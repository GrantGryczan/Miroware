const {user, isMe} = await parseUser(this);
if(isMe) {
	console.log(this.req.body);
	/*this.update.$push = {
		pipe: {}
	};*/
} else {
	this.value = {
		error: "You do not have permission to access that user's pipe."
	};
	this.status = 403;
}
this.done();
