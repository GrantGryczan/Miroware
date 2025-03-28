const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		const update = {};
		const typeDir = found.type === "/";
		const putItem = {};
		if (this.req.body.parent !== undefined) {
			if (found.id === "trash") {
				this.value = {
					error: "The trash directory cannot be moved."
				};
				this.status = 422;
				this.done();
				return;
			}
			if (this.req.body.parent === found.parent) {
				delete this.req.body.parent;
			} else if (typeof this.req.body.parent === "string") {
				let parent = user.pipe.find(item => item.type === "/" && item.id === this.req.body.parent);
				if (!parent) {
					this.value = {
						error: "That parent directory does not exist."
					};
					this.status = 422;
					this.done();
					return;
				} else if (typeDir) {
					do {
						if (parent === found) {
							this.value = {
								error: "Directories cannot be moved into themselves."
							};
							this.status = 422;
							this.done();
							return;
						}
					} while (parent.parent && (parent = user.pipe.find(item => item.type === "/" && item.id === parent.parent)));
				}
				putItem.parent = this.req.body.parent;
				if (this.req.body.parent === "trash") {
					putItem.trashed = Date.now();
					putItem.restore = found.parent;
				}
			} else if (this.req.body.parent === null) {
				putItem.parent = null;
			} else {
				this.value = {
					error: "The `parent` value must be a string or null."
				};
				this.status = 400;
				this.done();
				return;
			}
			if (this.req.body.parent !== undefined && this.req.body.parent !== "trash") {
				if (user.pipe.some(item => item.parent === this.req.body.parent && item.name === found.name)) {
					this.value = {
						error: "That name is already taken."
					};
					this.status = 422;
					this.done();
					return;
				}
				if (found.parent === "trash") {
					update.$unset = {
						"pipe.$.trashed": true,
						"pipe.$.restore": true
					};
					delete found.trashed;
					delete found.restore;
				}
			}
		}
		if (this.req.body.name !== undefined) {
			if (typeof this.req.body.name === "string") {
				this.req.body.name = this.req.body.name.trim();
				if (this.req.body.name.length < 1) {
					this.value = {
						error: "The `name` value must be at least 1 character long."
					};
					this.status = 400;
					this.done();
					return;
				} else if (this.req.body.name.length > 255) {
					this.value = {
						error: "The `name` value must be at most 255 characters long."
					};
					this.status = 400;
					this.done();
					return;
				} else if (this.req.body.name.includes("/")) {
					this.value = {
						error: "The `name` value cannot include slashes."
					};
					this.status = 400;
					this.done();
					return;
				} else if (found.parent !== "trash" && user.pipe.some(item => item.parent === found.parent && item.name === this.req.body.name)) {
					this.value = {
						error: "That name is already taken."
					};
					this.status = 422;
					this.done();
					return;
				} else if (this.req.body.name.toLowerCase().endsWith(".apk") || this.req.body.name.toLowerCase().endsWith(".exe") || this.req.body.name.toLowerCase().endsWith(".bin")) {
					this.value = {
						error: "Unfortunately, due to users frequently abusing File Garden by uploading illegal content, you cannot upload file types commonly used for malware. We intend to look for better solutions for these file types in the future."
					};
					this.status = 400;
					this.done();
					return;
				}
				putItem.name = this.req.body.name;
			} else {
				this.value = {
					error: "The `name` value must be a string."
				};
				this.status = 400;
				this.done();
				return;
			}
		}
		if (this.req.body.type !== undefined) {
			if (typeDir) {
				this.value = {
					error: "The type of a directory cannot be changed."
				};
				this.status = 422;
				this.done();
				return;
			}
			if (typeof this.req.body.type === "string") {
				this.req.body.type = this.req.body.type.trim();
				if (this.req.body.type.length > 255) {
					this.value = {
						error: "The `type` value must be at most 255 characters long."
					};
					this.status = 400;
					this.done();
					return;
				} else if (!mimeTest.test(this.req.body.type)) {
					this.value = {
						error: "The `type` value must be a valid MIME type."
					};
					this.status = 400;
					this.done();
					return;
				} else {
					putItem.type = this.req.body.type.toLowerCase();
				}
			} else {
				this.value = {
					error: "The `type` value must be a string."
				};
				this.status = 400;
				this.done();
				return;
			}
		}
		if (this.req.body.privacy !== undefined) {
			if (found.id === "trash") {
				this.value = {
					error: "The privacy of the trash directory cannot be changed."
				};
				this.status = 422;
				this.done();
				return;
			}
			if (typeof this.req.body.privacy === "number") {
				if (this.req.body.privacy === 0 || this.req.body.privacy === 1 || this.req.body.privacy === 2) {
					if (this.req.body.privacy === 2) {
						this.value = {
							error: "Private files are coming soon."
						};
						this.status = 422;
						this.done();
						return;
					}
					putItem.privacy = this.req.body.privacy;
				} else {
					this.value = {
						error: "The `privacy` value must be 0 (public), 1 (unlisted), or 2 (private)."
					};
					this.status = 400;
					this.done();
					return;
				}
			} else {
				this.value = {
					error: "The `privacy` value must be a number."
				};
				this.status = 400;
				this.done();
				return;
			}
		}
		if (putItem.name || putItem.parent !== undefined) {
			putItem.path = putItem.name || found.name;
			let parent = putItem.parent === undefined ? found.parent : putItem.parent;
			if (parent) {
				parent = user.pipe.find(item => item.type === "/" && item.id === parent);
				do {
					putItem.path = `${parent.name}/${putItem.path}`;
				} while (parent.parent && (parent = user.pipe.find(item => item.type === "/" && item.id === parent.parent)));
			}
		}
		this.value = {
			...found,
			...putItem
		};
		const keys = Object.keys(putItem);
		if (!keys.length) {
			this.done();
			return;
		}
		update.$set = {};
		for (const key of keys) {
			update.$set[`pipe.$.${key}`] = putItem[key];
		}
		const promises = [users.updateOne({
			_id: user._id,
			"pipe.id": found.id
		}, update)];
		const itemsToPurge = [found];
		if (putItem.path) {
			if (typeDir) {
				const prefix = `${found.path}/`;
				this.value.size = user.pipe.reduce((size, item) => {
					if (item.type !== "/" && item.path.startsWith(prefix)) {
						size += item.size;
					}
					return size;
				}, 0);
				for (const child of user.pipe) {
					if (child.path.startsWith(prefix)) {
						itemsToPurge.push({ ...child });
						promises.push(users.updateOne({
							_id: user._id,
							"pipe.id": child.id
						}, {
							$set: {
								"pipe.$.path": child.path = putItem.path + child.path.slice(found.path.length)
							}
						}));
						itemsToPurge.push(child);
					}
				}
			}
		}
		await Promise.all(promises);
		purgePipeCache(user, itemsToPurge);
	} else {
		this.value = {
			error: "That item does not exist."
		};
		this.status = 404;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's garden."
	};
	this.status = 403;
}
this.done();
