if(emailTest.test(this.req.body.email)) {
	if(await users.findOne({
		email: this.req.body.email
	})) {
		this.value = {
			error: "That email is already in use."
		};
		this.status = 422;
		this.done();
	} else if(this.req.body.service === "Google") {
		googleAuthClient.verifyIdToken({
			idToken: this.req.body.value,
			audience: youKnow.google.id
		}).then(async ticket => {
			const payload = ticket.getPayload();
			const login = [{
				service: "Google",
				id: payload.sub
			}];
			if(await users.findOne({
				login
			})) {
				this.value = {
					error: "That login method is already in use."
				};
				this.status = 422;
			} else {
				const now = Date.now();
				this.req.session.user = (await users.insertOne({
					created: now,
					updated: now,
					login,
					email: this.req.body.email,
					verified: this.req.body.email === payload.email && payload.email_verified,
					publicEmail: false,
					name: payload.name,
					desc: "",
					icon: ""
				})).ops[0]._id;
				this.status = 201;
			}
			this.done();
		}).catch(err => {
			this.value = {
				error: err.message
			};
			this.status = 422;
			this.done();
		});
	} else if(this.req.body.service === "Discord") {
		const catchError = err => {
			const error = JSON.parse(err.error);
			this.value = {
				error: error.error_description || error.error
			};
			this.status = 422;
			this.done();
		};
		request.post("https://discordapp.com/api/oauth2/token", {
			form: {
				client_id: youKnow.discord.id,
				client_secret: youKnow.discord.secret,
				grant_type: "authorization_code",
				code: this.req.body.value,
				redirect_uri: `${this.req.get("Referrer")}discord/`
			}
		}).then(body => {
			body = JSON.parse(body);
			request.get({
				url: "https://discordapp.com/api/users/@me",
				headers: {
					"Authorization": `${body.token_type} ${body.access_token}`
				}
			}).then(async body2 => {
				body2 = JSON.parse(body2);
				const login = [{
					service: "Discord",
					id: body2.id
				}];
				if(await users.findOne({
					login
				})) {
					this.value = {
						error: "That login method is already in use."
					};
					this.status = 422;
				} else {
					const now = Date.now();
					this.req.session.user = (await users.insertOne({
						created: now,
						updated: now,
						login,
						email: this.req.body.email,
						verified: this.req.body.email === body2.email && body2.verified,
						publicEmail: false,
						name: body2.username,
						desc: "",
						icon: ""
					})).ops[0]._id;
					this.status = 201;
				}
				this.done();
			}).catch(catchError);
		}).catch(catchError);
	} else {
		this.value = {
			error: `${this.req.body.service} is not a valid service.`
		};
		this.status = 422;
		this.done();
	}
} else {
	this.value = {
		error: `${this.req.body.email} is not a valid email.`
	};
	this.status = 422;
	this.done();
}
