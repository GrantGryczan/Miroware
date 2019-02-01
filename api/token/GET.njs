if (this.token) {
	this.value = {
		role: this.token.role,
		ip: this.token.ip
	};
	if (this.token.role === 0) {
		this.value.super = this.now - this.token.super < TOKEN_SUPER_COOLDOWN;
	}
} else {
	this.value = {
		error: "No authorization credentials were provided."
	};
	this.status = 401;
}
this.done();
