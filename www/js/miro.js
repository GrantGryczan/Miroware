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
	HTMLFormElement.prototype.disable = function() {
		this.setAttribute("disabled", true);
		for(const v of this.elements) {
			v.disabled = true;
		}
		for(const v of ["checkbox", "radio", "select", "slider", "text-field"]) {
			for(const w of this.querySelectorAll(`.mdc-${v}`)) {
				w.classList.add(`mdc-${v}--disabled`);
			}
		}
	};
	HTMLFormElement.prototype.enable = function() {
		this.removeAttribute("disabled");
		for(const v of this.elements) {
			v.disabled = false;
		}
		for(const v of ["checkbox", "radio", "select", "slider", "text-field"]) {
			for(const w of this.querySelectorAll(`.mdc-${v}`)) {
				w.classList.remove(`mdc-${v}--disabled`);
			}
		}
	};
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
			const p = v.split("=");
			Miro.query[p[0]] = decodeURIComponent(p[1]);
		} catch(err) {}
	}
	Miro.request = (method, url, data, headers, success, error, noMagic) => {
		data = data || {};
		headers = headers || {};
		const req = new XMLHttpRequest();
		req.open(method, url, true);
		for(const i of Object.keys(headers)) {
			req.setRequestHeader(i, headers[i]);
		}
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.onreadystatechange = function() {
			if(req.readyState === XMLHttpRequest.DONE && req.status) {
				statusType = Math.floor(req.status/100);
				if(noMagic || req.getResponseHeader("X-Magic") === "real") {
					if(statusType === 2) {
						if(typeof success === "function") {
							success(req.responseText);
						}
					} else if(statusType === 4 || statusType === 5) {
						if(typeof error === "function") {
							error(req.status);
						}
					}
				} else if(typeof error === "function") {
					error(req.status);
				}
			}
		};
		let formData = "";
		for(const i of Object.keys(data)) {
			formData += `${(formData ? "&" : "") + encodeURIComponent(i)}=${encodeURIComponent(data[i])}`;
		}
		req.send(formData);
	};
	Miro.dialog = (title, body, buttons) => {
		if(!(typeof title === "string")) {
			throw new MiroError("The `title` parameter must be a string.");
		}
		if(!(buttons instanceof Array)) {
			throw new MiroError("The `buttons` parameter must be an array.");
		}
		if(typeof body === "string") {
			body = document.createTextNode(body);
		} else if(!(body instanceof Node)) {
			throw new MiroError("The `body` parameter must be a string or a node.");
		}
		return new Promise((resolve, reject) => {
			let dialog;
			const dialogButton = evt => {
				dialog.close();
				resolve(evt.target._index);
			};
			const dialogElem = document.createElement("aside");
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
				if(i === 0) {
					button.classList.add("mdc-button--raised");
				}
				button._index = i;
				button.textContent = buttons[i];
				button.addEventListener("click", dialogButton);
				footerElem.appendChild(button);
			}
			surfaceElem.appendChild(footerElem);
			dialogElem.appendChild(surfaceElem);
			const backdropElem = document.createElement("div");
			backdropElem.classList.add("mdc-dialog__backdrop");
			dialogElem.appendChild(backdropElem);
			dialog = new mdc.dialog.MDCDialog(dialogElem);
			document.body.appendChild(dialogElem);
			dialog.listen("MDCDialog:cancel", () => {
				resolve(-1);
			});
			dialog.show();
		});
	};
	const drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-drawer--temporary"));
	document.querySelector("#menu").addEventListener("click", () => {
		drawer.open = true;
	});
	for(const v of document.querySelectorAll(".mdc-text-field")) {
		v._mdc = new mdc.textField.MDCTextField(v);
	}
	for(const v of document.querySelectorAll(".mdc-snackbar")) {
		v._mdc = new mdc.snackbar.MDCSnackbar(v);
	}
	for(const v of document.querySelectorAll(".ripple")) {
		v._mdc = new mdc.ripple.MDCRipple(v);
	}
})();
