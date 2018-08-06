const thisID = this.user && String(this.user._id);
if(this.user && this.params.user === "@me") {
	this.params.user = thisID;
}
const isMe = this.params.user === thisID;
let user = this.user;
if(!isMe) {
	let userID;
	try {
		userID = ObjectID(this.params.user);
	} catch(err) {
		this.value = {
			error: "That is not a valid user ID."
		};
		this.status = 400;
		this.done();
		return;
	}
	user = await users.findOne({
		_id: userID
	});
}
if(user) {
	if(isMe) {
		const found = this.user.concats.find(item => item.sub === this.req.query.sub && item.val === this.req.query.val);
		if(found) {
			const concat = await sanitizeConcat(this);
			for(const i of Object.keys(concat)) {
				this.update.$set[`concats.$.${i}`] = concat[i];
			}
			this.value = {
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
} else {
	this.value = {
		error: "That user was not found."
	};
	this.status = 404;
}
this.done();
