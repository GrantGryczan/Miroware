const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.req.query.path !== undefined) {
		if(this.req.query.path && !this.user.pipe.some(item => item.type === "/" && item.name === this.req.query.path)) {
			this.value = {
				error: "The parent directory does not exist."
			};
			this.status = 422;
			this.done();
			return;
		}
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
