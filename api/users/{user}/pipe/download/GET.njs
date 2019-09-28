const {user, isMe} = await parseUser(this);
if (isMe) {
	if (this.req.query.items) {
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
		const promises = [];
		for (const found of this.req.query.items.split(",").map(id => user.pipe.find(item => item.id === id))) {
			if (found.id && found.id !== "trash") {
				if (found.type === "/") {
					const sliceStart = found.path.lastIndexOf("/") + 1;
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
				} else {
					promises.push(new Promise(resolve => {
						s3.getObject({
							Bucket: "miroware-pipe",
							Key: found.id
						}, (err, data) => {
							archive.append(err ? JSON.stringify({
								error: err.message
							}) : data.Body, {
								name: found.name
							});
							resolve();
						});
					}));
				}
			}
		}
		Promise.all(promises).then(archive.finalize.bind(archive));
	} else {
		this.value = {
			error: "The `items` query must be a comma-separated list of item IDs."
		};
		this.status = 400;
		this.done();
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
	this.done();
}
