(function() {
	const form = document.querySelector("form");
	form.addEventListener("submit", function(evt) {
		evt.preventDefault();
		form.disable();
	});
})();
