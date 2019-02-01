const {user, isMe} = await parseUser(this);
if (isMe) {
	if (this.now - this.token.super < 300000) {
		if (this.user.connections.some(connection => connection.id === this.params.id)) {
			if (this.user.connections.length === 1) {
				this.value = {
					error: "You probably need to be able to log in with at least one connection."
				};
				this.status = 422;
			} else {
				this.update.$pull.connections = {
					id: this.params.id
				};
			}
		} else {
			this.value = {
				error: "That connection does not exist."
			};
			this.status = 404;
		}
	} else {
		this.value = {
			error: "Your token is not in super mode."
		};
		this.status = 401;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's connections."
	};
	this.status = 403;
}
this.done();
