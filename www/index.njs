let links = [];
this.title = "Miroware";
this.description = "Hello, world!";
this.tags = ["homepage", "home", "page", "front"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			<div class="wrapper">`;
for(let j = 0; j < links.length; j++) {
	let page = fs.readFileSync(`www${links[j]}index.njs`).toString();
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
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
