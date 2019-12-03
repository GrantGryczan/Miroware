"use strict";
const form = document.body.querySelector("#form");
const submit = form.querySelector("#save");
for (const input of form.elements) {
	input._input = input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement;
}
const savePrevs = () => {
	for (const input of form.elements) {
		if (input._input) {
			input._prev = Miro.value(input);
		}
	}
};
savePrevs();
const changed = [];
const onInput = evt => {
	changed.length = 0;
	for (const input of form.elements) {
		if (input._input) {
			if (input.checkValidity()) {
				if (input._prev !== Miro.value(input)) {
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
	if (changed.includes(form.elements.email)) {
		new Miro.Dialog("Account Verification", html`
			A verification email has sent to <b>$${form.elements.email.value}</b>. Be sure to check your spam!
		`).then(Miro.reload);
	}
	if (changed.includes(form.elements.name)) {
		Miro.inputState(form.elements.name, false);
	}
	changed.length = 0;
	submit.disabled = true;
	savePrevs();
};
const putResponse = Miro.response(setTimeout.bind(null, setForm));
const enableForm = Miro.formState.bind(null, form, true);
form.addEventListener("submit", evt => {
	evt.preventDefault();
	const body = {};
	for (const elem of changed) {
		body[elem.name] = Miro.value(elem);
	}
	Miro.formState(form, false);
	Miro.request("PUT", "/users/@me", {}, body).then(putResponse).finally(enableForm);
});
const removeConnection = evt => {
	new Miro.Dialog("Remove", `Are you sure you want to remove that ${evt.target.parentNode.parentNode.parentNode._connection.service} connection?`, ["Yes", "No"]).then(value => {
		if (value === 0) {
			Miro.checkSuper(() => {
				Miro.request("DELETE", `/users/@me/connections/${encodeURIComponent(evt.target.parentNode.parentNode.parentNode._connection.id)}`).then(Miro.response(() => {
					evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode.nextSibling);
					evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode);
				}));
			});
		}
	});
};
const postConnection = (service, code) => Miro.request("POST", "/users/@me/connections", {}, {
	connection: `${service} ${btoa(code)}`
});
let connectionBody;
const add = html`
	<button class="mdc-button margined">
		<i class="mdc-button__icon material-icons">add</i>Add
	</button>
`;
const appendCard = connection => {
	const card = html`
		<div class="mdc-card margined">
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
	card._connection = connection;
	card.querySelector("button").addEventListener("click", removeConnection);
	connectionBody.insertBefore(card, add);
};
const newConnection = xhr => {
	appendCard(xhr.response);
};
const connectionsResponse = Miro.response(xhr => {
	connectionBody = document.createElement("span");
	connectionBody.appendChild(add);
	xhr.response.forEach(appendCard);
	new Miro.Dialog("Connections", connectionBody);
});
const requestConnections = Miro.checkSuper.bind(null, () => {
	Miro.request("GET", "/users/@me/connections").then(connectionsResponse);
});
add.addEventListener("click", Miro.checkSuper.bind(null, () => {
	Miro.auth("Add Connection", "Authenticate a new connection for your account.", postConnection, undefined, true, newConnection);
}));
form.querySelector("#manageConnections").addEventListener("click", requestConnections);
window.onbeforeunload = () => !submit.disabled || undefined;
const deleteAccount = Miro.checkSuper.bind(null, () => {
	Miro.request("DELETE", "/users/@me").then(Miro.response(Miro.reload));
});
const checkDeleteAccount = value => {
	if (value === 0) {
		deleteAccount();
	}
};
const confirmDeleteAccount = value => {
	if (value === 0) {
		new Miro.Dialog("Delete", "Are you sure you're sure you want to delete your account?\nOnce you press \"Yes\" there's no turning back!", ["Yes", "No"]).then(checkDeleteAccount);
	}
};
form.querySelector("#delete").addEventListener("click", Miro.checkSuper.bind(null, () => {
	new Miro.Dialog("Delete", "Are you sure you want to delete your account?", ["Yes", "No"]).then(confirmDeleteAccount);
}));
const confirmDownload = value => {
	if (value === 0) {
		html`<a href="/account/data.json" download="user.json"></a>`.click();
	}
};
form.querySelector("#download").addEventListener("click", () => {
	new Miro.Dialog("Download", "Would you like a copy of your user data?", ["Yes", "No"]).then(confirmDownload);
});
const verificationResent = Miro.response(() => {
	new Miro.Dialog("Account Verification", html`A verification email has been resent to <b>$${form.elements.email.value}</b>. Be sure to check your spam!`);
});
const verifyEmail = form.querySelector("#verifyEmail");
const confirmVerifyEmail = value => {
	if (value === 0) {
		Miro.request("POST", "/users/@me/verification", {}, {}).then(verificationResent);
	}
};
verifyEmail.addEventListener("click", () => {
	new Miro.Dialog("Account Verification", "Are you sure you want to resend the verification email?", ["Yes", "No"]).then(confirmVerifyEmail);
});
const cancelVerify = form.querySelector("#cancelVerify");
if (cancelVerify) {
	const confirmCancelVerify = value => {
		if (value === 0) {
			Miro.request("DELETE", "/users/@me/verification").then(Miro.response(Miro.reload));
		}
	};
	cancelVerify.addEventListener("click", () => {
		new Miro.Dialog("Account Verification", "Are you sure you want to cancel the account verification?", ["Yes", "No"]).then(confirmCancelVerify);
	});
}
