if(this.token) {
	this.value = {
		scope: this.token.scope
	};
	if(this.token.scope <= 0) {
		this.connected = this.now-this.token.connected < 300000;
	}
} else {
	this.value = {
		error: "No authorization credentials were specified."
	};
	this.status = 404;
}
this.done();
