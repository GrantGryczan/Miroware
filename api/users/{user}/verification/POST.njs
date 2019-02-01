const {user, permitted} = await parseUser(this);
if (permitted) {
	if (user.emailCode) {
		verifyEmail(user, this.update.$set);
	} else {
		this.value = {
			error: "You cannot resend verification without an unverified email."
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
