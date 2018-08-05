const thisID = this.user && String(this.user._id);
if(this.user && this.params.user === "@me") {
	this.params.user = thisID;
}
const isMe = this.params.user === thisID;
let user = this.user;
if(!isMe) {
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
				birth: user.birth,
				concats: user.concats
			});
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
