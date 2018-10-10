const {user, isMe} = await parseUser(this);
if(isMe) {
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
			} else if(this.req.body.name.length > 32) {
				this.value = {
					error: "The `name` value must be at most 32 characters long."
				};
				this.status = 400;
				this.done();
				return;
			} else {
				const cooldown = 86400000 + user.nameCooldown - this.now;
				if(cooldown > 0) {
					this.value = {
						error: "The `name` value may only be set once per day."
					};
					this.res.set("Retry-After", Math.ceil(cooldown / 1000));
					this.status = 429;
					this.done();
					return;
				} else {
					this.update.$set.name = this.req.body.name;
					this.update.$set.nameCooldown = this.now;
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
	}
	if(this.req.body.birth !== undefined) {
		if(typeof this.req.body.birth === "number") {
			if(this.req.body.birth < -8640000000000000) {
				this.value = {
					error: "Nobody is that old."
				};
				this.status = 400;
				this.done();
				return;
			} else if(this.req.body.birth - this.now > -409968000000) {
				this.value = {
					error: "You must be at least 13 years of age to sign up."
				};
				this.status = 400;
				this.done();
				return;
			} else {
				this.update.$set.birth = this.req.body.birth;
			}
		} else {
			this.value = {
				error: "The `birth` value must be a number."
			};
			this.status = 400;
			this.done();
			return;
		}
	}
	if(this.req.body.email !== undefined) {
		if(typeof this.req.body.email === "string") {
			this.req.body.email = this.req.body.email.trim();
			if(testEmail(this.req.body.email)) {
				insertData.unverified = this.req.body.email;
				sendVerificationEmail(insertData);
			} else {
				this.value = {
					error: "The `email` value must be a valid email."
				};
				this.status = 400;
				this.done();
				return;
			}
		} else {
			this.value = {
				error: "The `email` value must be a string."
			};
			this.status = 400;
			this.done();
			return;
		}
	}
	if(this.req.body.publicEmail !== undefined) {
		if(typeof this.req.body.publicEmail === "boolean") {
			this.update.$set.publicEmail = this.req.body.publicEmail;
		} else {
			this.value = {
				error: "The `publicEmail` value must be a Boolean."
			};
			this.status = 400;
			this.done();
			return;
		}
	}
	if(this.req.body.desc !== undefined) {
		if(typeof this.req.body.desc === "string") {
			this.req.body.desc = this.req.body.desc.trim();
			if(this.req.body.desc.length > 16384) {
				this.value = {
					error: "The `desc` value must be at most 16 KB large."
				};
				this.status = 400;
				this.done();
				return;
			} else {
				this.update.$set.desc = this.req.body.desc;
			}
		} else {
			this.value = {
				error: "The `desc` value must be a string."
			};
			this.status = 400;
			this.done();
			return;
		}
	}
} else {
	this.value = {
		error: "You do not have permission to edit that user."
	};
	this.status = 403;
}
this.done();
