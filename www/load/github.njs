var t = this;
var queryIndex = this.req.url.indexOf("?")+1;
var path = this.req.url.slice(queryIndex);
if(queryIndex && path) {
	request.get(`https://raw.githubusercontent.com/${path}`, function(err, res, body) {
		t.res.set("Content-Type", mime.lookup(path)).status(res.statusCode);
		t.value = body || err;
		t.exit();
	});
} else {
	t.res.set("Content-Type", "text/plain").status(400);
	t.value = "400";
	t.exit();
}

