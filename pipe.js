console.log("< Pipe >")
const fs = require("fs");
const http = require("http");
const express = require("express");
const AWS = require("aws-sdk");
const youKnow = require("./data/tee.js");
const app = express();
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
app.use((req, res) => {
	try {
		req.decodedPath = decodeURIComponent(req.url);
		req.next();
	} catch(err) {
		res.send("Error 400: Bad Request");
	}
});
app.get("*", (req, res) => {
	if(req.decodedPath === "/") {
		res.redirect("https://miroware.io/pipe/");
	} else {
		s3.getObject({
			Bucket: "miroware-pipe",
			Key: req.decodedPath.slice(1)
		}, function(err, data) {
			if(err) {
				res.set("Content-Type", "text/plain").status(err.statusCode).send(`Error ${err.statusCode}: ${err.message}`);
			} else {
				res.set("Content-Type", data.ContentType).send(data.Body);
			}
		});
	}
});
app.post("*", (req, res) => {
	s3.putObject({
		Body: req.body,
		Bucket: "miroware-pipe",
		Key: req.decodedPath.slice(1),
		ContentType: mime.getType(req.decodedPath),
		ServerSideEncryption: "AES256"
	}, function(err) {
		res.set("Content-Type", "text/plain");
		if(err) {
			res.status(err.statusCode).send(`Error ${err.statusCode}: ${err.message}`);
		} else {
			res.send();
		}
	});
});
http.createServer(app).listen(8082);
fs.watch(__filename, () => {
	process.exit();
});
const stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(String(input)));
});
