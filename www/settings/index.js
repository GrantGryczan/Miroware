(() => {
	const _input = Symbol("input");
	const _icon = Symbol("icon");
	const editField = function() {
		this.previousSibling.classList.toggle("mdc-text-field--disabled");
		this[_input].disabled = !this[_input].disabled;
		this[_icon].textContent = (this[_icon].textContent === "edit" ? "save" : "edit");
	};
	for(const v of document.querySelectorAll(".editfield")) {
		v[_input] = v.previousSibling.querySelector("input");
		v[_icon] = v.querySelector(".mdc-fab__icon");
		v.addEventListener("click", editField);
	}
})();
