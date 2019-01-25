let {user} = this;
if (this.params.user !== (user && String(user._id))) {
	let userID;
	try {
		userID = ObjectID(this.params.user);
	} catch (err) {
		Object.assign(this, await load("error/400", this));
		this.done();
		return;
	}
	user = await users.findOne({
		_id: userID
	});
}
if (user) {
	this.title = user.name;
	this.description = user.desc;
	this.tags = ["account", "user", "profile"];
	this.value = (await load("load/head", this)).value;
	this.value += (await load("load/body", this)).value;
	this.value += (await load("load/pagehead", this)).value;
	this.value += html`
				<div id="desc">
					${html`$${user.desc}`.replace(lineBreaks, "<br>")}
				</div>
				<br>
				<br>
				<small>(Profiles, among other features, were deemed comparatively insignificant. Development on more practical services currently takes higher priority.)</small>`;
	this.value += (await load("load/pagefoot", this)).value;
	this.value += (await load("load/belt", this)).value;
	this.value += (await load("load/foot", this)).value;
} else {
	Object.assign(this, await load("error/404", this));
}
this.done();
