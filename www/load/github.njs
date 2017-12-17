var t = this;
var req = !this.path;
if(req) {
	var queryIndex = this.req.url.indexOf("?")+1;
	if(queryIndex) {
		this.path = this.req.url.slice(queryIndex);
	}
}
if(this.path) {
	request.get(`https://raw.githubusercontent.com/${this.path}`, function(err, res, body) {
		if(req) {
			t.res.set("Content-Type", mime.lookup(this.path)).status(res.statusCode);
		}
		t.value = body || err;
		t.exit();
	});
} else {
	t.res.set("Content-Type", "text/plain").status(400);
	t.value = "400";
	t.exit();
}
