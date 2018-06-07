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
	let rawQuery;
	if(location.href.indexOf("#") !== -1) {
		rawQuery = location.href.slice(0, location.href.indexOf("#"));
	} else {
		rawQuery = location.href;
	}
	if(rawQuery.indexOf("?") !== -1) {
		rawQuery = rawQuery.slice(rawQuery.indexOf("?")+1).split("&");
	} else {
		rawQuery = [];
	}
	Miro.query = {};
	for(const v of rawQuery) {
		try {
			const param = v.split("=");
			Miro.query[param[0]] = decodeURIComponent(param[1]);
		} catch(err) {}
	}
	Miro.wait = delay => {
		return new Promise(resolve => {
			setTimeout(resolve, delay);
		});
	};
	Miro.prepare = node => {
		if(!(node instanceof Element || node instanceof Document)) {
			throw new MiroError("The `node` parameter must be an element or a document.");
		}
		for(const v of node.querySelectorAll("input[type=\"email\"]")) {
			v.maxLength = 254;
		}
		for(const v of node.querySelectorAll("button:not([type])")) {
			v.type = "button";
		}
		for(const v of node.querySelectorAll(".mdc-ripple:not(.mdc-ripple-upgraded)")) {
			new mdc.ripple.MDCRipple(v);
		}
		for(const v of node.querySelectorAll(".mdc-text-field:not(.mdc-text-field--upgraded)")) {
			new mdc.textField.MDCTextField(v);
		}
		for(const v of node.querySelectorAll(".mdc-checkbox")) {
			v.querySelector(".mdc-checkbox__background").appendChild(checkmark.cloneNode(true));
			new mdc.checkbox.MDCCheckbox(v);
		}
		for(const v of node.querySelectorAll(".mdc-form-field")) {
			new mdc.formField.MDCFormField(v);
		}
	};
	const htmlExps = ["$", "&"];
	const htmlReplacements = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/`/g, "&#96;"]];
	window.html = function() {
		let string = arguments[0][0];
		const exps = arguments.length-1;
		for(let i = 0; i < exps; i++) {
			let code = String(arguments[i+1]);
			const expIndex = htmlExps.indexOf(arguments[0][i].slice(-1));
			if(expIndex !== -1) {
				string = string.slice(0, -1);
				for(let j = expIndex; j < htmlReplacements.length; j++) {
					code = code.replace(...htmlReplacements[j]);
				}
			}
			string += code + arguments[0][i+1];
		}
		const elem = document.createElement("span");
		elem.innerHTML = string.trim() || string;
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
		if(!(input instanceof HTMLInputElement)) {
			throw new MiroError("The `input` parameter must be an HTML input element.");
		}
		return input.type === "checkbox" ? input.checked : (input.type === "date" ? input.valueAsNumber : input.value);
	};
	const mdcTypes = ["checkbox", "radio", "select", "slider", "text-field"];
	Miro.inputState = (input, state) => {
		if(!(input instanceof HTMLInputElement)) {
			throw new MiroError("The `input` parameter must be an HTML input element.");
		}
		input.disabled = !state;
		for(const v of mdcTypes) {
			if(input.parentNode.classList.contains(`mdc-${v}`)) {
				const disabledClass = `mdc-${v}--disabled`;
				input.parentNode.classList[state ? "remove" : "add"](disabledClass);
			}
		}
	};
	const _disabled = Symbol("disabled");
	const _prevDisabled = Symbol("prevDisabled");
	Miro.formState = (form, state) => {
		if(!(form instanceof HTMLFormElement)) {
			throw new MiroError("The `form` parameter must be an HTML form element.");
		}
		state = !state;
		if(form[_disabled] !== state) {
			form[_disabled] = state;
			for(const v of form.elements) {
				if(state) {
					v[_prevDisabled] = v.disabled;
					v.disabled = true;
				} else if(!v[_prevDisabled]) {
					v.disabled = false;
				}
			}
			for(const v of mdcTypes) {
				const mdcClass = `.mdc-${v}`;
				const disabledClass = `mdc-${v}--disabled`;
				for(const w of form.querySelectorAll(mdcClass)) {
					if(state) {
						w[_prevDisabled] = w.classList.contains(disabledClass);
						w.classList.add(disabledClass);
					} else if(!w[_prevDisabled]) {
						w.classList.remove(disabledClass);
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
				body = document.createTextNode(body);
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
				if(!(submitted = !footerElem.querySelector("button[type=\"submit\"]"))) {
					surfaceElem.addEventListener("submit", evt => {
						evt.preventDefault();
						submitted = true;
						setTimeout(() => {
							formState = !surfaceElem[_disabled];
							Miro.formState(surfaceElem, false);
						});
					});
				}
				const close = value => {
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
				for(const v of buttons) {
					v.addEventListener("click", dialogButton);
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
				} else {
					throw new MiroError("The dialog has not finished instantiating and cannot be closed.");
				}
			});
		}
	}
	Miro.dialog = MiroDialog;
	const drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector("#drawer"));
	document.querySelector("#menu").addEventListener("click", () => {
		drawer.open = !drawer.open;
	});
	const progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
	window.addEventListener("load", progress.open);
	window.addEventListener("unload", progress.close);
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
			if(Math.floor(req.status/100) === 2) {
				if(success) {
					success(req);
				}
			} else {
				await new Miro.dialog("Error", (req.response && req.response.error) || req.statusText || "An unknown network error occurred.");
			}
		}
	};
	const apiOrigin = window.location.origin.includes("localhost") ? "http://api.localhost:8081" : "https://api.miroware.io";
	Miro.request = (method, url, headers, body) => {
		return new Promise((resolve, reject) => {
			method = typeof method === "string" ? method.toUpperCase() : "GET";
			if(typeof url === "string") {
				url = apiOrigin + (url.startsWith("/") ? "" : "/") + url;
			} else {
				throw new MiroError("The `url` parameter must be a string.");
			}
			progress.open();
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
					progress.close();
					(status === 0 ? reject : resolve)(req);
				}
			};
			req.send(body && JSON.stringify(body));
		});
	};
	Miro.logOut = () => Miro.request("DELETE", "/token").then(Miro.response(() => {
		window.location.reload();
	}));
	if(Miro.in = JSON.parse(document.querySelector("meta[name=\"in\"]").getAttribute("content"))) {
		document.querySelector("#logOut").addEventListener("click", () => {
			new Miro.dialog("Log out", "Are you sure you want to log out?", ["Yes", "No"]).then(value => {
				if(value === 0) {
					Miro.logOut();
				}
			});
		});
	}
	Miro.prepare(document);
})();
