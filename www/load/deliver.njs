let t = this;
t.cache = 2;
let queryIndex = this.req.url.indexOf("?")+1;
let path = this.req.url.slice(queryIndex);
if(queryIndex && path) {
	let callback = function(body) {
		t.res.set("Content-Type", mime.getType(path)).status(res.statusCode);
		t.value = body;
		t.exit();
	};
	request.get(path).then(callback).catch(callback);
} else {
	t.res.set("Content-Type", "text/plain").status(400);
	t.value = "400";
	t.exit();
}
