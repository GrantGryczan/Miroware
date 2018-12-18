const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.req.query.path !== undefined) {
		this.value = [];
		const fileItems = [];
		const prefix = this.req.query.path && `${this.req.query.path}/`;
		this.value = user.pipe.filter(item => item.name.startsWith(prefix) && !item.name.includes("/", prefix.length));
	} else {
		this.value = user.pipe;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
