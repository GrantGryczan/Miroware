this.cache = 2;
let url = this.req.url;
const queryIndex = url.indexOf("?")+1;
url = url.slice(queryIndex);
const queryIndex2 = url.indexOf("?");
let noQuery = url;
if(queryIndex2 != -1) {
	noQuery = url.slice(0, queryIndex2);
}
this.headers = {
	"Content-Type": mime.getType(noQuery)
};
request.get(decodeURIComponent(url)).then(body => {
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
