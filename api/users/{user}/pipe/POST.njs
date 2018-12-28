const {user, isMe} = await parseUser(this);
if(isMe) {
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
		} else if(data.name.startsWith("/") || data.name.endsWith("/")) {
			this.value = {
				error: "The `name` value cannot start or end with a slash."
			};
			this.status = 400;
			this.done();
			return;
		} else if(data.name.includes("//")) {
			this.value = {
				error: "The `name` value cannot contain multiple consecutive slashes."
			};
			this.status = 400;
			this.done();
			return;
		} else if(this.user.pipe.some(item => item.name === data.name)) {
			this.value = {
				error: "That name is already taken."
			};
			this.status = 422;
			this.done();
			return;
		} else {
			const slashIndex = data.name.lastIndexOf("/");
			if(slashIndex !== -1) {
				const parent = data.name.slice(0, slashIndex);
				if(!this.user.pipe.some(item => item.type === "/" && item.name === parent)) {
					this.value = {
						error: "That path does not exist."
					};
					this.status = 422;
					this.done();
					return;
				}
			}
		}
	} else {
		this.value = {
			error: "The `name` value must be a string."
		};
		this.status = 400;
		this.done();
		return;
	}
	let typeDir = false;
	if(data.type !== undefined) {
		if(typeof data.type === "string") {
			data.type = data.type.trim();
			if(data.type === "/") {
				typeDir = true;
			} else if(data.type.length > 255) {
				this.value = {
					error: "The `type` value must be at most 255 characters long."
				};
				this.status = 400;
				this.done();
				return;
			} else if(!mimeTest.test(data.type)) {
				this.value = {
					error: 'The `type` value must be "/" or a valid MIME type.'
				};
				this.status = 400;
				this.done();
				return;
			} else {
				data.type = data.type.toLowerCase();
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
	if(typeDir) {
		this.update.$push = {
			pipe: this.value = {
				id: String(ObjectID()),
				date: Date.now(),
				name: data.name,
				type: "/"
			}
		};
		this.value = {
			...this.value,
			size: 0
		}
		this.done();
	} else {
		if(this.req.get("Content-Type") !== "application/octet-stream") {
			this.value = {
				error: 'The `Content-Type` header must be "application/octet-stream" unless the item is a directory.'
			};
			this.status = 400;
			this.done();
			return;
		}
		const id = String(ObjectID());
		s3.putObject({
			Bucket: "miroware-pipe",
			Key: id,
			ContentLength: this.req.body.length,
			Body: this.req.body,
			Metadata: {
				user: String(user._id)
			}
		}, err => {
			if(err) {
				this.value = {
					error: err.message
				};
				this.status = err.statusCode || 422;
			} else {
				this.update.$push = {
					pipe: this.value = {
						id,
						date: Date.now(),
						name: data.name,
						type: data.type || mime.getType(data.name) || "application/octet-stream",
						size: this.req.body.length
					}
				};
				const encodedName = encodeURI(data.name);
				purgeCache(`https://pipe.miroware.io/${user._id}/${encodedName}`, `https://piped.miroware.io/${user._id}/${encodedName}`);
			}
			this.done();
		});
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
	this.done();
}
