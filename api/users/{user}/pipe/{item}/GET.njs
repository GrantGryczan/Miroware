const {user, isMe} = await parseUser(this);
if (isMe) {
	this.value = user.pipe.find(item => item.id === this.params.item);
	if (this.value) {
		if (this.value.type === "/") {
			const parentPath = `${this.value.path}/`;
			this.value.size = user.pipe.reduce((size, item) => {
				if (item.type !== "/" && item.path.startsWith(parentPath)) {
					size += item.size;
				}
				return size;
			}, 0);
		}
		this.done();
	} else {
		this.value = {
			error: "That item does not exist."
		};
		this.status = 404;
		this.done();
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
	this.done();
}
