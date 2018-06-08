(() => {
	const form = document.querySelector("#settings");
	const inputs = form.querySelectorAll("input");
	const submit = form.querySelector("#save");
	const _prev = Symbol("prev");
	const savePrevs = () => {
		for(const v of inputs) {
			v[_prev] = Miro.value(v);
		}
	};
	savePrevs();
	const changed = [];
	const onInput = evt => {
		changed.length = 0;
		for(const v of inputs) {
			if(v.checkValidity()) {
				if(v[_prev] !== Miro.value(v)) {
					changed.push(v);
				}
			} else {
				changed.length = 0;
				break;
			}
		}
		submit.disabled = !changed.length;
	};
	form.addEventListener("input", onInput);
	form.addEventListener("change", onInput);
	const setForm = () => {
		if(changed.includes(form.elements.name)) {
			Miro.inputState(form.elements.name, false);
		}
		savePrevs();
		changed.length = 0;
		submit.disabled = true;
	};
	const putResponse = Miro.response(() => {
		setTimeout(setForm);
	});
	const enableForm = () => {
		Miro.formState(form, true);
	};
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		const body = {};
		for(const v of changed) {
			body[v.name] = Miro.value(v);
		}
		Miro.formState(form, false);
		Miro.request("PUT", "/users/@me", {}, body).then(putResponse).finally(enableForm);
	});
	let connection;
	const send = function(service, code) {
		if(!connection) {
			connection = arguments;
		}
		return Miro.request("GET", "/users/@me", {
			"X-Miro-Connection": `${service} ${code}`
		});
	};
	const showConnections = req => {
		console.log(req.response);
	};
	form.querySelector("#manageConnections").addEventListener("click", () => {
		if(connection) {
			send.apply(null, connection).then(showConnections);
		} else {
			Miro.auth("Connections", "Confirm your credentials to continue.", send).then(showConnections);
		}
	});
	window.onbeforeunload = () => !submit.disabled || undefined;
})();
