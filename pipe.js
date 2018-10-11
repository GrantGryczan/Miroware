"use strict";
console.log("< Pipe >")
const fs = require("fs");
const http = require("http");
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
		let path;
		try {
			path = decodeURIComponent(req.url);
		} catch(err) {
			res.status(400).send(err.message);
			return;
		}
		if(path === "/") {
			res.redirect(308, "https://miroware.io/pipe/");
		} else {
			path = path.slice(1).split("/");
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
				const item = user.pipe.find(item => item.name === path);
				if(item) {
					s3.getObject({
						Bucket: "miroware-pipe",
						Key: path
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
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
