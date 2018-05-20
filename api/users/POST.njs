if(this.req.body.service === "Google") {
	
} else if(this.req.body.service === "Discord") {
	request.post("https://discordapp.com/api/oauth2/token", {
		form: {
			client_id: youKnow.discord.id,
			client_secret: youKnow.discord.secret,
			grant_type: "authorization_code",
			code: this.req.body.value,
			redirect_uri: `${this.req.get("Referrer")}discord/`
		}
	}).then(body => {
		body = JSON.parse(body);
		request.get({
			url: "https://discordapp.com/api/users/@me",
			headers: {
				"Authorization": `${body.token_type} ${body.access_token}`
			}
		}).then(body2 => {
			//request.post(`https://discordapp.com/api/oauth2/token/revoke?token=${body.access_token}`);
			body2 = JSON.parse(body2);
			this.status = 201;
			this.done();
		}).catch(requestError.bind(this));
	}).catch(requestError.bind(this));
} else {
	this.value = {
		error: `${this.req.body.service} is not a valid service.`
	};
	this.status = 404;
	this.done();
}
