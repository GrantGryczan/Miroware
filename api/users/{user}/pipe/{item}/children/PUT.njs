const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.type === "/" && item.id === this.params.item);
	if (found) {
		const update = {};
		const putItem = {};
		if (this.req.body.privacy !== undefined) {
			if (typeof this.req.body.privacy === "number") {
				if (this.req.body.privacy === 0 || this.req.body.privacy === 1 || this.req.body.privacy === 2) {
					if (this.req.body.privacy === 2 && true /* TODO: not subscribed */) {
						this.value = {
							error: "Private items require a paid subscription."
						};
						this.status = 422;
						this.done();
						return;
					}
					putItem.privacy = this.req.body.privacy;
				} else {
					this.value = {
						error: "The `privacy` value must be 0 (public), 1 (unlisted), or 2 (private)."
					};
					this.status = 400;
					this.done();
					return;
				}
			} else {
				this.value = {
					error: "The `privacy` value must be a number."
				};
				this.status = 400;
				this.done();
				return;
			}
		}
		const keys = Object.keys(putItem);
		if (!keys.length) {
			this.done();
			return;
		}
		update.$set = {};
		for (const key of keys) {
			update.$set[`pipe.$[item].${key}`] = putItem[key];
		}
		const items = [];
		const prefix = `${found.path}/`;
		for (const child of user.pipe) {
			if (child.path.startsWith(prefix)) {
				items.push(child);
			}
		}
		await users.updateOne({
			_id: user._id
		}, update, {
			arrayFilters: [{
				"item.id": {
					$in: items.map(byID)
				}
			}],
			multi: true
		});
		purgePipeCache(user, items);
	} else {
		this.value = {
			error: "That resource does not exist."
		};
		this.status = 404;
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
