if(this.socialicons) {
	this.value = "";
	this.done();
} else {
	this.cache = () => "";
	const htmlTitleTest = /<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i;
	const htmlIconExp = "<link(?: [^>]*?)? (?:(?:rel=(\"|')(?:[^\"'>]* )?icon(?: [^\"'>]*)?\\1(?: [^>]*?)? href=(\"|')([^\"'>]*?)\\2)|(?:href=(\"|')([^\"'>]*?)\\4(?: [^>]*?)? rel=(\"|')(?:[^\"'>]* )?icon(?: [^\"'>]*)?\\6))(?: [^>]*)?>";
	const htmlIconsTest = new RegExp(htmlIconExp, "ig");
	const htmlIconTest = new RegExp(htmlIconExp, "i");
	const iconSizeTest = / sizes=("|')([^\"']+)\1/i;
	this.value = html`
					<div id="externals">`;
	for(const v of ["discord", "patreon", "youtube", "twitter", "github"]) {
		const context = await load(`www/${v}/`, {
			...this,
			socialicons: true
		});
		const origin = context.redir.slice(0, context.redir.indexOf("/", context.redir.indexOf("//")+2));
		let body;
		try {
			body = await request.get(context.redir);
		} catch(err) {
			body = err.error;
		}
		if(typeof body === "string") {
			const matches = body.match(htmlIconsTest);
			let icon = "/favicon.ico";
			if(matches) {
				let size;
				let index = 0;
				for(let i = 0; i < matches.length; i++) {
					console.log(matches[i].match(iconSizeTest));
				}
			}
			icon = (icon.indexOf("//") === -1) ? (origin + icon) : icon;
			this.value += html`<a class="external mdc-button" href="/${v}/" title="${context.value.match(htmlTitleTest)[1]}" style="background-image: url(&quot;${icon}&quot;);"></a>`;
		}
	}
	this.value += html`
					</div>`;
	this.done();
}
