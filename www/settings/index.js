(() => {
	const form = document.querySelector("#settings");
	const submit = form.querySelector("#save");
	const _prev = Symbol("prev");
	const _element = Symbol("element");
	for(const input of form.elements) {
		input[_element] = input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement;
	}
	const savePrevs = () => {
		for(const input of form.elements) {
			if(input[_element]) {
				input[_prev] = Miro.value(input);
			}
		}
	};
	savePrevs();
	const changed = [];
	const onInput = evt => {
		changed.length = 0;
		for(const input of form.elements) {
			if(input[_element]) {
				if(input.checkValidity()) {
					if(input[_prev] !== Miro.value(input)) {
						changed.push(input);
					}
				} else {
					changed.length = 0;
					break;
				}
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
	const putResponse = Miro.response(setTimeout.bind(null, setForm));
	const enableForm = Miro.formState.bind(null, form, true);
	form.addEventListener("submit", evt => {
		evt.preventDefault();
		const body = {};
		for(const elem of changed) {
			body[elem.name] = Miro.value(elem);
		}
		Miro.formState(form, false);
		Miro.request("PUT", "/users/@me", {}, body).then(putResponse).finally(enableForm);
	});
	const _connection = Symbol("connection");
	const removeConnection = evt => {
		new Miro.dialog("Remove", `Are you sure you want to remove your account's connection with ${evt.target.parentNode.parentNode.parentNode[_connection].service} user #${evt.target.parentNode.parentNode.parentNode[_connection].id}?`, ["Yes", "No"]).then(value => {
			if(value === 0) {
				Miro.checkSuper(() => {
					Miro.request("DELETE", `/users/@me/connections/${evt.target.parentNode.parentNode.parentNode[_connection].service}/${evt.target.parentNode.parentNode.parentNode[_connection].id}`).then(Miro.response(() => {
						evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode.nextSibling);
						evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode);
					}));
				});
			}
		});
	};
	const postConnection = (service, code) => Miro.request("POST", "/users/@me/connections", {}, {
		connection: `${service} ${code}`
	});
	let connectionBody;
	const add = html`
		<button class="mdc-button">
			<i class="material-icons mdc-button__icon">add</i>Add
		</button>
	`;
	const appendCard = connection => {
		const card = html`
			<div class="mdc-card">
				<div class="mdc-card__area">
					<h2 class="mdc-card__title mdc-typography--headline6">${connection.id}</h2>
					<h3 class="mdc-card__subtitle mdc-typography--subtitle2">${connection.service}</h3>
				</div>
				<div class="mdc-card__actions">
					<div class="mdc-card__action-icons">
						<button class="mdc-card__action mdc-card__action--icon mdc-icon-button material-icons" title="Remove">delete</button>
					</div>
				</div>
			</div>
		`;
		card[_connection] = connection;
		card.querySelector("button").addEventListener("click", removeConnection);
		connectionBody.insertBefore(card, add);
		connectionBody.insertBefore(document.createElement("br"), add);
	};
	const newConnection = req => {
		appendCard(req.response);
	};
	const connectionsResponse = Miro.response(req => {
		connectionBody = document.createElement("span");
		connectionBody.appendChild(add);
		req.response.forEach(appendCard);
		new Miro.dialog("Connections", connectionBody);
	});
	const requestConnections = Miro.checkSuper.bind(null, () => {
		Miro.request("GET", "/users/@me/connections").then(connectionsResponse);
	});
	add.addEventListener("click", Miro.checkSuper.bind(null, () => {
		Miro.auth("Add Connection", "Authenticate a new connection for your account.", postConnection).then(newConnection);
	}));
	form.querySelector("#manageConnections").addEventListener("click", requestConnections);
	window.onbeforeunload = () => !submit.disabled || undefined;
	const afterDeletion = Miro.response(() => {
		location.reload();
	});
	const deleteAccount = Miro.checkSuper.bind(null, () => {
		Miro.request("DELETE", "/users/@me").then(afterDeletion);
	});
	const checkDeleteAccount = value => {
		if(value === 0) {
			deleteAccount();
		}
	};
	const confirmDeleteAccount = value => {
		if(value === 0) {
			new Miro.dialog("Delete", "Are you sure you're sure you want to delete your account?\nOnce you press \"Yes\" there's no turning back!", ["Yes", "No"]).then(deleteAccount);
		}
	};
	document.querySelector("#delete").addEventListener("click", Miro.checkSuper.bind(null, () => {
		new Miro.dialog("Delete", "Are you sure you want to delete your account?", ["Yes", "No"]).then(confirmDeleteAccount);
	}));
})();
