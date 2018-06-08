if(this.user && this.params.user === "@me") {
	this.params.user = String(this.user._id);
}
let userID;
try {
	userID = ObjectID(this.params.user);
} catch(err) {
	this.value = {
		error: err.message
	};
	this.status = 400;
	this.done();
	return;
}
const user = await users.findOne({
	_id: userID
});
if(user) {
	const isMe = this.user && this.params.user === String(this.user._id) && this.token.scope === 0;
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
					if(user.connections.find(v => v.service === data.connection[0] && v.id === data.id)) {
						this.value.connections = user.connections.map(v => ({
							service: v.service,
							id: v.id
						}));
					} else {
						this.value = {
							error: "That account does not use that login method."
						};
						this.status = 422;
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
			error: "You do not have permission to access that user."
		};
		this.status = 401;
		this.done();
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
	this.done();
}
