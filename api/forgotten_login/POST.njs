if (testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email.trim().toLowerCase()
	});
	if (user) {
		const password = crypto.randomBytes(24).toString("base64");
		const to = `${JSON.stringify(user.name)} <${user.email}>`;
		transporter.sendMail({
			from: "File Garden <service@filegarden.com>",
			replyTo: "File Garden Support <support@filegarden.com>",
			envelope: {
				from: "<bounce@filegarden.com>",
				to
			},
			to,
			subject: "Temporary Login",
			text: "Use this password to log into your File Garden account.",
			html: html`
				<p>Use the below password to log into the File Garden account associated with <b>$${user.email}</b>.</p>
				<p><b>$${password}</b></p>
				<p>You can copy this to your clipboard and paste it into the password field.</p>
				<p>This password is automatically deleted after using it, so you should set a new password in your account settings immediately after signing in.</p>
				<p>If you didn't request this, it's safe to ignore this email.</p>
			`
		});
		await users.updateOne({
			_id: user._id
		}, {
			$push: {
				connections: {
					service: "password",
					id: `temp_${ObjectID()}`,
					hash: youKnow.crypto.hash(password, user.salt.buffer),
					once: true
				}
			}
		});
	} else {
		this.value = {
			error: "That email is not registered."
		};
		this.status = 422;
	}
} else {
	this.value = {
		error: "That is not a valid email."
	};
	this.status = 400;
}
this.done();
