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
	const userAgents = [];
	app.get("*", async (req, res) => {
		let path = req.path;
		if(req.subdomains.join(".") === "piped") {
			path = path.slice(1);
			if(!userAgents.includes(req.get("User-Agent"))) {
				res.redirect(307, `https://pipe.miroware.io/${path}`);
				return;
			}
			try {
				path = decodeURIComponent(path);
			} catch(err) {
				res.status(400).send(err.message);
				return;
			}
			if(path === "/") {
				res.redirect(308, "https://miroware.io/pipe/");
			} else {
				path = path.split("/");
				let userID = path.shift();
				try {
					userID = ObjectID(userID);
				} catch(err) {
					res.sendStatus(404);
					return;
				}
				const user = await users.findOne({
					_id: userID
				});
				if(user) {
					path = path.join("/");
					const item = user.pipe.find(item => item.type !== "/" && item.name === path);
					if(item) {
						s3.getObject({
							Bucket: "miroware-pipe",
							Key: item.id
						}, (err, data) => {
							if(err) {
								res.status(err.statusCode).send(err.message);
							} else {
								res.set("Content-Type", item.type).send(data.Body);
								console.log(new Date(), req.url);
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
			}
		} else {
			const userAgent = `MirowarePipe (${Math.random()})`;
			userAgents.push(userAgent);
			if(path.endsWith("/")) {
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
				res.set("Content-Type", response.headers["content-type"]);
				userAgents.splice(userAgents.indexOf(userAgent), 1);
			});
		}
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
