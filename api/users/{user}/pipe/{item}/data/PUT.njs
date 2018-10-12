const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if(found) {
		if(this.req.get("Content-Type") !== "application/octet-stream") {
			this.value = {
				error: 'The `Content-Type` header must be "application/octet-stream".'
			};
			this.status = 400;
			this.done();
			return;
		}
		s3.putObject({
			Bucket: "miroware-pipe",
			Key: found.id,
			ContentLength: this.req.body.length,
			Body: this.req.body
		}, err => {
			if(err) {
				this.value = {
					error: err.message
				};
				this.status = err.statusCode;
			} else {
				users.updateOne({
					...this.userFilter,
					"pipe.id": found.id
				}, {
					$set: {
						"pipe.$.size": this.req.body.length
					}
				});
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
