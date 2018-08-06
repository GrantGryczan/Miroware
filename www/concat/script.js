"use strict";
(() => {
	const form = document.querySelector("form");
	const sub = form.querySelector("#sub");
	const entries = form.querySelector("#entries");
	const save = form.querySelector("#save");
	const deleteConcat = form.querySelector("#delete");
	let selected;
	const allDone = () => {
		location.href = location.pathname;
	};
	const enableForm = Miro.formState.bind(null, form, true);
	form.querySelector("#help").addEventListener("click", () => {
		new Miro.Dialog("Info", html`
			Adding only one URL will make your concat act as a regular redirect.<br>
			Adding multiple URLs will make your concat randomly redirect between them.
		`);
	});
	const addEntry = (noFocus, url) => {
		if(entries.childNodes.length > 1023) {
			new Miro.Dialog("Error", "You can stop now.");
		} else {
			const entry = html`
				<div class="entry">
					<div class="mdc-text-field spaced">
						<input class="mdc-text-field__input" type="url" maxlength="511" required>
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
		}
	};
	const addEachEntry = addEntry.bind(null, true);
	if(Miro.query.urls) {
		Miro.query.urls.split(",").forEach(addEachEntry);
	} else {
		addEntry(true);
	}
	form.querySelector("#addEntry").addEventListener("click", addEntry);
	entries.addEventListener("click", evt => {
		if(evt.target instanceof HTMLButtonElement) {
			evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
		}
	});
	const changeEnableSub = () => {
		sub.classList[form.elements.enableSub.checked ? "remove" : "add"]("hidden");
		if(form.elements.enableSub.checked) {
			form.elements.sub.select();
		} else {
			form.elements.sub.value = "";
			form.elements.val.select();
		}
	};
	form.elements.enableSub.addEventListener("change", changeEnableSub);
	let appendConcat;
	if(Miro.user) {
		const saves = form.querySelector("#saves");
		appendConcat = concat => {
			const option = html`<option>$${concat.sub ? `${concat.sub}.` : ""}miro.gg/$${concat.val}</option>`;
			option._concat = concat;
			saves.appendChild(option);
			return option;
		};
		Miro.user.concats.forEach(appendConcat);
		saves.addEventListener("change", () => {
			save.textContent = (selected = saves.options[saves.selectedIndex]._concat) ? "Save" : "Create";
			deleteConcat.classList[selected ? "remove" : "add"]("hidden");
			form.elements.enableSub.checked = selected && selected.sub;
			changeEnableSub();
			form.elements.anon.checked = selected && selected.anon;
			form.elements.sub.value = selected ? selected.sub : "";
			form.elements.val.value = selected ? decodeURI(selected.val) : "";
			while(entries.childNodes.length) {
				entries.removeChild(entries.lastChild);
			}
			if(selected) {
				selected.urls.forEach(addEachEntry);
			} else {
				addEntry(true);
			}
		});
		const confirmDeleteConcat = value => {
			if(value === 0) {
				Miro.formState(form, false);
				Miro.request("DELETE", `/users/@me/concats?sub=${encodeURIComponent(selected.sub)}&val=${encodeURIComponent(selected.val)}`).then(allDone).finally(enableForm);
			}
		};
		deleteConcat.addEventListener("click", () => {
			new Miro.Dialog("Delete", html`Are you sure you want to delete <i>${saves.options[saves.selectedIndex].innerHTML}</i>?`, ["Yes", "No"]).then(confirmDeleteConcat);
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
	const byValue = input => input.value;
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
		const dialog = new Miro.Dialog("Concat", body);
		if(selected) {
			const selectedOption = saves.options[saves.selectedIndex];
			const option = appendConcat(selected = req.response);
			option.selected = true;
			saves.insertBefore(option, selectedOption);
			saves.removeChild(selectedOption);
		} else {
			dialog.then(allDone);
		}
	});
	if(!location.href.endsWith(location.pathname)) {
		history.replaceState(0, "", location.pathname);
	}
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
			new Miro.Dialog("Error", "You must be logged in to create concats.", ["Log in", "Cancel"]).then(value => {
				if(value === 0) {
					history.replaceState(0, "", `${location.pathname}?anon=${form.elements.anon.checked}&sub=${encodeURIComponent(form.elements.sub.value)}&val=${encodeURIComponent(form.elements.val.value)}&urls=${encodeURIComponent(urls.join(","))}`);
					Miro.logIn();
				}
			});
		}
	});
})();
