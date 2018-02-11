if(this.socialicons) {
	this.value = "";
	this.exit();
} else {
	const links = ["/discord/", "/patreon/", "/youtube/", "/twitter/", "/github/"];
	this.cache = 1;
	this.value = html`
					<div id="externals">`;
	for(let i of links) {
		const context = await load(i, {
			...this,
			socialicons: true
		});
		const origin = context.redirect.slice(0, context.redirect.indexOf("/", context.redirect.indexOf("//")+2));
		let body;
		let icon;
		try {
			body = await request.get(context.redirect);
		} catch(err) {
			body = err.error;
		}
		icon = body.match(/<link(?: .*?)? (?:rel="(?:.* )?icon(?: .*)?"(?: .*?)? href="([^"]*?)")|(?:href="([^"]*?)"(?: .*?)? rel="(?:.* )?icon(?: .*)?")( [^>]*)?>/i)[1];
		if(!icon) {
			icon = "/favicon.ico";
		}
		icon = (icon.indexOf("//") === -1) ? (origin + icon) : icon;
		this.value += html`<a class="external mdc-button" href="${i}" title="${context.value.match(/<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i)[1]}" style="background-image: url(&quot;${icon}&quot;);"></a>`;
	}
	this.value += html`
					</div>`;
	this.exit();
}
