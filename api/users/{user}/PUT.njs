if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user.toHexString();
}
let userID;
try {
	userID = ObjectID(this.params.user);
} catch(err) {
	this.value = {
		error: err.message
	};
	this.status = 422;
	this.done();
	return;
}
const filter = {
	_id: userID
};
const user = await users.findOne(filter);
if(user) {
	if(this.req.session.user.toHexString() === user._id.toHexString()) {
		const notIn = this.req.session.in === false;
		const set = {};
		const now = Date.now();
		if(this.req.body.name !== undefined) {
			if(typeof this.req.body.name === "string") {
				this.req.body.name = this.req.body.name.trim();
				if(this.req.body.name.length < 1) {
					this.value = {
						error: "The `name` value must be at least 1 character long."
					};
					this.status = 422;
					this.done();
					return;
				} else if(this.req.body.name.length > 32) {
					this.value = {
						error: "The `name` value must be at most 32 characters long."
					};
					this.status = 422;
					this.done();
					return;
				} else {
					const cooldown = 86400000+user.nameCooldown-now;
					if(cooldown > 0) {
						this.value = {
							error: `The \`name\` value may only be set once per day.`,
							cooldown
						};
						this.status = 422;
						this.done();
						return;
					} else {
						set.name = this.req.body.name;
						set.nameCooldown = now;
					}
				}
			} else {
				this.value = {
					error: "The `name` value must be a string."
				};
				this.status = 422;
				this.done();
				return;
			}
		}
		if(notIn) {
			if(this.req.body.captcha === undefined) {
				this.value = {
					error: "If signup is incomplete, you must define a `captcha` value."
				};
				this.status = 422;
				this.done();
				return;
			} else if(typeof this.req.body.captcha === "string") {
				let success = false;
				try {
					({success} = await request.post("https://www.google.com/recaptcha/api/siteverify", {
						form: {
							secret: youKnow.captcha.secret,
							response: this.req.body.captcha,
							remoteip: this.req.ip
						}
					}));
				} catch(err) {}
				if(!success) {
					this.value = {
						error: "The captcha challenge was failed."
					};
					this.status = 422;
					this.done();
					return;
				}
			} else {
				this.value = {
					error: "The `captcha` value must be a string."
				};
				this.status = 422;
				this.done();
				return;
			}
		}
		if(this.req.body.name !== undefined) {
			if(typeof this.req.body.name === "string") {
				this.req.body.name = this.req.body.name.trim();
				if(this.req.body.name.length < 1) {
					this.value = {
						error: "The `name` value must be at least 1 character long."
					};
					this.status = 422;
					this.done();
					return;
				} else if(this.req.body.name.length > 32) {
					this.value = {
						error: "The `name` value must be at most 32 characters long."
					};
					this.status = 422;
					this.done();
					return;
				} else {
					const cooldown = 86400000+user.nameCooldown-now;
					if(cooldown > 0) {
						this.value = {
							error: `The \`name\` value may only be set once per day.`,
							cooldown
						};
						this.status = 422;
						this.done();
						return;
					} else {
						set.name = this.req.body.name;
						set.nameCooldown = now;
					}
				}
			} else {
				this.value = {
					error: "The `name` value must be a string."
				};
				this.status = 422;
				this.done();
				return;
			}
		} else if(notIn) {
			this.value = {
				error: "If signup is incomplete, you must define a `name` value."
			};
			this.status = 422;
			this.done();
			return;
		}
		if(this.req.body.birth !== undefined) {
			if(typeof this.req.body.birth === "number") {
				if(this.req.body.birth < -8640000000000000) {
					this.value = {
						error: "Nobody is that old."
					};
					this.status = 422;
					this.done();
					return;
				} else if(this.req.body.birth > now) {
					this.value = {
						error: "You wish you were that young."
					};
					this.status = 422;
					this.done();
					return;
				} else {
					set.birth = this.req.body.birth;
				}
			} else {
				this.value = {
					error: "The `birth` value must be a number."
				};
				this.status = 422;
				this.done();
				return;
			}
		} else if(notIn) {
			this.value = {
				error: "If signup is incomplete, you must define a `birth` value."
			};
			this.status = 422;
			this.done();
			return;
		}
		if(this.req.body.email !== undefined) {
			if(typeof this.req.body.email === "string") {
				this.req.body.email = this.req.body.email.trim();
				if(testEmail(this.req.body.email)) {
					insertData.unverified = this.req.body.email;
					// TODO
				} else {
					this.value = {
						error: "The `email` value must be a valid email."
					};
					this.status = 422;
					this.done();
					return;
				}
			} else {
				this.value = {
					error: "The `email` value must be a string."
				};
				this.status = 422;
				this.done();
				return;
			}
		}
		if(this.req.body.publicEmail !== undefined) {
			if(typeof this.req.body.publicEmail === "boolean") {
				set.publicEmail = this.req.body.publicEmail;
			} else {
				this.value = {
					error: "The `publicEmail` value must be a Boolean."
				};
				this.status = 422;
				this.done();
				return;
			}
		}
		if(notIn) {
			this.req.session.in = true;
			set.created = now;
		}
		if(Object.keys(set).length) {
			users.updateOne(filter, {
				$set: set
			});
		}
	} else {
		this.value = {
			error: "You do not have permission to edit that user."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
}
this.done();
