(() => {
	const _input = Symbol("input");
	const _prevValue = Symbol("prevValue");
	const editField = function() {
		this.parentNode.classList.add("hidden");
		this.parentNode.nextSibling.classList.remove("hidden");
		this.form[_input].disabled = false;
		this.form[_input].parentNode.classList.remove("mdc-text-field--disabled");
		this.form[_prevValue] = this.value;
		this.form[_input].focus();
		this.form[_input].setSelectionRange(this.form[_input].value.length, this.form[_input].value.length);
	};
	const closeField = function() {
		this.parentNode.classList.add("hidden");
		this.parentNode.previousSibling.classList.remove("hidden");
		this.form[_input].disabled = true;
		this.form[_input].parentNode.classList.add("mdc-text-field--disabled");
		this.value = this.form[_prevValue];
		this.form[_input].blur();
	};
	const saveField = function() {
		// TODO
		this.parentNode.classList.add("hidden");
		this.parentNode.previousSibling.classList.remove("hidden");
		this.form[_input].disabled = true;
		this.form[_input].parentNode.classList.add("mdc-text-field--disabled");
		this.form[_input].blur();
	};
	for(const v of document.querySelectorAll(".field")) {
		v[_input] = v.querySelector("input");
		v.querySelector(".editfield").addEventListener("click", editField);
		v.querySelector(".closefield").addEventListener("click", closeField);
		v.querySelector(".savefield").addEventListener("click", saveField);
	}
})();
