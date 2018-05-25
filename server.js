console.log("< Server >");
const fs = require("fs-extra");
const {serve, html} = require("servecube");
const cookieParser = require("cookie-parser");
const request = require("request-promise-native");
const mime = require("mime");
const {MongoClient, ObjectID} = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const {OAuth2Client} = require("google-auth-library");
const youKnow = require("./data/youknow.js");
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
			request.post("https://discordapp.com/api/oauth2/token", {
				form: {
					client_id: youKnow.discord.id,
					client_secret: youKnow.discord.secret,
					grant_type: "authorization_code",
					code: context.req.body.token,
					redirect_uri: `${context.req.get("Referrer")}discord/`
				}
			}).then(body => {
				body = JSON.parse(body);
				request.get({
					url: "https://discordapp.com/api/users/@me",
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
const bodyMethods = ["POST", "PUT", "PATCH"];
(async () => {
	const db = (await MongoClient.connect(youKnow.db.url, {
		native_parser: true
	})).db("web");
	const users = db.collection("users");
	const domain = production ? "miroware.io" : "localhost:8081";
	const cube = await serve({
		eval: v => eval(v),
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
		middleware: [cookieParser(youKnow.cookie.secret), session({
			secret: youKnow.cookie.secret,
			resave: false,
			saveUninitialized: false,
			name: "sess",
			cookie: {
				domain: `.${production ? domain : "localhost"}`,
				maxAge: 2592000000,
				secure: production,
				httpOnly: true
			},
			store: new MongoStore({
				db,
				collection: "sessions",
				stringify: false
			})
		}), (req, res) => {
			if(req.session.user) {
				users.findOneAndUpdate({
					_id: req.session.user
				}, {
					$set: {
						updated: Date.now()
					}
				});
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
		}]
	});
	const {load} = cube;
	evalInput = input => {
		console.log(eval(String(input)));
	};
})();
let evalInput = input => {
	console.log(eval(String(input)));
};
process.openStdin().on("data", input => {
	evalInput(input);
});
