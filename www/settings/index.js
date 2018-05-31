(() => {
	const form = document.querySelector("#settings");
	const inputs = form.querySelectorAll("input");
	const submit = document.querySelector("#save");
	const _prev = Symbol("prev");
	const savePrevs = () => {
		for(const v of inputs) {
			v[_prev] = v.type === "checkbox" ? v.checked : v.value;
		}
	};
	savePrevs();
	const onInput = evt => {
		for(const v of inputs) {
			if(v.checkValidity() && v[_prev] !== (v.type === "checkbox" ? v.checked : v.value)) {
				submit.disabled = false;
				return;
			}
		}
		submit.disabled = true;
	};
	form.addEventListener("input", onInput);
	form.addEventListener("change", onInput);
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		savePrevs();
	});
	window.onbeforeunload = () => !submit.disabled || undefined;
})();
