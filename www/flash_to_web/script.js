const form = document.body.querySelector("#form");
const panel = form.querySelector("#panel");
let data;
const hexString = byte => {
	const hex = byte.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "application/x-shockwave-flash";
fileInput.addEventListener("change", () => {
	panel.classList.add("hidden");
	Miro.formState(form, false);
	Miro.progress.open();
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		data = {
			result: new Uint8Array(reader.result),
			file: {}
		};
		try {
			data.file.Signature = String.fromCharCode(...data.result.slice(0, 3));
			if(data.file.Signature.slice(1) !== "WS") {
				throw new Error("Invalid SWF signature");
			}
			const compression = data.file.Signature[0];
			if(compression === "F") {
				data.array = data.result.slice(8);
			} else if(compression === "C") {
				data.array = pako.inflate(data.result.slice(8));
			} else if(compression === "Z") {
				const result = LZMA.decompress(data.result.slice(8));
				if(typeof result === "string") {
					data.array = new Uint8Array(result.length);
					for(let i = 0; i < result.length; i++) {
						data.array[i] = result[i].charCodeAt();
					}
				} else {
					data.array = result;
				}
			} else {
				throw new Error("Unsupported compression method");
			}
			data.file.Version = data.result[3];
			data.file.FileLength = parseInt([...data.result.slice(4, 8)].reverse().map(hexString).join(""), 16);
			data.bit = 0;
			panel.classList.remove("hidden");
		} catch(err) {
			new Miro.Dialog("Error", html`An error occurred while trying to read the SWF file.<br>$${err}`);
		}
		console.log(data);
		Miro.formState(form, true);
		Miro.progress.close();
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
