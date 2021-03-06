if (testEmail(this.req.body.email)) {
	const email = this.req.body.email.trim().toLowerCase();
	if (await users.findOne({
		email
	})) {
		this.value = {
			error: "That email is already taken."
		};
		this.status = 422;
		this.done();
	} else {
		connect(this).then(async data => {
			await verifyCaptcha(this);
			if (typeof this.req.body.name === "string") {
				this.req.body.name = this.req.body.name.trim();
				if (this.req.body.name.length < 1) {
					this.value = {
						error: "The `name` value must be at least 1 character long."
					};
					this.status = 400;
					this.done();
					return;
				} else if (this.req.body.name.length > 32) {
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
			if (typeof this.req.body.birth === "number") {
				if (this.req.body.birth < -8640000000000000) {
					this.value = {
						error: "Nobody is that old."
					};
					this.status = 400;
					this.done();
					return;
				} else if (this.req.body.birth - this.now > -409968000000) {
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
			const salt = youKnow.crypto.salt();
			const connection = {
				service: data.connection[0],
				id: data.id
			};
			if (data.connection[0] === "password") {
				connection.hash = youKnow.crypto.hash(data.connection[1], salt);
			}
			const insertData = {
				salt,
				pouch: [],
				connections: [connection],
				created: this.now,
				updated: this.now,
				email,
				verified: data.verified && email === data.email,
				unverified: null,
				emailCode: null,
				publicEmail: false,
				name: this.req.body.name,
				nameCooldown: 0,
				birth: this.req.body.birth,
				desc: "",
				icon: null,
				concats: [],
				pipe: [{
					id: "trash",
					date: Date.now(),
					parent: null,
					name: "Trash",
					path: "Trash",
					type: "/",
					privacy: 2
				}]
			};
			if (!insertData.verified) {
				insertData.unverified = email;
				sendVerification(insertData);
			}
			this.value = {
				id: String((await users.insertOne(insertData)).ops[0]._id)
			};
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
