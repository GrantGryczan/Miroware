const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		if (found.id === "trash") {
			this.value = {
				error: "You cannot download the trash directory."
			};
			this.status = 422;
			this.done();
		} else if (found.type === "/") {
			const archive = archiver("zip");
			archive.on("error", err => {
				throw err;
			});
			const data = [];
			archive.on("data", data.push);
			archive.on("end", () => {
				this.res.set("Content-Type", "application/zip");
				this.value = Buffer.concat(data);
				this.done();
			});
			const sliceStart = found.path.lastIndexOf("/") + 1;
			const promises = [];
			const scan = parent => {
				for (const item of user.pipe) {
					if (item.parent === parent) {
						if (item.type === "/") {
							scan(item.id);
						} else {
							promises.push(new Promise(resolve => {
								s3.getObject({
									Bucket: "miroware-pipe",
									Key: item.id
								}, (err, data) => {
									archive.append(err ? JSON.stringify({
										error: err.message
									}) : data.Body, {
										name: item.path.slice(sliceStart)
									});
									resolve();
								});
							}));
						}
					}
				}
			};
			scan(found.id);
			Promise.all(promises).then(archive.finalize);
		} else {
			s3.getObject({
				Bucket: "miroware-pipe",
				Key: found.id
			}, (err, data) => {
				if (err) {
					this.value = {
						error: err.message
					};
					this.status = err.statusCode;
				} else {
					this.res.set("Content-Type", "application/octet-stream");
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
