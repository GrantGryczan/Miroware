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
		const concat = await sanitizeConcat(this);
		const keeper = await users.findOne({
			concats: {
				$elemMatch: {
					sub: concat.sub,
					val: concat.val
				}
			}
		});
		if(keeper) {
			const found = keeper.concats.find(item => item.sub === concat.sub && item.val === concat.val);
			this.value = {
				error: `That concat is already taken${found.anon ? "" : html` by <a href="/users/${keeper._id}/">$${keeper.name}</a>`}.`,
				keeper: !found.anon && keeper._id
			};
			this.status = 422;
		} else {
			this.update.$push = {
				concats: concat
			};
			this.value = {
				...concat,
				url: `https://${concat.sub ? `${concat.sub}.` : ""}miro.gg/${concat.val}`
			};
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
