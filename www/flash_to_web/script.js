const form = document.body.querySelector("#form");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "application/x-shockwave-flash";
fileInput.addEventListener("change", () => {
	Miro.formState(form, false);
	Miro.progress.open();
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		Miro.formState(form, true);
		Miro.progress.close();
		const array = new Uint8Array(reader.result);
		console.log(array);
		form.classList.remove("hidden");
	});
	reader.readAsArrayBuffer(fileInput.files[0]);
	fileInput.value = null;
});
form.elements.import.addEventListener("click", fileInput.click.bind(fileInput));
form.addEventListener("submit", evt => {
	evt.preventDefault();
	html`<a href="$${URL.createObjectURL(new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${html.escape(form.elements.title.value)}</title></head><body></body></html>`], {
		type: "text/html"
	}))}" download="$${form.elements.title.value}.html"></a>`.click();
});
