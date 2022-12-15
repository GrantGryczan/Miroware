const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		if (found.type === "/") {
			this.value = {
				error: "Directories do not have file content."
			};
			this.status = 404;
			this.done();
		} else {
			b2.getObject({
				Bucket: "file-garden",
				Key: `${user._id.toString('base64url')}/${found.id}`
			}, (err, data) => {
				if (err) {
					console.error(err);
					this.value = {
						error: err.message
					};
					this.status = err.statusCode;
				} else {
					this.res.set("Content-Type", found.type);
					this.value = data.Body;
				}
				this.done();
			});
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
