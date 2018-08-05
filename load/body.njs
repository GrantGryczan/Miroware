this.value = html`
	</head>
	<body class="mdc-typography">
		<div id="container">
			<header class="mdc-top-app-bar mdc-elevation--z2">
				<div class="mdc-top-app-bar__row">
					<div class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
						<button id="menu" class="mdc-top-app-bar__navigation-icon mdc-fab mdc-fab--mini material-icons" type="button">
							<span class="mdc-fab__icon">menu</span>
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
			</header>
			<aside id="drawer" class="mdc-drawer mdc-drawer--temporary">
				<nav class="mdc-drawer__drawer">
					<header class="mdc-drawer__header">
						<div class="mdc-drawer__header-content"></div>
					</header>
					<nav class="mdc-drawer__content mdc-list-group">
						<div class="mdc-list">
							<a class="mdc-list-item${this.req.decodedPath === "/" ? " visiting" : '" href="/'}">
								<i class="mdc-list-item__graphic material-icons">home</i> Home
							</a>`;
if(this.user) {
	const myProfile = `/users/${this.user._id}/`;
	this.value += html`
							<a class="mdc-list-item${this.req.decodedPath === "/settings/" ? " visiting" : '" href="/settings/'}">
								<i class="mdc-list-item__graphic material-icons">settings</i> Settings
							</a>
							<a class="mdc-list-item${this.req.decodedPath === myProfile ? " visiting" : `" href="${myProfile}`}">
								<i class="mdc-list-item__graphic material-icons">account_box</i> Profile
							</a>
							<a id="logOut" class="mdc-list-item" href="javascript:;">
								<i class="mdc-list-item__graphic material-icons">person</i> Log out
							</a>`;
} else {
	this.value += html`
							<a id="logIn" class="mdc-list-item${this.req.decodedPath === "/login/" ? " visiting" : html`" href="/login/?dest=$${encodeURIComponent(this.req.url)}`}">
								<i class="mdc-list-item__graphic material-icons">person</i> Log in
							</a>`;
}
this.value += html`
						</div>
						<hr class="mdc-list-divider">
						<div id="legal">© Miroware 2017-${new Date().getFullYear()}</div>`;
this.value += (await load("load/external", this)).value;
this.value += html`
					</nav>
				</nav>
			</aside>`;
this.done();
