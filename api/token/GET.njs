if (this.token) {
	this.value = {
		scope: this.token.scope
	};
	if (this.token.scope === 0) {
		this.value.super = this.now - this.token.super < 300000;
	}
} else {
	this.value = {
		error: "No authorization credentials were provided."
	};
	this.status = 401;
}
this.done();
