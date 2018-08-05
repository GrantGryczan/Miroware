(() => {
	const form = document.querySelector("form");
	const sub = form.querySelector("#sub");
	const entries = form.querySelector("#entries");
	form.elements.enableSub.addEventListener("input", () => {
		sub.classList[form.elements.enableSub.checked ? "remove" : "add"]("hidden");
		if(form.elements.enableSub.checked) {
			form.elements.sub.select();
		} else {
			form.elements.sub.value = "";
			form.elements.val.select();
		}
	});
	form.elements.anon.addEventListener("input", form.elements.val.focus.bind(form.elements.val));
	form.querySelector(".help").addEventListener("click", () => {
		new Miro.Dialog("Help", html`
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
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		const urls = Array.prototype.map.call(entries.querySelectorAll("input"), byValue);
		history.pushState(0, "", `${location.pathname}?anon=${form.elements.anon.checked}&sub=${encodeURIComponent(form.elements.sub.value)}&val=${encodeURIComponent(form.elements.val.value)}&urls=${encodeURIComponent(urls.join(","))}`);
		if(urls.length) {
			Miro.request("POST", "/users/@me/concats", {}, {
				anon: form.elements.anon.checked,
				sub: form.elements.sub.value,
				val: form.elements.val.value,
				urls
			}).then(Miro.response(req => {
				const body = html`
					Concat successfully created!<br>
					<div class="mdc-text-field">
						<input class="mdc-text-field__input" type="text" value="${req.response.url}">
						<div class="mdc-line-ripple"></div>
					</div>
				`;
				const input = body.querySelector("input");
				body.querySelector("button").addEventListener("click", () => {
					input.select();
					document.execCommand("copy");
				});
				new Miro.Dialog("Concat", body);
			}));
		} else {
			new Miro.Dialog("Error", "You must specify at least one URL.");
		}
	});
})();
