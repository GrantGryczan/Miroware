(function() {
	let form = document.querySelector("form");
	form.addEventListener("submit", function(evt) {
		evt.preventDefault();
		form.disable();
	});
})();
1+1