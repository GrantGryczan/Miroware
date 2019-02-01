const {user, isMe} = await parseUser(this);
if (isMe) {
	if (this.now - this.token.super < TOKEN_SUPER_COOLDOWN) {
		this.value = user.connections.map(sanitizeConnection);
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 401;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's connections."
	};
	this.status = 403;
}
this.done();
