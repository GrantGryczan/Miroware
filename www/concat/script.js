(() => {
	const form = document.querySelector("form");
	const sub = form.querySelector("#sub");
	form.elements.enableSub.addEventListener("input", () => {
		sub.classList[form.elements.enableSub.checked ? "remove" : "add"]("hidden");
		if(form.elements.enableSub.checked) {
			form.elements.sub.focus();
		} else {
			form.elements.sub.value = "";
			form.elements.val.focus();
		}
	});
	form.elements.anon.addEventListener("input", form.elements.val.focus.bind(form.elements.val));
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		history.pushState(0, "", `${location.pathname}?anon=${form.elements.anon.checked}&sub=${form.elements.sub.value}&val=${form.elements.val.value}`);
		Miro.request("POST", "/users/@me/concats", {}, {
			anon: form.elements.anon.checked,
			sub: form.elements.sub.value,
			val: form.elements.val.value
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
	});
})();
