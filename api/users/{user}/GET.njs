const thisID = this.user && String(this.user._id);
if(this.user && this.params.user === "@me") {
	this.params.user = thisID;
}
let user = this.user;
if(this.params.user !== thisID) {
	let userID;
	try {
		userID = ObjectID(this.params.user);
	} catch(err) {
		this.value = {
			error: "That is not a valid user ID."
		};
		this.status = 400;
		this.done();
		return;
	}
	user = await users.findOne({
		_id: userID
	});
}
if(user) {
	const isMe = this.params.user === thisID && this.token.scope === 0;
	if(isMe || user.name !== null) {
		this.value = {
			created: user.created,
			updated: user.updated,
			verified: user.verified,
			publicEmail: user.publicEmail,
			name: user.name,
			desc: user.desc,
			icon: user.icon
		};
		if(isMe || user.publicEmail) {
			this.value.email = user.email;
		}
		if(isMe) {
			Object.assign(this.value, {
				unverified: user.unverified,
				nameCooldown: user.nameCooldown,
				birth: user.birth
			});
			if(this.req.get("X-Miro-Connection")) {
				const data = await connect(this);
				if(data) {
					if(user.connections.some(v => v.service === data.connection[0] && v.id === data.id)) {
						this.value.connections = user.connections.map(v => ({
							service: v.service,
							id: v.id
						}));
					} else {
						this.value = {
							error: "Authentication failed."
						};
						this.status = 401;
						this.done();
					}
				} else {
					return;
				}
			}
		}
		this.done();
	} else {
		this.value = {
			error: "That user was not found."
		};
		this.status = 404;
		this.done();
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
	this.done();
}
