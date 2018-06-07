if(testEmail(this.req.body.email)) {
	if(await users.findOne({
		email: this.req.body.email
	})) {
		this.value = {
			error: "That email is already in use."
		};
		this.status = 422;
		this.done();
	} else {
		authenticate(this).then(async data => {
			const inAMonth = this.now+cookieOptions.maxAge;
			const token = youKnow.crypto.token();
			const salt = youKnow.crypto.salt();
			const insertData = {
				salt,
				pouch: [{
					value: youKnow.crypto.hash(token, salt),
					scope: 0,
					expire: inAMonth
				}],
				login: [{
					service: this.req.body.service,
					id: data.id
				}],
				created: this.now,
				updated: this.now,
				email: this.req.body.email,
				verified: this.req.body.email === data.email && data.verified,
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
			const id = (await users.insertOne(insertData)).ops[0]._id.toHexString();
			this.value = {
				id,
				token
			};
			this.res.cookie("auth",  Buffer.from(`${id}:${token}`).toString("base64"), cookieOptions);
			this.done();
		});
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 422;
	this.done();
}
