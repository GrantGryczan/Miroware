const form = document.body.querySelector("#form");
const panel = form.querySelector("#panel");
let data;
const alignToByte = () => {
	if (data.bitPos !== 0) {
		data.bytePos++;
		data.bitPos = 0;
	}
};
const SWF = {
	Array: (type, n) => {
		const array = new Array(+n);
		for (let i = 0; i < n; i++) {
			array[i] = type();
		}
		return array;
	},
	SI8: () => {
		const value = SWF.UI8();
		return value & 0b10000000 ? value - 256 /* 2 ** 8 */ : value;
	},
	SI16: () => {
		const value = SWF.UI16();
		return value & 0b1000000000000000 ? value - 65536 /* 2 ** 16 */ : value;
	},
	SI32: () => {
		const value = SWF.UI32();
		return value & 0b10000000000000000000000000000000 ? value - 4294967296 /* 2 ** 32 */ : value;
	},
	UI8: () => {
		alignToByte();
		return data.bytes[data.bytePos++];
	},
	UI16: () => SWF.UI8() | SWF.UI8() << 8,
	UI24: () => SWF.UI16() | SWF.UI8() << 16,
	UI32: () => SWF.UI24() | SWF.UI8() << 24,
	FIXED: () => SWF.SI16() + SWF.UI16() / 65536 /* 2 ** 16 */,
	FIXED8: () => SWF.SI8() + SWF.UI8() / 256 /* 2 ** 8 */,
	FLOAT16: () => {
		const value = SWF.UI16();
		const sign = value & 0b1000000000000000 ? -1 : 1;
		const exponent = value >>> 10 & 0b011111;
		const significand = value & 0b0000001111111111;
		return exponent === 0b11111 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 15) * ((exponent ? 1 : 0) + significand / 1024 /* 2 ** 10 */);
	},
	FLOAT: () => {
		const value = SWF.UI32();
		const sign = value & 0b10000000000000000000000000000000 ? -1 : 1;
		const exponent = value >>> 23 & 0b011111111;
		const significand = value & 0b00000000011111111111111111111111;
		return exponent === 0b11111111 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 127) * ((exponent ? 1 : 0) + significand / 8388608 /* 2 ** 23 */);
	},
	DOUBLE: () => {
		const value = SWF.UI32();
		const sign = value & 0b10000000000000000000000000000000 ? -1 : 1;
		const exponent = value >>> 20 & 0b011111111111;
		const significand2 = SWF.UI32().toString(2);
		const significand = parseInt((value & 0b00000000000011111111111111111111).toString(2) + "0".repeat(32 - significand2.length) + significand2, 2);
		return exponent === 0b11111111111 ? (significand ? NaN : sign * Infinity) : sign * 2 ** (exponent - 1023) * ((exponent ? 1 : 0) + significand / 4503599627370496 /* 2 ** 52 */);
	},
	EncodedU32: () => {
		let value = 0;
		for (let i = 0; i < 5; i++) {
			const byte = SWF.UI8();
			value |= (byte & 0b01111111) << 7 * i;
			if (byte >>> 7 === 0) {
				break;
			}
		}
		return value;
	},
	SB: (nBits = 1) => {
		const value = SWF.UB(nBits);
		return value & 1 << nBits - 1 ? value - 2 ** nBits : value;
	},
	UB: (nBits = 1) => {
		let value = 0;
		let byte = data.bytes[data.bytePos];
		for (let i = 0; i < nBits; i++) {
			value = value << 1 | (byte >>> 7 - data.bitPos & 1);
			if (++data.bitPos === 8) {
				byte = data.bytes[++data.bytePos];
				data.bitPos = 0;
			}
		}
		return value;
	},
	FB: (nBits = 1) => {
		const value = SWF.Array(SWF.UB, nBits);
		console.log(`FB[${nBits}]`, value);
		return 1; // TODO: Find the position of the decimal point
	},
	STRING: (length = Infinity) => {
		let value = "";
		let byte;
		while (value.length < length && (byte = SWF.UI8())) {
			value += String.fromCharCode(byte);
		}
		return value;
	},
	LANGCODE: () => ({
		LanguageCode: SWF.UI8()
	}),
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
			Nbits: SWF.UB(5)
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
		if (value.HasScale = SWF.UB()) {
			value.NScaleBits = SWF.UB(5);
			value.ScaleX = SWF.FB(value.NScaleBits);
			value.ScaleY = SWF.FB(value.NScaleBits);
		}
		if (value.HasRotate = SWF.UB()) {
			value.NRotateBits = SWF.UB(5);
			value.RotateSkew0 = SWF.FB(value.NRotateBits);
			value.RotateSkew1 = SWF.FB(value.NRotateBits);
		}
		value.NTranslateBits = SWF.UB(5);
		value.TranslateX = SWF.SB(value.NTranslateBits);
		value.TranslateY = SWF.SB(value.NTranslateBits);
		return value;
	},
	CXFORM: () => {
		alignToByte();
		const value = {
			HasAddTerms: SWF.UB(),
			HasMultTerms: SWF.UB(),
			Nbits: SWF.UB(4)
		};
		if (value.HasMultTerms) {
			value.RedMultTerm = SWF.SB(value.Nbits);
			value.GreenMultTerm = SWF.SB(value.Nbits);
			value.BlueMultTerm = SWF.SB(value.Nbits);
		}
		if (value.HasAddTerms) {
			value.RedAddTerm = SWF.SB(value.Nbits);
			value.GreenAddTerm = SWF.SB(value.Nbits);
			value.BlueAddTerm = SWF.SB(value.Nbits);
		}
		return value;
	},
	CXFORMWITHALPHA: () => {
		alignToByte();
		const value = {
			HasAddTerms: SWF.UB(),
			HasMultTerms: SWF.UB(),
			Nbits: SWF.UB(4)
		};
		if (value.HasMultTerms) {
			value.RedMultTerm = SWF.SB(value.Nbits);
			value.GreenMultTerm = SWF.SB(value.Nbits);
			value.BlueMultTerm = SWF.SB(value.Nbits);
			value.AlphaMultTerm = SWF.SB(value.Nbits);
		}
		if (value.HasAddTerms) {
			value.RedAddTerm = SWF.SB(value.Nbits);
			value.GreenAddTerm = SWF.SB(value.Nbits);
			value.BlueAddTerm = SWF.SB(value.Nbits);
			value.AlphaAddTerm = SWF.SB(value.Nbits);
		}
		return value;
	},
	RECORDHEADER: () => {
		const value = {
			TagCodeAndLength: SWF.UI16()
		};
		value.TagCode = value.TagCodeAndLength >>> 6;
		value.Length = value.TagCodeAndLength & 0b0000000000111111;
		if (value.Length === 0b111111) {
			value.Length = SWF.UI32();
		}
		return value;
	},
	PlaceObject: value => {
		const bytePos = data.bytePos;
		value.CharacterId = SWF.UI16();
		value.Depth = SWF.UI16();
		value.Matrix = SWF.MATRIX();
		if (bytePos < data.bytePos + value.Header.Length) {
			value.ColorTransform = SWF.CXFORM();
		}
		return value;
	},
	PlaceObject2: value => {
		value.PlaceFlagHasClipActions = SWF.UB();
		value.PlaceFlagHasClipDepth = SWF.UB();
		value.PlaceFlagHasName = SWF.UB();
		value.PlaceFlagHasRatio = SWF.UB();
		value.PlaceFlagHasColorTransform = SWF.UB();
		value.PlaceFlagHasMatrix = SWF.UB();
		value.PlaceFlagHasCharacter = SWF.UB();
		value.PlaceFlagMove = SWF.UB();
		value.Depth = SWF.UI16();
		if (value.PlaceFlagHasCharacter) {
			value.CharacterId = SWF.UI16();
		}
		if (value.PlaceFlagHasMatrix) {
			value.Matrix = SWF.MATRIX();
		}
		if (value.PlaceFlagHasColorTransform) {
			value.ColorTransform = SWF.CXFORMWITHALPHA();
		}
		if (value.PlaceFlagHasRatio) {
			value.Ratio = SWF.UI16();
		}
		if (value.PlaceFlagHasName) {
			value.Name = SWF.STRING();
		}
		if (value.PlaceFlagHasClipDepth) {
			value.ClipDepth = SWF.UI16();
		}
		if (value.PlaceFlagHasClipActions) {
			value.ClipActions = SWF.CLIPACTIONS();
		}
		return value;
	},
	CLIPACTIONS: () => {
		data.bytePos += 16;
		const value = {
			AllEventFlags: SWF.CLIPEVENTFLAGS(),
			ClipActionRecords: []
		};
		const clipActionEndFlag = data.file.Version < 6 ? SWF.UI16 : SWF.UI32;
		alignToByte();
		for (let bytePos, endFlag; bytePos = data.bytePos, endFlag = clipActionEndFlag();) {
			data.bytePos = bytePos;
			value.ClipActionRecords.push(SWF.CLIPACTIONRECORD());
		}
		return value;
	},
	CLIPACTIONRECORD: () => {
		const value = {
			EventFlags: SWF.CLIPEVENTFLAGS(),
			ActionRecordSize: SWF.UI32()
		};
		const endPos = data.bytePos + value.ActionRecordSize;
		if (value.EventFlags.ClipEventKeyPress) {
			value.KeyCode = SWF.UI8();
		}
		value.Actions = [];
		while (data.bytePos < endPos) {
			value.Actions.push(SWF.ACTIONRECORD());
		}
		return value;
	},
	PlaceObject3: value => {
		value.PlaceFlagHasClipActions = SWF.UB();
		value.PlaceFlagHasClipDepth = SWF.UB();
		value.PlaceFlagHasName = SWF.UB();
		value.PlaceFlagHasRatio = SWF.UB();
		value.PlaceFlagHasColorTransform = SWF.UB();
		value.PlaceFlagHasMatrix = SWF.UB();
		value.PlaceFlagHasCharacter = SWF.UB();
		value.PlaceFlagMove = SWF.UB();
		value.PlaceFlagOpaqueBackground = SWF.UB();
		value.PlaceFlagHasVisible = SWF.UB();
		value.PlaceFlagHasImage = SWF.UB();
		value.PlaceFlagHasClassName = SWF.UB();
		value.PlaceFlagHasCacheAsBitmap = SWF.UB();
		value.PlaceFlagHasBlendMode = SWF.UB();
		value.PlaceFlagHasFilterList = SWF.UB();
		value.Depth = SWF.UI16();
		if (value.PlaceFlagHasClassName || (value.PlaceFlagHasImage && value.PlaceFlagHasCharacter)) {
			value.ClassName = SWF.STRING();
		}
		if (value.PlaceFlagHasCharacter) {
			value.CharacterId = SWF.UI16();
		}
		if (value.PlaceFlagHasMatrix) {
			value.Matrix = SWF.MATRIX();
		}
		if (value.PlaceFlagHasColorTransform) {
			value.ColorTransform = SWF.CXFORMWITHALPHA();
		}
		if (value.PlaceFlagHasRatio) {
			value.Ratio = SWF.UI16();
		}
		if (value.PlaceFlagHasName) {
			value.Name = SWF.STRING();
		}
		if (value.PlaceFlagHasClipDepth) {
			value.ClipDepth = SWF.UI16();
		}
		if (value.PlaceFlagHasFilterList) {
			value.SurfaceFilterList = SWF.FILTERLIST();
		}
		if (value.PlaceFlagHasBlendMode) {
			value.BlendMode = SWF.UI8();
		}
		if (value.PlaceFlagHasCacheAsBitmap) {
			value.BitmapCache = SWF.UI8();
		}
		if (value.PlaceFlagHasVisible) {
			value.Visible = SWF.UI8();
			value.BackgroundColor = SWF.RGBA();
		}
		if (value.PlaceFlagHasClipActions) {
			value.ClipActions = SWF.CLIPACTIONS();
		}
		return value;
	},
	FILTERLIST: () => {
		const value = {
			NumberOfFilters: SWF.UI8()
		};
		value.Filters = SWF.Array(SWF.FILTER, value.NumberOfFilters);
		return value;
	},
	FILTER: () => {
		const value = {
			FilterID: SWF.UI8()
		};
		if (value.FilterID === 0) {
			value.DropShadowFilter = SWF.DROPSHADOWFILTER();
		} else if (value.FilterID === 1) {
			value.BlurFilter = SWF.BLURFILTER();
		} else if (value.FilterID === 2) {
			value.GlowFilter = SWF.GLOWFILTER();
		} else if (value.FilterID === 3) {
			value.BevelFilter = SWF.BEVELFILTER();
		} else if (value.FilterID === 4) {
			value.GradientGlowFilter = SWF.GRADIENTGLOWFILTER();
		} else if (value.FilterID === 5) {
			value.ConvolutionFilter = SWF.CONVOLUTIONFILTER();
		} else if (value.FilterID === 6) {
			value.ColorMatrixFilter = SWF.COLORMATRIXFILTER();
		} else if (value.FilterID === 7) {
			value.GradientBevelFilter = SWF.GRADIENTBEVELFILTER();
		}
		return value;
	},
	COLORMATRIXFILTER: () => ({
		Matrix: SWF.Array(SWF.FLOAT, 20)
	}),
	CONVOLUTIONFILTER: () => {
		const value = {
			MatrixX: SWF.UI8(),
			MatrixY: SWF.UI8(),
			Divisor: SWF.FLOAT(),
			Bias: SWF.FLOAT()
		};
		value.Matrix = SWF.Array(SWF.FLOAT, value.MatrixX * value.MatrixY);
		value.DefaultColor = SWF.RGBA();
		SWF.UB(6);
		value.Clamp = SWF.UB();
		value.PreserveAlpha = SWF.UB();
		return value;
	},
	BLURFILTER: () => {
		const value = {
			BlurX: SWF.FIXED(),
			BlurY: SWF.FIXED(),
			Passes: SWF.UB(5)
		};
		SWF.UB(3);
		return value;
	},
	DROPSHADOWFILTER: () => ({
		DropShadowColor: SWF.RGBA(),
		BlurX: SWF.FIXED(),
		BlurY: SWF.FIXED(),
		Angle: SWF.FIXED(),
		Distance: SWF.FIXED(),
		Strength: SWF.FIXED8(),
		InnerShadow: SWF.UB(),
		Knockout: SWF.UB(),
		CompositeSource: SWF.UB(),
		Passes: SWF.UB(5)
	}),
	GLOWFILTER: () => ({
		GlowColor: SWF.RGBA(),
		BlurX: SWF.FIXED(),
		BlurY: SWF.FIXED(),
		Strength: SWF.FIXED8(),
		InnerGlow: SWF.UB(),
		Knockout: SWF.UB(),
		CompositeSource: SWF.UB(),
		Passes: SWF.UB(5)
	}),
	BEVELFILTER: () => ({
		ShadowColor: SWF.RGBA(),
		HighlightColor: SWF.RGBA(),
		BlurX: SWF.FIXED(),
		BlurY: SWF.FIXED(),
		Angle: SWF.FIXED(),
		Distance: SWF.FIXED(),
		Strength: SWF.FIXED8(),
		InnerShadow: SWF.UB(),
		Knockout: SWF.UB(),
		CompositeSource: SWF.UB(),
		OnTop: SWF.UB(),
		Passes: SWF.UB(4)
	}),
	GRADIENTGLOWFILTER: () => {
		const value = {
			NumColors: SWF.UI8()
		};
		value.GradientColors = SWF.Array(SWF.RGBA, value.NumColors);
		value.GradientRatio = SWF.Array(SWF.UI8, value.NumColors);
		value.BlurX = SWF.FIXED();
		value.BlurY = SWF.FIXED();
		value.Angle = SWF.FIXED();
		value.Distance = SWF.FIXED();
		value.Strength = SWF.FIXED8();
		value.InnerShadow = SWF.UB();
		value.Knockout = SWF.UB();
		value.CompositeSource = SWF.UB();
		value.OnTop = SWF.UB();
		value.Passes = SWF.UB(4);
		return value;
	},
	GRADIENTBEVELFILTER: () => {
		const value = {
			NumColors: SWF.UI8()
		};
		value.GradientColors = SWF.Array(SWF.RGBA, value.NumColors);
		value.GradientRatio = SWF.Array(SWF.UI8, value.NumColors);
		value.BlurX = SWF.FIXED();
		value.BlurY = SWF.FIXED();
		value.Angle = SWF.FIXED();
		value.Distance = SWF.FIXED();
		value.Strength = SWF.FIXED8();
		value.InnerShadow = SWF.UB();
		value.Knockout = SWF.UB();
		value.CompositeSource = SWF.UB();
		value.OnTop = SWF.UB();
		value.Passes = SWF.UB(4);
		return value;
	},
	CLIPEVENTFLAGS: () => {
		const value = {
			ClipEventKeyUp: SWF.UB(),
			ClipEventKeyDown: SWF.UB(),
			ClipEventMouseUp: SWF.UB(),
			ClipEventMouseDown: SWF.UB(),
			ClipEventMouseMove: SWF.UB(),
			ClipEventUnload: SWF.UB(),
			ClipEventEnterFrame: SWF.UB(),
			ClipEventLoad: SWF.UB(),
			ClipEventDragOver: SWF.UB(),
			ClipEventRollOut: SWF.UB(),
			ClipEventRollOver: SWF.UB(),
			ClipEventReleaseOutside: SWF.UB(),
			ClipEventRelease: SWF.UB(),
			ClipEventPress: SWF.UB(),
			ClipEventInitialize: SWF.UB(),
			ClipEventData: SWF.UB()
		};
		if (data.file.Version >= 6) {
			SWF.UB(5);
			value.ClipEventConstruct = SWF.UB();
			value.ClipEventKeyPress = SWF.UB();
			value.ClipEventDragOut = SWF.UB();
			SWF.UB(8);
		}
		return value;
	},
	RemoveObject: value => {
		value.CharacterId = SWF.UI16();
		value.Depth = SWF.UI16();
	},
	RemoveObject2: value => {
		value.Depth = SWF.UI16();
	},
	ShowFrame: () => {}
};
const tagTypes = {
	4: SWF.PlaceObject,
	26: SWF.PlaceObject2,
	70: SWF.PlaceObject3,
	5: SWF.RemoveObject,
	28: SWF.RemoveObject2,
	1: SWF.ShowFrame
};
const read = function() {
	data = {
		array: new Uint8Array(this.result),
		file: {},
		bytePos: 0,
		bitPos: 0
	};
	try {
		data.file.Signature = String.fromCharCode(...data.array.slice(0, 3));
		if (data.file.Signature.slice(1) !== "WS") {
			throw new Error("Invalid SWF Signature");
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
			throw new Error(`Unsupported compression Signature ${compression}`);
		}
		data.file.Version = data.array[3];
		data.file.FileLength = ((data.array[4] | data.array[5] << 8) | data.array[6] << 16) | data.array[7] << 24;
		data.file.FrameSize = SWF.RECT();
		data.file.FrameRate = SWF.UI8() / 256 /* 2 ** 8 */ + SWF.UI8();
		data.file.FrameCount = SWF.UI16();
		data.file.Tags = [];
		while (data.bytePos < data.bytes.length) {
			const tag = {
				Header: SWF.RECORDHEADER()
			};
			const tagType = tagTypes[tag.Header.TagCode];
			if (tagType) {
				tagType(tag);
			} else {
				console.warn(`Unsupported TagCode ${tag.Header.TagCode}`);
				data.bytePos += tag.Header.Length;
			}
			data.file.Tags.push(tag);
		}
		if ((data.bytePos += 8) !== data.file.FileLength) {
			throw new Error(`Final bytePos ${data.bytePos} does not equal FileLength ${data.file.FileLength}`);
		}
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
