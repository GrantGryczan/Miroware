(() => {
	const form = document.querySelector("form");
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		form.disable();
	});
})();
