const {user, isMe} = await parseUser(this);
if(isMe) {
	if(this.now - this.token.super < 300000) {
		this.value = user.connections.map(connection => ({
			service: connection.service,
			id: connection.id
		}));
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's connections."
	};
	this.status = 404;
}
this.done();
