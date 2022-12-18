const {user, isMe} = await parseUser(this);
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
	for (const found of this.req.query.items.split(",").map(id => user.pipe.find(item => item.id === id && (isMe || item.privacy !== 2)))) {
		if (found.id && found.id !== "trash") {
			const userIDString = user._id.toString('base64url');
			if (found.type === "/") {
				const sliceStart = found.path.lastIndexOf("/") + 1;
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
			} else {
				promises.push(new Promise((resolve, reject) => {
					getB2(`${userIDString}/${found.id}`).then(({ data }) => {
						archive.append(data, {
							name: found.name
						});
						resolve();
					}).catch(reject);
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
