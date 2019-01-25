const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		if (found.type === "/") {
			const items = [found];
			const fileItems = [];
			const prefix = `${found.name}/`;
			for (const item of user.pipe) {
				if (item.name.startsWith(prefix)) {
					items.push(item);
					if (item.type !== "/") {
						fileItems.push(item);
					}
				}
			}
			this.update.$pull.pipe = {
				$or: items.map(byDBQueryObject)
			};
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
						delete this.update.$pull.pipe;
					} else {
						purgeCache(...fileItems.map(item => `https://pipe.miroware.io/${user._id}/${encodeForPipe(item.name)}`), ...fileItems.map(item => `https://piped.miroware.io/${user._id}/${encodeForPipe(item.name)}`)); // TODO: `flatMap` and define `encodedName`
					}
					this.done();
				});
			} else {
				this.done();
			}
		} else {
			s3.deleteObject({
				Bucket: "miroware-pipe",
				Key: found.id
			}, err => {
				if (err) {
					this.value = {
						error: err.message
					};
					this.status = err.statusCode;
				} else {
					this.update.$pull.pipe = {
						id: found.id
					};
					const encodedName = encodeForPipe(found.name);
					purgeCache(`https://pipe.miroware.io/${user._id}/${encodedName}`, `https://piped.miroware.io/${user._id}/${encodedName}`);
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
