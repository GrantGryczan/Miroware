(() => {
	Object.assign(document.querySelector("#email"), {
		_resource: "/users/@me",
		_getData: function() {
			return {
				email: this._input.value
			};
		}
	});
	Object.assign(document.querySelector("#username"), {
		_resource: "/users/@me",
		_getData: function() {
			return {
				username: this._input.value
			};
		}
	});
	Object.assign(document.querySelector("#birth"), {
		_resource: "/users/@me",
		_getData: function() {
			return {
				birth: this._input.valueAsNumber
			};
		}
	});
})();
