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
const enableMaintenance = () => {
	maintenance = Math.random();
	console.log(`document.cookie="temp=${maintenance};domain=.filegarden.com;path=/;expires="+new Date(Date.now()+1000*60*60*24*7).toUTCString();document.cookie="temp=${maintenance};domain=file.garden;path=/;expires="+new Date(Date.now()+1000*60*60*24*7).toUTCString();`);
};
const disableMaintenance = () => {
	maintenance = '';
};
const listener = (req, res) => {
	if (maintenance && !req.headers.host?.endsWith(".gg") && !req.headers.host?.endsWith(".gold") && !(
		req.headers.cookie && req.headers.cookie.includes(maintenance)
	)) {
		res.writeHead(req.method === 'OPTIONS' ? 200 : 503, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'no-cache',
			'Access-Control-Allow-Origin': 'https://filegarden.com',
			'Access-Control-Allow-Credentials': 'true',
			'Allow': 'OPTIONS, GET, POST, PUT, DELETE, PATCH',
			'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE, PATCH',
			...req.headers['access-control-request-headers'] && {
				'Access-Control-Allow-Headers': req.headers['access-control-request-headers']
			}
		}).end(
			req.method === 'OPTIONS'
				? undefined
				: 'File Garden is undergoing brief maintenance. Sorry for the inconvenience.'
		);
		return;
	}

	let target = "http://localhost:8081";
	if (req.headers.host) {
		if (req.headers.host.endsWith(".garden") || req.headers.host === "pipe.miroware.io") {
			target = "http://localhost:8082";
		} else if (req.headers.host.endsWith(".at") || req.headers.host.endsWith(".gg")) {
			target = "http://localhost:8083";
		} else if (req.headers.host.endsWith(".gold")) {
			target = "http://localhost:8180";
		}
	}
	proxy.web(req, res, {
		target
	});
};
process.on("uncaughtException", (error) => {
	console.error("uncaughtException", error);
});
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
