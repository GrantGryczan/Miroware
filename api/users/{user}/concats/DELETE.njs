const {user, permitted} = await parseUser(this);
if (permitted) {
	this.update.$pull.concats = {
		sub: this.req.query.sub,
		val: this.req.query.val
	};
	this.done();
} else {
	this.value = {
		error: "You do not have permission to access that user's concats."
	};
	this.status = 403;
}
this.done();
