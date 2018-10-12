const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.now - this.token.super < 300000) {
		this.update = false;
		s3.deleteObjects({
			Bucket: "miroware-pipe",
			Delete: {
				Objects: user.pipe.map(byS3Object)
			}
		}, err => {
			if(err) {
				this.value = {
					error: err.message
				};
				this.status = err.statusCode;
			} else {
				purgeCache(...user.pipe.map(item => `https://pipe.miroware.io/${user._id}/${item.name}`));
			}
			this.done();
		});
		users.deleteOne(this.userFilter);
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "You do not have permission to edit that user."
	};
	this.status = 403;
}
this.done();
