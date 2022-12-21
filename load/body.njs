this.value = html`
	</head>
	<body class="mdc-typography">
		<div class="mdc-top-app-bar--fixed-adjust"></div>
		<div id="container">
			<aside id="drawer" class="mdc-drawer mdc-drawer--modal">
				<div class="mdc-drawer__header">
					<h3 class="mdc-drawer__title">File Garden</h3>${this.user ? html`
					<h6 class="mdc-drawer__subtitle">$${this.user.name}</h6>` : ""}
				</div>
				<div class="mdc-drawer__content">
					<nav class="mdc-list">
						<a class="mdc-list-item${this.req.decodedPath === "/" ? " mdc-list-item--activated" : '" href="/'}">
							<i class="mdc-list-item__graphic material-icons">upload_file</i> <span class="mdc-list-item__text">Your Garden</span>
						</a>`;
if (!this.user) {
	this.value += html`
						<a id="logIn" class="mdc-list-item${this.req.decodedPath === "/login/" ? " mdc-list-item--activated" : html`" href="/login/?dest=$${encodeURIComponent(this.req.url)}`}">
							<i class="mdc-list-item__graphic material-icons">person</i> <span class="mdc-list-item__text">Log in</span>
						</a>`;
}
this.value += html`
						<hr class="mdc-list-divider">
						<a class="mdc-list-item${this.req.decodedPath === "/link-hat/" ? " mdc-list-item--activated" : '" href="/link-hat/'}">
							<i class="mdc-list-item__graphic material-icons">link</i> <span class="mdc-list-item__text">Link Hat</span>
						</a>
						<a class="mdc-list-item${this.req.decodedPath === "/corrupt/" ? " mdc-list-item--activated" : '" href="/corrupt/'}">
							<i class="mdc-list-item__graphic material-icons">broken_image</i> <span class="mdc-list-item__text">Image Corruptor</span>
						</a>
						<a class="mdc-list-item${this.req.decodedPath === "/mimic/" ? " mdc-list-item--activated" : '" href="/mimic/'}">
							<i class="mdc-list-item__graphic material-icons">memory</i> <span class="mdc-list-item__text">Mimic</span>
						</a>`;
if (this.user) {
	this.value += html`
						<hr class="mdc-list-divider">
						<a class="mdc-list-item${this.req.decodedPath === "/account/" ? " mdc-list-item--activated" : '" href="/account/'}">
							<i class="mdc-list-item__graphic material-icons">settings</i> <span class="mdc-list-item__text">Account</span>
						</a>
						<a id="logOut" class="mdc-list-item" href="javascript:;">
							<i class="mdc-list-item__graphic material-icons">person</i> <span class="mdc-list-item__text">Log out</span>
						</a>`;
}
this.value += html`
						<hr class="mdc-list-divider">
					</nav>
					<div id="legal">© File Garden 2022-${new Date().getFullYear()}</div>`;
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
