const {user, permitted} = await parseUser(this);
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
if (permitted || user.publicEmail) {
	this.value.email = user.email;
}
if (permitted) {
	Object.assign(this.value, {
		unverified: user.unverified,
		nameCooldown: user.nameCooldown,
		birth: user.birth
	});
}
this.done();
