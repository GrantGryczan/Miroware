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
