this.value = (await load("api/users/@me", {
	...this,
	method: "GET"
})).value;
this.done();
