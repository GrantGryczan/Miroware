"use strict";
console.log("< Proxy >");
const fs = require("fs");
const redbird = require("redbird")({
	port: 8080,
	secure: true,
	ssl: {
		port: 8443,
		key: "/etc/letsencrypt/live/miroware.io/privkey.pem",
		cert: "/etc/letsencrypt/live/miroware.io/cert.pem",
		ca: "/etc/letsencrypt/live/miroware.io/chain.pem"
	}
});
redbird.register("pipe.miroware.io", "http://localhost:8082");
redbird.register("comedy-dot.gold", "http://localhost:8180", {
	secure: false
});
redbird.addResolver(() => "http://localhost:8081");
fs.watch(__filename, () => {
	setTimeout(() => {
		process.exit();
	}, 1000);
});
require("replthis")(v => eval(v));
