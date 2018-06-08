(() => {
	const loginForm = document.querySelector("#loginForm");
	const submits = loginForm.querySelectorAll("button[type=\"submit\"]");
	const signupForm = document.querySelector("#signupForm");
	let signup = false;
	const loggedIn = () => {
		Miro.formState(loginForm, false);
		if(Miro.in) {
			window.location.href = (Miro.query.dest && Miro.query.dest.startsWith("/")) ? Miro.query.dest : "/";
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
						}).then(Miro.response(() => {
							Miro.in = true;
						})).finally(loggedIn);
					} else {
						new Miro.dialog("Error", "You must complete the CAPTCHA challenge before authenticating.").then(loggedIn);
					}
				} else {
					Miro.logOut();
				}
			});
		} else {
			window.location.reload();
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
	let authDialog;
	let sendAuth;
	const authFailed = data => {
		new Miro.dialog("Error", (data && ((data.response && data.response.error) || data.statusText || data.details || data.error || data)) || "An unknown network error occurred.");
	};
	const clickAuth = auth => {
		return () => {
			Miro.block(true);
			auth().then(code => {
				try {
					sendAuth(auth.name, code).then(Miro.response(req => {
						authDialog.close(-2);
						loggedIn();
					})).finally(() => {
						Miro.block(false);
					});
				} catch(err) {
					throw new MiroError("The `send` parameter must be a promise from `Miro.request`.");
				}
			}).catch(err => {
				Miro.block(false);
				authFailed(err);
			});
		};
	};
	const auths = {
		Google: () => {
			return new Promise((resolve, reject) => {
				gapi.load("auth2", () => {
					gapi.auth2.init().then(auth2 => {
						auth2.signIn().then(user => {
							resolve(user.getAuthResponse().id_token);
						}).catch(reject);
					}).catch(reject);
				});
			});
		},
		Discord: () => {
			return new Promise((resolve, reject) => {
				const win = window.open(`https://discordapp.com/api/oauth2/authorize?client_id=430826805302263818&redirect_uri=${encodeURIComponent(window.location.origin)}%2Flogin%2Fdiscord%2F&response_type=code&scope=identify%20email`, "authDiscord");
				const winClosedPoll = setInterval(() => {
					if(win.closed) {
						clearInterval(winClosedPoll);
						reject("The Discord authentication page was closed.");
					}
				}, 200);
				const receive = evt => {
					if(evt.origin === window.origin) {
						window.removeEventListener("message", receive);
						clearInterval(winClosedPoll);
						const ampIndex = evt.data.indexOf("&");
						if(ampIndex !== -1) {
							evt.data = evt.data.slice(ampIndex);
						}
						if(evt.data.startsWith("code=")) {
							resolve(evt.data.slice(5));
						} else {
							reject(evt.data.slice(evt.data.indexOf("=")+1));
						}
					}
				};
				window.addEventListener("message", receive);
			});
		}
	};
	Miro.auth = (title, message, send) => {
		if(!(typeof message === "string")) {
			throw new MiroError("The `body` parameter must be a string.");
		}
		const body = document.createElement("span");
		for(const v of message.split("\n")) {
			body.appendChild(document.createTextNode(v));
			body.appendChild(document.createElement("br"));
		}
		body.appendChild(document.createElement("br"));
		for(const i of Object.keys(auths)) {
			const button = document.createElement("button");
			button.classList.add("mdc-button");
			button.classList.add("mdc-button--unelevated");
			button.classList.add("spaced");
			button.textContent = i;
			button.addEventListener("click", clickAuth(auths[i]));
			body.appendChild(button);
		}
		new Miro.dialog(title || "Authenticate", body, ["Cancel"]).then(value => {
			if(value !== -2) {
				Miro.formState(loginForm, true);
			}
		});
	};
	loginForm.addEventListener("submit", evt => {
		evt.preventDefault();
		Miro.formState(loginForm, false);
		dialog = Miro.auth(signup ? "Sign up" : "Log in", signup ? "Connect your Miroware account to an external login to secure your account.\nThe option to change or add more connections is available after signing up." : "Choose a login method.", send);
	});
})();
