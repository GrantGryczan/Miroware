const form = document.body.querySelector("#form");
const panel = form.querySelector("#panel");
let data;
const alignToByte = () => {
	if (bit > 0) {
		byte++;
		bit = 0;
	}
};
const SWF = {
	SI8: () => {
		const value = SWF.UI8();
		return value >>> 7 ? value - (1 << 8) : value;
	},
	SI16: () => {
		const value = SWF.UI16();
		return value >>> 15 ? value - (1 << 16) : value;
	},
	SI32: () => {
		const value = SWF.UI32();
		return value >>> 31 ? value - (1 << 32) : value;
	},
	UI8: () => {
		alignToByte();
		return data.bytes[data.byte++];
	},
	UI16: () => SWF.UI8() | data.bytes[data.byte++] << 8,
	UI24: () => SWF.UI16() | data.bytes[data.byte++] << 16,
	UI32: () => SWF.UI24() | data.bytes[data.byte++] << 24,
	FIXED: () => SWF.SI16() + 2 ** (Math.log(data.bytes[data.byte++]) / Math.log(2) - 16),
	FIXED8: () => SWF.SI8() + 2 ** (Math.log(data.bytes[data.byte++]) / Math.log(2) - 8),
	FLOAT16: () => {
		const value = SWF.UI16();
		const sign = value >>> 15 ? -1 : 1;
		const exponent = ((value << 17) >>> 27) - 15;
		const significand = (value << 22) >>> 22;
		return exponent === 16 ? (significand ? NaN : sign * Infinity) : sign * 2 ** exponent * ((exponent ? 1 : 0) + 2 ** (Math.log(significand) / Math.log(2) - 10));
	},
	FLOAT: () => {
		const value = SWF.UI32();
		const sign = value >>> 31 ? -1 : 1;
		const exponent = ((value << 1) >>> 24) - 127;
		const significand = (value << 9) >>> 9;
		return exponent === 128 ? (significand ? NaN : sign * Infinity) : sign * 2 ** exponent * ((exponent ? 1 : 0) + 2 ** (Math.log(significand) / Math.log(2) - 23));
	},
	DOUBLE: () => {
		
	},
	EncodedU32: () => {
		alignToByte();
		
	},
	SB: nBits => {
		
	},
	UB: nBits => {
		
	},
	FB: nBits => {
		
	}
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
			array: new Uint8Array(reader.result),
			file: {}
		};
		try {
			data.file.Signature = String.fromCharCode(...data.array.slice(0, 3));
			if (data.file.Signature.slice(1) !== "WS") {
				throw new Error("Invalid SWF signature");
			}
			const compression = data.file.Signature[0];
			if (compression === "F") {
				data.bytes = data.array.slice(8);
			} else if (compression === "C") {
				data.bytes = pako.inflate(data.array.slice(8));
			} else if (compression === "Z") {
				const result = LZMA.decompress(data.array.slice(8));
				if (typeof result === "string") {
					data.bytes = new Uint8Array(result.length);
					for (let i = 0; i < result.length; i++) {
						data.bytes[i] = result[i].charCodeAt();
					}
				} else {
					data.bytes = result;
				}
			} else {
				throw new Error("Unsupported compression method");
			}
			data.file.Version = data.array[3];
			data.file.FileLength = ((data.array[4] | data.array[5] << 8) | data.array[6] << 16) | data.array[7] << 24;
			data.byte = 0;
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
