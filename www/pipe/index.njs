this.title = "Pipe";
this.description = "Host your files with decency.";
this.tags = ["pipe", "file", "files", "host", "hosting", "hoster", "upload", "uploader", "image", "images", "direct", "link", "links", "url", "urls", "free"];
this.image = "/pipe/images/icon/full.png";
this.icon = "/pipe/images/icon/cover.png";
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>Miroware Pipe lets you upload any type of file to link from any applicable website, forever for free.</p>
				<div>
					<a class="mdc-button mdc-button--raised mdc-ripple" href="${this.user ? `/users/${this.user._id}/pipe/#` : "/login/?dest=%2Fpipe%2F"}">Go to your Pipe</a>
				</div>
				<div id="cube"></div>
				<p id="details">
					<b>${(await users.aggregate([{
						$project: {
							size: {
								$size: "$pipe"
							}
						}
					}, {
						$group: {
							_id: null,
							count: {
								$sum: "$size"
							}
						}
					}]).next()).count}</b> items have been uploaded in total!
				</p>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
