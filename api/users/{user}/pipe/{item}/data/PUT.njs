const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = this.user.pipe.find(item => item.id === this.params.item);
	if(found) {
		if(this.req.get("Content-Type") !== "application/octet-stream") {
			this.value = {
				error: 'The `Content-Type` header must be "application/octet-stream".'
			};
			this.status = 400;
			this.done();
			return;
		}
		const item = {
			size: this.body.length
		};
		const set = {};
		for(const key of Object.keys(item)) {
			set[`pipe.$.${key}`] = item[key];
		}
		users.updateOne({
			...this.userFilter,
			"pipe.id": found.id
		}, {
			$set: set
		});
		this.value = item;
	} else {
		this.value = {
			error: "That item does not exist."
		};
		this.status = 404;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
