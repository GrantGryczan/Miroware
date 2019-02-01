if(!this.user || this.user.role !== 0) {
	this.value = {
		error: "You do not have permission to access that user."
	};
	this.status = 403;
	this.done();
}
const {user} = await parseUser(this);
addToken(this, user);
