this.value = html`
	</head>
	<body class="mdc-typography${this.in ? " in" : ""}">
		<aside id="drawer" class="mdc-drawer mdc-drawer--temporary">
			<nav class="mdc-drawer__drawer">
				<header class="mdc-drawer__header">
					<div class="mdc-drawer__header-content"></div>
				</header>
				<nav class="mdc-drawer__content mdc-list-group">
					<div class="mdc-list">
						<a class="mdc-list-item${this.req.decodedPath === "/" ? " visiting" : "\" href=\"/"}">
							<i class="material-icons mdc-list-item__graphic">home</i> Home
						</a>`;
if(this.in) {
	this.value += html`
						<a class="mdc-list-item${this.req.decodedPath === "/settings/" ? " visiting" : "\" href=\"/settings/"}">
							<i class="material-icons mdc-list-item__graphic">settings</i> Settings
						</a>
						<a id="logOut" class="mdc-list-item" href="javascript:;">
							<i class="material-icons mdc-list-item__graphic">person</i> Log out
						</a>`;
} else {
	this.value += html`
						<a id="logIn" class="mdc-list-item${this.req.decodedPath === "/login/" ? " visiting" : html`" href="/login/?dest=$${encodeURIComponent(this.req.url)}`}">
							<i class="material-icons mdc-list-item__graphic">person</i> Log in
						</a>`;
}
this.value += html`
					</div>
					<hr class="mdc-list-divider">`;
this.value += (await load("www/load/external", this)).value;
this.value += html`
				</nav>
			</nav>
		</aside>
		<div id="container">
			<header class="mdc-top-app-bar mdc-elevation--z2">
				<div class="mdc-top-app-bar__row">
					<section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
						<button id="menu" class="mdc-top-app-bar__navigation-icon mdc-fab mdc-fab--mini material-icons" type="button">
							<span class="mdc-fab__icon">menu</span>
						</button>
						<span class="mdc-top-app-bar__title">$${this.title}</span>
					</section>
				</div>
			</header>`;
this.done();
