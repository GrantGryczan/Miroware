(function() {
	window.Miro = {};
	Miro.magic = {};
	Miro.magic.magic = Miro.magic;
	console.log(Miro.magic);
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
	Miro.request = function(method, url, data, headers, success, error, noMagic) {
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
	const drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-drawer--temporary"));
	document.querySelector("#menu").addEventListener("click", function() {
		drawer.open = true;
	});
	const textFields = document.querySelectorAll(".mdc-text-field");
	for(const v of textFields) {
		v._mdc = new mdc.textField.MDCTextField(i);
	}
	const snackBars = document.querySelectorAll(".mdc-snackbar");
	for(const v of snackBars) {
		v._mdc = new mdc.snackbar.MDCSnackbar(i);
	}
	const ripples = document.querySelectorAll(".ripple");
	for(const v of ripples) {
		v._mdc = new mdc.ripple.MDCRipple(i);
	}
})();
