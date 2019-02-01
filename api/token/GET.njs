if (this.token) {
	this.value = {
		used: this.token.used,
		role: this.token.role,
		super: this.now - this.token.super < TOKEN_SUPER_COOLDOWN,
		ip: this.token.ip
	};
} else {
	this.value = {
		error: "No authorization credentials were provided."
	};
	this.status = 401;
}
this.done();
