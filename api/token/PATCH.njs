if(this.token) {
	if(this.token.scope <= 0) {
		connect(this).then(data => {
			validateConnection(this, data).then(() => {
				context.updatePouch["pouch.$.super"] = context.now;
			});
		});
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
	this.status = 404;
	this.done();
}
