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
		} else if (found.type === "/") {
			const items = [found];
			const fileItems = [];
			const prefix = `${found.path}/`;
			for (const item of user.pipe) {
				if (item.path.startsWith(prefix)) {
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
						purgePipeCache(user, fileItems);
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
					purgePipeCache(user, [found]);
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
