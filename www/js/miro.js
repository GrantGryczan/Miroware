// idk
(function() {
	HTMLFormElement.prototype.disable = function() {
		this.classList.add("mdc-text-field--disabled");
		var inputs = this.querySelectorAll("input, button");
		for(var i = 0; i < inputs.length; i++) {
			inputs[i].disabled = true;
		}
	};
	HTMLFormElement.prototype.enable = function() {
		this.classList.remove("mdc-text-field--disabled");
		var inputs = this.querySelectorAll("input, button");
		for(var i = 0; i < inputs.length; i++) {
			inputs[i].disabled = false;
		}
	};
	window.Miro = {};
	Miro.magic = {};
	Miro.magic.magic = Miro.magic;
	console.log(Miro.magic);
	var rawQuery;
	if(location.href.indexOf("#") != -1) {
		rawQuery = location.href.slice(0, location.href.indexOf("#"));
	} else {
		rawQuery = location.href;
	}
	if(rawQuery.indexOf("?") != -1) {
		rawQuery = rawQuery.slice(rawQuery.indexOf("?")+1).split("&");
	} else {
		rawQuery = [];
	}
	Miro.query = {};
	for(var i = 0; i < rawQuery.length; i++) {
		try {
			var p = rawQuery[i].split("=");
			Miro.query[p[0]] = decodeURIComponent(p[1]);
		} catch(err) {}
	}
	Miro.request = function(method, url, data, headers, success, error, noMagic) {
		data = data || {};
		headers = headers || {};
		var req = new XMLHttpRequest();
		req.open(method, url, true);
		for(var i in headers) {
			req.setRequestHeader(i, headers[i]);
		}
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.onreadystatechange = function() {
			if(req.readyState == XMLHttpRequest.DONE && req.status) {
				statusType = Math.floor(req.status/100);
				if(noMagic || req.getResponseHeader("X-Magic") == "real") {
					if(statusType == 2) {
						if(typeof success == "function") {
							success(req.responseText);
						}
					} else if(statusType == 4 || statusType == 5) {
						if(typeof error == "function") {
							error(req.status);
						}
					}
				} else if(typeof error == "function") {
					error(req.status);
				}
			}
		};
		var formData = "";
		for(var i in data) {
			formData += `${(formData ? "&" : "") + encodeURIComponent(i)}=${encodeURIComponent(data[i])}`;
		}
		req.send(formData);
	};
	var drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector(".mdc-temporary-drawer"));
	document.querySelector("#menu").addEventListener("click", function() {
		drawer.open = true;
	});
	var textFields = document.querySelectorAll(".mdc-text-field");
	for(var i = 0; i < textFields.length; i++) {
		new mdc.textField.MDCTextField(textFields[i]);
	}
	var ripples = document.querySelectorAll(".ripple");
	for(var i = 0; i < ripples.length; i++) {
		new mdc.ripple.MDCRipple(ripples[i]);
	}
})();
