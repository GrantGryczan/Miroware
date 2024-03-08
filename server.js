"use strict";
console.log("< Server >");
const crypto = require("crypto");
const fs = require("fs-extra");
const { serve, html } = require("servecube");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");
const mime = require("mime");
const { MongoClient, ObjectID } = require("mongodb");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const { S3 } = require("@aws-sdk/client-s3");
const archiver = require("archiver");
const youKnow = require("./secret/youknow.js");
const axios = require('axios');
const production = process.argv.includes("production");
const lineBreaks = /\n/g;
const emailTest = /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/;
const testEmail = email => emailTest.test(email) && email.length <= 254;
const urlTest = /^https?:\/\/./;
const subdomainTest = /^(?:[0-9a-z](?:[-_0-9a-z]*[0-9a-z])?)?$/;
const mimeTest = /^[^\x00-\x20()<>@,;:\\"/[\]?.=]+\/[^\x00-\x20()<>@,;:\\"/[\]?=]+$/;
const transporter = nodemailer.createTransport({
	sendmail: true,
	path: "/usr/sbin/sendmail",
	secure: true
});
const googleAuthClient = new OAuth2Client(youKnow.google.id);
const b2 = new S3({
	credentials: youKnow.b2.auth,
	sslEnabled: true,
	endpoint: 'https://s3.us-west-004.backblazeb2.com',
	region: 'us-west-004'
});
const byID = ({id}) => id;
const pipeFiles = item => item.type !== "/";
const encodedSlashes = /%2F/g;
const encodedAts = /%40/g;
const encodeForPipe = name => encodeURIComponent(name).replace(encodedSlashes, "/").replace(encodedAts, "@");
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
				await fetch(`https://api.cloudflare.com/client/v4/zones/${youKnow.cloudflare.zone}/purge_cache`, {
					method: "POST",
					headers: {
						"Authorization": youKnow.cloudflare.auth,
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
const stringifyID = id => id.toString("base64url");
const purgePipeCache = (user, items) => purgeCache(...items.flatMap(item => {
	const encodedPath = encodeForPipe(item.path);
	const userID = stringifyID(user._id);
	const urls = [`https://file.garden/${userID}/${encodedPath}`];
	for (let slashIndex = encodedPath.indexOf("/"); slashIndex !== -1; slashIndex = encodedPath.indexOf("/", slashIndex + 1)) {
		const slicedPath = encodedPath.slice(0, slashIndex);
		urls.push(`https://file.garden/${userID}/${slicedPath}`);
	}
	if (user.tag) {
		const userTag = `@${user.tag}`;
		for (const url of [...urls]) {
			urls.push(url.replace(userID, userTag));
		}
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
	const domain = production ? "filegarden.com" : "localhost:8081";
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

	let b2Authorization;
	const AUTHORIZATION_PERIOD = 1000 * 60 * 60 * 24 * 7;
	const authorizeB2 = async () => {
		const { data } = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
			auth: {
				username: youKnow.b2.auth.accessKeyId,
				password: youKnow.b2.auth.secretAccessKey
			}
		});

		const { data: data2 } = await axios.post(`${data.apiUrl}/b2api/v2/b2_get_download_authorization`, {
			bucketId: youKnow.b2.bucketID,
			fileNamePrefix: '',
			validDurationInSeconds: AUTHORIZATION_PERIOD / 1000
		}, {
			headers: {
				Authorization: data.authorizationToken
			}
		});

		b2Authorization = data2.authorizationToken;
	};
	await authorizeB2();
	setInterval(authorizeB2, AUTHORIZATION_PERIOD - 1000 * 60 * 10);
	const getB2 = path => axios.get(`https://b2.filegarden.com/${path}`, {
		responseType: 'stream',
		headers: {
			Authorization: b2Authorization
		}
	});

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
				({success} = await (await fetch("https://www.google.com/recaptcha/api/siteverify", {
					method: "POST",
					body: new URLSearchParams({
						secret: youKnow.captcha.secret,
						response: captcha,
						remoteip: context.req.get("CF-Connecting-IP") || context.req.ip
					})
				})).json());
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
		const verifyLink = `https://filegarden.com/account/verification/?code=${encodeURIComponent(set.emailCode = crypto.randomBytes(50).toString("base64"))}`;
		transporter.sendMail({
			from: "File Garden <no-reply@filegarden.com>",
			to: `${JSON.stringify(user.name)} <${set.unverified || user.unverified}>`,
			subject: "File Garden - Verify Email",
			text: "Verify your File Garden account.",
			html: html`
				Click the following link to verify your File Garden account.<br>
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
				let redirect_uri = context.req.get("Referrer") || "https://filegarden.com/";
				const pathIndex = redirect_uri.indexOf("/", redirect_uri.indexOf("//") + 2);
				if (pathIndex !== -1) {
					redirect_uri = `${redirect_uri.slice(0, pathIndex)}/login/discord/`;
				}
				const catchError = async err => {
					context.value = {
						error: err.message || err.error_description || err.error
					};
					context.status = 422;
					context.done();
				};
				fetch("https://discordapp.com/api/oauth2/token", {
					method: "POST",
					body: new URLSearchParams({
						client_id: youKnow.discord.id,
						client_secret: youKnow.discord.secret,
						grant_type: "authorization_code",
						code: connection[1],
						redirect_uri
					})
				}).then(async response => {
					const body = await response.json();
					if (response.ok) {
						fetch("https://discordapp.com/api/users/@me", {
							method: "GET",
							headers: {
								"Authorization": `${body.token_type} ${body.access_token}`
							}
						}).then(async response2 => {
							const body2 = await response2.json();
							if (response2.ok) {
								resolve({
									connection,
									id: body2.id,
									name: body2.username,
									email: body2.email,
									verified: body2.verified
								});
							} else {
								catchError(body2);
							}
						}).catch(catchError);
					} else {
						catchError(body);
					}
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
			deletePipeFiles(stringifyID(user._id), fileItems).then(() => {
				purgePipeCache(user, fileItems);
				users.deleteOne(userFilter);
				resolve();
			}).catch(reject);
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
					error: `That link is already taken${found.anon ? "" : html` by $${keeper.name}`}.`,
					keeper: !found.anon && keeper._id
				};
				context.status = 422;
				context.done();
			} else {
				resolve(concat);
			}
		});
	});
	const deletePipeFiles = (userIDString, fileItems) => new Promise((resolve, reject) => {
		const objects = fileItems.map(item => ({
			Key: `${userIDString}/${item.id}`
		}));
		const deleteMore = () => {
			if (objects.length) {
				b2.deleteObjects({
					Bucket: "file-garden",
					Delete: {
						Objects: objects.splice(0, 100)
					}
				}, err => {
					if (err) {
						reject(err);
					} else {
						deleteMore();
					}
				});
			} else {
				resolve();
			}
		};
		deleteMore();
	});
	const deletePipeItem = (user, item, update, context) => new Promise(resolve => {
		if (!update.$pull) {
			update.$pull = {};
		}
		if (!update.$pull.pipe) {
			update.$pull.pipe = {};
		}
		if (!update.$pull.pipe.id) {
			update.$pull.pipe.id = {};
		}
		if (!update.$pull.pipe.id.$in) {
			update.$pull.pipe.id.$in = [];
		}
		const userIDString = stringifyID(user._id);
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
				update.$pull.pipe.id.$in.push(...items.map(byID));
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
				deletePipeFiles(userIDString, fileItems).then(() => {
					applyUpdate();
					purgePipeCache(user, fileItems);
				}).catch(err => {
					console.error(err);
					if (context) {
						context.value = {
							error: err.message
						};
						context.status = err.statusCode;
					}
				}).finally(resolve);
			} else {
				applyUpdate();
				resolve();
			}
		} else {
			b2.deleteObject({
				Bucket: "file-garden",
				Key: `${userIDString}/${item.id}`
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
					update.$pull.pipe.id.$in.push(item.id);
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
				const promises = [users.updateOne(context.userFilter, context.update)];
				if (context.updatePouch) {
					promises.push(users.updateOne(context.pouchFilter, context.updatePouch));
				}
				await Promise.all(promises);
			}
		}],
		babelOptions: {
			plugins: ["iife-wrap"]
		}
	});
	const hourly = () => {
		const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
		users.find().forEach(async user => {
			if (!user.verified && user.created < thirtyDaysAgo) {
				deleteUser(user);
				return;
			}
			const update = {};
			let updated = false;
			for (let i = 0; i < user.pipe.length; i++) {
				const item = user.pipe[i];
				if (item.trashed && item.trashed < thirtyDaysAgo) {
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
