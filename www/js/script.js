const Miro = window.Miro = {};
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
const container = document.body.querySelector("#container");
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
const inputDate = function() {
	if(this.value) {
		const date = new Date(this.value);
		this.parentNode.nextSibling.textContent = date;
		this.setCustomValidity(isNaN(date) ? date : "");
	} else {
		this.parentNode.nextSibling.textContent = "";
		this.setCustomValidity("");
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
		elem._mdc = mdc.ripple.MDCRipple.attachTo(elem);
	}
	for(const elem of node.querySelectorAll(".mdc-text-field:not(.mdc-text-field-upgraded)")) {
		elem._mdc = mdc.textField.MDCTextField.attachTo(elem);
	}
	for(const elem of node.querySelectorAll(".mdc-select")) {
		elem._mdc = mdc.select.MDCSelect.attachTo(elem);
	}
	for(const elem of node.querySelectorAll(".mdc-checkbox:not(.mdc-checkbox-upgraded)")) {
		elem.querySelector(".mdc-checkbox__background").appendChild(checkmark.cloneNode(true));
		elem._mdc = mdc.checkbox.MDCCheckbox.attachTo(elem);
	}
	for(const elem of node.querySelectorAll(".mdc-form-field")) {
		elem._mdc = mdc.formField.MDCFormField.attachTo(elem);
	}
	for(const elem of node.querySelectorAll("input[data-type='date']")) {
		elem.addEventListener("input", inputDate);
		inputDate.call(elem);
	}
};
const htmlReplacements = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/`/g, "&#96;"]];
const html = window.html = (strs, ...exps) => {
	let str = strs[0];
	for(let i = 0; i < exps.length; i++) {
		let code = String(exps[i]);
		if(strs[i].slice(-1) === "$") {
			str = str.slice(0, -1);
			code = html.escape(code);
		}
		str += code + strs[i + 1];
	}
	const elem = document.createElement("span");
	elem.innerHTML = str.trim() || str;
	Miro.prepare(elem);
	return elem.childNodes.length === 1 ? elem.firstChild : elem;
};
html.escape = code => {
	if(typeof code !== "string") {
		throw new MiroError("The `code` parameter must be a string.");
	}
	for(const htmlReplacement of htmlReplacements) {
		code = code.replace(...htmlReplacement);
	}
	return code;
};
Miro.block = state => {
	container.classList[state ? "add" : "remove"]("hidden");
};
Miro.value = input => {
	if(!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) {
		throw new MiroError("The `input` parameter must be an HTML `input`, `textarea`, or `select` element.");
	}
	return input.type === "checkbox" ? input.checked : (input.getAttribute("data-type") === "date" ? +new Date(input.value) : input.value);
};
const mdcTypes = ["checkbox", "radio", "select", "slider", "text-field"];
const checkmark = html`
	<svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
		<path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59">
	</svg>
