const thisID = this.user && String(this.user._id);
if(this.user && this.params.user === "@me") {
	this.redirect = `/users/${this.user._id}/`;
	this.done();
	return;
}
const isMe = this.params.user === thisID;
let user = this.user;
if(!isMe) {
	let userID;
	try {
		userID = ObjectID(this.params.user);
	} catch(err) {
		await load("error/400", this);
		this.done();
		return;
	}
	user = await users.findOne({
		_id: userID
	});
}
if(user) {
	this.title = user.name;
	this.description = user.desc;
	this.tags = ["account", "user", "profile"];
	this.value = (await load("www/load/head", this)).value;
	this.value += (await load("www/load/body", this)).value;
	this.value += html`
			<div id="page">
				
			</div>`;
	this.value += (await load("www/load/belt", this)).value;
	this.value += html`
		<script src="index.js"></script>`;
	this.value += (await load("www/load/foot", this)).value;
} else {
	await load("error/404", this);
}
this.done();
