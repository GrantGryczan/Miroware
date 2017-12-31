console.log("< Server >");
var fs = require("fs");
var http = require("http");
var https = require("https");
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var request = require("request");
var crypto = require("crypto");
var babel = require("babel-core");
var mime = require("mime");
var AWS = require("aws-sdk");
var DynamoDBStore = require("connect-dynamodb")({
	session
});
var youKnow = require("./data/youknow.js");
mime.define({
	"text/html": ["njs"]
});
var s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
var app = express();
app.set("trust proxy", true);
app.use(cookieParser());
app.use(bodyParser.raw({
	limit: "100mb",
	type: "*/*"
}));
app.use(session({
	name: "session",
	secret: "temp",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: true,
		expires: new Date(Date.now()+2592000000)
	},
	store: new DynamoDBStore({
		table: "sessions",
		AWSConfigJSON: youKnow.db
	})
}));
app.use(function(req, res) {
	res.set("X-Magic", "real");
	res.set("Access-Control-Expose-Headers", "X-Magic");
	res.set("Access-Control-Allow-Origin", "*");
	var host = req.get("Host");
	if(host) {
		if(host.startsWith("localhost:")) {
			Object.defineProperty(req, "protocol", {
				value: "https",
				enumerable: true
			});
		}
		if(req.protocol == "http") {
			res.redirect(`https://${host + req.url}`);
		} else {
			var subdomain = req.subdomains.join(".");
			if(subdomain == "www") {
				res.redirect(`${req.protocol}://${host.slice(4) + req.url}`);
			} else {
				try {
					decodeURIComponent(req.url);
					req.next();
				} catch(err) {
					res.status(400).json(400);
				}
			}
		}
	} else {
		console.log(req.get("User-Agent"));
		res.status(400).send("I am not quite sure how you could get this error, but you apparently can. I am willing to bet that you need a new web browser. That is probably what caused it.");
	}
});
app.post("*", function(req, res) {
	var subdomain = req.subdomains.join(".");
	if(subdomain == "") {
		if(req.path == "/github") {
			var signature = req.get("X-Hub-Signature");
			if(signature && signature == `sha1=${crypto.createHmac("sha1", youKnow.gh.secret).update(req.body).digest("hex")}` && req.get("X-GitHub-Event") == "push") {
				res.send();
				var payload = JSON.parse(req.body);
				if(payload.repository.name == "web") {
					var branch = payload.ref.slice(payload.ref.lastIndexOf("/")+1);
					if(branch == "master") {
						var added = [];
						var removed = [];
						var modified = [];
						for(var i = 0; i < payload.commits.length; i++) {
							for(var j = 0; j < payload.commits[i].added.length; j++) {
								if(!added.includes(payload.commits[i].added[j])) {
									added.push(payload.commits[i].added[j]);
									(function(path) {
										request.get(`https://raw.githubusercontent.com/${payload.repository.full_name}/${branch}/${path}?${Date.now()}`, function(err, res2, body) {
											if(body) {
												var index = 0;
												while(index = path.indexOf("/", index)+1) {
													nextPath = path.slice(0, index-1);
													if(!fs.existsSync(nextPath)) {
														fs.mkdirSync(nextPath);
													}
												}
												if(path.startsWith("web/") && path.endsWith(".js")) {
													var result = babel.transform(body);
													body = result.code;
													fs.writeFileSync(path + ".map", result.map);
												}
												fs.writeFileSync(path, body);
											}
										});
									})(payload.commits[i].added[j]);
								}
							}
							for(var j = 0; j < payload.commits[i].modified.length; j++) {
								if(!modified.includes(payload.commits[i].modified[j])) {
									modified.push(payload.commits[i].modified[j]);
									(function(path) {
										request.get(`https://raw.githubusercontent.com/${payload.repository.full_name}/${branch}/${path}?${Date.now()}`, function(err, res2, body) {
											if(body) {
												fs.writeFileSync(path, body);
											}
										});
									})(payload.commits[i].modified[j]);
								}
							}
							for(var j = 0; j < payload.commits[i].removed.length; j++) {
								if(!removed.includes(payload.commits[i].removed[j])) {
									removed.push(payload.commits[i].removed[j]);
									if(fs.existsSync(payload.commits[i].removed[j])) {
										fs.unlinkSync(payload.commits[i].removed[j]);
									}
									var index = payload.commits[i].removed[j].length;
									while((index = payload.commits[i].removed[j].lastIndexOf("/", index)-1) != -2) {
										var path = payload.commits[i].removed[j].slice(0, index+1);
										if(fs.existsSync(path)) {
											try {
												fs.rmdirSync(path);
											} catch(err) {}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	} else if(subdomain == "pipe") {
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
				res.send(key);
			}
		});
	}
});
var html = function() {
	var string = arguments[0][0];
	var substitutions = Array.prototype.slice.call(arguments, 1);
	for(var i = 0; i < substitutions.length; i++) {
		string += String(substitutions[i]).replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + arguments[0][i+1];
	}
	return string;
};
var evalVal = function(thisCode) {
	return eval(thisCode);
};
var getActualPath = function(path) {
	if(!path.startsWith("/")) {
		path = `/${path}`;
	}
	path = `www${path.replace(/\/+/g, "/")}`;
	if(path.lastIndexOf("/") > path.lastIndexOf(".") && !(fs.existsSync(path) && !fs.statSync(path).isDirectory())) {
		if(!path.endsWith("/")) {
			path += "/";
		}
		path += "index.njs";
	}
	path = path.replace(/\/\.{1,2}(?=\/)/g, "");
	return path;
};
var loadCache = {};
var load = function(path, context) {
	if(context) {
		context = Object.assign({}, context);
		delete context.cache;
		delete context.value;
		delete context.exit;
	} else {
		context = {};
	}
	var properties = ["exit", Object.keys(context)];
	context.value = "";
	return new Promise(function(resolve, reject) {
		if(loadCache[path]) {
			resolve(Object.assign(context, loadCache[path]));
		} else {
			context.exit = function() {
				if(context.cache == 1) {
					loadCache[path] = {};
					for(var i in context) {
						if(!properties.includes(i)) {
							loadCache[path][i] = context[i];
						}
					}
				}
				resolve(context);
			};
			var val = "";
			try {
				evalVal.call(context, `(async function() {\n${fs.readFileSync(getActualPath(path))}\n}).call(this);`);
			} catch(err) {
				reject(err);
			}
		}
	});
};
setInterval(function() {
	loadCache = {};
}, 86400000);
app.get("*", async function(req, res) {
	var decodedPath = decodeURIComponent(req.path);
	var subdomain = req.subdomains.join(".");
	if(subdomain == "" || subdomain == "d") {
		var path = getActualPath(decodedPath);
		var type = (path.lastIndexOf("/") > path.lastIndexOf(".")) ? "text/plain" : mime.getType(path);
		var publicPath = path.slice(3);
		if(path.slice(-10) == "/index.njs") {
			publicPath = publicPath.slice(0, -9);
		}
		if(decodedPath != publicPath) {
			res.redirect(publicPath);
		} else if(fs.existsSync(path)) {
			res.set("Content-Type", type);
			if(path.slice(-4) == ".njs") {
				res.set("Content-Type", "text/html");
				res.send((await load(decodedPath, {
					req,
					res
				})).value);
			} else {
				fs.createReadStream(path).pipe(res);
			}
		} else {
			res.status(404);
			if(type == "text/html") {
				res.redirect("/error/404/");
			} else if(type.startsWith("image/")) {
				res.json(404);
			} else {
				res.json(404);
			}
		}
	} else if(subdomain == "pipe") {
		if(decodedPath == "/") {
			res.redirect(`${req.protocol}://${req.get("Host").slice(5)}/pipe/`);
		} else {
			s3.getObject({
				Bucket: "miroware-pipe",
				Key: decodedPath.slice(1)
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
});
http.createServer(app).listen(8080);
try {
	https.createServer({
		key: fs.readFileSync("/etc/letsencrypt/live/miroware.io/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/miroware.io/cert.pem"),
		ca: fs.readFileSync("/etc/letsencrypt/live/miroware.io/chain.pem")
	}, app).listen(8443);
} catch(err) {}
fs.watch(__filename, function() {
	process.exit();
});
var stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(String(input).trim()));
});
