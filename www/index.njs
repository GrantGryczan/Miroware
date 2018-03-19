const links = [];
this.title = "Miroware";
this.description = "Hello, world!";
this.tags = ["homepage", "home", "page", "front"];
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			<div class="wrapper">`;
for(let j = 0; j < links.length; j++) {
	const page = String(fs.readFileSync(`www${links[j]}index.njs`));
	this.value += html`
			<div class="mdc-card mdc-elevation-transition mdc-elevation--z2 mdc-ripple-surface invisible open" href="${links[j]}" style="background-image: url(&quot;${links[j]}icon.png&quot;);">
				<section class="mdc-card__primary">
					<h1 class="mdc-card__title mdc-card__title--large">${page.match(/<meta property="og:title" content="(.*?)">/)[1]}</h1>
				</section>
				<section class="mdc-card__supporting-text">${page.match(/<meta property="og:description" content="(.*?)">/)[1]}</section>
				<section class="mdc-card__actions">
					<a class="mdc-button mdc-button--compact mdc-card__action" href="${links[j]}">Open</a>
				</section>
			</div>`;
}
this.value += html`
			</div>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.exit();
