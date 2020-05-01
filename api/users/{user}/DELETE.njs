const {user, isMe} = await parseUser(this);
if (isMe) {
	if (this.now - this.token.super < TOKEN_SUPER_COOLDOWN) {
		this.update = false;
		deleteUser(user, this.userFilter).catch(err => {
			console.error(err);
			this.value = {
				error: err.message
			};
			this.status = err.statusCode;
		}).finally(this.done);
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 401;
		this.done();
	}
} else {
	this.value = {
		error: "You do not have permission to access that user."
	};
	this.status = 403;
	this.done();
}
