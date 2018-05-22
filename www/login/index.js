(() => {
	const form = document.querySelector("form");
	const submits = form.querySelectorAll("button[type=\"submit\"]");
	let dialog;
	let signup = false;
	const setSubmit = function() {
		signup = this.id === "signup";
	};
	for(const v of submits) {
		v.addEventListener("click", setSubmit);
	}
	const authFailed = data => {
		new Miro.dialog("Error", (data && ((data.response && data.response.error) || data.statusText || data.details || data.error || data)) || "Unknown", ["Okay"]);
	};
	const send = (service, value) => {
		if(signup) {
			Miro.request("POST", "/users", {}, {
				email: form.email.value,
				service,
				value
			}).then(req => {
				Miro.block(false);
				if(Math.floor(req.status/100) === 2) {
					Miro.formState(form, true);
					dialog.close();
				} else {
					authFailed(req);
				}
			});
		} else {
			
		}
	};
	const clickAuth = auth => {
		return function() {
			Miro.block(true);
			auth().then(value => {
				send(auth.name, value);
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
						reject();
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
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		Miro.formState(form, false);
		const body = document.createElement("span");
		if(signup) {
			body.appendChild(document.createTextNode("Connect your Miroware account to an external login to secure your account."));
			body.appendChild(document.createElement("br"));
			body.appendChild(document.createTextNode("The option to change or add more connections is available after signing up."));
		} else {
			body.appendChild(document.createTextNode("Choose a login method."));
		}
		body.appendChild(document.createElement("br"));
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
		dialog = new Miro.dialog(signup ? "Signup" : "Login", body, ["Cancel"]).then(value => {
			if(value !== 1) {
				Miro.formState(form, true);
			}
		});
	});
})();
