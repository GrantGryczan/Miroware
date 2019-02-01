const {user, isMe} = await parseUser(this);
this.value = {
	id: user._id,
	created: user.created,
	updated: user.updated,
	verified: user.verified,
	publicEmail: user.publicEmail,
	name: user.name,
	desc: user.desc,
	icon: user.icon
};
if (isMe || user.publicEmail) {
	this.value.email = user.email;
	if (isMe) {
		this.value.unverified = user.unverified;
		this.value.nameCooldown = user.nameCooldown;
		this.value.birth = user.birth;
	}
}
this.done();
