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
	if(!Array.prototype.includes) {
		const includes = function(search, fromIndex) {
			return this.indexOf(search, fromIndex) !== -1;
		};
		Array.prototype.includes = includes;
		if(!String.prototype.includes) {
			String.prototype.includes = includes;
		}
	}
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
			req.responseType = "json";
			req.withCredentials = true;
			req.open(method, url, true);
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
	Miro.block = state => {
		container.classList[state ? "add" : "remove"]("hidden");
	};
	Miro.formState = (form, state) => {
		if(!(form instanceof HTMLFormElement)) {
			throw new MiroError("The `form` parameter must be an HTML form element.");
		}
		state = !state;
		form.setAttribute("disabled", state);
		for(const v of form.elements) {
			v.disabled = state;
		}
		for(const v of ["checkbox", "radio", "select", "slider", "text-field"]) {
			for(const w of form.querySelectorAll(`.mdc-${v}`)) {
				w.classList[state ? "add" : "remove"](`mdc-${v}--disabled`);
			}
		}
	};
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
			dialogElem._dialog = this;
			dialogElem.classList.add("mdc-dialog");
			const surfaceElem = document.createElement("div");
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
				const button = document.createElement("button");
				button.classList.add("mdc-button");
				button.classList.add("mdc-dialog__footer__button");
				button.textContent = buttons[i];
				footerElem.appendChild(button);
				buttons[i] = button;
			}
			surfaceElem.appendChild(footerElem);
			dialogElem.appendChild(surfaceElem);
			const backdropElem = document.createElement("div");
			backdropElem.classList.add("mdc-dialog__backdrop");
			dialogElem.appendChild(backdropElem);
			const dialog = new mdc.dialog.MDCDialog(dialogElem);
			container.appendChild(dialogElem);
			this._promise = new Promise(resolve => {
				const close = value => {
					setTimeout(() => {
						container.removeChild(dialogElem);
					}, 120);
					resolve(value);
				};
				this._close = close;
				const dialogButton = evt => {
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
			this._dialog = dialog;
			this.element = dialogElem;
			this.body = bodyElem;
			this.buttons = buttons;
		}
		then(onFulfilled) {
			this._promise.then(onFulfilled);
			return this;
		}
		finally(onFinally) {
			this._promise.finally(onFinally);
			return this;
		}
		close(value) {
			setTimeout(() => {
				if(this.ready) {
					this._dialog.close();
					this._close(typeof value === "number" ? value : -1);
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
		v._mdc = new mdc.textField.MDCTextField(v);
	}
	for(const v of document.querySelectorAll(".ripple")) {
		v._mdc = new mdc.ripple.MDCRipple(v);
	}
	const userElem = document.querySelector("meta[name=\"user\"]");
	if(userElem) {
		Miro.user = userElem.getAttribute("content");
	}
	const logout = document.querySelector("#logout");
	if(logout) {
		logout.addEventListener("click", () => {
			new Miro.dialog("Log out", "Are you sure you want to log out?", ["Yes", "No"]).then(value => {
				if(value === 0) {
					Miro.request("DELETE", "/session").then(req => {
						if(Math.floor(req.status/100) === 2) {
							window.location.reload();
						} else {
							new Miro.dialog("Error", req.statusText, ["Okay"]);
						}
					});
				}
			});
		});
	}
})();
