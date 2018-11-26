"use strict";
const loginForm = document.body.querySelector("#loginForm");
const submits = loginForm.querySelectorAll("button[type='submit']");
const signupForm = document.body.querySelector("#signupForm");
const captchaElem = document.body.querySelector(".g-recaptcha");
let signup = false;
const setSubmit = evt => {
	signup = evt.target.name === "signup";
};
for(const input of submits) {
	input.addEventListener("click", setSubmit);
}
const forgot = html`<a class="transparent" href="javascript:;">Forgot your login? Click here.</a>`;
forgot.addEventListener("click", () => {
	new Miro.Dialog("Forgot Login", html`
		Are you sure you want to send a new password connection to <b>$${loginForm.elements.email.value}</b>?<br>
		The password will be automatically disconnected once you use it. No other connections will be removed or created, and you would have to update the connections in your account settings manually not to forget your login again.
	`, ["Yes", "No"]).then(value => {
		if(value === 0) {
			Miro.request("POST", "/forgotten_login", {}, {
				email: loginForm.elements.email.value
			}).then(Miro.response(() => {
				new Miro.Dialog("Forgot Login", "An email with a temporary password connection has been sent.");
			}));
		}
	});
});
const enableFormOnAuthCancel = value => {
	if(value !== -2) {
		Miro.formState(loginForm, true);
	}
};
const dialogCallback = dialog => {
	dialog.body.appendChild(document.createElement("br"));
	dialog.body.appendChild(document.createElement("br"));
	dialog.body.appendChild(signup ? captchaElem : forgot);
	dialog.then(enableFormOnAuthCancel);
};
let signupDialog;
const captchaCallbacks = [];
window.captchaCallback = response => {
	captchaCallbacks.shift()(response);
	grecaptcha.reset();
	if(captchaCallbacks.length) {
		grecaptcha.execute();
	}
};
const executeCaptcha = resolve => {
	captchaCallbacks.push(resolve);
	grecaptcha.execute();
};
const signUp = async (service, code) => Miro.request("POST", "/users", {
	"X-Captcha": await new Promise(executeCaptcha)
}, {
	connection: `${service} ${code}`,
	email: signupDialog.form.elements.email.value,
	name: signupDialog.form.elements.name.value,
	birth: signupDialog.form.elements.birth.valueAsNumber
});
const logIn = async (service, code) => Miro.request("POST", "/token", {}, {
	connection: `${service} ${code}`,
	email: loginForm.elements.email.value
});
const loggedIn = location.reload.bind(location, false);
loginForm.addEventListener("submit", evt => {
	evt.preventDefault();
	Miro.formState(loginForm, false);
	if(signup) {
		signupDialog = new Miro.Dialog("Signup", signupForm, [{
			text: "Okay",
			type: "submit"
		}, "Cancel"]).then(value => {
			if(value === 0) {
				Miro.auth("Signup", "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up.", signUp, dialogCallback, true).then(loggedIn);
			} else {
				Miro.formState(loginForm, true);
			}
		});
		signupDialog.form.elements.email.value = loginForm.elements.email.value;
		signupDialog.form.elements.email.labels[0].classList.add("mdc-floating-label--float-above");
		setTimeout(signupDialog.form.elements.name.focus.bind(signupDialog.form.elements.name));
	} else {
		Miro.auth("Login", "Choose a login method.", logIn, dialogCallback).then(loggedIn);
	}
});
