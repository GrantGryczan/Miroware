const {user, isMe} = await parseUser(this);
if(isMe) {
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
		}
	} else {
		this.value = {
			error: "The `name` value must be a string."
		};
		this.status = 400;
		this.done();
		return;
	}
	this.update.$push = {
		pipe: this.value = {
			id: String(new ObjectID()),
			name: this.req.body.name,
			mime: mime.getType(this.req.body.name) || "application/octet-stream"
		}
	};
	this.value = {
		...this.value,
		user: user._id,
		url: `https://pipe.miroware.io/${user._id}/${encodeURIComponent(this.req.body.name)}`
	};
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
