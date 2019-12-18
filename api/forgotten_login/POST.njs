if (testEmail(this.req.body.email)) {
	const user = await users.findOne({
		email: this.req.body.email.trim().toLowerCase()
	});
	if (user) {
		const password = crypto.randomBytes(24).toString("base64");
		transporter.sendMail({
			from: "Miroware <bot@miroware.io>",
			to: `${JSON.stringify(user.name)} <${user.email}>`,
			subject: "Miroware / Forgot Login",
			text: "Use this password to log into your Miroware account.",
			html: html`
				Use the below password to log into the Miroware account associated with <b>$${user.email}</b>.<br>
				<b>$${password}</b><br>
				It is recommended that you copy it to your clipboard to paste it into the password field.<br>
				Once you use this password, it will be automatically disconnected.
				<p>
					<i>(It would be greatly appreciated if you could mark the email as not spam as well, if you did happen to find this email in your spam folder. Thank you!)</i>
				</p>
			`
		});
		users.updateOne({
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
