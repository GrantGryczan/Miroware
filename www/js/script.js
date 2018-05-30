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
		let elem = document.createElement("span");
		elem.innerHTML = string;
		if(elem.children.length === 1) {
			elem = elem.firstChild;
		}
		return elem;
	};
	Miro.block = state => {
		container.classList[state ? "add" : "remove"]("hidden");
	};
	const mdcTypes = ["checkbox", "radio", "select", "slider", "text-field"];
	const _disabled = Symbol("disabled");
	const _prevDisabled = Symbol("prevDisabled");
	Miro.formState = (form, state) => {
		if(!(form instanceof HTMLFormElement)) {
			throw new MiroError("The `form` parameter must be an HTML form element.");
		}
		state = !state;
		if(form[_disabled] !== state) {
			form.setAttribute("disabled", form[_disabled] = state);
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
	for(const v of document.querySelectorAll("input[type=\"email\"]")) {
		v.maxLength = 254;
	}
	for(const v of document.querySelectorAll("form button:not([type])")) {
		v.type = "button";
	}
	const _dialog = Symbol("dialog");
	const _promise = Symbol("promise");
	const _close = Symbol("close");
	class MiroDialog {
		constructor(title, body, buttons) {
			if(!(typeof title === "string")) {
				throw new MiroError("The `title` parameter must be a string.");
			}
			if(!(buttons instanceof Array)) {
				throw new MiroError("The `buttons` parameter must be an array.");
			}
			if(typeof body === "string") {
				body = document.createTextNode(body);
			} else if(!(body instanceof Node)) {
				throw new MiroError("The `body` parameter must be a string or a DOM node.");
			}
			this.ready = false;
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
							surfaceElem.getAttribute("disabled");
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
	const drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-drawer--temporary"));
	document.querySelector("#menu").addEventListener("click", () => {
		drawer.open = !drawer.open;
	});
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
	for(const v of document.querySelectorAll(".mdc-text-field")) {
		new mdc.textField.MDCTextField(v);
	}
	for(const v of document.querySelectorAll(".ripple")) {
		new mdc.ripple.MDCRipple(v);
	}
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
				await new Miro.dialog("Error", (req.response && req.response.error) || req.statusText, ["Okay"]);
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
					(status === 0 ? reject : resolve)(req);
				}
			};
			req.send(body && JSON.stringify(body));
		});
	};
	const _prevValue = Symbol("prevValue");
	const _closeField = Symbol("closeField");
	const _saveField = Symbol("saveField");
	const editField = function() {
		this.parentNode.classList.add("hidden");
		this.form[_saveField].disabled = true;
		this.parentNode.nextSibling.classList.remove("hidden");
		this.form._input.disabled = false;
		this.form._input.parentNode.classList.remove("mdc-text-field--disabled");
		this.form[_prevValue] = this.form._input.value;
		this.form._input.focus();
		const prevType = this.form._input.type;
		this.form._input.type = "text";
		const cursorPos = String(this.form._input.value).length;
		this.form._input.setSelectionRange(cursorPos, cursorPos);
		this.form._input.type = prevType;
	};
	const closeField = function() {
		this.parentNode.classList.add("hidden");
		this.parentNode.previousSibling.classList.remove("hidden");
		this.form._input.disabled = true;
		this.form._input.parentNode.classList.add("mdc-text-field--disabled");
		this.form._input.value = this.form[_prevValue];
	};
	const inputField = function(evt) {
		this.form[_saveField].disabled = !this.checkValidity() || this.value === this.form[_prevValue];
	};
	const keyField = function(evt) {
		if(evt.keyCode === 27) {
			this.form[_closeField].click();
		}
	};
	const submitField = function(evt) {
		evt.preventDefault();
		Miro.formState(this, false);
		Miro.request("PUT", this._resource, {}, this._getData()).then(Miro.response(() => {
			setTimeout(() => {
				this[_saveField].parentNode.classList.add("hidden");
				this[_saveField].parentNode.previousSibling.classList.remove("hidden");
				this._input.disabled = true;
				this._input.parentNode.classList.add("mdc-text-field--disabled");
			});
		})).finally(() => {
			Miro.formState(this, true);
		});
	};
	const editOptions = html`
		<span class="editoptions">
			<button class="mdc-fab mdc-fab--mini material-icons editfield">
				<span class="mdc-fab__icon">edit</span>
			</button>
		</span><span class="editoptions hidden">
			<button class="mdc-fab mdc-fab--mini material-icons closefield">
				<span class="mdc-fab__icon">close</span>
			</button><button class="mdc-fab mdc-fab--mini material-icons savefield" type="submit" disabled>
				<span class="mdc-fab__icon">check</span>
			</button>
		</span>
	`;
	for(const v of document.querySelectorAll(".field:not(.noedit)")) {
		(v._input = v.querySelector("input")).addEventListener("input", inputField);
		v.insertBefore(editOptions.cloneNode(true), v._input.parentNode.nextSibling);
		v.querySelector(".editfield").addEventListener("click", editField);
		(v[_closeField] = v.querySelector(".closefield")).addEventListener("click", closeField);
		v[_saveField] = v.querySelector(".savefield");
		v._input.addEventListener("keydown", keyField);
		v.addEventListener("submit", submitField);
	}
	Miro.logOut = () => Miro.request("DELETE", "/session").then(Miro.response(() => {
		window.location.reload();
	}));
	if((Miro.in = JSON.parse(document.querySelector("meta[name=\"in\"]").getAttribute("content"))) !== null) {
		Miro.user = document.querySelector("meta[name=\"user\"]").getAttribute("content");
		if(Miro.in) {
			document.querySelector("#logout").addEventListener("click", () => {
				new Miro.dialog("Log out", "Are you sure you want to log out?", ["Yes", "No"]).then(value => {
					if(value === 0) {
						Miro.logOut();
					}
				});
			});
		}
	}
})();
