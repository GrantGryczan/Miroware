(() => {
	const form = document.querySelector("#settings");
	const inputs = form.querySelectorAll("input");
	const submit = document.querySelector("#save");
	const _prev = Symbol("prev");
	const savePrevs = () => {
		for(const v of inputs) {
			v[_prev] = Miro.value(v);
		}
	};
	savePrevs();
	const changed = [];
	const onInput = evt => {
		changed.length = 0;
		for(const v of inputs) {
			if(v.checkValidity()) {
				if(v[_prev] !== Miro.value(v)) {
					changed.push(v);
				}
			} else {
				changed.length = 0;
				break;
			}
		}
		submit.disabled = !changed.length;
	};
	form.addEventListener("input", onInput);
	form.addEventListener("change", onInput);
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		const body = {};
		for(const v of changed) {
			body[v.id] = Miro.value(v);
		}
		Miro.request("PUT", "/users/@me", {}, body).then(Miro.request(req => {
			savePrevs();
			submit.disabled = true;
		}));
	});
	window.onbeforeunload = () => !submit.disabled || undefined;
})();
