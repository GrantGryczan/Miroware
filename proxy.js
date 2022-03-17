"use strict";
console.log("< Proxy >");
const fs = require("fs");
const http = require("http");
const https = require("https");
const tls = require("tls");
const httpProxy = require("http-proxy");
const ioContextOptions = {
	key: fs.readFileSync("/etc/letsencrypt/live/miroware.io/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/miroware.io/cert.pem"),
	ca: fs.readFileSync("/etc/letsencrypt/live/miroware.io/chain.pem")
};
const ioContext = tls.createSecureContext(ioContextOptions);
const ggContext = tls.createSecureContext({
	key: fs.readFileSync("/etc/letsencrypt/live/miro.gg/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/miro.gg/cert.pem"),
	ca: fs.readFileSync("/etc/letsencrypt/live/miro.gg/chain.pem")
});
const gardenContext = tls.createSecureContext({
	key: fs.readFileSync("/etc/letsencrypt/live/file.garden/privkey.pem"),
	cert: fs.readFileSync("/etc/letsencrypt/live/file.garden/cert.pem"),
	ca: fs.readFileSync("/etc/letsencrypt/live/file.garden/chain.pem")
});
const proxy = httpProxy.createProxyServer();
/** A string which, when set, enables maintenance mode and must be in the client's cookies in order to bypass it. */
let maintenance;
const listener = (req, res) => {
	if (maintenance && !(
		req.headers.cookie && req.headers.cookie.includes(maintenance)
	)) {
		const body = 'Miroware is undergoing brief maintenance. Please be patient.';
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(body),
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache'
		}).end(body);
		return;
	}

	let target = "http://localhost:8081";
	if (req.headers.host) {
		if (req.headers.host.endsWith(".garden") || req.headers.host.startsWith("pipe.")) {
			target = "http://localhost:8082";
		} else if (req.headers.host.endsWith(".gg")) {
			target = "http://localhost:8083";
		} else if (req.headers.host.endsWith(".gold")) {
			target = "http://localhost:8180";
		}
	}
	proxy.web(req, res, {
		target
	});
};
http.createServer(listener).listen(8080);
https.createServer({
	SNICallback: (domain, callback) => {
		callback(null, domain.endsWith(".garden") ? gardenContext : domain.endsWith(".gg") ? ggContext : ioContext);
	},
	...ioContextOptions
}, listener).listen(8443);
fs.watch(__filename, () => {
	setTimeout(() => {
		process.exit();
	}, 1000);
});
require("replthis")(v => eval(v));
