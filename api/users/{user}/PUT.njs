if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user;
}
const filter = {
	_id: ObjectID(this.params.user)
};
const user = await users.findOne(filter);
if(user) {
	if(this.req.session.user.toHexString() === user._id.toHexString()) {
		const set = {};
		
		if(Object.keys(set).length) {
			await users.updateOne(filter, {
				$set: set
			});
		}
	} else {
		this.value = {
			error: "You do not have permission to edit that user."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
}
this.done();