`;
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
Miro.reload = () => location.reload();
const _dialog = Symbol("dialog");
const _promise = Symbol("promise");
const _close = Symbol("close");
class MiroDialog {
	constructor(title, content, buttons) {
		if(!(typeof title === "string")) {
			throw new MiroError("The `title` parameter must be a string.");
		}
		if(buttons === undefined) {
			buttons = ["Okay"];
		} else if(!(buttons instanceof Array)) {
			throw new MiroError("The `buttons` parameter must be an array if it is defined.");
		}
		if(typeof content === "string") {
			const lines = content.split("\n");
			content = document.createElement("span");
			for(let i = 0; i < lines.length; i++) {
				if(i !== 0) {
					content.appendChild(document.createElement("br"));
				}
				content.appendChild(document.createTextNode(lines[i]));
			}
		} else if(!(content instanceof Node)) {
			throw new MiroError("The `content` parameter must be a string or a DOM node.");
		}
		this.ready = false;
		if(content instanceof HTMLElement) {
			Miro.prepare(content);
		}
		const dialogElem = html`
			<div class="mdc-dialog">
				<div class="mdc-dialog__container">
					<form class="mdc-dialog__surface">
						<h2 class="mdc-dialog__title">$${title}</h2>
						<div class="mdc-dialog__content"></div>
						<div class="mdc-dialog__actions"></div>
					</form>
				</div>
				<div class="mdc-dialog__scrim"></div>
			</div>
		`;
		dialogElem[_dialog] = this;
		const form = this.form = dialogElem.querySelector("form");
		const contentElem = dialogElem.querySelector(".mdc-dialog__content");
		contentElem.appendChild(content);
		const buttonsElem = dialogElem.querySelector(".mdc-dialog__actions");
		if(buttons.length) {
			buttons = buttons.map(item => {
				const button = document.createElement("button");
				if(typeof item === "string") {
					button.type = "button";
					button.textContent = item;
				} else if(item instanceof Object) {
					button.type = item.type;
					button.textContent = item.text;
				} else {
					throw new MiroError("The `buttons` parameter's array must only include strings and objects.");
				}
				button.classList.add("mdc-button");
				button.classList.add("mdc-dialog__button");
				buttonsElem.appendChild(button);
				return button;
			});
		}
		container.appendChild(dialogElem);
		const dialog = mdc.dialog.MDCDialog.attachTo(dialogElem);
		this[_promise] = new Promise(resolve => {
			let submitted = false;
			let formState = true;
			form.addEventListener("submit", (submitted = !buttonsElem.querySelector("button[type='submit']")) ? evt => {
				evt.preventDefault();
			} : evt => {
				evt.preventDefault();
				submitted = true;
				setTimeout(() => {
					formState = !form._disabled;
					Miro.formState(form, false);
				});
			});
			let canClose = true;
			this.value = null;
			const close = this[_close] = value => {
				if(canClose) {
					canClose = false;
					this.value = value;
					dialog.close();
					Miro.formState(form, formState);
					resolve(value);
				}
			};
			const click = async evt => {
				if(!submitted && evt.target.type === "submit") {
					await Miro.wait();
					if(!submitted) {
						return;
					}
				}
				close(buttons.indexOf(evt.target));
			};
			for(const elem of buttons) {
				elem.addEventListener("click", click);
			}
			dialog.listen("MDCDialog:closing", close.bind(this, -1));
			dialog.listen("MDCDialog:closed", () => {
				container.removeChild(dialogElem);
			});
			setTimeout(() => {
				dialog.open();
				this.ready = true;
			});
		});
		this[_dialog] = dialog;
		this.element = dialogElem;
		this.content = contentElem;
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
				this[_close](typeof value === "number" ? value : -1);
				return true;
			} else {
				throw new MiroError("The dialog has not finished instantiating and cannot be closed.");
			}
		});
	}
}
Miro.Dialog = MiroDialog;
const drawer = mdc.drawer.MDCDrawer.attachTo(container.querySelector("#drawer"));
container.querySelector("#menu").addEventListener("click", () => {
	drawer.open = !drawer.open;
});
Miro.progress = mdc.linearProgress.MDCLinearProgress.attachTo(container.querySelector(".mdc-linear-progress"));
const closeProgress = () => {
	Miro.progress.close();
	window.removeEventListener("load", closeProgress);
};
window.addEventListener("load", closeProgress);
const snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.body.querySelector("#snackbar"));
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
Miro.response = (success, failure) => async xhr => {
	if(Math.floor(xhr.status / 100) === 2) {
		if(success instanceof Function) {
			success(xhr);
		}
	} else if(!xhr._aborted) {
		const error = (xhr.response && xhr.response.error && html`${xhr.response.error}`) || xhr.statusText || "An unknown error occurred.";
		if(failure instanceof Function) {
			failure(xhr, error);
		}
		await new Miro.Dialog("Error", error);
	}
};
const apiOrigin = location.origin.includes("localhost") ? "http://api.localhost:8081" : "https://api.miroware.io";
let loadingRequests = 0;
Miro.request = (method, url, headers, body, beforeOpen, noProgress) => {
	method = typeof method === "string" ? method.toUpperCase() : "GET";
	const request = new Promise(resolve => {
		if(typeof url === "string") {
			url = apiOrigin + (url.startsWith("/") ? "" : "/") + url;
		} else {
			throw new MiroError("The `url` parameter must be a string.");
		}
		const progress = !noProgress;
		if(progress) {
			loadingRequests++;
			Miro.progress.open();
		}
		headers = headers instanceof Object ? headers : {};
		if(body instanceof Object && !headers["Content-Type"]) {
			headers["Content-Type"] = "application/json";
		}
		const xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		if(typeof beforeOpen === "function") {
			beforeOpen(xhr);
		}
		xhr.open(method, url, true);
		xhr.responseType = "text";
		for(const header of Object.keys(headers)) {
			xhr.setRequestHeader(header, headers[header]);
		}
		xhr.addEventListener("abort", () => {
			xhr._aborted = true;
		});
		xhr.addEventListener("readystatechange", () => {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(progress && !--loadingRequests) {
					Miro.progress.close();
				}
				if(xhr.response) {
					const response = JSON.parse(xhr.response);
					Object.defineProperty(xhr, "response", {
						get: () => response
					});
				}
				resolve(xhr);
			}
		});
		xhr.send((body && (headers["Content-Type"] === "application/json" ? JSON.stringify(body) : body)) || undefined);
	});
	return request;
};
let authDialog;
let sendAuth;
let resolveAuth;
const authFailed = data => {
	if(data) {
		new Miro.Dialog("Error", (data.response && data.response.error && html`${xhr.response.error}`) || data.statusText || data.details || data.error || data);
	}
};
const catchAuth = err => {
	Miro.block(false);
	authFailed(err);
};
const closeAndResolveAuth = Miro.response(xhr => {
	authDialog.close(-2);
	resolveAuth(xhr);
});
const clickAuth = service => function() {
	const notPassword = service !== "password";
	if(notPassword) {
		Miro.block(true);
	}
	new Promise(auths[service].bind(this)).then(code => {
		try {
			if(notPassword) {
				Miro.block(false);
			}
			setTimeout(() => {
				sendAuth(service, code).then(closeAndResolveAuth);
			});
		} catch(err) {
			throw new MiroError("The `send` parameter must be a promise (of `Miro.request` or which resolves a `Miro.request`).");
		}
	}).catch(catchAuth);
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
	},
	password: async function(resolve, reject) {
		const creation = this === true;
		const content = html`
			Enter ${creation ? "a secure" : "your"} password.<br>
			<div class="mdc-text-field">
				<input id="password" name="password" class="mdc-text-field__input" type="password" minlength="10" autocomplete="${creation ? "new" : "current"}-password" required>
				<label class="mdc-floating-label" for="password">Password</label>
				<div class="mdc-line-ripple"></div>
			</div>
		`;
		if(creation) {
			content.appendChild(html`
				<br>
				<div class="mdc-text-field">
					<input id="confirmPassword" name="confirmPassword" class="mdc-text-field__input" type="password" minlength="10" autocomplete="current-password" required>
					<label class="mdc-floating-label" for="confirmPassword">Confirm password</label>
					<div class="mdc-line-ripple"></div>
				</div>
			`);
		}
		const email = container.querySelector("#email2, #email");
		if(email) {
			content.appendChild(html`<input name="email" class="hidden" type="email" value="$${email.value}" autocomplete="email">`);
		}
		const dialog = new Miro.Dialog("Password", content, [{
			text: "Okay",
			type: "submit"
		}, "Cancel"]).then(value => {
			if(value === 0) {
				if(!creation || dialog.form.elements.password.value === dialog.form.elements.confirmPassword.value) {
					resolve(dialog.form.elements.password.value);
				} else {
					reject("The passwords do not match.");
				}
			} else {
				reject();
			}
		});
	}
};
Miro.auth = function(title, message, send, dialogCallback, creation) {
	if(!(typeof message === "string")) {
		throw new MiroError("The `message` parameter must be a string.");
	}
	if(!(send instanceof Function)) {
		throw new MiroError("The `send` parameter must be a function.");
	}
	sendAuth = send;
	const content = document.createElement("span");
	for(const part of message.split("\n")) {
		content.appendChild(document.createTextNode(part));
		content.appendChild(document.createElement("br"));
	}
	content.appendChild(document.createElement("br"));
	for(const service of Object.keys(auths)) {
		const button = document.createElement("button");
		button.classList.add("mdc-button");
		button.classList.add("mdc-button--unelevated");
		button.classList.add("spaced");
		button.textContent = service;
		button.addEventListener("click", clickAuth(service).bind(creation));
		content.appendChild(button);
	}
	authDialog = new Miro.Dialog(title || "Authenticate", content, ["Cancel"]);
	if(dialogCallback instanceof Function) {
		dialogCallback(authDialog);
	}
	return new Promise(resolve => {
		resolveAuth = resolve;
	});
};
const putToken = (service, code) => Miro.request("PUT", "/token", {}, {
	connection: `${service} ${btoa(code)}`
});
Miro.checkSuper = success => {
	if(!(success instanceof Function)) {
		throw new MiroError("The `success` parameter must be a function.");
	}
	Miro.request("GET", "/token").then(Miro.response(xhr => {
		if(xhr.response.super) {
			success(xhr);
		} else {
			Miro.auth("Security", "You must confirm the validity of your credentials before continuing.", putToken).then(success);
		}
	}));
};
if(Miro.in = JSON.parse(document.head.querySelector("meta[name='in']").getAttribute("content"))) {
	Miro.logOut = () => Miro.request("DELETE", "/token").then(Miro.response(Miro.reload));
	const checkLogout = value => {
		if(value === 0) {
			Miro.logOut();
		}
	};
	container.querySelector("#logOut").addEventListener("click", () => {
		new Miro.Dialog("Logout", "Are you sure you want to log out?", ["Yes", "No"]).then(checkLogout);
	});
} else {
	Miro.logIn = dest => {
		location.href = `/login/?dest=${encodeURIComponent(dest || location.href.slice(location.href.indexOf("/", location.href.indexOf("//") + 2)))}`;
	};
}
Miro.data = JSON.parse(document.head.querySelector("meta[name='data']").getAttribute("content"));
Miro.focused = () => !(drawer.open || container.querySelector(".mdc-dialog"));
Miro.typing = () => container.querySelector("input:not([type='button']):not([type='submit']):not([type='reset']):focus, textarea:focus");
Miro.prepare(document);
