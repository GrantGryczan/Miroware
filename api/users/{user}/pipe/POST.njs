const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.req.get("Content-Type") !== "application/octet-stream") {
		this.value = {
			error: 'The `Content-Type` header must be "application/octet-stream".'
		};
		this.status = 400;
		this.done();
		return;
	}
	let data;
	try {
		data = JSON.parse(this.req.get("X-Data"));
	} catch(err) {
		this.value = {
			error: "The `X-Data` header must be valid JSON."
		};
		this.status = 400;
		this.done();
		return;
	}
	if(typeof data.name === "string") {
		data.name = data.name.trim();
		if(data.name.length < 1) {
			this.value = {
				error: "The `name` value must be at least 1 character long."
			};
			this.status = 400;
			this.done();
			return;
		} else if(data.name.length > 255) {
			data.name = data.name.slice(0, 255);
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
			date: Date.now(),
			name: data.name,
			mime: mime.getType(data.name) || "application/octet-stream",
			size: this.req.body.length
		}
	};
	this.value = {
		...this.value,
		url: `https://pipe.miroware.io/${user._id}/${encodeURIComponent(data.name)}`
	};
	s3.putObject({
		Bucket: "miroware-pipe",
		Key: this.value.id,
		ContentLength: this.value.size,
		Body: this.req.body
	}, err => {
		if(err) {
			this.value = {
				error: err.message
			};
			this.status = err.statusCode;
		} else {
			purgeCache(`https://pipe.miroware.io/${user._id}/${this.value.name}`);
		}
		this.done();
	});
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
