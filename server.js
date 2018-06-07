console.log("< Server >");
const crypto = require("crypto");
const fs = require("fs-extra");
const {serve, html} = require("servecube");
const cookieParser = require("cookie-parser");
const request = require("request-promise-native");
const mime = require("mime");
const {MongoClient, ObjectID} = require("mongodb");
const {OAuth2Client} = require("google-auth-library");
const youKnow = require("./secret/youknow.js");
const production = process.argv[2] === "production";
const emailTest = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const testEmail = email => emailTest.test(email) && email.length <= 254;
const googleAuthClient = new OAuth2Client(youKnow.google.id);
const authenticate = context => {
	return new Promise(resolve => {
		if(context.req.body.service === "Google") {
			googleAuthClient.verifyIdToken({
				idToken: context.req.body.token,
				audience: youKnow.google.id
			}).then(ticket => {
				const payload = ticket.getPayload();
				resolve({
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
		} else if(context.req.body.service === "Discord") {
			const catchError = err => {
				const error = JSON.parse(err.error);
				context.value = {
					error: error.error_description || error.error
				};
				context.status = 422;
				context.done();
			};
			let referrer = context.req.get("Referrer");
			const queryIndex = referrer.indexOf("?");
			if(queryIndex !== -1) {
				referrer = referrer.slice(0, queryIndex);
			}
			request.post("https://discordapp.com/api/oauth2/token", {
				form: {
					client_id: youKnow.discord.id,
					client_secret: youKnow.discord.secret,
					grant_type: "authorization_code",
					code: context.req.body.token,
					redirect_uri: `${referrer}discord/`
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
						id: body2.id,
						name: body2.username,
						email: body2.email,
						verified: body2.verified
					});
				}).catch(catchError);
			}).catch(catchError);
		} else {
			context.value = {
				error: "That is not a valid service."
			};
			context.status = 422;
			context.done();
		}
	});
};
const inputDate = date => {
	let day = String(date.getDate());
	if(day.length < 2) {
		day = `0${day}`;
	}
	let month = String(date.getMonth()+1);
	if(month.length < 2) {
		month = `0${month}`;
	}
	return `${date.getFullYear()}-${month}-${day}`;
};
const notLoggedIn = context => {
	if(context.in) {
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
		maxAge: 2592000000,
		secure: production,
		httpOnly: true,
		signed: true
	};
	const cube = await serve({
		eval: myEval,
		domain,
		errorDir: "error",
		httpPort: 8081,
		httpsRedirect: production,
		subdomains: {
			d: "www/",
			api: "api/"
		},
		githubSubdomain: "api",
		githubPayloadURL: "/githubwebhook",
		githubSecret: youKnow.github.secret,
		githubToken: youKnow.github.token,
		middleware: [cookieParser(youKnow.cookie.secret), (req, res) => {
			let auth = req.get("Authorization");
			if(auth) {
				if((auth = auth.split(" ")).length === 2) {
					if(auth[0] === "Basic") {
						if((auth = String(Buffer.from(auth[1], "base64")).split(":")).length === 2) {
							req.auth = auth;
						} else {
							res.status(400).send({
								error: "The credentials of the `Authorization` header are not under the format \"<user ID>:<token>\", encoded in base 64."
							});
							return;
						}
					}
				} else {
					res.status(400).send({
						error: "The `Authorization` header is not under the format \"<type> <credentials>\"."
					});
					return;
				}
			}
			if(req.dir === "api" && bodyMethods.includes(req.method)) {
				res.set("Content-Type", "application/json");
				try {
					req.body = JSON.parse(req.body);
				} catch(err) {
					res.status(400).send({
						error: err.message
					});
					return;
				}
			}
			req.next();
		}],
		loadStart: [async context => {
			context.now = Date.now();
			const auth = context.req.auth || (context.req.signedCookies.auth && String(Buffer.from(context.req.signedCookies.auth, "base64")).split(":"));
			if(auth) {
				try {
					context.user = await users.findOne(context.userFilter = {
						_id: ObjectID(auth[0])
					});
				} catch(err) {
					if(context.req.signedCookies.auth) {
						context.res.clearCookie("auth", cookieOptions);
					}
					context.value = {
						error: err.message
					};
					context.status = 400;
					return false;
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
					console.log(context.user.pouch);
					const token = context.user.pouch.find(v => v.value.buffer.equals(hash));
					if(token && context.now < token.expire) {
						context.scope = token.scope;
						context.update.$set = {
							updated: context.now
						};
					} else {
						if(context.req.signedCookies.auth) {
							context.res.clearCookie("auth", cookieOptions);
						}
						context.value = {
							error: "The authorization credentials are using an invalid token."
						};
						context.status = 401;
						return false;
					}
				} else {
					if(context.req.signedCookies.auth) {
						context.res.clearCookie("auth", cookieOptions);
					}
					context.value = {
						error: "The authorization credentials are requesting a user which does not exist."
					};
					context.status = 401;
					return false;
				}
			}
			context.in = context.user ? !!context.user.name : null;
		}],
		loadEnd: [async context => {
			if(context.update) {
				users.updateOne(context.userFilter, context.update);
			}
		}]
	});
	const {load} = cube;
})();
