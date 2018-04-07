
	request.post(`https://discordapp.com/api/oauth2/token?client_id=${youKnow.discord.id}&client_secret=${youKnow.discord.secret}&grant_type=authorization_code&code=${encodeURIComponent(this.req.body.code)}`).then(body => {
		body = JSON.parse(body);
		request.get({
			url: "https://discordapp.com/api/users/@me",
			headers: {
				"Authorization": `${body.token_type} ${body.access_token}`
			}
		}).then(body2 => {
			//request.post(`https://discordapp.com/api/oauth2/token/revoke?token=${body.access_token}`);
			body2 = JSON.parse(body2);
			body2.id;
		}).catch(() => {
			// error
		});
	}).catch(() => {
		// error
	});
this.done();
