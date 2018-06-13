if(testEmail(this.req.body.email)) {
	if(await users.findOne({
		email: this.req.body.email
	})) {
		this.value = {
			error: "That email is already in use."
		};
		this.status = 409;
		this.done();
	} else {
		connect(this).then(async data => {
			const token = youKnow.crypto.token();
			const salt = youKnow.crypto.salt();
			const insertData = {
				salt,
				pouch: [{
					value: youKnow.crypto.hash(token, salt),
					scope: 0,
					expire: this.now+cookieOptions.maxAge,
					super: this.now
				}],
				connections: [{
					service: data.connection[0],
					id: data.id
				}],
				created: this.now,
				updated: this.now,
				email: this.req.body.email,
				verified: data.verified && this.req.body.email === data.email,
				unverified: null,
				emailCode: null,
				publicEmail: false,
				name: null,
				nameCooldown: 0,
				birth: null,
				desc: "",
				icon: null
			};
			if(!insertData.verified) {
				insertData.unverified = this.req.body.email;
				// TODO: Set `emailCode` and send verification email.
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
