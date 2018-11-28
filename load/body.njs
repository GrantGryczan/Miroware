this.value = html`
	</head>
	<body class="mdc-typography">
		<div id="container">
			<aside id="drawer" class="mdc-drawer mdc-drawer--modal">
				<header class="mdc-drawer__header">
					<div class="mdc-drawer__header-content"></div>
				</header>
				<div class="mdc-drawer__content">
					<nav class="mdc-list">
						<a class="mdc-list-item${this.req.decodedPath === "/" ? " mdc-list-item--activated" : '" href="/'}">
							<i class="mdc-list-item__graphic material-icons">home</i> Home
						</a>`;
if(this.user) {
const myProfile = `/users/${this.user._id}/`;
this.value += html`
						<a class="mdc-list-item${this.req.decodedPath === "/account/" ? " mdc-list-item--activated" : '" href="/account/'}">
							<i class="mdc-list-item__graphic material-icons">settings</i> Account
						</a>
						<a class="mdc-list-item${this.req.decodedPath === myProfile ? " mdc-list-item--activated" : `" href="${myProfile}`}">
							<i class="mdc-list-item__graphic material-icons">account_box</i> Profile
						</a>
						<a id="logOut" class="mdc-list-item" href="javascript:;">
							<i class="mdc-list-item__graphic material-icons">person</i> Log out
						</a>`;
} else {
this.value += html`
						<a id="logIn" class="mdc-list-item${this.req.decodedPath === "/login/" ? " mdc-list-item--activated" : html`" href="/login/?dest=$${encodeURIComponent(this.req.url)}`}">
							<i class="mdc-list-item__graphic material-icons">person</i> Log in
						</a>`;
}
this.value += html`
						<hr class="mdc-list-divider">
						<a class="mdc-list-item${this.req.decodedPath.startsWith("/pipe/") ? " mdc-list-item--activated" : '" href="/pipe/'}">
							<i class="mdc-list-item__graphic material-icons">upload_file</i> Pipe
						</a>
						<a class="mdc-list-item${this.req.decodedPath === "/concat/" ? " mdc-list-item--activated" : '" href="/concat/'}">
							<i class="mdc-list-item__graphic material-icons">link</i> Concat
						</a>
						<a class="mdc-list-item${this.req.decodedPath === "/mimic/" ? " mdc-list-item--activated" : '" href="/mimic/'}">
							<i class="mdc-list-item__graphic material-icons">memory</i> Mimic
						</a>
						<hr class="mdc-list-divider">
					</nav>
					<div id="legal">© Miroware 2017-${new Date().getFullYear()}</div>`;
this.value += (await load("load/external", this)).value;
this.value += html`
				</div>
			</aside>
			<div class="mdc-drawer-scrim"></div>
			<header class="mdc-top-app-bar mdc-elevation--z2">
				<div class="mdc-top-app-bar__row">
					<div class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
						<button id="menu" class="mdc-top-app-bar__navigation-icon" type="button" title="Menu">
							<i class="material-icons">menu</i>
						</button>
						<span class="mdc-top-app-bar__title">$${this.title}</span>
					</div>
				</div>
				<div class="mdc-linear-progress mdc-linear-progress--indeterminate">
					<div class="mdc-linear-progress__buffering-dots"></div>
					<div class="mdc-linear-progress__buffer"></div>
					<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
						<span class="mdc-linear-progress__bar-inner"></span>
					</div>
					<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
						<span class="mdc-linear-progress__bar-inner"></span>
					</div>
				</div>
			</header>`;
this.done();
