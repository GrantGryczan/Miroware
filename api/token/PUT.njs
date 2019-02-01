if (this.token) {
	if (this.token.role === 0) {
		connect(this, this.user).then(data => {
			validateConnection(this, data).then(() => {
				this.updatePouch.$set["pouch.$.super"] = this.now;
				this.done();
			});
		});
	} else {
		this.value = {
			error: "The role of the provided token does not suffice this action."
		};
		this.status = 403;
		this.done();
	}
} else {
	this.value = {
		error: "No authorization credentials were provided."
	};
	this.status = 401;
	this.done();
}
