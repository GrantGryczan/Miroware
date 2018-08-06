const {user, isMe} = await parseUser(this);
if(isMe) {
	const found = this.user.concats.find(item => item.sub === this.req.query.sub && item.val === this.req.query.val);
	if(found) {
		const concat = await sanitizeConcat(this, true);
		const set = {};
		for(const i of Object.keys(concat)) {
			set[`concats.$.${i}`] = concat[i];
		}
		users.updateOne({
			...this.userFilter,
			"concats.sub": found.sub,
			"concats.val": found.val
		}, {
			$set: set
		});
		this.value = {
			...concat,
			url: `https://${concat.sub ? `${concat.sub}.` : ""}miro.gg/${concat.val}`
		};
	} else {
		this.value = {
			error: "You do not own that concat."
		};
		this.status = 403;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's concats."
	};
	this.status = 403;
}
this.done();
