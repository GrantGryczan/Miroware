console.log("< Server >");
const fs = require("fs");
const ServeCube = require("servecube");
const {html} = ServeCube;
const request = require("request-promise-native");
const youKnow = require("./data/youknow.js");
const options = {
	eval: v => {
		return eval(v);
	},
	httpPort: 8081,
	httpsPort: 8444,
	subdomain: ["", "d"],
	githubSecret: youKnow.github.secret,
	githubPayloadURL: "/githubwebhook"
};
try {
	options.tls = {
		key: fs.readFileSync("/etc/letsencrypt/live/miroware.io/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/miroware.io/cert.pem"),
		ca: fs.readFileSync("/etc/letsencrypt/live/miroware.io/chain.pem")
	};
} catch(err) {}
const cube = ServeCube.serve(options);
const {load} = cube;
const stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(String(input)));
});
