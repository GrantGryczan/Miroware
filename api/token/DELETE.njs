if (this.token) {
	if (this.req.signedCookies.auth) {
		this.res.clearCookie("auth", clearCookieOptions);
	}
	this.update.$pull = {
		pouch: {
			value: this.token.value
		}
	};
} else {
	this.value = {
		error: "No authorization credentials were provided."
	};
	this.status = 401;
}
this.done();
