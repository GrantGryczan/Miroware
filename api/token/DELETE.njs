if(this.req.signedCookies.auth) {
	this.res.clearCookie("auth", cookieOptions);
}
this.update.$pull.pouch = {
	$or: [this.update.$pull.pouch, {
		value: this.token.value
	}]
};
this.done();
