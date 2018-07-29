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
	const enableFormOnAuthCancel = value => {
		if(value !== -2) {
			Miro.formState(loginForm, true);
		}
	};
	const dialogCallback = dialog => {
		if(signup) {
			dialog.body.appendChild(document.createElement("br"));
			dialog.body.appendChild(document.createElement("br"));
			dialog.body.appendChild(captchaElem);
		}
		dialog.then(enableFormOnAuthCancel);
	};
	let signupDialog;
	const executeCaptcha = resolve => {
		window.captchaCallback = resolve;
		grecaptcha.execute();
	};
	const signUp = async (service, code) => Miro.request("POST", "/users", {}, {
		connection: `${service} ${code}`,
		captcha: await new Promise(executeCaptcha),
		email: signupDialog.form.elements.email.value,
		name: signupDialog.form.elements.name.value,
		birth: signupDialog.form.elements.birth.valueAsNumber
	});
	const logIn = async (service, code) => Miro.request("POST", "/token", {}, {
		connection: `${service} ${code}`,
		email: loginForm.elements.email.value
	});
	const loggedIn = () => {
		location.reload();
	};
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		Miro.formState(loginForm, false);
		if(signup) {
			signupDialog = new Miro.Dialog("Sign up", signupForm, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]).then(value => {
				if(value === 0) {
					Miro.auth("Sign up", "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up.", signUp, dialogCallback).then(loggedIn);
				} else {
					Miro.formState(loginForm, true);
				}
			});
			if(!signupDialog.form.elements.email.value) {
				signupDialog.form.elements.email.value = loginForm.elements.email.value;
			}
			setTimeout(signupDialog.form.elements.name.focus.bind(signupDialog.form.elements.name));
		} else {
			Miro.auth("Log in", "Choose a login method.", logIn, dialogCallback).then(loggedIn);
		}
	});
})();
