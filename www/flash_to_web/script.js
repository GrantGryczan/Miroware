const panel = document.body.querySelector("#panel");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "application/x-shockwave-flash";
fileInput.addEventListener("change", () => {
	Miro.progress.open();
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		Miro.progress.close();
		const array = new Uint8Array(reader.result);
		console.log(array);
	});
	reader.readAsArrayBuffer(fileInput.files[0]);
	fileInput.value = null;
});
document.body.querySelector("#upload").addEventListener("click", fileInput.click.bind(fileInput));
panel.addEventListener("submit", evt => {
	evt.preventDefault();
	const code = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${html.escape(panel.elements.title.value)}</title></head><body></body></html>`;
	html`<a href="$${URL.createObjectURL(new Blob([code], {
		type: "text/html"
	}))}" download="$${panel.elements.title.value}.html"></a>`.click();
});
