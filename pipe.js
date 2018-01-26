console.log("< Pipe >")
const express = require("express");
const AWS = require("aws-sdk");
const youKnow = require("./data/tee.js");
const app = express();
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
app.get((req, res) => {
	if(req.subdomain === "pipe") {
		if(req.decodedPath === "/") {
			res.redirect(`${req.protocol}://${req.get("Host").slice(5)}/pipe/`);
		} else {
			s3.getObject({
				Bucket: "miroware-pipe",
				Key: req.decodedPath.slice(1)
			}, function(err, data) {
				if(err) {
					res.set("Content-Type", "text/plain").status(err.statusCode).send(`Error ${err.statusCode}: ${err.message}`);
				} else {
					res.set("Content-Type", data.ContentType);
					res.send(data.Body);
				}
			});
		}
	}
})
app.post((req, res) => {
	if(req.subdomain === "pipe") {
		s3.putObject({
			Body: req.body,
			Bucket: "miroware-pipe",
			Key: req.path.slice(1),
			ContentType: mime.getType(req.path),
			ServerSideEncryption: "AES256"
		}, function(err) {
			res.set("Content-Type", "text/plain");
			if(err) {
				res.status(err.statusCode).send(`Error ${err.statusCode}: ${err.message}`);
			} else {
				res.send(pathThingyThatDoesNotYetExist);
			}
		});
	}
});
const stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(String(input)));
});
