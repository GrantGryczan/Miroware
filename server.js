console.log("< Server >");
let fs = require("fs");
let http = require("http");
let https = require("https");
let express = require("express");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let request = require("request-promise-native");
let crypto = require("crypto");
let babel = require("babel-core");
let UglifyJS = require("uglify-js");
let childProcess = require("child_process");
let mime = require("mime");
let AWS = require("aws-sdk");
let session = require("express-session");
let DynamoDBStore = require("connect-dynamodb")({
	session
});
let youKnow = require("./data/youknow.js");
mime.define({
	"text/html": ["njs"]
});
let s3 = new AWS.S3({
	credentials: new AWS.Credentials(youKnow.s3),
	sslEnabled: true
});
let app = express();
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
	let host = req.get("Host");
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
			let subdomain = req.subdomains.join(".");
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
app.post("*", async function(req, res) {
	let subdomain = req.subdomains.join(".");
	if(subdomain == "") {
		if(req.path == "/github") {
			let signature = req.get("X-Hub-Signature");
			if(signature && signature == `sha1=${crypto.createHmac("sha1", youKnow.gh.secret).update(req.body).digest("hex")}` && req.get("X-GitHub-Event") == "push") {
				res.send();
				let payload = JSON.parse(req.body);
				if(payload.repository.name == "web") {
					let branch = payload.ref.slice(payload.ref.lastIndexOf("/")+1);
					if(branch == "master") {
						let modified = [];
						let removed = [];
						for(let v of payload.commits) {
							for(let w of [...v.added, ...v.modified]) {
								if(!modified.includes(w)) {
									modified.push(w);
									let contents = String(new Buffer(JSON.parse(await request.get({
										url: `https://api.github.com/repos/${payload.repository.full_name}/contents/${w}?ref=${branch}`,
										headers: {
											"User-Agent": "request"
										}
									})).content, "base64"));
									let index = 0;
									while(index = w.indexOf("/", index)+1) {
										nextPath = w.slice(0, index-1);
										if(!fs.existsSync(nextPath)) {
											fs.mkdirSync(nextPath);
										}
									}
									if(w.startsWith("www/") && w.endsWith(".js")) {
										let filename = w.slice(w.lastIndexOf("/")+1);
										let compiled = babel.transform(contents, {
											ast: false,
											comments: false,
											compact: true,
											filename,
											minified: true,
											presets: ["env"],
											sourceMaps: true
										});
										let result = UglifyJS.minify(compiled.code, {
											parse: {
												html5_comments: false
											},
											compress: {
												passes: 2,
												unsafe_comps: true,
												unsafe_math: true,
												unsafe_proto: true
											},
											sourceMap: {
												content: JSON.stringify(compiled.map),
												filename,
												url: `${filename}.map`
											}
										});
										console.log(result);
										contents = result.code;
										fs.writeFileSync(`${w}.map`, result.map);
									}
									fs.writeFileSync(w, contents);
								}
							}
							for(let w of v.removed) {
								if(!removed.includes(w)) {
									removed.push(w);
									if(fs.existsSync(w)) {
										fs.unlinkSync(w);
									}
									let index = w.length;
									while((index = w.lastIndexOf("/", index)-1) != -2) {
										let path = w.slice(0, index+1);
										if(fs.existsSync(path)) {
											try {
												fs.rmdirSync(path);
											} catch(err) {}
										}
									}
								}
							}
						}
						if(modified.includes("package.json")) {
							childProcess.spawnSync("npm", ["update"]);
						}
						if(modified.includes("server.js")) {
							process.exit();
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
let html = function() {
	let string = arguments[0][0];
	let substitutions = Array.prototype.slice.call(arguments, 1);
	for(let i = 0; i < substitutions.length; i++) {
		string += String(substitutions[i]).replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + arguments[0][i+1];
	}
	return string;
};
let evalVal = function(thisCode) {
	return eval(thisCode);
};
let getActualPath = function(path) {
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
let loadCache = {};
let load = function(path, context) {
	if(context) {
		context = Object.assign({}, context);
		delete context.cache;
		delete context.value;
		delete context.exit;
	} else {
		context = {};
	}
	let properties = ["exit", Object.keys(context)];
	context.value = "";
	return new Promise(function(resolve, reject) {
		if(loadCache[path]) {
			resolve(Object.assign(context, loadCache[path]));
		} else {
			context.exit = function() {
				if(context.cache == 1) {
					loadCache[path] = {};
					for(let i in context) {
						if(!properties.includes(i)) {
							loadCache[path][i] = context[i];
						}
					}
				}
				resolve(context);
			};
			let val = "";
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
	res.set("Cache-Control", "max-age=86400");
	let decodedPath = decodeURIComponent(req.path);
	let subdomain = req.subdomains.join(".");
	if(subdomain == "" || subdomain == "d") {
		let path = getActualPath(decodedPath);
		let type = (path.lastIndexOf("/") > path.lastIndexOf(".")) ? "text/plain" : mime.getType(path);
		let publicPath = path.slice(3);
		if(path.endsWith("/index.njs")) {
			publicPath = publicPath.slice(0, -9);
		}
		if(decodedPath != publicPath) {
			res.redirect(publicPath);
		} else if(fs.existsSync(path)) {
			res.set("Content-Type", type);
			if(path.endsWith(".njs")) {
				res.set("Cache-Control", "no-cache");
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
let stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(String(input)));
});
