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
	app.get("*", async (req, res) => {
		if(req.subdomains.join(".") === "piped") {
			let path = req.path.slice(1);
			if(req.get("User-Agent") !== "MirowarePipe") {
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
					if(path.endsWith("/")) {
						path += "index.html";
					}
					const item = user.pipe.find(item => item.name === path);
					if(item) {
						s3.getObject({
							Bucket: "miroware-pipe",
							Key: item.id
						}, (err, data) => {
							if(err) {
								res.status(err.statusCode).send(err.message);
							} else {
								res.set("Content-Type", item.mime).send(data.Body);
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
			https.get({
				hostname: "piped.miroware.io",
				path: req.path,
				headers: {
					"User-Agent": "MirowarePipe"
				}
			}, response => {
				response.pipe(res);
			});
		}
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
