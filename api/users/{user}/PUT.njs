if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user;
}
const filter = {
	_id: this.params.user
};
const user = await users.findOne(filter);
if(user) {
	console.log(this.req.session.user.constructor, user._id.constructor);
	if(this.req.session.user === user._id) {
		const set = {};
		
		await users.updateOne(filter, {
			$set: set
		});
		this.done();
	} else {
		this.value = {
			error: "You do not have permission to edit that user."
		};
		this.status = 403;
		this.done();
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
	this.done();
}
