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
			const insertData = {
				salt: youKnow.crypto.salt(),
				created: now,
				updated: now,
				login: [{
					service: this.req.body.service,
					id: data.id
				}],
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
			this.value = {
				id: this.req.session.user = (await users.insertOne(insertData)).ops[0]._id
			};
			this.req.session.in = false;
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
