const {user, permitted} = await parseUser(this);
if (permitted) {
	const concat = await sanitizeConcat(this);
	this.update.$push = {
		concats: concat
	};
	this.value = {
		...concat,
		url: `https://${concat.sub ? `${concat.sub}.` : ""}miro.gg/${concat.val}`
	};
} else {
	this.value = {
		error: "You do not have permission to access that user's concats."
	};
	this.status = 403;
}
this.done();
