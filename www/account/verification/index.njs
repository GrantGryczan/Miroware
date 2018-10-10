const user = typeof this.req.query.code === "string" && await users.findOne({
	emailCode: this.req.query.code
});
if(user) {
	if(await users.findOne({
		email: user.unverified
	})) {
		users.updateOne({
			_id: user._id
		}, {
			$set: {
				unverified: null,
				emailCode: null
			}
		});
	} else {
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
		this.done();
		return;
	}
}
this.redirect = "/account/verification/done/?result=failure";
this.done();
