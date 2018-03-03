let string = this.req.url;
const queryIndex = string.indexOf("?")+1;
if(queryIndex && (string = string.slice(queryIndex))) {
	string = decodeURIComponent(string);
} else {
	string = "Hello, world!";
}
this.title = string;
this.description = string;
this.tags = ["string"];
this.value = (await load("/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body", this)).value;
this.value += html`
			<div id="string">${string}</div>`;
this.value += (await load("/load/belt", this)).value;
this.value += (await load("/load/foot", this)).value;
this.exit();
