const user = await users.findOne({
	emailCode: this.req.query.code
});
if(user) {
	users.updateOne({
		_id: user._id
	}, {
		$set: {
			email: user.unverified,
			verified: true,
			unverified: null,
			emailCode: null
		}
	});
	this.redirect = "/account/verification/done/?result=success";
} else {
	this.redirect = "/account/verification/done/?result=failure";
}
this.done();
