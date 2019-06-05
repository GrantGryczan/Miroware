if (this.socialIcons) {
	this.value = "";
	this.done();
} else {
	this.cache = true;
	const htmlTitleTest = /<title(?: [^>]*)?>((?:.|\n)*?)<\/title>/i;
	const htmlIconExp = "<link(?: [^>]*?)? (?:(?:rel=(\"|')(?:[^\"'>]* )?icon(?: [^\"'>]*)?\\1(?: [^>]*?)? href=(\"|')([^\"'>]*?)\\2)|(?:href=(\"|')([^\"'>]*?)\\4(?: [^>]*?)? rel=(\"|')(?:[^\"'>]* )?icon(?: [^\"'>]*)?\\6))(?: [^>]*)?>";
	const htmlIconsTest = new RegExp(htmlIconExp, "ig");
	const htmlIconTest = new RegExp(htmlIconExp, "i");
	const iconSizeTest = / sizes=("|')([^"']+)\1/i;
	const numerically = (a, b) => a - b;
	const testSizes = (sizes, size) => {
		const smallSizes = [];
		const largeSizes = [];
		for (const size of sizes) {
			(size < 24 ? smallSizes : largeSizes).push(size);
		}
		const bestOfSizes = Math[largeSizes.length ? "min" : "max"](...(largeSizes.length ? largeSizes : smallSizes));
		return size ? size !== testSizes([size, bestOfSizes]) && bestOfSizes : bestOfSizes;
	};
	this.value = html`
					<div id="externalContainer">
						<div id="externals">`;
	for (const service of ["discord", "sponsus", "youtube", "twitter", "github", "twitch"]) {
		const context = await load(`www/${service}/`, {
			...this,
			socialIcons: true
		});
		const origin = context.redir.slice(0, context.redir.indexOf("/", context.redir.indexOf("//") + 2));
		let body;
		try {
			body = await request.get(context.redir);
		} catch (err) {
			body = err.error;
		}
		if (typeof body === "string") {
			const matches = body.match(htmlIconsTest);
			let icon = "/favicon.ico";
			if (matches) {
				let size = Infinity;
				let index = 0;
				for (let i = 0; i < matches.length; i++) {
					const sizes = matches[i].match(iconSizeTest);
					if (sizes) {
						if (sizes[2] === "any") {
							index = i;
							break;
						} else {
							const bestSize = testSizes(sizes[2].split(" ").map(parseInt).filter(isFinite).sort(numerically), size);
							if (bestSize) {
								size = bestSize;
								index = i;
							}
						}
					}
				}
				icon = matches[index].match(htmlIconTest)
				icon = icon[3] || icon[5];
			}
			icon = (icon.indexOf("//") === -1) ? (origin + icon) : icon;
			this.value += html`<a class="external mdc-button" href="/${service}/" title="$${context.value.match(htmlTitleTest)[1]}" style="background-image: url(${icon});"></a>`;
		}
	}
	this.value += html`
						</div>
					</div>`;
	this.done();
}
