if(this.socialicons) {
	this.value = "";
	this.exit();
} else {
	this.cache = 1;
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
		if(body) {
			let icon = body.match(/<link(?: .*?)? (?:rel="(?:.* )?icon(?: .*)?"(?: .*?)? href="([^"]*?)")|(?:href="([^"]*?)"(?: .*?)? rel="(?:.* )?icon(?: .*)?")( [^>]*)?>/i)[1] || "/favicon.ico";
			icon = (icon.indexOf("//") === -1) ? (origin + icon) : icon;
			this.value += html`<a class="external mdc-button" href="${v}" title="${context.value.match(/<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i)[1]}" style="background-image: url(&quot;${icon}&quot;);"></a>`;
		}
	}
	this.value += html`
					</div>`;
	this.exit();
}
