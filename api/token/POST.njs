if(testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email
	});
	if(user) {
		connect(this).then(data => {
			if(user.connections.find(v => v.service === data.connection[0] && v.id === data.id)) {
				const token = youKnow.crypto.token();
				users.updateOne({
					_id: user._id
				}, {
					$push: {
						pouch: {
							value: youKnow.crypto.hash(token, user.salt.buffer),
							scope: 0,
							expire: this.now+cookieOptions.maxAge,
							super: this.now
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
					error: "Authentication failed."
				};
				this.status = 401;
				this.done();
			}
		});
	} else {
		this.value = {
			error: "Authentication failed."
		};
		this.status = 401;
		this.done();
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 400;
	this.done();
}
