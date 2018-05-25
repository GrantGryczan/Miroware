if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user.toHexString();
}
const filter = {
	_id: ObjectID(this.params.user)
};
const user = await users.findOne(filter);
if(user) {
	if(this.req.session.user.toHexString() === user._id.toHexString()) {
		const set = {};
		if(this.req.body.name !== undefined && (this.req.body.name = String(this.req.body.name)).length) {
			set.name = this.req.body.name.slice(0, 32);
		}
		if(typeof this.req.body.birth === "number" && this.req.body.birth <= Date.now() && this.req.body.birth >= 8640000000000000) {
			set.birth = parseInt(this.req.body.birth);
		}
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
