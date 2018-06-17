if(this.token) {
	if(this.token.scope <= 0) {
		if(typeof this.req.body.connection === "string") {
			connect(this).then(data => {
				validateConnection(this, data).then(() => {
					this.updatePouch.$set["pouch.$.super"] = this.now;
					this.done();
				});
			});
		} else {
			this.value = {
				error: "The `connection` value must be a string."
			};
			this.status = 400;
			this.done();
			return;
		}
	} else {
		this.value = {
			error: "The scope of the specified token does not suffice this action."
		};
		this.status = 403;
		this.done();
	}
} else {
	this.value = {
		error: "No authorization credentials were specified."
	};
	this.status = 401;
	this.done();
}
