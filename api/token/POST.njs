if(testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email
	});
	if(user) {
		authenticate(this).then(async data => {
			if(user.login.find(v => v.service === this.req.body.service && v.id === data.id)) {
				const token = youKnow.crypto.token();
				users.updateOne({
					_id: user._id
				}, {
					$push: {
						pouch: {
							value: youKnow.crypto.hash(token, user.salt.buffer),
							scope: 0,
							expire: this.now+cookieOptions.maxAge
						}
					}
				});
				const id = String(user._id);
				this.value = {
					id,
					token
				};
				this.res.cookie("auth", Buffer.from(`${id}:${token}`).toString("base64"), cookieOptions);
				this.done();
			} else {
				this.value = {
					error: "That account does not use that login method."
				};
				this.status = 422;
				this.done();
			}
		});
	} else {
		this.value = {
			error: "That email is not registered."
		};
		this.status = 422;
		this.done();
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 422;
	this.done();
}
