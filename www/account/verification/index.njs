const user = typeof this.req.query.code === "string" && await users.findOne({
	emailCode: this.req.query.code
});
if (user) {
	if (await users.findOne({
		email: user.unverified,
		_id: {
			$ne: user._id
		}
	})) { // If the email being verified is already verified by a different user
		await users.updateOne({
			_id: user._id
		}, {
			$set: {
				unverified: null,
				emailCode: null
			}
		});
	} else {
		await users.updateOne({
			_id: user._id
		}, {
			$set: {
				email: user.unverified,
				verified: true,
				unverified: null,
				emailCode: null
			}
		});
		createToken(this, user);
		this.redirect = "/account/verification/done/?result=success";
		this.done();
		return;
	}
}
this.redirect = "/account/verification/done/?result=failure";
this.done();
