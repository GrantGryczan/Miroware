(() => {
	const loginForm = document.querySelector("#loginForm");
	const submits = loginForm.querySelectorAll("button[type=\"submit\"]");
	const signupForm = document.querySelector("#signupForm");
	let signup = false;
	const getIn = Miro.response(() => {
		Miro.in = true;
	});
	const loggedIn = () => {
		Miro.formState(loginForm, false);
		if(Miro.in) {
			location.href = (Miro.query.dest && Miro.query.dest.startsWith("/")) ? Miro.query.dest : "/";
		} else if(Miro.in === false) {
			setTimeout(() => {
				signupForm.classList.remove("hidden");
			});
			const signupDialog = new Miro.dialog("Sign up", signupForm, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]).then(value => {
				if(value === 0) {
					if(signupDialog.form.elements["g-recaptcha-response"] && signupDialog.form.elements["g-recaptcha-response"].value) {
						Miro.request("PUT", "/users/@me", {}, {
							captcha: signupDialog.form.elements["g-recaptcha-response"].value,
							name: signupDialog.form.elements.name.value,
							birth: signupDialog.form.elements.birthday.valueAsNumber,
						}).then(getIn).finally(loggedIn);
					} else {
						new Miro.dialog("Error", "You must complete the CAPTCHA challenge before authenticating.").then(loggedIn);
					}
				} else {
					Miro.logOut();
				}
			});
		} else {
			location.reload();
		}
	};
	if(Miro.in !== null) {
		loggedIn();
		return;
	}
	const setSubmit = function() {
		signup = this.name === "signup";
	};
	for(const v of submits) {
		v.addEventListener("click", setSubmit);
	}
	const send = (service, code) => Miro.request("POST", signup ? "/users" : "/token", {}, {
		email: loginForm.email.value,
		service,
		code
	});
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		Miro.formState(loginForm, false);
		Miro.auth(signup ? "Sign up" : "Log in", signup ? "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up." : "Choose a login method.", send).then(loggedIn);
	});
})();
