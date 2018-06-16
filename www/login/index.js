(() => {
	const loginForm = document.querySelector("#loginForm");
	const submits = loginForm.querySelectorAll("button[type='submit']");
	const signupForm = document.querySelector("#signupForm");
	const captchaElem = document.querySelector(".g-recaptcha");
	const captchaInput = captchaElem.querySelector("[name='g-recaptcha-response']");
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
		captcha: captchaInput.value,
		email: signupForm.elements.email.value,
		name: signupForm.elements.name.value,
		birthday: signupForm.elements.birthday.valueAsNumber
	});
	const loggedIn = () => {
		location.reload();
	};
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		if(signup) {
			if(!signupForm.elements.email) {
				signupForm.elements.email = loginForm.elements.email;
			}
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
