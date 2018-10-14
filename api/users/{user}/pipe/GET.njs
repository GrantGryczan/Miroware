const {user, isMe} = await parseUser(this);
if(isMe) {
	this.value = user.pipe;
	for(const item of this.value) {
		item.url = `https://pipe.miroware.io/${user._id}/${encodeURIComponent(item.name)}`;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
