if(testEmail(this.req.body.email)) {
	this.req.body.email = this.req.body.email.trim().toLowerCase();
	if(await users.findOne({
		email: this.req.body.email
	})) {
		this.value = {
			error: "That email is already taken."
		};
		this.status = 422;
		this.done();
	} else {
		connect(this).then(async data => {
			await verifyCaptcha(this);
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
				}
			} else {
				this.value = {
					error: "The `name` value must be a string."
				};
				this.status = 400;
				this.done();
				return;
			}
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
				}
			} else {
				this.value = {
					error: "The `birth` value must be a number."
				};
				this.status = 400;
				this.done();
				return;
			}
			const token = youKnow.crypto.token();
			const salt = youKnow.crypto.salt();
			const insertData = {
				salt,
				pouch: [{
					value: youKnow.crypto.hash(token, salt),
					scope: 0,
					expire: this.now + cookieOptions.maxAge,
					super: this.now
				}],
				connections: [{
					service: data.connection[0],
					id: data.id || youKnow.crypto.hash(data.connection[1], salt).toString("base64")
				}],
				created: this.now,
				updated: this.now,
				email: this.req.body.email,
				verified: data.verified && this.req.body.email === data.email,
				unverified: null,
				emailCode: null,
				publicEmail: false,
				name: this.req.body.name,
				nameCooldown: 0,
				birth: this.req.body.birth,
				desc: "",
				icon: null,
				concats: [],
				pipe: []
			};
			if(!insertData.verified) {
				insertData.unverified = this.req.body.email;
				verifyEmail(insertData);
			}
			const id = String((await users.insertOne(insertData)).ops[0]._id);
			this.value = {
				id,
				token
			};
			this.res.cookie("auth", Buffer.from(`${id}:${token}`).toString("base64"), cookieOptions);
			this.done();
		});
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 400;
	this.done();
}
