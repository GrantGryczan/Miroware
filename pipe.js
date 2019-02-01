"use strict";
console.log("< Pipe >")
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const {MongoClient, ObjectID} = require("mongodb");
const AWS = require("aws-sdk");
const youKnow = require("./secret/youknow.js");
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
(async () => {
	require("replthis")(v => eval(v));
	const db = (await MongoClient.connect(youKnow.db, {
		native_parser: true
	})).db("web");
	const users = db.collection("users");
	const app = express();
	app.disable("X-Powered-By");
	const userAgents = [];
	app.get("*", async (req, res) => {
		let path = req.path;
		if (path === "/") {
			res.redirect(308, "https://miroware.io/pipe/");
		} else if (req.subdomains.join(".") === "piped") {
			path = path.slice(1);
			if (!userAgents.includes(req.get("User-Agent"))) {
				res.redirect(307, `https://pipe.miroware.io/${path}`);
				return;
			}
			try {
				path = decodeURIComponent(path);
			} catch (err) {
				res.status(400).send(err.message);
				return;
			}
			let userID = (path = path.split("/")).shift();
			try {
				userID = ObjectID(userID);
			} catch (err) {
				res.sendStatus(404);
				return;
			}
			const user = await users.findOne({
				_id: userID
			});
			if (user) {
				path = path.join("/");
				const item = user.pipe.find(item => item.type !== "/" && item.name === path);
				if (item) {
					s3.getObject({
						Bucket: "miroware-pipe",
						Key: item.id
					}, (err, data) => {
						if (err) {
							res.status(err.statusCode).send(err.message);
						} else {
							res.set("Content-Type", item.type).set("Content-Length", String(data.Body.length)).send(data.Body);
						}
					});
				} else {
					res.sendStatus(404);
					return;
				}
			} else {
				res.sendStatus(404);
				return;
			}
		} else {
			res.set("X-Powered-By", "Miroware");
			const userAgent = `MirowarePipe (${Math.random()})`;
			userAgents.push(userAgent);
			if (path.endsWith("/")) {
				path += "index.html";
			}
			https.get({
				hostname: "piped.miroware.io",
				path,
				headers: {
					"User-Agent": userAgent
				}
			}, response => {
				response.pipe(res);
				if (response.headers["content-length"]) { // This is necessary because Cloudflare removes the `Content-Length` header from dynamic content.
					res.set("Content-Length", response.headers["content-length"]);
				}
				res.status(response.statusCode).set("Content-Type", req.query.download === undefined ? response.headers["content-type"] : "application/octet-stream").set("Access-Control-Allow-Origin", "*").set("Content-Security-Policy", "default-src pipe.miroware.io miro.gg 'unsafe-inline' 'unsafe-eval'");
				userAgents.splice(userAgents.indexOf(userAgent), 1);
			});
			const referrer = req.get("Referrer");
			if(referrer && !referrer.startsWith("https://miroware.io/") && !referrer.startsWith("https://pipe.miroware.io/") && !referrer.startsWith("https://mspfa.com/")) {
				console.log(referrer);
			}
		}
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
