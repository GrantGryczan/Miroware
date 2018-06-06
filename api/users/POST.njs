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
			const now = Date.now();
			const inAMonth = now+cookieOptions.maxAge;
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
				created: now,
				updated: now,
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
			const id = (await users.insertOne(insertData)).ops[0]._id;
			this.value = {
				token,
				id
			};
			this.res.cookie("auth",  `Basic ${Buffer.from(`${id}:${token}`).toString("base64")}`, cookieOptions);
			this.status = 201;
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
