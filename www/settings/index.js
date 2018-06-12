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
	const connectDialogs = [];
	const pushDialog = connectDialogs.push.bind(connectDialogs);
	const putToken = (service, code) => Miro.request("PUT", "/token", {}, {
		connection: `${service} ${code}`
	});
	const checkToken = success => {
		Miro.request("GET", "/token").then(req => {
			if(req.response.super) {
				success(req);
			} else {
				console.log(connectDialogs);
				let dialog;
				while(dialog = connectDialogs.pop()) {
					if(!dialog.closed) {
						dialog.close();
					}
				}
				Miro.auth("Security", "You must confirm the validity of your credentials before continuing.", putToken, pushDialog).then(success);
			}
		});
	};
	const _connection = Symbol("connection");
	const removeConnection = evt => {
		checkToken(() => {
			Miro.request("DELETE", `/users/@me/connections/${evt.target.parentNode.parentNode[_connection].service}/${evt.target.parentNode.parentNode[_connection].id}`).then(connectionsResponse);
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
		card.querySelector(".mdc-card__actions")[_connection] = connection;
		card.querySelector("button").addEventListener("click", removeConnection);
		connectionBody.insertBefore(card, add);
		connectionBody.insertBefore(document.createElement("br"), add);
	};
	const newConnection = req => {
		appendCard(req.response);
	};
	const showConnections = req => {
		connectionBody = document.createElement("span");
		connectionBody.appendChild(add);
		for(const v of req.response) {
			appendCard(v);
		}
		pushDialog(new Miro.dialog("Connections", connectionBody));
	};
	const connectionsResponse = Miro.response(showConnections);
	const requestConnections = checkToken.bind(null, () => {
		Miro.request("GET", "/users/@me/connections").then(connectionsResponse);
	});
	add.addEventListener("click", checkToken.bind(null, () => {
		pushDialog(Miro.auth("Add Connection", "Authenticate a new connection for your account.", postConnection, pushDialog).then(newConnection));
	}));
	form.querySelector("#manageConnections").addEventListener("click", requestConnections);
	window.onbeforeunload = () => !submit.disabled || undefined;
})();
