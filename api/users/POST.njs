if(this.req.body.service === "Discord") {
	console.log(this.req.body);
	request.post(`https://discordapp.com/api/oauth2/token?client_id=${youKnow.discord.id}&client_secret=${youKnow.discord.secret}&grant_type=client_credentials&code=${encodeURIComponent(this.req.body.value)}`).then(body => {
		body = JSON.parse(body);
		console.log(body);
		request.get({
			url: "https://discordapp.com/api/users/@me",
			headers: {
				"Authorization": `${body.token_type} ${body.access_token}`
			}
		}).then(body2 => {
			//request.post(`https://discordapp.com/api/oauth2/token/revoke?token=${body.access_token}`);
			body2 = JSON.parse(body2);
			console.log(body2);
			this.status = 201;
			this.done();
		}).catch(requestError.bind(this));
	}).catch(requestError.bind(this));
} else {
	this.done();
}
