const {user, isMe} = await parseUser(this);
if (isMe) {
	const concat = await sanitizeConcat(this);
	this.update.$push = {
		concats: concat
	};
	this.value = {
		...concat,
		url: `https://${concat.sub ? `${concat.sub}.` : ""}linkh.at/${concat.val}`
	};
} else {
	this.value = {
		error: "You do not have permission to access that user's concats."
	};
	this.status = 403;
}
this.done();
