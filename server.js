console.log("< Server >");
const fs = require("fs-extra");
const {serve, html} = require("servecube");
const cookieParser = require("cookie-parser");
const request = require("request-promise-native");
const mime = require("mime");
const {MongoClient} = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const youKnow = require("./data/youknow.js");
const production = process.argv[2] === "production";
(async () => {
	const client = await MongoClient.connect(youKnow.db.url, {
		compression: "snappy"
	});
	const db = client.db("web");
	const cube = await serve({
		eval: v => eval(v),
		domain: production ? "miroware.io" : "localhost:8081",
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
		middleware: [cookieParser(), session({
			secret: youKnow.session.secret,
			resave: false,
			saveUninitialized: false,
			name: "sess",
			cookie: {
				secure: true,
				maxAge: 604800000
			},
			store: new MongoStore({
				db,
				collection: "sessions",
				stringify: false
			})
		})]
	});
	const {load} = cube;
	process.openStdin().on("data", input => {
		console.log(eval(String(input)));
	});
})();
