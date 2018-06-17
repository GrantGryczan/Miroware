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
		dialog.body.appendChild(document.createElement("br"));
		dialog.body.appendChild(document.createElement("br"));
		dialog.body.appendChild(captchaElem);
	};
	let signupDialog;
	const signUp = (service, code) => {
		return new Promise(resolve => {
			window.captchaCallback = captchaValue => {
				Miro.request("POST", "/users", {}, {
					connection: `${service} ${code}`,
					captcha: captchaValue,
					email: signupDialog.form.elements.email.value,
					name: signupDialog.form.elements.name.value,
					birth: signupDialog.form.elements.birth.valueAsNumber
				}).then(resolve);
			};
			grecaptcha.execute();
		});
	};
	const loggedIn = () => {
		location.reload();
	};
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		if(signup) {
			signupDialog = new Miro.dialog("Sign up", signupForm, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]).then(value => {
				if(value === 0) {
					Miro.auth(signup ? "Sign up" : "Log in", signup ? "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up." : "Choose a login method.", signUp, dialogCallback).then(loggedIn);
				}
			});
			if(!signupDialog.form.elements.email.value) {
				signupDialog.form.elements.email.value = loginForm.elements.email.value;
			}
			setTimeout(signupDialog.form.elements.name.focus.bind(signupDialog.form.elements.name));
		} else {
			
		}
	});
})();
