const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		if (found.id === "trash") {
			this.value = {
				error: "The trash directory cannot be deleted."
			};
			this.status = 422;
			this.done();
		} else {
			await deletePipeItem(user, found, this.update, this);
			this.done();
		}
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
