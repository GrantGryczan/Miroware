(() => {
	const loginForm = document.querySelector("#loginForm");
	const submits = loginForm.querySelectorAll("button[type='submit']");
	const signupForm = document.querySelector("#signupForm");
	const captchaElem = document.querySelector(".g-recaptcha");
	let signup = false;
	const setSubmit = evt => {
		signup = evt.target.name === "signup";
	};
	for(const input of submits) {
		input.addEventListener("click", setSubmit);
	}
	const dialogCallback = dialog => {
		dialog.body.appendChild(captchaElem);
	};
	const send = (service, code) => Miro.request("POST", "/users", {}, {
		connection: `${service} ${code}`,
		captcha: signupDialog.form.elements["g-recaptcha-response"].value,
		email: loginForm.elements.email.value,
		name: loginForm.elements.name.value,
		birthday: loginForm.elements.birthday.valueAsNumber
	});
	const loggedIn = () => {
		Miro.formState(loginForm, false);
		//location.href = Miro.query.dest && !Miro.query.dest.includes("//") ? Miro.query.dest : "/";
		location.reload();
	};
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		if(signup) {
			const signupDialog = new Miro.dialog("Sign up", signupForm, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]).then(value => {
				if(value === 0) {
					Miro.auth(signup ? "Sign up" : "Log in", signup ? "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up." : "Choose a login method.", send, dialogCallback).then(loggedIn);
				}
			});
		}
	});
})();
