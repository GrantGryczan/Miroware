const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.now - this.token.super < 300000) {
		this.update = false;
		users.deleteOne(this.userFilter);
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "You do not have permission to edit that user."
	};
	this.status = 403;
}
this.done();
