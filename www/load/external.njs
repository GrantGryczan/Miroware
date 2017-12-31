if(this.socialicons) {
	this.value = "";
	this.exit();
} else {
	let links = ["/discord/", "/patreon/", "/youtube/", "/twitter/", "/github/"];
	let t = this;
	t.cache = 1;
	t.value = html`
					<div id="externals">`;
	for(let v of links) {
		let context = await load(v, {
			socialicons: true
		});
		let origin = context.redirect.slice(0, context.redirect.indexOf("/", context.redirect.indexOf("//")+2));
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
		icon = (icon.indexOf("//") == -1) ? (origin + icon) : icon;
		t.value += html`<a class="external mdc-button" href="${v}" title="${context.value.match(/<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i)[1]}" style="background-image: url(&quot;${icon}&quot;);"></a>`;
	}
	t.value += html`
					</div>`;
	t.exit();
}
