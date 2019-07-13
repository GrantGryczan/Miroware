const {user, isMe} = await parseUser(this);
this.value = {
	ancestors: []
};
if (this.req.query.parent) {
	let parent = {
		parent: this.req.query.parent
	};
	while (parent = user.pipe.find(item => item.type === "/" && item.id === parent.parent && (isMe || item.privacy < 2))) {
		this.value.ancestors.unshift(parent);
	}
	if (!this.value.ancestors.length) {
		this.value = {
			error: "That parent directory does not exist."
		};
		this.status = 422;
		this.done();
		return;
	}
} else {
	this.req.query.parent = null;
}
this.value.items = user.pipe.filter(item => item.parent === this.req.query.parent && (isMe || item.privacy === 0));
for (const item of this.value.ancestors ? this.value.ancestors.concat(this.value.items) : this.value.items) {
	if (item.type === "/") {
		const parentPath = `${item.path}/`;
		item.size = user.pipe.reduce((size, item2) => {
			if (item2.type !== "/" && item2.path.startsWith(parentPath)) {
				size += item2.size;
			}
			return size;
		}, 0);
	}
}
this.done();
