const {user, permitted} = await parseUser(this);
if (permitted) {
	if (user.verified) {
		this.update.$set.unverified = this.update.$set.emailCode = null;
	} else {
		this.value = {
			error: "You cannot cancel verification without a verified email."
		};
		this.status = 422;
	}
} else {
	this.value = {
		error: "You do not have permission to edit that user."
	};
	this.status = 403;
}
this.done();
