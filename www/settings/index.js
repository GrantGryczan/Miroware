(() => {
	const settings = document.querySelector("#settings");
	const inputs = settings.querySelectorAll("input");
	const _prev = Symbol("prev");
	const savePrevs = () => {
		for(const v of inputs) {
			v[_prev] = v.type === "checkbox" ? v.checked : v.value;
		}
	};
	savePrevs();
	const onInput = evt => {
		for(const v of inputs) {
			if(!v.checkValidity() || v[_prev] !== (v.type === "checkbox" ? v.checked : v.value)) {
				console.log(v.checkValidity(), v[_prev], v.type === "checkbox" ? v.checked : v.value);
				settings.disabled = true;
				return;
			}
		}
		console.log(1);
		settings.disabled = false;
	};
	settings.addEventListener("input", onInput);
	settings.addEventListener("change", onInput);
	settings.addEventListener("submit", evt => {
		evt.preventDefault();
		savePrevs();
	});
})();
