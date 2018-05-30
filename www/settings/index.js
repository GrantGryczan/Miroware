(() => {
	const _input = Symbol("input");
	const _prevValue = Symbol("prevValue");
	const editField = function() {
		this.form[_input].disabled = false;
		this.form[_prevValue] = this.value;
		this.form[_input].select();
	};
	const closeField = function() {
		this.form[_input].disabled = false;
		this.form[_prevValue] = this.value;
		this.form[_input].select();
	};
	for(const v of document.querySelectorAll(".field")) {
		v[_input] = v.previousSibling.querySelector("input");
		v.querySelector(".editfield").addEventListener("click", editField);
		v.querySelector(".closefield").addEventListener("click", closeField);
		v.querySelector(".savefield").addEventListener("click", saveField);
	}
})();
