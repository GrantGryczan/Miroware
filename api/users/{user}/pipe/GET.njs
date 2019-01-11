const {user, isMe} = await parseUser(this);
if(this.req.query.path && !user.pipe.some(item => item.type === "/" && item.name === this.req.query.path && (isMe || item.privacy < 2))) {
	this.value = {
		error: "That path does not exist."
	};
	this.status = 422;
	this.done();
	return;
}
const fileItems = [];
const path = (this.req.query.path && `${this.req.query.path}/`) || "";
this.value = user.pipe.filter(item => item.name.startsWith(path) && !item.name.includes("/", path.length) && (isMe || item.privacy === 0));
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
this.done();
