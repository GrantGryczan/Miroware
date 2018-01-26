console.log("< Server >");
const fs = require("fs");
const ServeCube = require("servecube");
const {html} = ServeCube;
const request = require("request-promise-native");
const AWS = require("aws-sdk");
const mime = require("mime");
const youKnow = require("./data/youknow.js");
const s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
const options = {
	eval: v => {
		return eval(v);
	},
	subdomain: ["", "d"],
	githubSecret: youKnow.github.secret,
	githubPayloadURL: "/githubwebhook"
};
try {
	options.tls = {
		key: fs.readFileSync("/etc/letsencrypt/live/miroware.io/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/miroware.io/cert.pem"),
		ca: fs.readFileSync("/etc/letsencrypt/live/miroware.io/chain.pem")
	};
} catch(err) {}
const cube = ServeCube.serve(options);
const {load} = cube;
cube.app.post((req, res) => {
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
