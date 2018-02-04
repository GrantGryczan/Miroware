this.cache = 2;
const queryIndex = this.req.url.indexOf("?")+1;
const path = this.req.url.slice(queryIndex);
this.headers = {
	"Content-Type": mime.getType(path)
};
request.get(path).then(body => {
	this.value = body;
	this.exit();
}).catch(error => {
	if(error.response) {
		this.status = error.response.status;
		this.value = error.response.body;
	} else {
		this.status = 400;
		this.value = error.message;
	}
	this.exit();
});
