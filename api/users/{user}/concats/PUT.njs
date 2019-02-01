const {user, permitted} = await parseUser(this);
if (permitted) {
	const found = this.user.concats.find(item => item.sub === this.req.query.sub && item.val === this.req.query.val);
	if (found) {
		const concat = await sanitizeConcat(this, true);
		this.value = {
			...concat,
			url: `https://${concat.sub ? `${concat.sub}.` : ""}miro.gg/${concat.val}`
		};
		const keys = Object.keys(concat);
		if (!keys.length) {
			this.done();
			return;
		}
		const set = {};
		for (const key of keys) {
			set[`concats.$.${key}`] = concat[key];
		}
		users.updateOne({
			...this.userFilter,
			"concats.sub": found.sub,
			"concats.val": found.val
		}, {
			$set: set
		});
	} else {
		this.value = {
			error: "You do not own that concat."
		};
		this.status = 404;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's concats."
	};
	this.status = 403;
}
this.done();
