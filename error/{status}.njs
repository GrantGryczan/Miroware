if(this.req.subdomain === "api") {
	this.value = String(this.params.status);
} else {
	delete this.status;
	this.redirect = "/error/";
}
this.done();
