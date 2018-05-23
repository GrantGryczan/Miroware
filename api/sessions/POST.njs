if(testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email
	});
	if(user) {
		authenticate(this).then(async data => {
			const user = await users.findOne({
				login: [{
					service: this.req.body.service,
					id: data.id
				}]
			});
			if(user) {
				this.value = {
					id: this.req.session.id = user._id
				};
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
