if(this.req.session.user) {
	this.value = {
		user: this.req.session.user
	};
} else {
	this.value = {
		error: "No session was detected."
	};
	this.status = 404;
}
this.done();
