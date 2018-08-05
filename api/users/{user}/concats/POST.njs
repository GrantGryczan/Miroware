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
		const concat = {
			anon: !!this.req.body.anon,
			sub: this.req.body.sub.trim().toLowerCase(),
			val: encodeURI(this.req.body.val)
		};
		if(typeof concat.sub === "string") {
			if(concat.sub.length > 63) {
				this.value = {
					error: "The `sub` value must be at most 63 characters long."
				};
				this.status = 400;
				this.done();
				return;
			} else if(!testSubdomain(concat.sub)) {
				this.value = {
					error: "The `sub` value may only contain alphanumeric characters, hyphens and underscores if not on the ends, and periods if not on the ends nor consecutive."
				};
				this.status = 400;
				this.done();
				return;
			}
		} else {
			this.value = {
				error: "The `sub` value must be a string."
			};
			this.status = 400;
			this.done();
			return;
		}
		if(typeof concat.val === "string") {
			if(concat.val.length > 63) {
				this.value = {
					error: "The `val` value must be at most 63 characters long."
				};
				this.status = 400;
				this.done();
				return;
			}
		} else {
			this.value = {
				error: "The `val` value must be a string."
			};
			this.status = 400;
			this.done();
			return;
		}
		const keeper = await users.findOne({
			concats: [{
				sub: concat.sub,
				val: concat.val
			}]
		});
		if(keeper) {
			const found = keeper.concats.find(item => item.sub === concat.sub && item.val === concat.val);
			this.value = {
				error: `That concat is already taken$${found.anon ? "" : html` by <a href="/users/${keeper._id}/">$${keeper.name}</a>`}.`,
				keeper: found.anon && keeper._id
			};
			this.status = 422;
		} else {
			this.update.$push = {
				concats: concat
			};
			this.value = {
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
