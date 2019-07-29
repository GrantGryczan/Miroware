const {user, isMe} = await parseUser(this);
if (isMe) {
	if (this.now - this.token.super < TOKEN_SUPER_COOLDOWN) {
		this.update = false;
		const fileItems = user.pipe.filter(pipeFiles);
		if (fileItems.length) {
			s3.deleteObjects({
				Bucket: "miroware-pipe",
				Delete: {
					Objects: fileItems.map(byS3Object)
				}
			}, err => {
				if (err) {
					this.value = {
						error: err.message
					};
					this.status = err.statusCode;
				} else {
					purgeCache(...fileItems.flatMap(item => {
						const encodedPath = encodeForPipe(item.path);
						return [`https://pipe.miroware.io/${user._id}/${encodedPath}`, `https://piped.miroware.io/${user._id}/${encodedPath}`];
					}));
					users.deleteOne(this.userFilter);
				}
				this.done();
			});
		} else {
			users.deleteOne(this.userFilter);
			this.done();
		}
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 401;
		this.done();
	}
} else {
	this.value = {
		error: "You do not have permission to access that user."
	};
	this.status = 403;
	this.done();
}
