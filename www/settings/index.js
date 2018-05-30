(() => {
	const onInput = function(evt) {
		this.form[_saveField].disabled = !this.checkValidity() || this.value === this.form[_prevValue];
	};
})();
