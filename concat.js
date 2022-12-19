"use strict";
console.log("< Concat >")
const fs = require("fs");
const http = require("http");
const express = require("express");
const {MongoClient} = require("mongodb");
const youKnow = require("./secret/youknow.js");
(async () => {
	require("replthis")(v => eval(v));
	const db = (await MongoClient.connect(youKnow.db, {
		useUnifiedTopology: true
	})).db("web");
	const users = db.collection("users");
	const app = express();
	app.use((req, res) => {
		req.sub = req.subdomains.join(".");
		req.val = req.url.startsWith("/") ? req.url.slice(1) : req.url;
		try {
			decodeURI(req.val);
		} catch {
			res.sendStatus(400);
			return;
		}
		req.next();
	});
	app.get("*", async (req, res) => {
		const keeper = await users.findOne({
			concats: {
				$elemMatch: {
					sub: req.sub,
					val: req.val
				}
			}
		});
		if (keeper) {
			const found = keeper.concats.find(item => item.sub === req.sub && item.val === req.val);
			res.redirect(found.urls.length === 1 ? found.urls[0] : found.urls[Math.floor(Math.random() * found.urls.length)]);
		} else {
			res.redirect(`https://filegarden.com/link-hat/?sub=${encodeURIComponent(req.sub)}&val=${encodeURIComponent(req.val)}`);
		}
	});
	http.createServer(app).listen(8083);
})();
fs.watch(__filename, () => {
	process.exit();
});
