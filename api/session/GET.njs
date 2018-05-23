this.value = {};
if(this.req.session.in !== undefined) {
	this.value.in = this.req.session.in;
}
if(this.req.session.user) {
	this.value.user = this.req.session.user;
}
this.done();
