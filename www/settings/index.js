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
				name: this._input.value
			};
		},
		_success: function() {
			let editOptions;
			while(editOptions = this.querySelector(".editoptions")) {
				editOptions.parentNode.removeChild(editOptions);
			}
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
