const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = this.user.pipe.find(item => item.id === this.params.item);
	if(found) {
		const item = {};
		if(this.req.body.name !== undefined) {
			if(typeof this.req.body.name === "string") {
				this.req.body.name = this.req.body.name.trim();
				if(this.req.body.name.length < 1) {
					this.value = {
						error: "The `name` value must be at least 1 character long."
					};
					this.status = 400;
					this.done();
					return;
				} else if(this.req.body.name.length > 255) {
					this.value = {
						error: "The `name` value must be at most 255 characters long."
					};
					this.status = 400;
					this.done();
					return;
				} else if(this.req.body.name.startsWith("/") || this.req.body.name.endsWith("/")) {
					this.value = {
						error: "The `name` value cannot start or end with a slash."
					};
					this.status = 400;
					this.done();
					return;
				} else if(this.req.body.name.includes("//")) {
					this.value = {
						error: "The `name` value cannot contain multiple consecutive slashes."
					};
					this.status = 400;
					this.done();
					return;
				} else if(this.user.pipe.some(item => item.name === this.req.body.name)) {
					this.value = {
						error: "That name is already taken."
					};
					this.status = 422;
					this.done();
					return;
				} else if(found.type === "/" && this.req.body.name.startsWith(`${found.name}/`)) {
					this.value = {
						error: "Directories cannot be moved into themselves."
					};
					this.status = 422;
					this.done();
					return;
				} else {
					const slashIndex = this.req.body.name.lastIndexOf("/");
					if(slashIndex !== -1) {
						const parent = this.req.body.name.slice(0, slashIndex);
						if(!this.user.pipe.some(item => item.type === "/" && item.name === parent)) {
							this.value = {
								error: "The parent directory does not exist."
							};
							this.status = 422;
							this.done();
							return;
						}
					}
				}
				item.name = this.req.body.name;
			} else {
				this.value = {
					error: "The `name` value must be a string."
				};
				this.status = 400;
				this.done();
				return;
			}
		}
		if(this.req.body.type !== undefined) {
			if(found.type === "/") {
				this.value = {
					error: "The `type` value cannot be changed for a directory."
				};
				this.status = 422;
				this.done();
				return;
			}
			if(typeof this.req.body.type === "string") {
				this.req.body.type = this.req.body.type.trim();
				if(this.req.body.type.length > 255) {
					this.value = {
						error: "The `type` value must be at most 255 characters long."
					};
					this.status = 400;
					this.done();
					return;
				} else if(!mimeTest.test(this.req.body.type)) {
					this.value = {
						error: "The `type` value must be a valid MIME type."
					};
					this.status = 400;
					this.done();
					return;
				} else {
					item.type = this.req.body.type.toLowerCase();
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
		const set = {};
		for(const key of Object.keys(item)) {
			set[`pipe.$.${key}`] = item[key];
		}
		users.updateOne({
			...this.userFilter,
			"pipe.id": found.id
		}, {
			$set: set
		});
		this.value = {
			...found,
			...item
		};
		const urls = [`https://pipe.miroware.io/${user._id}/${encodeURI(found.name)}`, this.value.url = `https://pipe.miroware.io/${user._id}/${encodeURI(this.value.name)}`];
		if(found.type === "/" && item.name) {
			const prefix = `${found.name}/`;
			for(const child of user.pipe) {
				if(child.name.startsWith(prefix)) {
					const name = item.name + child.name.slice(found.name.length);
					users.updateOne({
						...this.userFilter,
						"pipe.id": child.id
					}, {
						$set: {
							"pipe.$.name": name
						}
					});
					urls.push(`https://pipe.miroware.io/${user._id}/${encodeURI(child.name)}`, `https://pipe.miroware.io/${user._id}/${encodeURI(name)}`);
				}
			}
		}
		purgeCache(...urls);
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
