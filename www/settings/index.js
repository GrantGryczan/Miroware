(() => {
	const _input = Symbol("input");
	const _prevValue = Symbol("prevValue");
	const _closeField = Symbol("closeField");
	const _saveField = Symbol("saveField");
	const editField = function() {
		this.parentNode.classList.add("hidden");
		this.form[_saveField].disabled = true;
		this.parentNode.nextSibling.classList.remove("hidden");
		this.form[_input].disabled = false;
		this.form[_input].parentNode.classList.remove("mdc-text-field--disabled");
		this.form[_prevValue] = this.form[_input].value;
		this.form[_input].focus();
		const prevType = this.form[_input].type;
		this.form[_input].type = "text";
		const cursorPos = String(this.form[_input].value).length;
		this.form[_input].setSelectionRange(cursorPos, cursorPos);
		this.form[_input].type = prevType;
	};
	const closeField = function() {
		this.parentNode.classList.add("hidden");
		this.parentNode.previousSibling.classList.remove("hidden");
		this.form[_input].disabled = true;
		this.form[_input].parentNode.classList.add("mdc-text-field--disabled");
		this.form[_input].value = this.form[_prevValue];
		this.form[_input].blur();
	};
	const inputField = function(evt) {
		this.form[_saveField].disabled = !this.checkValidity() || this.value === this.form[_prevValue];
	};
	const keyField = function(evt) {
		if(evt.keyCode === 27) {
			this.form[_closeField].click();
		}
	};
	const submitField = function(evt) {
		evt.preventDefault();
		// TODO: save
		this.classList.add("hidden");
		this.previousSibling.classList.remove("hidden");
		this[_input].disabled = true;
		this[_input].parentNode.classList.add("mdc-text-field--disabled");
		this[_input].blur();
	};
	for(const v of document.querySelectorAll(".field")) {
		v.querySelector(".editfield").addEventListener("click", editField);
		(v[_closeField] = v.querySelector(".closefield")).addEventListener("click", closeField);
		v[_saveField] = v.querySelector(".savefield");
		(v[_input] = v.querySelector("input")).addEventListener("input", inputField);
		v[_input].addEventListener("keydown", keyField);
		v.addEventListener("submit", submitField);
	}
})();
