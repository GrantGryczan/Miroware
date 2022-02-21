"use strict";
console.log("< Pipe >")
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const AWS = require("aws-sdk");
const archiver = require("archiver");
const youKnow = require("./secret/youknow.js");
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
const encodedSlashes = /%2F/g;
const encodedAts = /%40/g;
const encodeForPipe = name => encodeURIComponent(name).replace(encodedSlashes, "/").replace(encodedAts, "@");
(async () => {
	require("replthis")(v => eval(v));
	const db = (await MongoClient.connect(youKnow.db, {
		useUnifiedTopology: true
	})).db("web");
	const users = db.collection("users");
	const app = express();
	app.disable("X-Powered-By");
	const userAgents = [];
	const request = path => new Promise(resolve => {
		const userAgent = `File Garden (${Math.random()})`;
		userAgents.push(userAgent);
		https.get({
			hostname: "cache.file.garden",
			path,
			headers: {
				"User-Agent": userAgent
			}
		}, response => {
			resolve(response);
			userAgents.splice(userAgents.indexOf(userAgent), 1);
		});
	});
	app.get("*", async (req, res) => {
		let path = req.path;
		if (path === "/") {
			res.redirect(307, "https://miroware.io/pipe/");
		} else if (req.hostname === 'pipe.miroware.io') {
			const referrer = req.get('Referer');
			if (referrer) {
				console.log(referrer, req.url);
			}
			let url = req.url.slice(1);
			url = url.replace(/^[0-9a-f]{24}/, hex => Buffer.from(hex, 'hex').toString('base64url'));
			res.set("Access-Control-Allow-Origin", "*").redirect(308, `https://file.garden/${url}`);
		} else if (req.subdomains.join(".") === "cache") {
			path = path.slice(1);
			try {
				path = decodeURIComponent(path);
			} catch (err) {
				res.header("Content-Type", "text/plain").status(400).send(err.message);
				return;
			}
			if (!userAgents.includes(req.get("User-Agent"))) {
				// This is a temporary redirect rather than permanent so that the redirect doesn't get cached.
				res.redirect(307, 'https://file.garden/');
				return;
			}
			const slashIndex = path.indexOf("/");
			let userID;
			try {
				if (slashIndex === -1) {
					throw 404;
				}
				userID = new ObjectId(
					Buffer.from(path.slice(0, slashIndex), "base64url")
				);
			} catch {
				res.sendStatus(404);
				return;
			}
			const user = await users.findOne({
				_id: userID
			});
			if (user) {
				path = path.slice(slashIndex + 1);
				if (path.startsWith(`${user.pipe.find(item => item.id === "trash").path}/`)) {
					res.sendStatus(404);
					return;
				}
				const item = user.pipe.find(item => item.path === path && item.privacy !== 2);
				if (item) {
					if (item.type === "/") {
						res.set("Content-Type", "application/zip");
						const archive = archiver("zip");
						archive.on("error", err => {
							throw err;
						});
						archive.pipe(res);
						const sliceStart = path.length + 1; // Change `path.length` to `path.lastIndexOf("/")` to put the folder inside of the ZIP instead of having the ZIP be the folder itself.
						const promises = [];
						const scan = parent => {
							for (const item of user.pipe) {
								if (item.parent === parent && item.privacy === 0) {
									if (item.type === "/") {
										scan(item.id);
									} else {
										promises.push(request(`/${user._id}/${encodeForPipe(item.path)}`).then(response => {
											archive.append(response, {
												name: item.path.slice(sliceStart)
											});
										}));
									}
								}
							}
						};
						scan(item.id);
						Promise.all(promises).then(() => {
							archive.finalize();
						});
					} else {
						s3.getObject({
							Bucket: "miroware-pipe",
							Key: item.id
						}, (err, data) => {
							if (err) {
								console.error(err);
								res.status(err.statusCode).send(err.message);
							} else {
								res.set("Content-Type", item.type).set("Content-Length", String(data.Body.length)).send(data.Body);
							}
						});
					}
				} else {
					res.sendStatus(404);
					return;
				}
			} else {
				res.sendStatus(404);
				return;
			}
		} else {
			request(path).then(response => {
				response.pipe(res);
				if (response.headers["content-length"]) { // This condition is necessary because Cloudflare removes the `Content-Length` header from dynamic content.
					res.set("Content-Length", response.headers["content-length"]);
				}
				res.status(response.statusCode).set("Content-Type", "download" in req.query ? "application/octet-stream" : response.headers["content-type"]).set("Access-Control-Allow-Origin", "*").set("Content-Security-Policy", "default-src file.garden pipe.miroware.io miro.gg data: mediastream: blob: 'unsafe-inline' 'unsafe-eval'");
			});
		}
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
