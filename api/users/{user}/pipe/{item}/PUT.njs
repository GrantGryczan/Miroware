const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
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
			if (typeof this.req.body.parent === "string") {
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
			if (user.pipe.some(item => item.parent === this.req.body.parent && item.name === found.name)) {
				this.value = {
					error: "That name is already taken."
				};
				this.status = 422;
				this.done();
				return;
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
				} else if (user.pipe.some(item => item.parent === found.parent && item.name === this.req.body.name)) {
					this.value = {
						error: "That name is already taken."
					};
					this.status = 422;
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
				if (this.req.body.privacy === 0 || this.req.body.privacy === 1 || (typeDir && this.req.body.privacy === 2)) {
					putItem.privacy = this.req.body.privacy;
				} else {
					this.value = {
						error: `The \`privacy\` value must be 0 (public)${typeDir ? ", 1 (unlisted), or 2 (private)" : " or 1 (unlisted)"}.`
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
		const set = {};
		for (const key of keys) {
			set[`pipe.$.${key}`] = putItem[key];
		}
		users.updateOne({
			_id: user._id,
			"pipe.id": found.id
		}, {
			$set: set
		});
		const encodedPath = encodeForPipe(found.path);
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
						const path = putItem.path + child.path.slice(found.path.length);
						users.updateOne({
							_id: user._id,
							"pipe.id": child.id
						}, {
							$set: {
								"pipe.$.path": path
							}
						});
						itemsToPurge.push(child);
					}
				}
			}
		}
		purgePipeCache(user, itemsToPurge);
	} else {
		this.value = {
			error: "That item does not exist."
		};
		this.status = 404;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
