console.log("< Server >");
const fs = require("fs-extra");
const ServeCube = require("servecube");
const {html} = ServeCube;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const request = require("request-promise-native");
const mime = require("mime");
const session = require("express-session");
//const Store = require("")(session);
const youKnow = require("./data/youknow.js");
const production = process.argv[2] === "production";
(async () => {
	const cube = await ServeCube.serve({
		eval: v => {
			return eval(v);
		},
		domain: "miroware.io",
		httpPort: 8081,
		httpsRedirect: production,
		subdomains: {
			d: "www/",
			api: "api/"
		},
		githubPayloadURL: "/githubwebhook",
		githubSecret: youKnow.github.secret,
		githubToken: youKnow.github.token,
		uncacheModified: !production,
		middleware: [cookieParser(), bodyParser.raw({
			limit: "100mb",
			type: "*/*"
		})/*, session({
			name: "session",
			secret: youKnow.sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: true,
				maxAge: 604800000
			},
			store: new Store({
				
			})
		})*/]
	});
	const {load} = cube;
	process.openStdin().on("data", input => {
		console.log(eval(String(input)));
	});
})();
