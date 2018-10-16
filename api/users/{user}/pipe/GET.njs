const {user, isMe} = await parseUser(this);
if(isMe) {
	this.value = user.pipe;
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
