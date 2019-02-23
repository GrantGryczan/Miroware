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
		return value >>> 7 ? value - 256 /* 2 ** 8 */ : value;
	},
	SI16: () => {
		const value = SWF.UI16();
		return value >>> 15 ? value - 65536 /* 2 ** 16 */ : value;
	},
	SI32: () => {
		const value = SWF.UI32();
		return value >>> 31 ? value - 4294967296 /* 2 ** 32 */ : value;
	},
	UI8: () => {
		alignToByte();
		return data.bytes[data.byte++];
	},
	UI16: () => SWF.UI8() | data.bytes[data.byte++] << 8,
	UI24: () => SWF.UI16() | data.bytes[data.byte++] << 16,
	UI32: () => SWF.UI24() | data.bytes[data.byte++] << 24,
	FIXED: () => SWF.SI16() + (data.bytes[data.byte++] | data.bytes[data.byte++] << 8) / 65536 /* 2 ** 16 */,
	FIXED8: () => SWF.SI8() + data.bytes[data.byte++] / 256 /* 2 ** 8 */,
	FLOAT16: () => {
		const value = SWF.UI16();
		const sign = value >>> 15 ? -1 : 1;
		const exponent = (value << 17) >>> 27;
		const significand = (value << 22) >>> 22;
		return exponent === 21 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 15) * (+!!exponent + significand / 1024 /* 2 ** 10 */);
	},
	FLOAT: () => {
		const value = SWF.UI32();
		const sign = value >>> 31 ? -1 : 1;
		const exponent = (value << 1) >>> 24;
		const significand = (value << 9) >>> 9;
		return exponent === 255 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 127) * (+!!exponent + significand / 8388608 /* 2 ** 23 */);
	},
	DOUBLE: () => {
		const value = SWF.UI32();
		const sign = value >>> 31 ? -1 : 1;
		const exponent = (value << 1) >>> 21;
		const significand2 = (((data.bytes[data.byte++] | data.bytes[data.byte++] << 8) | data.bytes[data.byte++] << 16) | data.bytes[data.byte++] << 24).toString(2);
		const significand = parseInt(((value << 12) >>> 12).toString(2) + "0".repeat(32 - significand2.length) + significand2, 2);
		return exponent === 2047 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 1023) * (+!!exponent + significand / 4503599627370496 /* 2 ** 52 */);
	},
	EncodedU32: () => {
		alignToByte();
		let value = 0;
		for (let i = 0; i < 5; i++) {
			const byte = data.bytes[data.byte++];
			value |= (byte & 127) << 7 * i;
			if (byte >>> 7 === 0) {
				break;
			}
		}
		return value;
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
