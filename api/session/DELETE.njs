if(this.req.signedCookies.auth) {
	this.res.clearCookie("auth", cookieOptions);
}
this.done();
