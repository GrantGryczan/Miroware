const {user, isMe} = await parseUser(this);
const found = user.pipe.find(item => item.id === this.params.item);
if (found) {
	if (found.id === "trash") {
		this.value = {
			error: "You cannot download the trash directory."
		};
		this.status = 422;
		this.done();
	} else if (!isMe && found.privacy === 2) {
		this.value = {
			error: "You do not have permission to access that item."
		};
		this.status = 403;
		this.done();
	} else if (found.type === "/") {
		const archive = archiver("zip");
		archive.on("error", err => {
			throw err;
		});
		const data = [];
		archive.on("data", data.push.bind(data));
		archive.on("end", () => {
			this.res.set("Content-Type", "application/zip");
			this.value = Buffer.concat(data);
			this.done();
		});
		const sliceStart = found.path.lastIndexOf("/") + 1;
		const promises = [];
		const userIDString = user._id.toString('base64url');
		const scan = parent => {
			for (const item of user.pipe) {
				if (item.parent === parent && (isMe || item.privacy === 0)) {
					if (item.type === "/") {
						scan(item.id);
					} else {
						promises.push(new Promise((resolve, reject) => {
							getB2(`${userIDString}/${item.id}`).then(({ data }) => {
								archive.append(data, {
									name: item.path.slice(sliceStart)
								});
								resolve();
							}).catch(reject);
						}));
					}
				}
			}
		};
		scan(found.id);
		Promise.all(promises).then(archive.finalize.bind(archive));
	} else {
		getB2(`${user._id.toString('base64url')}/${found.id}`).then(({ data }) => {
			this.res.set("Content-Type", "application/octet-stream");
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
