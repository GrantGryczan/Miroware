const logFlow = this.req.session.user ? "out" : "in";
this.value = html`
	</head>
	<body class="mdc-typography">
		<aside class="mdc-drawer mdc-drawer--temporary">
			<nav class="mdc-drawer__drawer">
				<header class="mdc-drawer__header">
					<div class="mdc-drawer__header-content"></div>
				</header>
				<nav class="mdc-drawer__content mdc-list-group">
					<div class="mdc-list">
						<a class="mdc-list-item" href="/">
							<i class="material-icons mdc-list-item__graphic">home</i>Home
						</a>
						<a id="log${logFlow}" class="mdc-list-item" href="${this.req.session.user ? "javascript:;" : "/login/"}">
							<i class="material-icons mdc-list-item__graphic">person</i>Log ${logFlow}
						</a>
					</div>
					<hr class="mdc-list-divider">`;
this.value += (await load("www/load/external", this)).value;
this.value += html`
				</nav>
			</nav>
		</aside>
		<div id="container">
			<button id="menu" class="mdc-fab mdc-fab--mini material-icons">
				<span class="mdc-fab__icon">menu</span>
			</button>`;
this.done();
