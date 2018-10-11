"use strict";
console.log("< Server >");
const crypto = require("crypto");
const fs = require("fs-extra");
const {serve, html} = require("servecube");
const cookieParser = require("cookie-parser");
const request = require("request-promise-native");
const mime = require("mime");
const {MongoClient, ObjectID} = require("mongodb");
const nodemailer = require("nodemailer");
const {OAuth2Client} = require("google-auth-library");
const AWS = require("aws-sdk");
const youKnow = require("./secret/youknow.js");
const production = process.argv[2] === "production";
const lineBreaks = /\n/g;
const emailTest = /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/;
const testEmail = email => emailTest.test(email) && email.length <= 254;
const urlTest = /^https?:\/\/./;
const subdomainTest = /^(?:[0-9a-z](?:[-_0-9a-z]*[0-9a-z])?)?$/;
const transporter = nodemailer.createTransport({
	sendmail: true,
	newline: "unix",
	path: "/usr/sbin/sendmail"
});
const googleAuthClient = new OAuth2Client(youKnow.google.id);
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
const connect = context => {
	let connection = context.req.body.connection;
	return new Promise(resolve => {
		if(typeof connection !== "string" || (connection = connection.split(" ")).length !== 2) {
			context.value = {
				error: 'The `connection` value is not in the format "<service> <code>".'
			};
			context.status = 400;
			context.done();
			return;
		}
		if(connection[0] === "Google") {
			googleAuthClient.verifyIdToken({
				idToken: connection[1],
				audience: youKnow.google.id
			}).then(ticket => {
				const payload = ticket.getPayload();
				resolve({
					connection,
					id: payload.sub,
					name: payload.name,
					email: payload.email,
					verified: payload.email_verified
				});
			}).catch(err => {
				context.value = {
					error: err.message
				};
				context.status = 422;
				context.done();
			});
		} else if(connection[0] === "Discord") {
			const catchError = err => {
				const error = JSON.parse(err.error);
				context.value = {
					error: error.error_description || error.error
				};
				context.status = 422;
				context.done();
			};
			let redirect_uri = context.req.get("Referrer");
			const pathIndex = redirect_uri.indexOf("/", redirect_uri.indexOf("//") + 2);
			if(pathIndex !== -1) {
				redirect_uri = `${redirect_uri.slice(0, pathIndex)}/login/discord/`;
			}
			request.post("https://discordapp.com/api/oauth2/token", {
				form: {
					client_id: youKnow.discord.id,
					client_secret: youKnow.discord.secret,
					grant_type: "authorization_code",
					code: connection[1],
					redirect_uri
				}
			}).then(body => {
				body = JSON.parse(body);
				request.get("https://discordapp.com/api/users/@me", {
					headers: {
						"Authorization": `${body.token_type} ${body.access_token}`
					}
				}).then(body2 => {
					body2 = JSON.parse(body2);
					resolve({
						connection,
						id: body2.id,
						name: body2.username,
						email: body2.email,
						verified: body2.verified
					});
				}).catch(catchError);
			}).catch(catchError);
		} else {
			context.value = {
				error: "The service of the `connection` value is invalid."
			};
			context.status = 400;
			context.done();
		}
	});
};
const validateConnection = (context, data) => {
	return new Promise(resolve => {
		if(context.user.connections.some(connection => connection.service === data.connection[0] && connection.id === data.id)) {
			resolve(true);
		} else {
			context.value = {
				error: "Authentication failed."
			};
			context.status = 401;
			context.done();
		}
	});
};
const inputDate = date => {
	let year = String(date.getFullYear());
	if(year.length < 4) {
		year = `0${year}`;
	}
	let month = String(date.getMonth() + 1);
	if(month.length < 2) {
		month = `0${month}`;
	}
	let day = String(date.getDate());
	if(day.length < 2) {
		day = `0${day}`;
	}
	return `${year}-${month}-${day}`;
};
const notLoggedIn = context => {
	if(context.user) {
		return false;
	} else {
		context.redirect = `/login/?dest=${encodeURIComponent(context.req.url)}`;
		context.done();
		return true;
	}
};
const bodyMethods = ["POST", "PUT", "PATCH"];
(async () => {
	const myEval = v => eval(v);
	require("replthis")(myEval);
	const db = (await MongoClient.connect(youKnow.db, {
		native_parser: true
	})).db("web");
	const users = db.collection("users");
	const domain = production ? "miroware.io" : "localhost:8081";
	const cookieOptions = {
		domain: `.${production ? domain : "localhost"}`,
		path: "/",
		maxAge: 2592000000,
		secure: production,
		httpOnly: true,
		signed: true
	};
	const clearCookieOptions = {
		domain: cookieOptions.domain,
		path: cookieOptions.path
	};
	const parseUser = context => new Promise(async resolve => {
		const thisID = context.user && String(context.user._id);
		if(context.user && context.params.user === "@me") {
			context.params.user = thisID;
		}
		const isMe = context.params.user === thisID;
		let user = context.user;
		if(!isMe) {
			let userID;
			try {
				userID = ObjectID(context.params.user);
			} catch(err) {
				context.value = {
					error: "That is not a valid user ID."
				};
				context.status = 400;
				context.done();
				return;
			}
			user = await users.findOne({
				_id: userID
			});
		}
		if(user) {
			resolve({
				user,
				isMe
			});
		} else {
			context.value = {
				error: "That user was not found."
			};
			context.status = 404;
			context.done();
		}
	});
	const verifyEmail = (user, set) => {
		if(!set) {
			set = user;
		}
		const verifyLink = `https://miroware.io/account/verification/?code=${encodeURIComponent(set.emailCode = crypto.randomBytes(50).toString("base64"))}`;
		transporter.sendMail({
			from: "Miroware <info@miroware.io>",
			to: `${JSON.stringify(user.name)} <${set.unverified || user.unverified}>`,
			subject: "Miroware / Account Verification",
			text: "Verify your Miroware account.",
			html: html`
				Click the following link to verify your Miroware account.<br>
				<a href="${verifyLink}">${verifyLink}</a>
				<p>
					<i>(It would be greatly appreciated if you could mark the email as not spam as well, if you did happen to find this email in your spam folder. Thank you!)</i>
				</p>
			`
		});
	};
	const sanitizeConcat = (context, put) => new Promise(resolve => {
		const concat = {
			anon: !!context.req.body.anon,
			sub: context.req.body.sub.trim().toLowerCase(),
			val: encodeURI(context.req.body.val),
			urls: context.req.body.urls
		};
		if(typeof concat.sub === "string") {
			if(concat.sub.length > 63) {
				context.value = {
					error: "The `sub` value must be at most 63 characters long."
				};
				context.status = 400;
				context.done();
				return;
			} else if(!subdomainTest.test(concat.sub)) {
				context.value = {
					error: "The `sub` value may only contain alphanumeric characters, and hyphens and underscores if not on the ends."
				};
				context.status = 400;
				context.done();
				return;
			}
		} else {
			context.value = {
				error: "The `sub` value must be a string."
			};
			context.status = 400;
			context.done();
			return;
		}
		if(typeof concat.val === "string") {
			if(concat.val.length > 255) {
				context.value = {
					error: "The encoded `val` value must be at most 255 characters long."
				};
				context.status = 400;
				context.done();
				return;
			}
		} else {
			context.value = {
				error: "The `val` value must be a string."
			};
			context.status = 400;
			context.done();
			return;
		}
		if(concat.urls instanceof Array) {
			if(concat.urls.length < 1) {
				context.value = {
					error: "The `urls` value must have at least 1 item."
				};
				context.status = 400;
				context.done();
				return;
			} else if(concat.urls.length > 1023) {
				context.value = {
					error: "The `urls` value must have at most 1023 items."
				};
				context.status = 400;
				context.done();
				return;
			} else {
				for(const url of concat.urls) {
					if(typeof url === "string") {
						if(url.length > 511) {
							context.value = {
								error: "Items of the `urls` value must be at most 511 characters long."
							};
							context.status = 400;
							context.done();
							return;
						} else if(!urlTest.test(url)) {
							context.value = {
								error: "Items of the `urls` value must be valid URLs."
							};
							context.status = 400;
							context.done();
							return;
						}
					} else {
						context.value = {
							error: "Items of the `urls` value must be strings."
						};
						context.status = 400;
						context.done();
						return;
					}
				}
			}
		} else {
			context.value = {
				error: "The `urls` value must be an array."
			};
			context.status = 400;
			context.done();
			return;
		}
		users.findOne({
			concats: {
				$elemMatch: {
					sub: concat.sub,
					val: concat.val
				}
			}
		}).then(keeper => {
			if(keeper && (!put || context.req.query.sub !== concat.sub || context.req.query.val !== concat.val)) {
				const found = keeper.concats.find(item => item.sub === concat.sub && item.val === concat.val);
				context.value = {
					error: `That concat is already taken${found.anon ? "" : html` by <a href="/users/${keeper._id}/">$${keeper.name}</a>`}.`,
					keeper: !found.anon && keeper._id
				};
				context.status = 422;
				context.done();
			} else {
				resolve(concat);
			}
		});
	});
	const cube = await serve({
		eval: myEval,
		domain,
		errorDir: "error",
		loadDirs: ["load"],
		httpPort: 8081,
		subdomains: {
			d: "www/",
			api: "api/"
		},
		githubSubdomain: "api",
		githubPayloadURL: "/githubwebhook",
		githubSecret: youKnow.github.secret,
		githubToken: youKnow.github.token,
		middleware: [(req, res) => {
			let auth = req.get("Authorization");
			if(auth) {
				if((auth = auth.split(" ")).length === 2) {
					if(auth[0] === "Basic") {
						if((auth = String(Buffer.from(auth[1], "base64")).split(":")).length === 2) {
							req.auth = auth;
						} else {
							res.status(400).send({
								error: 'The credentials of the `Authorization` header are not in the format "<user ID>:<token>", encoded in base 64.'
							});
							return;
						}
					}
				} else {
					res.status(400).send({
						error: 'The `Authorization` header is not in the format "<type> <credentials>".'
					});
					return;
				}
			}
			if(req.dir === "api" && bodyMethods.includes(req.method)) {
				res.set("Content-Type", "application/json");
				if(req.get("Content-Type") === "application/json") {
					try {
						req.body = JSON.parse(req.body);
					} catch(err) {
						res.status(400).send({
							error: err.message
						});
						return;
					}
				}
			}
			req.next();
		}, cookieParser(youKnow.cookie)],
		loadStart: [async context => {
			if(context.depth === 1) {
				context.now = Date.now();
				const auth = context.req.auth || (context.req.signedCookies && context.req.signedCookies.auth && String(Buffer.from(context.req.signedCookies.auth, "base64")).split(":"));
				if(auth) {
					try {
						context.user = await users.findOne(context.userFilter = {
							_id: ObjectID(auth[0])
						});
					} catch(err) {
						if(context.req.signedCookies.auth) {
							context.res.clearCookie("auth", clearCookieOptions);
						} else {
							context.value = {
								error: err.message
							};
							context.status = 400;
							return false;
						}
					}
					if(context.user) {
						context.update = {
							$pull: {
								pouch: {
									expire: {
										$lte: context.now
									}
								}
							}
						};
						const hash = youKnow.crypto.hash(auth[1], context.user.salt.buffer);
						const token = context.user.pouch.find(token => token.value.buffer.equals(hash));
						if(token && context.now < token.expire) {
							context.token = token;
							context.update.$set = {
								updated: context.now,
							};
							context.pouchFilter = {
								...context.userFilter,
								"pouch.value": hash
							};
							context.updatePouch = {
								$set: {
									"pouch.$.expire": context.now + cookieOptions.maxAge
								}
							};
							if(context.req.signedCookies.auth && context.rawPath !== "api/token/DELETE.njs") {
								context.res.cookie("auth", context.req.signedCookies.auth, cookieOptions);
							}
						} else {
							if(context.req.signedCookies.auth) {
								context.res.clearCookie("auth", clearCookieOptions);
							} else {
								context.value = {
									error: "Authentication failed."
								};
								context.status = 401;
								return false;
							}
						}
					} else {
						if(context.req.signedCookies.auth) {
							context.res.clearCookie("auth", clearCookieOptions);
						} else {
							context.value = {
								error: "Authentication failed."
							};
							context.status = 401;
							return false;
						}
					}
				}
			}
		}],
		loadEnd: [async context => {
			if(context.depth === 1 && context.update) {
				users.updateOne(context.userFilter, context.update);
				if(context.updatePouch) {
					users.updateOne(context.pouchFilter, context.updatePouch);
				}
			}
		}],
		babelOptions: {
			plugins: ["iife-wrap"]
		}
	});
	const {load} = cube;
})();
