const {user, isMe} = await parseUser(this);
console.log(0);
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
	console.log(1);
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
			this.status = err.statusCode || 422;
			console.dir(err);
		} else {
			this.update.$push = {
				pipe: this.value = {
					id: String(new ObjectID()),
					date: Date.now(),
					name: data.name,
					mime: mime.getType(data.name) || "application/octet-stream",
					size: this.req.body.length
				}
			};
			purgeCache((this.value = {
				...this.value,
				url: `https://pipe.miroware.io/${user._id}/${encodeURIComponent(data.name)}`
			}).url);
			console.log(2);
		}
		this.done();
		console.log(3);
	});
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
	this.done();
}
