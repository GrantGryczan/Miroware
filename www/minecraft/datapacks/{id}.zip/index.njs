this.res.set("Content-Type", "application/zip");
const archive = archiver("zip");
archive.on("error", err => {
	throw err;
});
archive.pipe(this.res);
const sliceStart = path.length + 1;
const promises = [];
const scan = parent => {
	for (const item of user.pipe) {
		if (item.parent === parent && item.privacy === 0) {
			if (item.type === "/") {
				scan(item.id);
			} else {
				promises.push(request(`/${user._id}/${encodeForPipe(item.path)}`).then(response => {
					archive.append(response, {
						name: item.path.slice(sliceStart)
					});
				}));
			}
		}
	}
};
scan(item.id);
Promise.all(promises).then(archive.finalize.bind(archive));
