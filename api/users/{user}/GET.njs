if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user;
}
const user = await users.findOne({
	_id: ObjectID(this.params.user)
});
if(user) {
	const isMe = this.params.user === this.req.session.user;
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
				email: user.email,
				birth: user.birth
			});
		}
		this.done();
	} else {
		this.value = {
			error: "You do not have permission to access that user."
		};
		this.status = 403;
		this.done();
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
	this.done();
}
