this.title = "Miroware";
this.description = "Hello, world!";
this.tags = ["homepage", "home", "page", "front"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="wrapper">`;
for(const v of []) {
	const page = String(await fs.readFile(`www/${v}/index.njs`)); // TODO: Use `load` instead of `fs.readFile`.
	this.value += html`
			<div class="mdc-card mdc-elevation-transition mdc-elevation--z2 mdc-ripple-surface invisible open" href="/${v}/" style="background-image: url(/${v}/icon.png);">
				<div class="mdc-card__primary">
					<h1 class="mdc-card__title mdc-card__title--large">${page.match(/<meta property="og:title" content="(.*?)">/)[1]}</h1>
				</div>
				<div class="mdc-card__supporting-text">${page.match(/<meta property="og:description" content="(.*?)">/)[1]}</div>
				<div class="mdc-card__actions">
					<a class="mdc-button mdc-button--compact mdc-card__action" href="/${v}/">Open</a>
				</div>
			</div>`;
}
this.value += html`
			</div>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
