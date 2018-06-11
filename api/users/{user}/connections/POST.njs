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
		connect(this).then(data => {
			console.log(1);
			validateConnection(this, user, data).then(() => {
				console.log(data);
				connect(this, req.body.connection).then(data2 => {
					console.log(data1);
					this.value = {};
					this.update.$push = {
						connections: (this.value.connection = {
							service: data2.connection[0],
							id: data2.connection[1]
						})
					};
				});
			});
		});
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
