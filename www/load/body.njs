this.value = html`
	</head>
	<body class="mdc-theme--dark">
		<aside class="mdc-temporary-drawer mdc-typography">
			<nav class="mdc-temporary-drawer__drawer">
				<header class="mdc-temporary-drawer__header">
					<div class="mdc-temporary-drawer__header-content"></div>
				</header>
				<nav class="mdc-temporary-drawer__content mdc-list">
					<a class="mdc-list-item" href="/">
						<i class="material-icons mdc-list-item__start-detail">home</i>Home
					</a>
					<a class="mdc-list-item" href="/login/">
						<i class="material-icons mdc-list-item__start-detail">person</i>Log in
					</a>
					<div class="mdc-permanent-drawer__toolbar-spacer"></div>`;
this.value += (await load("/load/external.njs", this)).value;
this.value += html`
				</nav>
			</nav>
		</aside>
		<button id="menu" class="mdc-fab mdc-fab--mini material-icons">
			<span class="mdc-fab__icon">menu</span>
		</button>
		<div id="container">`;
this.exit();
