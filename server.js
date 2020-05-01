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
const archiver = require("archiver");
const youKnow = require("./secret/youknow.js");
const production = process.argv[2] === "production";
const lineBreaks = /\n/g;
const emailTest = /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/;
const testEmail = email => emailTest.test(email) && email.length <= 254;
const urlTest = /^https?:\/\/./;
const subdomainTest = /^(?:[0-9a-z](?:[-_0-9a-z]*[0-9a-z])?)?$/;
const mimeTest = /^[^\x00-\x20()<>@,;:\\"/[\]?.=]+\/[^\x00-\x20()<>@,;:\\"/[\]?=]+$/;
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
const byS3Object = item => ({
	Key: item.id
});
const byDBQueryObject = item => ({
	id: item.id
});
const pipeFiles = item => item.type !== "/";
const encodedSlashes = /%2F/g;
const encodeForPipe = name => encodeURIComponent(name).replace(encodedSlashes, "/");
const wait = delay => new Promise(resolve => {
	setTimeout(resolve, delay);
});
const validateConnection = (context, data) => new Promise(resolve => {
	if (context.user.connections.some(connection => connection.service === data.connection[0] && connection.id === data.id)) {
		resolve(true);
	} else {
		context.value = {
			error: "Authentication failed."
		};
		context.status = 401;
		context.done();
	}
});
const sanitizeConnection = connection => ({
	service: connection.service,
	id: connection.id
});
const inputDate = date => {
	let year = String(date.getFullYear());
	if (year.length < 4) {
		year = `0${year}`;
	}
	let month = String(date.getMonth() + 1);
	if (month.length < 2) {
		month = `0${month}`;
	}
	let day = String(date.getDate());
	if (day.length < 2) {
		day = `0${day}`;
	}
	return `${year}/${month}/${day}`;
};
const notLoggedIn = context => {
	if (context.user) {
		return false;
	} else {
		context.redirect = `/login/?dest=${encodeURIComponent(context.req.url)}`;
		context.done();
		return true;
	}
};
const purgeCache = async (...files) => {
	for (let i = 0; i < files.length; i += 30) {
		const slicedFiles = files.slice(i, i + 30);
		let errors = 0;
		do {
			await wait(1000);
			try {
				await request.post(`https://api.cloudflare.com/client/v4/zones/${youKnow.cloudflare.zone}/purge_cache`, {
					headers: {
						"X-Auth-Email": youKnow.cloudflare.email,
						"X-Auth-Key": youKnow.cloudflare.key,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						files: slicedFiles
					})
				});
			} catch (err) {
				if (++errors < 60) {
					continue;
				} else {
					throw err;
				}
			}
			break;
		} while (true);
	}
};
const purgePipeCache = (user, items) => purgeCache(...items.flatMap(item => {
	const encodedPath = encodeForPipe(item.path);
	const urls = [`https://pipe.miroware.io/${user._id}/${encodedPath}`, `https://piped.miroware.io/${user._id}/${encodedPath}`];
	for (let slashIndex = encodedPath.indexOf("/"); slashIndex !== -1; slashIndex = encodedPath.indexOf("/", slashIndex + 1)) {
		const slicedPath = encodedPath.slice(0, slashIndex);
		urls.push(`https://pipe.miroware.io/${user._id}/${slicedPath}`, `https://piped.miroware.io/${user._id}/${slicedPath}`);
	}
	if (encodedPath.endsWith("/index.html") || encodedPath === "index.html") {
		const slicedPath = encodedPath.slice(0, encodedPath.lastIndexOf("/") + 1);
		urls.push(`https://pipe.miroware.io/${user._id}/${slicedPath}`, `https://piped.miroware.io/${user._id}/${slicedPath}`);
	}
	return urls;
}));
const bodyMethods = ["POST", "PUT", "PATCH"];
(async () => {
	const myEval = v => eval(v);
	require("replthis")(myEval);
	const db = (await MongoClient.connect(youKnow.db, {
		useUnifiedTopology: true
	})).db("web");
	const users = db.collection("users");
	const domain = production ? "miroware.io" : "localhost:8081";
	const TOKEN_SUPER_COOLDOWN = 5 * 60 * 1000;
	const cookieOptions = {
		domain: `.${production ? domain : "localhost"}`,
		path: "/",
		maxAge: 1000 * 60 * 60 * 24 * 30,
		secure: production,
		httpOnly: true,
		signed: true
	};
	const clearCookieOptions = {
		domain: cookieOptions.domain,
		path: cookieOptions.path
	};
	const parseUser = context => new Promise(async resolve => {
		let {user} = context;
		const isMe = user && context.params.user === String(user._id);
		if (!isMe) {
			let userID;
			try {
				userID = ObjectID(context.params.user);
			} catch {
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
		if (user) {
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
	const verifyCaptcha = context => new Promise(async resolve => {
		const captcha = context.req.get("X-Captcha");
		if (typeof captcha === "string") {
			let success = false;
			try {
				({success} = JSON.parse(await request.post("https://www.google.com/recaptcha/api/siteverify", {
					form: {
						secret: youKnow.captcha.secret,
						response: captcha,
						remoteip: context.req.get("CF-Connecting-IP") || context.req.ip
					}
				})));
			} catch {}
			if (success) {
				resolve();
			} else {
				context.value = {
					error: "You failed the CAPTCHA challenge."
				};
				context.status = 422;
				context.done();
			}
		} else {
			context.value = {
				error: "The `X-Captcha` header must be a string."
			};
			context.status = 400;
			context.done();
		}
	});
	const sendVerification = (user, set) => {
		if (!set) {
			set = user;
		}
		const verifyLink = `https://miroware.io/account/verification/?code=${encodeURIComponent(set.emailCode = crypto.randomBytes(50).toString("base64"))}`;
		transporter.sendMail({
			from: "Miroware <bot@miroware.io>",
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
	const connect = (context, user) => {
		let connection = context.req.body.connection;
		return new Promise(resolve => {
			if (typeof connection !== "string" || (connection = connection.split(" ")).length !== 2) {
				context.value = {
					error: 'The `connection` value is not in the format "<service> <Base64-encoded code>".'
				};
				context.status = 400;
				context.done();
				return;
			}
			connection[1] = String(Buffer.from(connection[1], "base64"));
			if (connection[0] === "Google") {
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
			} else if (connection[0] === "Discord") {
				let redirect_uri = context.req.get("Referrer") || "https://miroware.io/";
				const pathIndex = redirect_uri.indexOf("/", redirect_uri.indexOf("//") + 2);
				if (pathIndex !== -1) {
					redirect_uri = `${redirect_uri.slice(0, pathIndex)}/login/discord/`;
				}
				const catchError = err => {
					const error = JSON.parse(err.error);
					context.value = {
						error: error.error_description || error.error
					};
					context.status = 422;
					context.done();
				};
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
			} else if (connection[0] === "password") {
				if (connection[1].length < 8) {
					context.value = {
						error: "The password must be at least 8 characters long."
					};
					context.status = 422;
					context.done();
				} else if (user) {
					const hash = youKnow.crypto.hash(connection[1], user.salt.buffer);
					const foundConnection = user.connections.find(connection2 => connection2.service === "password" && connection2.hash.buffer.equals(hash));
					if (foundConnection) {
						if (foundConnection.once) {
							users.updateOne({
								_id: user._id
							}, {
								$pull: {
									connections: {
										id: foundConnection.id
									}
								}
							});
						}
						resolve({
							connection,
							id: foundConnection.id
						});
					} else {
						context.value = {
							error: "The password is incorrect."
						};
						context.status = 422;
						context.done();
					}
				} else {
					resolve({
						connection,
						id: String(ObjectID())
					});
				}
			} else {
				context.value = {
					error: "The service of the `connection` value is invalid."
				};
				context.status = 400;
				context.done();
			}
		});
	};
	const createToken = (context, user) => {
		const token = youKnow.crypto.token();
		users.updateOne({
			_id: user._id
		}, {
			$push: {
				pouch: {
					value: youKnow.crypto.hash(token, user.salt.buffer),
					used: context.now,
					role: 0,
					super: context.now,
					ip: context.req.realIP
				}
			}
		});
		const id = String(user._id);
		context.res.cookie("auth", Buffer.from(`${id}:${token}`).toString("base64"), cookieOptions);
		return {
			id,
			token
		};
	};
	const deleteUser = (user, userFilter = {
		_id: user._id
	}) => new Promise((resolve, reject) => {
		const fileItems = user.pipe.filter(pipeFiles);
		if (fileItems.length) {
			s3.deleteObjects({
				Bucket: "miroware-pipe",
				Delete: {
					Objects: fileItems.map(byS3Object)
				}
			}, err => {
				if (err) {
					reject(err);
				} else {
					purgePipeCache(user, fileItems);
					users.deleteOne(userFilter);
					resolve();
				}
			});
		} else {
			users.deleteOne(userFilter);
			resolve();
		}
	});
	const sanitizeConcat = (context, put) => new Promise(resolve => {
		const concat = {
			anon: !!context.req.body.anon,
			sub: context.req.body.sub.trim().toLowerCase(),
			val: encodeURI(context.req.body.val),
			urls: context.req.body.urls
		};
		if (typeof concat.sub === "string") {
			if (concat.sub.length > 63) {
				context.value = {
					error: "The `sub` value must be at most 63 characters long."
				};
				context.status = 400;
				context.done();
				return;
			} else if (!subdomainTest.test(concat.sub)) {
				context.value = {
					error: "The `sub` value may only include alphanumeric characters, and hyphens and underscores if not on the ends."
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
		if (typeof concat.val === "string") {
			if (concat.val.length > 255) {
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
		if (concat.urls instanceof Array) {
			if (concat.urls.length < 1) {
				context.value = {
					error: "The `urls` value must have at least 1 item."
				};
				context.status = 400;
				context.done();
				return;
			} else if (concat.urls.length > 1023) {
				context.value = {
					error: "The `urls` value must have at most 1023 items."
				};
				context.status = 400;
				context.done();
				return;
			} else {
				for (const url of concat.urls) {
					if (typeof url === "string") {
						if (url.length > 511) {
							context.value = {
								error: "Items of the `urls` value must be at most 511 characters long."
							};
							context.status = 400;
							context.done();
							return;
						} else if (!urlTest.test(url)) {
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
			if (keeper && (!put || context.req.query.sub !== concat.sub || context.req.query.val !== concat.val)) {
				const found = keeper.concats.find(item => item.sub === concat.sub && item.val === concat.val);
				context.value = {
					error: `That concat is already taken${found.anon ? "" : html` by <a href="/users/${keeper._id}/" target="_blank">$${keeper.name}</a>`}.`,
					keeper: !found.anon && keeper._id
				};
				context.status = 422;
				context.done();
			} else {
				resolve(concat);
			}
		});
	});
	const deletePipeItem = (user, item, update, context) => new Promise(resolve => {
		if (!update.$pull) {
			update.$pull = {};
		}
		if (!update.$pull.pipe) {
			update.$pull.pipe = {};
		}
		if (!update.$pull.pipe.$or) {
			update.$pull.pipe.$or = [];
		}
		if (item.type === "/") {
			const items = [item]; // all recursive children of the directory being deleted
			const fileItems = []; // all recursive children of the directory being deleted which are files
			const prefix = `${item.path}/`;
			for (const item2 of user.pipe) {
				if (item2.path.startsWith(prefix)) {
					items.push(item2);
					if (item2.type !== "/") {
						fileItems.push(item2);
					}
				}
			}
			const applyUpdate = () => {
				update.$pull.pipe.$or.push(...items.map(byDBQueryObject));
				for (const item2 of items) {
					if (item2.type === "/") {
						users.updateOne({
							_id: user._id
						}, {
							$set: {
								"pipe.$[item].restore": null
							}
						}, {
							arrayFilters: [{
								"item.restore": item2.id
							}],
							multi: true
						}); // Reset other items' restore directories if they were set to the directory being deleted.
					}
				}
			};
			if (fileItems.length) {
				s3.deleteObjects({
					Bucket: "miroware-pipe",
					Delete: {
						Objects: fileItems.map(byS3Object)
					}
				}, err => {
					if (err) {
						console.error(err);
						if (context) {
							context.value = {
								error: err.message
							};
							context.status = err.statusCode;
						}
					} else {
						applyUpdate();
						purgePipeCache(user, fileItems);
					}
					resolve();
				});
			} else {
				applyUpdate();
				resolve();
			}
		} else {
			s3.deleteObject({
				Bucket: "miroware-pipe",
				Key: item.id
			}, err => {
				if (err) {
					console.error(err);
					if (context) {
						context.value = {
							error: err.message
						};
						context.status = err.statusCode;
					}
				} else {
					update.$pull.pipe.$or.push({
						id: item.id
					});
					purgePipeCache(user, [item]);
				}
				resolve();
			});
		}
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
			if (auth) {
				if ((auth = auth.split(" ")).length === 2) {
					if (auth[0] === "Basic") {
						if ((auth = String(Buffer.from(auth[1], "base64")).split(":")).length === 2) {
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
			if (req.dir === "api" && bodyMethods.includes(req.method)) {
				res.set("Content-Type", "application/json");
				if (req.get("Content-Type") === "application/json") {
					try {
						req.body = JSON.parse(req.body);
					} catch (err) {
						res.status(400).send({
							error: err.message
						});
						return;
					}
				}
			}
			req.realIP = req.get("CF-Connecting-IP");
			req.next();
		}, cookieParser(youKnow.cookie)],
		loadStart: [async context => {
			if (context.depth === 1) {
				context.now = Date.now();
				const auth = context.req.auth || (context.req.signedCookies && context.req.signedCookies.auth && String(Buffer.from(context.req.signedCookies.auth, "base64")).split(":"));
				if (auth) {
					try {
						context.user = await users.findOne(context.userFilter = {
							_id: ObjectID(auth[0])
						});
					} catch (err) {
						if (context.req.signedCookies.auth) {
							context.res.clearCookie("auth", clearCookieOptions);
							context.user = null;
						} else {
							context.value = {
								error: err.message
							};
							context.status = 400;
							return false;
						}
					}
					if (context.user) {
						context.update = {};
						const hash = youKnow.crypto.hash(auth[1], context.user.salt.buffer);
						const token = context.user.pouch.find(token => token.value.buffer.equals(hash));
						if (token && token.used > context.now - cookieOptions.maxAge) {
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
									"pouch.$.used": context.now,
									"pouch.$.ip": context.req.realIP
								}
							};
							if (context.req.signedCookies.auth && context.rawPath !== "api/token/DELETE.njs") {
								context.res.cookie("auth", context.req.signedCookies.auth, cookieOptions);
							}
						} else {
							if (context.req.signedCookies.auth) {
								context.res.clearCookie("auth", clearCookieOptions);
								context.user = null;
							} else {
								context.value = {
									error: "Authentication failed."
								};
								context.status = 401;
								return false;
							}
						}
					} else {
						if (context.req.signedCookies.auth) {
							context.res.clearCookie("auth", clearCookieOptions);
							context.user = null;
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
			if (context.user && context.params && context.params.user === "@me") {
				context.params.user = String(context.user._id);
			}
		}],
		loadEnd: [async context => {
			if (context.depth === 1 && context.user && context.update) {
				users.updateOne(context.userFilter, context.update);
				if (context.updatePouch) {
					users.updateOne(context.pouchFilter, context.updatePouch);
				}
			}
		}],
		babelOptions: {
			plugins: ["iife-wrap"]
		}
	});
	const hourly = () => {
		const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
		users.updateMany({}, {
			$pull: {
				pouch: {
					used: {
						$lte: thirtyDaysAgo
					}
				}
			}
		});
		users.find().forEach(async user => {
			const update = {};
			let updated = false;
			for (let i = 0; i < user.pipe.length; i++) {
				const item = user.pipe[i];
				if (item.trashed && item.trashed <= thirtyDaysAgo) {
					await deletePipeItem(user, item, update);
					updated = true;
				}
			}
			if (updated) {
				users.updateOne({
					_id: user._id
				}, update);
			}
		});
	};
	setInterval(hourly, 1000 * 60 * 60);
	hourly();
	const {load} = cube;
})();
