"use strict";
console.log("< Concat >")
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
app.use((req, res) => {
	req.subdomain = req.subdomains.join(".");
	req.value = req.url.startsWith("/") ? req.url.slice(1) : req.url;
	req.next();
});
app.get("*", (req, res) => {
	if(req.subdomain === "") {
		if(req.decodedURL === "/") {
			res.redirect("https://miroware.io/concat/");
		} else {
			console.log(req.value);
		}
	} else if(req.subdomain === "w") {
		res.redirect(`https://miroware.io/${req.value}`);
	}
});
http.createServer(app).listen(8083);
fs.watch(__filename, () => {
	process.exit();
});
require("replthis")(v => eval(v));
