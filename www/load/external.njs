if(this.socialicons) {
	this.value = "";
	this.exit();
} else {
	var links = ["/discord/", "/patreon/", "/youtube/", "/twitter/", "/github/"];
	var t = this;
	t.cache = 1;
	t.value = html`
						<div id="externals">`;
	var i = 0;
	var iterate = async function() {
		if(i == links.length) {
			t.value += html`
						</div>`;
			t.exit();
		} else {
			var context = await load(links[i], {
				socialicons: true
			});
			request(context.redirect, function(err, res, body) {
				var origin = context.redirect.slice(0, context.redirect.indexOf("/", context.redirect.indexOf("//")+2));
				var icon = body.match(/<link(?: .*?)? (?:rel="(?:.* )?icon(?: .*)?"(?: .*?)? href="([^"]*?)")|(?:href="([^"]*?)"(?: .*?)? rel="(?:.* )?icon(?: .*)?")( [^>]*)?>/i)[1];
				if(!icon) {
					icon = "/favicon.ico";
				}
				icon = (icon.indexOf("//") == -1) ? (origin + icon) : icon;
				t.value += html`<a class="external mdc-button" href="${links[i]}" title="${context.value.match(/<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i)[1]}" style="background-image: url(&quot;${icon}&quot;);"></a>`;
				i++;
				iterate();
			});
		}
	};
	iterate();
}
