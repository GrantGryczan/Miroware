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
			getB2(`${user._id.toString('base64url')}/${found.id}`).then(({ data }) => {
				this.res.set("Content-Type", found.type);
				data.pipe(this.res);
				this.noSend = true;
			}).catch(error => {
				console.error(error);
				this.value = {
					error: error.message
				};
				this.status = error.statusCode;
			}).finally(() => {
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
