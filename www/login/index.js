(() => {
	const form = document.querySelector("form");
	const submits = form.querySelectorAll("button[type=\"submit\"]");
	let signup = false;
	const setSubmit = function() {
		signup = this.id === "signup";
	};
	for(const v of submits) {
		v.addEventListener("click", setSubmit);
	}
	const send = (service, value) => {
		console.log(service, value);
		form._enable(); // TODO: after being sent
	};
	const clickAuth = auth => {
		return function() {
			Miro.block(true);
			auth().then(value => {
				this.parentNode.parentNode.parentNode.parentNode._dialog.close(1);
				send(auth.name, value);
			}).catch(() => {
				new Miro.snackbar("Authentication failed", "Okay");
			}).finally(() => {
				Miro.block(false);
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
						}).catch(console.log);
					});
				});
			});
		},
		Discord: () => {
			return new Promise((resolve, reject) => {
				const win = window.open(`https://discordapp.com/api/oauth2/authorize?client_id=430826805302263818&redirect_uri=${encodeURIComponent(window.location.origin)}%2Flogin%2Fdiscord%2F&response_type=code&scope=email%20identify%20connections`, "authDiscord");
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
						resolve(evt.data);
					}
				};
				window.addEventListener("message", receive);
			});
		}
	};
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		form._disable();
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
		new Miro.dialog(signup ? "Signup" : "Login", body, ["Cancel"]).then(value => {
			if(value !== 1) {
				form._enable();
			}
		});
	});
})();
