(() => {
	window.Miro = {};
	Miro.magic = {};
	Miro.magic.magic = Miro.magic;
	console.log(Miro.magic);
	class MiroError extends Error {
		constructor() {
			const err = super(...arguments);
			err.name = "MiroError";
			return err;
		}
	}
	const doNothing = () => {};
	const container = document.querySelector("#container");
	let rawQuery = location.href;
	const hashIndex = rawQuery.indexOf("#");
	if(hashIndex !== -1) {
		rawQuery = rawQuery.slice(0, hashIndex);
	}
	rawQuery = rawQuery.indexOf("?") !== -1 ? rawQuery.slice(rawQuery.indexOf("?") + 1).split("&") : [];
	Miro.query = {};
	for(const pair of rawQuery) {
		try {
			const param = pair.split("=");
			Miro.query[param[0]] = decodeURIComponent(param[1]);
		} catch(err) {}
	}
	const addTwo = (a, b) => a + b;
	Miro.sum = (...values) => values.reduce(addTwo, 0);
	Miro.average = (...values) => Miro.sum(...values) / values.length;
	Miro.wait = delay => new Promise(resolve => {
		setTimeout(resolve, delay);
	});
	Miro.benchmark = (f, n, data) => {
		if(!(f instanceof Function)) {
			throw new MiroError("The `f` parameter must be a function.");
		}
		data = data instanceof Array ? data : [];
		if(n = isFinite(n) ? Math.abs(n) : 1) {
			let i = 0;
			for(const now = Date.now(); Date.now() - now < 100; f(i++));
			data.push(i);
			return Miro.benchmark(f, n-1, data);
		} else {
			return Miro.average(...data);
		}
	};
	Miro.prepare = node => {
		if(!(node instanceof Element || node instanceof Document)) {
			throw new MiroError("The `node` parameter must be an element or a document.");
		}
		for(const elem of node.querySelectorAll("input[type='email']")) {
			elem.maxLength = 254;
		}
		for(const elem of node.querySelectorAll("button:not([type])")) {
			elem.type = "button";
		}
		for(const elem of node.querySelectorAll(".mdc-ripple:not(.mdc-ripple-upgraded)")) {
			elem._mdc = new mdc.ripple.MDCRipple(elem);
		}
		for(const elem of node.querySelectorAll(".mdc-text-field:not(.mdc-text-field--upgraded)")) {
			elem._mdc = new mdc.textField.MDCTextField(elem);
		}
		for(const elem of node.querySelectorAll(".mdc-select")) {
			elem._mdc = new mdc.select.MDCSelect(elem);
		}
		for(const elem of node.querySelectorAll(".mdc-checkbox:not(.mdc-checkbox--upgraded)")) {
			elem.querySelector(".mdc-checkbox__background").appendChild(checkmark.cloneNode(true));
			elem._mdc = new mdc.checkbox.MDCCheckbox(elem);
		}
		for(const elem of node.querySelectorAll(".mdc-form-field")) {
			elem._mdc = new mdc.formField.MDCFormField(elem);
		}
	};
	const htmlExps = ["$", "&"];
	const htmlReplacements = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/`/g, "&#96;"]];
	window.html = (strs, ...exps) => {
		let str = strs[0];
		for(let i = 0; i < exps.length; i++) {
			let code = String(exps[i]);
			const expIndex = htmlExps.indexOf(strs[i].slice(-1));
			if(expIndex !== -1) {
				str = str.slice(0, -1);
				for(let j = expIndex; j < htmlReplacements.length; j++) {
					code = code.replace(...htmlReplacements[j]);
				}
			}
			str += code + strs[i + 1];
		}
		const elem = document.createElement("span");
		elem.innerHTML = str.trim() || str;
		Miro.prepare(elem);
		return elem.childNodes.length === 1 ? elem.firstChild : elem;
	};
	const checkmark = html`
		<svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
			<path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
		</svg>
	`;
	Miro.block = state => {
		container.classList[state ? "add" : "remove"]("hidden");
	};
	Miro.value = input => {
		if(!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) {
			throw new MiroError("The `input` parameter must be an HTML `input`, `textarea`, or `select` element.");
		}
		return input.type === "checkbox" ? input.checked : (input.type === "date" ? input.valueAsNumber : input.value);
	};
	const mdcTypes = ["checkbox", "radio", "select", "slider", "text-field"];
	Miro.inputState = (input, state) => {
		if(!(input instanceof HTMLInputElement)) {
			throw new MiroError("The `input` parameter must be an HTML `input` element.");
		}
		input.disabled = !state;
		for(const mdcType of mdcTypes) {
			if(input.parentNode.classList.contains(`mdc-${mdcType}`)) {
				input.parentNode.classList[state ? "remove" : "add"](`mdc-${mdcType}--disabled`);
			}
		}
	};
	Miro.formState = (form, state) => {
		if(!(form instanceof HTMLFormElement)) {
			throw new MiroError("The `form` parameter must be an HTML `form` element.");
		}
		state = !state;
		if(form._disabled !== state) {
			form._disabled = state;
			for(const elem of form.elements) {
				if(state) {
					elem._prevDisabled = elem.disabled;
					elem.disabled = true;
				} else if(!elem._prevDisabled) {
					elem.disabled = false;
				}
			}
			for(const mdcType of mdcTypes) {
				const mdcClass = `.mdc-${mdcType}`;
				const disabledClass = `mdc-${mdcType}--disabled`;
				for(const elem of form.querySelectorAll(mdcClass)) {
					if(state) {
						elem._prevDisabled = elem.classList.contains(disabledClass);
						elem.classList.add(disabledClass);
					} else if(!elem._prevDisabled) {
						elem.classList.remove(disabledClass);
					}
				}
			}
		}
	};
	const _dialog = Symbol("dialog");
	const _promise = Symbol("promise");
	const _close = Symbol("close");
	class MiroDialog {
		constructor(title, body, buttons) {
			if(!(typeof title === "string")) {
				throw new MiroError("The `title` parameter must be a string.");
			}
			if(buttons === undefined) {
				buttons = ["Okay"];
			} else if(!(buttons instanceof Array)) {
				throw new MiroError("The `buttons` parameter must be an array if it is defined.");
			}
			if(typeof body === "string") {
				const lines = body.split("\n");
				body = document.createElement("span");
				for(let i = 0; i < lines.length; i++) {
					if(i !== 0) {
						body.appendChild(document.createElement("br"));
					}
					body.appendChild(document.createTextNode(lines[i]));
				}
			} else if(!(body instanceof Node)) {
				throw new MiroError("The `body` parameter must be a string or a DOM node.");
			}
			this.ready = false;
			if(body instanceof HTMLElement) {
				Miro.prepare(body);
			}
			const dialogElem = document.createElement("aside");
			dialogElem[_dialog] = this;
			dialogElem.classList.add("mdc-dialog");
			const surfaceElem = this.form = document.createElement("form");
			surfaceElem.classList.add("mdc-dialog__surface");
			const headerElem = document.createElement("header");
			headerElem.classList.add("mdc-dialog__header");
			const titleElem = document.createElement("h2");
			titleElem.classList.add("mdc-dialog__header__title");
			titleElem.textContent = title;
			headerElem.appendChild(titleElem);
			surfaceElem.appendChild(headerElem);
			const bodyElem = document.createElement("section");
			bodyElem.classList.add("mdc-dialog__body");
			bodyElem.appendChild(body);
			surfaceElem.appendChild(bodyElem);
			const footerElem = document.createElement("footer");
			footerElem.classList.add("mdc-dialog__footer");
			for(let i = 0; i < buttons.length; i++) {
				const item = buttons[i];
				buttons[i] = document.createElement("button");
				if(typeof item === "string") {
					buttons[i].type = "button";
					buttons[i].textContent = item;
				} else if(item instanceof Object) {
					buttons[i].type = item.type;
					buttons[i].textContent = item.text;
				} else {
					throw new MiroError("The `buttons` parameter's array must only include strings and objects.");
				}
				buttons[i].classList.add("mdc-button");
				buttons[i].classList.add("mdc-dialog__footer__button");
				footerElem.appendChild(buttons[i]);
			}
			surfaceElem.appendChild(footerElem);
			dialogElem.appendChild(surfaceElem);
			const backdropElem = document.createElement("div");
			backdropElem.classList.add("mdc-dialog__backdrop");
			dialogElem.appendChild(backdropElem);
			const dialog = new mdc.dialog.MDCDialog(dialogElem);
			container.appendChild(dialogElem);
			this[_promise] = new Promise(resolve => {
				let submitted = false;
				let formState = true;
				if(!(submitted = !footerElem.querySelector("button[type='submit']"))) {
					surfaceElem.addEventListener("submit", evt => {
						evt.preventDefault();
						submitted = true;
						setTimeout(() => {
							formState = !surfaceElem._disabled;
							Miro.formState(surfaceElem, false);
						});
					});
				}
				this.value = null;
				const close = value => {
					this.closed = true;
					this.value = value;
					setTimeout(() => {
						container.removeChild(dialogElem);
						Miro.formState(surfaceElem, formState);
					}, 120);
					resolve(value);
				};
				this[_close] = close;
				const dialogButton = async evt => {
					if(!submitted && evt.target.type === "submit") {
						await Miro.wait();
						if(!submitted) {
							return;
						}
					}
					dialog.close();
					close(buttons.indexOf(evt.target));
				};
				for(const elem of buttons) {
					elem.addEventListener("click", dialogButton);
				}
				dialog.listen("MDCDialog:cancel", () => {
					close(-1);
				});
				setTimeout(() => {
					dialog.show();
					this.ready = true;
				});
			});
			this[_dialog] = dialog;
			this.element = dialogElem;
			this.body = bodyElem;
			this.buttons = buttons;
		}
		then(onFulfilled) {
			this[_promise].then(onFulfilled);
			return this;
		}
		finally(onFinally) {
			this[_promise].finally(onFinally);
			return this;
		}
		close(value) {
			setTimeout(() => {
				if(this.ready) {
					this[_dialog].close();
					this[_close](typeof value === "number" ? value : -1);
					return true;
				} else {
					throw new MiroError("The dialog has not finished instantiating and cannot be closed.");
				}
			});
		}
	}
	Miro.Dialog = MiroDialog;
	const drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector("#drawer"));
	document.querySelector("#menu").addEventListener("click", () => {
		drawer.open = !drawer.open;
	});
	Miro.progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
	const closeProgress = () => {
		Miro.progress.close();
		window.removeEventListener("load", closeProgress);
	};
	window.addEventListener("load", closeProgress);
	const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector("#snackbar"));
	Miro.snackbar = (message, actionText, actionHandler) => {
		const dataObj = {
			message
		};
		if(actionText) {
			dataObj.actionText = actionText;
			dataObj.actionHandler = actionHandler || doNothing;
		}
		snackbar.show(dataObj);
	};
	Miro.response = success => {
		if(success && !(success instanceof Function)) {
			throw new MiroError("The `success` parameter must be a function if it is defined.");
		}
		return async req => {
			if(Math.floor(req.status / 100) === 2) {
				if(success) {
					success(req);
				}
			} else {
				await new Miro.Dialog("Error", (req.response && req.response.error && html`${req.response.error}`) || req.statusText || "An unknown network error occurred.");
			}
		}
	};
	const apiOrigin = location.origin.includes("localhost") ? "http://api.localhost:8081" : "https://api.miroware.io";
	Miro.request = (method, url, headers, body) => {
		method = typeof method === "string" ? method.toUpperCase() : "GET";
		return new Promise(resolve => {
			if(typeof url === "string") {
				url = apiOrigin + (url.startsWith("/") ? "" : "/") + url;
			} else {
				throw new MiroError("The `url` parameter must be a string.");
			}
			Miro.progress.open();
			body = body !== undefined && (body instanceof Object ? body : {});
			headers = headers instanceof Object ? headers : {};
			if(body) {
				headers["Content-Type"] = "application/json";
			} else {
				delete headers["Content-Type"];
			}
			const req = new XMLHttpRequest();
			req.withCredentials = true;
			req.open(method, url, true);
			req.responseType = "json";
			for(const i of Object.keys(headers)) {
				req.setRequestHeader(i, headers[i]);
			}
			req.onreadystatechange = () => {
				if(req.readyState === XMLHttpRequest.DONE) {
					Miro.progress.close();
					resolve(req);
				}
			};
			req.send((body && JSON.stringify(body)) || undefined);
		});
	};
	let authDialog;
	let sendAuth;
	let resolveAuth;
	const authFailed = data => {
		new Miro.Dialog("Error", (data && ((data.response && data.response.error && html`${req.response.error}`) || data.statusText || data.details || data.error || data)) || "An unknown network error occurred.");
	};
	const catchAuth = err => {
		Miro.block(false);
		authFailed(err);
	};
	const closeAndResolveAuth = Miro.response(req => {
		authDialog.close(-2);
		resolveAuth(req);
	});
	const clickAuth = auth => {
		return () => {
			Miro.block(true);
			new Promise(auth).then(code => {
				try {
					Miro.block(false);
					setTimeout(() => {
						sendAuth(auth.name, code).then(closeAndResolveAuth);
					});
				} catch(err) {
					throw new MiroError("The `send` parameter must be a promise (of `Miro.request` or which resolves a `Miro.request`).");
				}
			}).catch(catchAuth);
		};
	};
	const auths = {
		Google: (resolve, reject) => {
			gapi.load("auth2", () => {
				gapi.auth2.init().then(auth2 => {
					auth2.signIn().then(user => {
						resolve(user.getAuthResponse().id_token);
					}).catch(reject);
				}).catch(reject);
			});
		},
		Discord: (resolve, reject) => {
			const win = window.open(`https://discordapp.com/api/oauth2/authorize?client_id=430826805302263818&redirect_uri=${encodeURIComponent(location.origin)}%2Flogin%2Fdiscord%2F&response_type=code&scope=identify%20email`, "authDiscord");
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
						reject(evt.data.slice(evt.data.indexOf("=") + 1));
					}
				}
			};
			window.addEventListener("message", receive);
		}
	};
	Miro.auth = (title, message, send, dialogCallback) => {
		if(!(typeof message === "string")) {
			throw new MiroError("The `message` parameter must be a string.");
		}
		if(!(send instanceof Function)) {
			throw new MiroError("The `send` parameter must be a function.");
		}
		sendAuth = send;
		const body = document.createElement("span");
		for(const part of message.split("\n")) {
			body.appendChild(document.createTextNode(part));
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
		authDialog = new Miro.Dialog(title || "Authenticate", body, ["Cancel"]);
		if(dialogCallback instanceof Function) {
			dialogCallback(authDialog);
		}
		return new Promise(resolve => {
			resolveAuth = resolve;
		});
	};
	const putToken = (service, code) => Miro.request("PUT", "/token", {}, {
		connection: `${service} ${code}`
	});
	Miro.checkSuper = success => {
		if(!(success instanceof Function)) {
			throw new MiroError("The `success` parameter must be a function.");
		}
		Miro.request("GET", "/token").then(Miro.response(req => {
			if(req.response.super) {
				success(req);
			} else {
				Miro.auth("Security", "You must confirm the validity of your credentials before continuing.", putToken).then(success);
			}
		}));
	};
	const userMeta = document.querySelector("meta[name='user']");
	if(userMeta && (Miro.user = JSON.parse(userMeta.getAttribute("content")))) {
		Miro.logOut = () => Miro.request("DELETE", "/token").then(Miro.response(location.reload.bind(location)));
		const checkLogout = value => {
			if(value === 0) {
				Miro.logOut();
			}
		};
		document.querySelector("#logOut").addEventListener("click", () => {
			new Miro.Dialog("Log Out", "Are you sure you want to log out?", ["Yes", "No"]).then(checkLogout);
		});
	} else {
		Miro.logIn = () => {
			location.href = `/login/?dest=${encodeURIComponent(location.href.slice(location.href.indexOf("/", location.href.indexOf("//") + 2)))}`;
		};
	}
	Miro.prepare(document);
})();