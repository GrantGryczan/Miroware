this.cache = 2;
this.headers = {};
const queryIndex = this.req.url.indexOf("?")+1;
const path = this.req.url.slice(queryIndex);
if(queryIndex && path) {
	let callback = body => {
		this.headers["Content-Type"] = mime.getType(path);
		this.value = body;
		this.exit();
	};
	request.get(path).then(callback).catch(callback);
} else {
	this.status = 400;
	this.headers["Content-Type"] = "text/plain";
	this.value = "400";
	this.exit();
}
