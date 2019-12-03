if (testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email.trim().toLowerCase()
	});
	if (user) {
		if (user.verified) {
			connect(this, user).then(data => {
				if (user.connections.some(connection => connection.service === data.connection[0] && connection.id === data.id)) {
					this.value = createToken(this, user);
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
				error: "That email is not verified.",
				unverified: true
			};
			this.status = 422;
			this.done();
		}
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
	this.status = 400;
	this.done();
}
