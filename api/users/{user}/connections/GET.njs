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
	if(isMe) {
		if(this.now - this.token.super < 300000) {
			this.value = user.connections.map(connection => ({
				service: connection.service,
				id: connection.id
			}));
			this.done();
		} else {
			this.value = {
				error: "Your token is not in super mode."
			};
			this.status = 403;
			this.done();
		}
	} else {
		this.value = {
			error: "You do not have permission to access that user's connections."
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
