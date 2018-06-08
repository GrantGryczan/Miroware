if(this.token) {
	if(this.req.signedCookies.auth) {
		this.res.clearCookie("auth", clearCookieOptions);
	}
	this.update.$pull.pouch = {
		$or: [this.update.$pull.pouch, {
			value: this.token.value
		}]
	};
} else {
	this.value = {
		error: "No authorization credentials were specified."
	};
	this.status = 404;
	this.done();
}
this.done();
