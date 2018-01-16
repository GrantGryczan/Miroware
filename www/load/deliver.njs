const t = this;
t.cache = 2;
t.headers = {};
const queryIndex = this.req.url.indexOf("?")+1;
const path = this.req.url.slice(queryIndex);
if(queryIndex && path) {
	let callback = function(body) {
		t.headers["Content-Type"] = mime.getType(path);
		t.value = body;
		t.exit();
	};
	request.get(path).then(callback).catch(callback);
} else {
	t.status = 400;
	t.headers["Content-Type"] = "text/plain";
	t.value = "400";
	t.exit();
}
