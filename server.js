console.log("< Server >");
const fs = require("fs");
const ServeCube = require("servecube");
const {html} = ServeCube;
const request = require("request-promise-native");
const mime = require("mime");
const session = require("express-session");
//const Store = require("")(session);
const youKnow = require("./data/youknow.js");
const cube = ServeCube.serve({
	eval: v => {
		return eval(v);
	},
	domain: "miroware.io",
	httpPort: 8081,
	httpsRedirect: true,
	subdomain: ["", "d"],
	githubSecret: youKnow.github.secret,
	githubPayloadURL: "/githubwebhook",
	uncacheModified: process.argv[2] !== "production"/*,/
	middleware: [session({
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
	})]*/
});
const {load} = cube;
const stdin = process.openStdin();
stdin.on("data", input => {
	console.log(eval(String(input)));
});
