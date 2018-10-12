const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if(found) {
		s3.deleteObject({
			Bucket: "miroware-pipe",
			Key: found.id
		}, err => {
			if(err) {
				this.value = {
					error: err.message
				};
				this.status = err.statusCode;
			} else {
				this.update.$pull.pipe = {
					id: found.id
				};
				purgeCache(`https://pipe.miroware.io/${user._id}/${found.name}`);
			}
			this.done();
		});
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
