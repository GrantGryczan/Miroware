if(this.req.session.user && this.params.user === "@me") {
	this.params.user = this.req.session.user.toHexString();
}
let userID;
try {
	userID = ObjectID(this.params.user);
} catch(err) {
	this.value = {
		error: err.message
	};
	this.status = 422;
	this.done();
	return;
}
const filter = {
	_id: userID
};
const user = await users.findOne(filter);
if(user) {
	if(this.req.session.user.toHexString() === user._id.toHexString()) {
		const set = {};
		const notIn = this.req.session.in === false;
		const now = Date.now();
		const validName = this.req.body.name !== undefined && (this.req.body.name = String(this.req.body.name)).length && now-user.nameCooldown >= 86400000;
		const validBirth = typeof this.req.body.birth === "number" && this.req.body.birth <= now && this.req.body.birth >= -8640000000000000;
		if(notIn) {
			if(validName && validBirth) {
				this.req.session.in = true;
				set.created = set.updated = now;
			} else {
				this.value = {
					error: "If signup is incomplete, you must define the `name` and `birth` values."
				};
				this.status = 422;
				this.done();
				return;
			}
		}
		if(validName) {
			set.name = this.req.body.name.slice(0, 32);
			set.nameCooldown = now;
		}
		if(validBirth) {
			set.birth = parseInt(this.req.body.birth);
		}
		if(Object.keys(set).length) {
			await users.updateOne(filter, {
				$set: set
			});
			this.value = set;
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
