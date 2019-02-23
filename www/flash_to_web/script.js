const form = document.body.querySelector("#form");
const panel = form.querySelector("#panel");
let data;
const alignToByte = () => {
	if (data.bit !== 0) {
		data.byte++;
		data.bit = 0;
	}
};
const BitValue = class BitValue {
	constructor(length) {
		this.array = new Array(+length);
		let byte = data.bytes[data.byte];
		for (let i = 0; i < this.array.length; i++) {
			this.array[i] = byte & 1 << 7 - data.bit ? 1 : 0;
			if (data.bit + 1 === 8) {
				byte = data.bytes[++data.byte];
				data.bit = 0;
			} else {
				data.bit++;
			}
		}
		this.update();
	}
	update() {
		this.primitive = parseInt(this.array.join(""), 2); // Arrays and strings must be used because a SWF bit value can be longer than 32 bits, and JavaScript binary operations do not values that long.
	}
	[Symbol.toPrimitive]() {
		return this.primitive;
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
	UI16: () => SWF.UI8() | SWF.UI8() << 8,
	UI24: () => SWF.UI16() | SWF.UI8() << 16,
	UI32: () => SWF.UI24() | SWF.UI8() << 24,
	FIXED: () => {
		const value = SWF.UI16() / 65536 /* 2 ** 16 */ + SWF.UI16();
		return value >>> 15 ? value - 65536 /* 2 ** 16 */ : value;
	},
	FIXED8: () => {
		const value = SWF.UI8() / 256 /* 2 ** 8 */ + SWF.UI8();
		return value >>> 7 ? value - 256 /* 2 ** 8 */ : value;
	},
	FLOAT16: () => {
		const value = SWF.UI16();
		const sign = value >>> 15 ? -1 : 1;
		const exponent = (value << 17) >>> 27;
		const significand = (value << 22) >>> 22;
		return exponent === 21 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 15) * ((exponent ? 1 : 0) + significand / 1024 /* 2 ** 10 */);
	},
	FLOAT: () => {
		const value = SWF.UI32();
		const sign = value >>> 31 ? -1 : 1;
		const exponent = (value << 1) >>> 24;
		const significand = (value << 9) >>> 9;
		return exponent === 255 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 127) * ((exponent ? 1 : 0) + significand / 8388608 /* 2 ** 23 */);
	},
	DOUBLE: () => {
		const value = SWF.UI32();
		const sign = value >>> 31 ? -1 : 1;
		const exponent = (value << 1) >>> 21;
		const significand2 = SWF.UI32().toString(2);
		const significand = parseInt(((value << 12) >>> 12).toString(2) + "0".repeat(32 - significand2.length) + significand2, 2);
		return exponent === 2047 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 1023) * ((exponent ? 1 : 0) + significand / 4503599627370496 /* 2 ** 52 */);
	},
	EncodedU32: () => {
		let value = 0;
		for (let i = 0; i < 5; i++) {
			const byte = SWF.UI8();
			value |= (byte & 127) << 7 * i;
			if (byte >>> 7 === 0) {
				break;
			}
		}
		return value;
	},
	SB: nBits => {
		const value = SWF.UB(nBits);
		return value.array[0] ? value - 2 ** nBits : +value;
	},
	UB: nBits => new BitValue(nBits),
	FB: nBits => {
		const value = SWF.UB(nBits);
		console.log(`FB[${nBits}]`, value);
		return 1; // TODO: Find the position of the decimal point
	},
	STRING: () => {
		let value = "";
		let byte;
		while (byte = SWF.UI8()) {
			value += String.fromCharCode(byte);
		}
		return value;
	},
	LANGCODE: () => SWF.UI8(),
	RGB: () => ({
		Red: SWF.UI8(),
		Green: SWF.UI8(),
		Blue: SWF.UI8()
	}),
	RGBA: () => ({
		Alpha: SWF.UI8(),
		Red: SWF.UI8(),
		Green: SWF.UI8(),
		Blue: SWF.UI8()
	}),
	RECT: () => {
		alignToByte();
		const value = {
			Nbits: +SWF.UB(5)
		};
		value.Xmin = SWF.SB(value.Nbits);
		value.Xmax = SWF.SB(value.Nbits);
		value.Ymin = SWF.SB(value.Nbits);
		value.Ymax = SWF.SB(value.Nbits);
		return value;
	},
	MATRIX: () => {
		alignToByte();
		const value = {};
		if(value.HasScale = +SWF.UB(1)) {
			value.NScaleBits = +SWF.UB(5);
			value.ScaleX = SWF.FB(value.NScaleBits);
			value.ScaleY = SWF.FB(value.NScaleBits);
		}
		if(value.HasRotate = +SWF.UB(1)) {
			value.NRotateBits = +SWF.UB(5);
			value.RotateSkew0 = SWF.FB(value.NRotateBits);
			value.RotateSkew1 = SWF.FB(value.NRotateBits);
		}
		value.NTranslateBits = +SWF.UB(5);
		value.TranslateX = SWF.SB(value.NTranslateBits);
		value.TranslateY = SWF.SB(value.NTranslateBits);
		return value;
	},
	CXFORM: () => {
		alignToByte();
		const value = {
			HasAddTerms: +SWF.UB(1),
			HasMultTerms: +SWF.UB(1),
			Nbits: +SWF.UB(4)
		};
		if(value.HasMultTerms) {
			value.RedMultTerm = SWF.SB(value.Nbits);
			value.GreenMultTerm = SWF.SB(value.Nbits);
			value.BlueMultTerm = SWF.SB(value.Nbits);
		}
		if(value.HasAddTerms) {
			value.RedAddTerm = SWF.SB(value.Nbits);
			value.GreenAddTerm = SWF.SB(value.Nbits);
			value.BlueAddTerm = SWF.SB(value.Nbits);
		}
		return value;
	},
	CXFORMWITHALPHA: () => {
		alignToByte();
		const value = {
			HasAddTerms: +SWF.UB(1),
			HasMultTerms: +SWF.UB(1),
			Nbits: +SWF.UB(4)
		};
		if(value.HasMultTerms) {
			value.RedMultTerm = SWF.SB(value.Nbits);
			value.GreenMultTerm = SWF.SB(value.Nbits);
			value.BlueMultTerm = SWF.SB(value.Nbits);
			value.AlphaMultTerm = SWF.SB(value.Nbits);
		}
		if(value.HasAddTerms) {
			value.RedAddTerm = SWF.SB(value.Nbits);
			value.GreenAddTerm = SWF.SB(value.Nbits);
			value.BlueAddTerm = SWF.SB(value.Nbits);
			value.AlphaAddTerm = SWF.SB(value.Nbits);
		}
		return value;
	}
};
const read = function() {
	data = {
		array: new Uint8Array(this.result),
		file: {},
		byte: 0,
		bit: 0
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
		data.file.FrameSize = SWF.RECT();
		data.file.FrameRate = SWF.FIXED8();
		data.file.FrameCount = SWF.UI16();
		panel.classList.remove("hidden");
	} catch(err) {
		console.error(err);
		new Miro.Dialog("Error", html`An error occurred while trying to read the SWF file.<br>$${err}`);
	}
	console.log(data);
	Miro.formState(form, true);
	Miro.progress.close();
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "application/x-shockwave-flash";
fileInput.addEventListener("change", () => {
	panel.classList.add("hidden");
	Miro.formState(form, false);
	Miro.progress.open();
	const reader = new FileReader();
	reader.addEventListener("loadend", read);
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
