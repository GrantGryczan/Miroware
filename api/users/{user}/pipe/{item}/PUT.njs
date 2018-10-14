const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = this.user.pipe.find(item => item.sub === this.req.query.sub && item.val === this.req.query.val);
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
				} else {
					item.name = this.req.body.name;
				}
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
			if(typeof this.req.body.type === "string") {
				this.req.body.type = this.req.body.type.trim();
				if(this.req.body.type.length > 255) {
					this.value = {
						error: "The `type` value must be at most 255 characters long."
					};
					this.status = 400;
					this.done();
					return;
				} else if(mimeTest.test(this.req.body.type)) {
					this.value = {
						error: "The `type` value must be a valid MIME type."
					};
					this.status = 400;
					this.done();
					return;
				} else {
					item.type = this.req.body.type;
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
			set[`concats.$.${key}`] = item[key];
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
		purgeCache(`https://pipe.miroware.io/${user._id}/${found.type}`, this.value.url = `https://pipe.miroware.io/${user._id}/${encodeURIComponent(this.value.name)}`);
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
