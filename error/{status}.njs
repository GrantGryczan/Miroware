if(this.req.subdomain === "api") {
	this.value = String(this.params.status);
} else {
	this.status = 308;
	this.redirect = "/error/";
}
this.done();
