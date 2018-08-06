"use strict";
(() => {
	const form = document.querySelector("form");
	const sub = form.querySelector("#sub");
	const entries = form.querySelector("#entries");
	const save = form.querySelector("#save");
	const delete = form.querySelector("#delete");
	let selected;
	if(Miro.user) {
		const saves = form.querySelector("#saves");
		for(const concat of Miro.user.concats) {
			const option = html`<option>$${concat.sub ? `${concat.sub}.` : ""}miro.gg/$${concat.val}</option>`;
			option._concat = concat;
			saves.appendChild(option);
		}
		saves.addEventListener("change", () => {
			selected = saves.options[saves.selectedIndex]._concat;
		});
	}
	form.elements.val.addEventListener("change", () => {
		const encoded = encodeURI(form.elements.val.value);
		if(form.elements.val.value !== encoded) {
			new Miro.Dialog("Warning", html`
				"$${form.elements.val.value}" has not yet been encoded.<br>
				After you save this concat, "$${encoded}" will be used instead.
			`);
		}
	});
	form.elements.enableSub.addEventListener("input", () => {
		sub.classList[form.elements.enableSub.checked ? "remove" : "add"]("hidden");
		if(form.elements.enableSub.checked) {
			form.elements.sub.select();
		} else {
			form.elements.sub.value = "";
			form.elements.val.select();
		}
	});
	form.querySelector("#help").addEventListener("click", () => {
		new Miro.Dialog("Info", html`
			Adding only one URL will make your concat act as a regular redirect.<br>
			Adding multiple URLs will make your concat randomly redirect between them.
		`);
	});
	const addEntry = (noFocus, url) => {
		const entry = html`
			<div class="entry">
				<div class="mdc-text-field spaced">
					<input class="mdc-text-field__input" type="url" required>
					<div class="mdc-line-ripple"></div>
				</div><button class="mdc-icon-button material-icons spaced">close</button>
			</div>
		`;
		entries.appendChild(entry);
		const input = entry.querySelector("input");
		if(url) {
			input.value = url;
		}
		if(noFocus !== true) {
			input.select();
		}
	};
	if(Miro.query.urls) {
		Miro.query.urls.split(",").forEach(addEntry.bind(null, true));
	} else {
		addEntry(true);
	}
	form.querySelector("#addEntry").addEventListener("click", addEntry);
	entries.addEventListener("click", evt => {
		if(evt.target instanceof HTMLButtonElement) {
			evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
		}
	});
	const byValue = input => input.value;
	const allDone = () => {
		location.href = location.pathname;
	};
	const response = Miro.response(req => {
		const body = html`
			Concat successfully saved!<br>
			<div class="mdc-text-field spaced">
				<input class="mdc-text-field__input" type="text" value="$${req.response.url}" readonly>
				<div class="mdc-line-ripple"></div>
			</div><button class="mdc-icon-button material-icons spaced" type="button">link</button>
		`;
		const input = body.querySelector("input");
		body.querySelector("button").addEventListener("click", () => {
			input.select();
			document.execCommand("copy");
		});
		new Miro.Dialog("Concat", body).then(allDone);
	});
	const enableForm = Miro.formState.bind(null, form, true);
	if(!location.href.endsWidth(location.pathname)) {
		history.replaceState(0, "", location.pathname);
	}
	const checkLogin = value => {
		if(value === 0) {
			history.replaceState(0, "", `${location.pathname}?anon=${form.elements.anon.checked}&sub=${encodeURIComponent(form.elements.sub.value)}&val=${encodeURIComponent(form.elements.val.value)}&urls=${encodeURIComponent(urls.join(","))}`);
			Miro.logIn();
		}
	};
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		const urls = Array.prototype.map.call(entries.querySelectorAll("input"), byValue);
		if(Miro.user) {
			if(urls.length) {
				Miro.formState(form, false);
				Miro.request(selected ? "PUT" : "POST", `/users/@me/concats${selected ? `?sub=${encodeURIComponent(selected.sub)}&val=${encodeURIComponent(selected.val)}` : ""}`, {}, {
					anon: form.elements.anon.checked,
					sub: form.elements.sub.value,
					val: form.elements.val.value,
					urls
				}).then(response).finally(enableForm);
			} else {
				new Miro.Dialog("Error", "You must specify at least one URL.");
			}
		} else {
			new Miro.Dialog("Error", "You must be logged in to create concats.", ["Log in", "Cancel"]).then(checkLogin);
		}
	});
})();
