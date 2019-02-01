const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.concats.find(item => item.sub === this.req.query.sub && item.val === this.req.query.val);
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
			_id: user._id,
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
