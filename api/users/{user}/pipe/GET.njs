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
		const path = this.req.query.path && `${this.req.query.path}/`;
		this.value = user.pipe.filter(item => item.name.startsWith(path) && !item.name.includes("/", path.length));
		for(const item of this.value) {
			if(item.type === "/") {
				const itemPath = `${item.name}/`;
				item.size = user.pipe.reduce((size, item2) => {
					if(item2.type !== "/" && item2.name.startsWith(itemPath)) {
						size += item2.size;
					}
					return size;
				}, 0);
			}
		}
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
