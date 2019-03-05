const form = document.body.querySelector("#form");
const panel = form.querySelector("#panel");
let data;
const alignToByte = () => {
	if (data.bitPos !== 0) {
		data.bytePos++;
		data.bitPos = 0;
	}
};
const getArray = (type, length) => {
	const array = new Array(+length);
	for (let i = 0; i < length; i++) {
		array[i] = type();
	}
	return array;
};
const getFlaggedArray = (type, flagType, flagValue, oneOrMore) => {
	const array = [];
	if (oneOrMore) {
		array.push(type());
	}
	for (let bytePos, bitPos; bytePos = data.bytePos, bitPos = data.bitPos, flagType() !== flagValue;) {
		data.bytePos = bytePos;
		data.bitPos = bitPos;
		array.push(type());
	}
	return array;
};
const SWF = {
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
	EncodedUI32: () => {
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
		const value = getArray(SWF.UB, nBits);
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
		const endPos = data.bytePos + value.Header.Length;
		value.CharacterId = SWF.UI16();
		value.Depth = SWF.UI16();
		value.Matrix = SWF.MATRIX();
		if (data.bytePos < endPos) {
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
		SWF.UI16();
		return {
			AllEventFlags: SWF.CLIPEVENTFLAGS(),
			ClipActionRecords: getFlaggedArray(SWF.CLIPACTIONRECORD, data.file.Version < 6 ? SWF.UI16 : SWF.UI32, 0, true)
		};
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
		value.Filters = getArray(SWF.FILTER, value.NumberOfFilters);
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
		Matrix: getArray(SWF.FLOAT, 20)
	}),
	CONVOLUTIONFILTER: () => {
		const value = {
			MatrixX: SWF.UI8(),
			MatrixY: SWF.UI8(),
			Divisor: SWF.FLOAT(),
			Bias: SWF.FLOAT()
		};
		value.Matrix = getArray(SWF.FLOAT, value.MatrixX * value.MatrixY);
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
		value.GradientColors = getArray(SWF.RGBA, value.NumColors);
		value.GradientRatio = getArray(SWF.UI8, value.NumColors);
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
		value.GradientColors = getArray(SWF.RGBA, value.NumColors);
		value.GradientRatio = getArray(SWF.UI8, value.NumColors);
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
	ShowFrame: () => {},
	SetBackgroundColor: value => {
		value.BackgroundColor = SWF.RGB();
	},
	FrameLabel: value => {
		const endPos = data.bytePos + value.Header.Length;
		value.Name = SWF.STRING();
		if (data.bytePos < endPos) {
			value.NamedAnchor = SWF.UI8();
		}
	},
	Protect: value => {
		if (value.Header.Length) {
			value.Password = SWF.STRING();
		}
	},
	End: () => {},
	ExportAssets: value => {
		value.Count = SWF.UI16();
		value.Tag = [];
		value.Name = [];
		for (let i = 0; i < value.Count; i++) {
			value.Tag[i] = SWF.UI16();
			value.Name[i] = SWF.STRING();
		}
	},
	ImportAssets: value => {
		value.URL = SWF.STRING();
		value.Count = SWF.UI16();
		value.Tag = [];
		value.Name = [];
		for (let i = 0; i < value.Count; i++) {
			value.Tag[i] = SWF.UI16();
			value.Name[i] = SWF.STRING();
		}
	},
	EnableDebugger: value => {
		value.Password = SWF.STRING();
	},
	EnableDebugger2: value => {
		SWF.UI16();
		value.Password = SWF.STRING();
	},
	ScriptLimits: value => {
		value.MaxRecursionDepth = SWF.UI16();
		value.ScriptTimeoutSeconds = SWF.UI16();
	},
	SetTabIndex: value => {
		value.Depth = SWF.UI16();
		value.TabIndex = SWF.UI16();
	},
	FileAttributes: value => {
		SWF.UB();
		value.UseDirectBlit = SWF.UB();
		value.UseGPU = SWF.UB();
		value.HasMetadata = SWF.UB();
		value.ActionScript3 = SWF.UB();
		SWF.UB(2);
		value.UseNetwork = SWF.UB();
		SWF.UB(24);
	},
	ImportAssets2: value => {
		value.URL = SWF.STRING();
		SWF.UI8();
		SWF.UI8();
		value.Count = SWF.UI16();
		value.Tag = [];
		value.Name = [];
		for (let i = 0; i < value.Count; i++) {
			value.Tag[i] = SWF.UI16();
			value.Name[i] = SWF.STRING();
		}
	},
	SymbolClass: value => {
		value.NumSymbols = SWF.UI16();
		value.Tag = [];
		value.Name = [];
		for (let i = 0; i < value.NumSymbols; i++) {
			value.Tag[i] = SWF.UI16();
			value.Name[i] = SWF.STRING();
		}
	},
	Metadata: value => {
		value.Metadata = SWF.STRING();
	},
	DefineScalingGrid: value => {
		value.CharacterId = SWF.UI16();
		value.Splitter = SWF.RECT();
	},
	DefineSceneAndFrameLabelData: value => {
		value.SceneCount = SWF.EncodedUI32();
		value.Offset = [];
		value.Name = [];
		for (let i = 0; i < value.SceneCount; i++) {
			value.Offset[i] = SWF.EncodedUI32();
			value.Name[i] = SWF.STRING();
		}
		value.FrameLabelCount = SWF.EncodedUI32();
		value.FrameNum = [];
		value.FrameLabel = [];
		for (let i = 0; i < value.FrameLabelCount; i++) {
			value.FrameNum[i] = SWF.EncodedUI32();
			value.FrameLabel[i] = SWF.STRING();
		}
	},
	DoAction: value => {
		value.Actions = getFlaggedArray(SWF.ACTIONRECORD, SWF.UI8, 0);
	},
	ACTIONRECORD: () => {
		const value = {
			Header: SWF.ACTIONRECORDHEADER()
		};
		const actionType = actionTypes[value.Header.ActionCode];
		if (actionType) {
			actionType(value);
		} else {
			const hex = value.Header.ActionCode.toString(16);
			const message = `Unsupported ActionCode 0x${hex.length === 1 ? `0${hex}` : hex}`;
			if ("Length" in value.Header) {
				console.warn(message);
				data.bytePos += value.Header.Length;
			} else {
				throw new Error(message);
			}
		}
		return value;
	},
	ACTIONRECORDHEADER: () => {
		const value = {
			ActionCode: SWF.UI8()
		};
		if (value.ActionCode >= 0x80) {
			value.Length = SWF.UI16();
		}
		return value;
	},
	ActionGotoFrame: value => {
		value.Frame = SWF.UI16();
	},
	ActionGetURL: value => {
		value.UrlString = SWF.STRING();
		value.TargetString = SWF.STRING();
	},
	ActionNextFrame: () => {},
	ActionPreviousFrame: () => {},
	ActionPlay: () => {},
	ActionStop: () => {},
	ActionToggleQuality: () => {},
	ActionStopSounds: () => {},
	ActionWaitForFrame: value => {
		value.Frame = SWF.UI16();
		value.SkipCount = SWF.UI8();
	},
	ActionSetTarget: value => {
		value.TargetName = SWF.STRING();
	},
	ActionGoToLabel: value => {
		value.Label = SWF.STRING();
	},
	ActionPush: value => {
		value.Type = SWF.UI8();
		if (value.Type === 0) {
			value.String = SWF.STRING();
		} else if (value.Type === 1) {
			value.Float = SWF.FLOAT();
		} else if (value.Type === 4) {
			value.RegisterNumber = SWF.UI8();
		} else if (value.Type === 5) {
			value.Boolean = SWF.UI8();
		} else if (value.Type === 6) {
			value.Double = SWF.DOUBLE();
		} else if (value.Type === 7) {
			value.Integer = SWF.UI32();
		} else if (value.Type === 8) {
			value.Constant8 = SWF.UI8();
		} else if (value.Type === 9) {
			value.Constant16 = SWF.UI16();
		}
	},
	ActionPop: () => {},
	ActionAdd: () => {},
	ActionSubtract: () => {},
	ActionMultiply: () => {},
	ActionDivide: () => {},
	ActionEquals: () => {},
	ActionLess: () => {},
	ActionAnd: () => {},
	ActionOr: () => {},
	ActionNot: () => {},
	ActionStringEquals: () => {},
	ActionStringLength: () => {},
	ActionStringAdd: () => {},
	ActionStringExtract: () => {},
	ActionStringLess: () => {},
	ActionMBStringLength: () => {},
	ActionMBStringExtract: () => {},
	ActionToInteger: () => {},
	ActionCharToAscii: () => {},
	ActionAsciiToChar: () => {},
	ActionMBCharToAscii: () => {},
	ActionMBAsciiToChar: () => {},
	ActionJump: value => {
		value.BranchOffset = SWF.SI16();
	},
	ActionIf: value => {
		value.BranchOffset = SWF.SI16();
	},
	ActionCall: () => {},
	ActionGetVariable: () => {},
	ActionSetVariable: () => {},
	ActionGetURL2: value => {
		value.SendVarsMethod = SWF.UB(2);
		SWF.UB(4);
		value.LoadTargetFlag = SWF.UB();
		value.LoadVariablesFlag = SWF.UB();
	},
	ActionGotoFrame2: value => {
		SWF.UB(6);
		value.SceneBiasFlag = SWF.UB();
		value.PlayFlag = SWF.UB();
		if (value.SceneBiasFlag) {
			value.SceneBias = SWF.UI16();
		}
	},
	ActionSetTarget2: () => {},
	ActionGetProperty: () => {},
	ActionSetProperty: () => {},
	ActionCloneSprite: () => {},
	ActionRemoveSprite: () => {},
	ActionStartDrag: () => {},
	ActionEndDrag: () => {},
	ActionWaitForFrame2: value => {
		value.SkipCount = SWF.UI8();
	},
	ActionTrace: () => {},
	ActionGetTime: () => {},
	ActionRandomNumber: () => {},
	ActionCallFunction: () => {},
	ActionCallMethod: () => {},
	ActionConstantPool: value => {
		value.ConstantPool = getArray(SWF.STRING, value.Count = SWF.UI16());
	},
	ActionDefineFunction: value => {
		value.FunctionName = SWF.STRING();
		value.param = getArray(SWF.STRING, value.NumParams = SWF.UI16());
		value.codeSize = SWF.UI16();
		console.warn(`Skipped ActionDefineFunction.codeSize ${value.codeSize} bytes`, data.bytes.slice(data.bytePos, data.bytePos += value.codeSize));
	},
	ActionDefineLocal: () => {},
	ActionDefineLocal2: () => {},
	ActionDelete: () => {},
	ActionDelete2: () => {},
	ActionEnumerate: () => {},
	ActionEquals2: () => {},
	ActionGetMember: () => {},
	ActionInitArray: () => {},
	ActionInitObject: () => {},
	ActionNewMethod: () => {},
	ActionNewObject: () => {},
	ActionSetMember: () => {},
	ActionTargetPath: () => {},
	ActionWith: value => {
		value.Size = SWF.UI16();
	},
	ActionToNumber: () => {},
	ActionToString: () => {},
	ActionTypeOf: () => {},
	ActionAdd2: () => {},
	ActionLess2: () => {},
	ActionModulo: () => {},
	ActionBitAnd: () => {},
	ActionBitLShift: () => {},
	ActionBitOr: () => {},
	ActionBitRShift: () => {},
	ActionBitURShift: () => {},
	ActionBitXOr: () => {},
	ActionDecrement: () => {},
	ActionIncrement: () => {},
	ActionPushDuplicate: () => {},
	ActionReturn: () => {},
	ActionStackSwap: () => {},
	ActionStoreRegister: value => {
		value.RegisterNumber = SWF.UI8();
	},
	DoInitAction: value => {
		value.SpriteID = SWF.UI16();
		value.Actions = getFlaggedArray(SWF.ACTIONRECORD, SWF.UI8, 0);
	},
	ActionInstanceOf: () => {},
	ActionEnumerate2: () => {},
	ActionStrictEquals: () => {},
	ActionGreater: () => {},
	ActionStringGreater: () => {},
	ActionDefineFunction2: value => {
		value.FunctionName = SWF.STRING();
		value.NumParams = SWF.UI16();
		value.RegisterCount = SWF.UI8();
		value.PreloadParentFlag = SWF.UB();
		value.PreloadRootFlag = SWF.UB();
		value.SuppressSuperFlag = SWF.UB();
		value.PreloadSuperFlag = SWF.UB();
		value.SuppressArgumentsFlag = SWF.UB();
		value.PreloadArgumentsFlag = SWF.UB();
		value.SuppressThisFlag = SWF.UB();
		value.PreloadThisFlag = SWF.UB();
		SWF.UB(7);
		value.PreloadGlobalFlag = SWF.UB();
		value.Parameters = getArray(SWF.REGISTERPARAM, value.NumParams);
		value.codeSize = SWF.UI16();
		console.warn(`Skipped ActionDefineFunction2.codeSize ${value.codeSize} bytes`, data.bytes.slice(data.bytePos, data.bytePos += value.codeSize));
	},
	REGISTERPARAM: () => ({
		Register: SWF.UI8(),
		ParamName: SWF.STRING()
	}),
	ActionExtends: () => {},
	ActionCastOp: () => {},
	ActionImplementsOp: () => {},
	ActionTry: value => {
		SWF.UB(5);
		value.CatchInRegisterFlag = SWF.UB();
		value.FinallyBlockFlag = SWF.UB();
		value.CatchBlockFlag = SWF.UB();
		value.TrySize = SWF.UI16();
		value.CatchSize = SWF.UI16();
		value.FinallySize = SWF.UI16();
		if (value.CatchInRegisterFlag) {
			value.CatchRegister = SWF.UI8();
		} else {
			value.CatchName = SWF.STRING();
		}
		value.TryBody = getArray(SWF.UI8, value.TrySize);
		value.CatchBody = getArray(SWF.UI8, value.CatchSize);
		value.FinallyBody = getArray(SWF.UI8, value.FinallySize);
	},
	ActionThrow: () => {},
	DoABC: value => {
		const endPos = data.bytePos + value.Header.Length;
		value.Flags = SWF.UI32();
		value.Name = SWF.STRING();
		value.ABCData = data.bytes.slice(data.bytePos, data.bytePos = endPos);
	},
	FILLSTYLEARRAY: () => {
		const value = {
			FillStyleCount: SWF.UI8()
		};
		if (value.FillStyleCount === 0xff) {
			value.FillStyleCount = SWF.UI16();
		}
		value.FillStyle = getArray(SWF.FILLSTYLE, value.FillStyleCount);
		return value;
	},
	FILLSTYLE: () => {
		const value = {
			FillStyleType: SWF.UI8()
		};
		if (value.FillStyleType === 0x00) {
			value.Color = SWF.RGBA();
		} else {
			value.Color = SWF.RGB();
			const focalRadialGradientFill = value.FillStyleType === 0x13;
			if (focalRadialGradientFill || value.FillStyleType === 0x10 || value.FillStyleType === 0x12) {
				value.GradientMatrix = SWF.MATRIX();
				value.Gradient = (focalRadialGradientFill ? SWF.FOCALGRADIENT : SWF.GRADIENT)();
			} else if (value.FillStyleType === 0x40 || value.FillStyleType === 0x41 || value.FillStyleType === 0x42 || value.FillStyleType === 0x43) {
				value.BitmapId = SWF.UI16();
				value.BitmapMatrix = SWF.MATRIX();
			}
		}
		return value;
	},
	LINESTYLEARRAY: () => {
		const value = {
			LineStyleCount: SWF.UI8()
		};
		if (value.LineStyleCount === 0xff) {
			value.LineStyleCount = SWF.UI16();
		}
		value.LineStyles = getArray(data.tag.Header.TagCode === 2 || data.tag.Header.TagCode === 22 || data.tag.Header.TagCode === 32 ? SWF.LINESTYLE : SWF.LINESTYLE2, value.LineStyleCount);
		return value;
	},
	LINESTYLE: () => ({
		Width: SWF.UI16(),
		Color: (data.tag.Header.TagCode === 32 ? SWF.RGBA : SWF.RGB)()
	}),
	LINESTYLE2: () => {
		const value = {
			Width: SWF.UI16(),
			StartCapStyle: SWF.UB(2),
			JoinStyle: SWF.UB(2),
			HasFillFlag: SWF.UB(),
			NoHScaleFlag: SWF.UB(),
			NoVScaleFlag: SWF.UB(),
			PixelHintingFlag: SWF.UB()
		};
		SWF.UB(5);
		value.NoClose = SWF.UB();
		value.EndCapStyle = SWF.UB(2);
		if (value.JoinStyle === 2) {
			value.MiterLimitFacter = SWF.UI16();
		}
		value.FillType = (value.HasFillFlag ? SWF.FILLSTYLE : SWF.RGBA)();
		return value;
	},
	SHAPE: () => {
		const value = {
			NumFillBits: SWF.UB(4),
			NumLineBits: SWF.UB(4)
		};
		value.ShapeRecords = getFlaggedArray(SWF.SHAPERECORD.bind(null, value), SWF.UB.bind(null, 6), 0);
		return value;
	},
	SHAPEWITHSTYLE: () => {
		const value = {
			FillStyles: SWF.FILLSTYLEARRAY(),
			LineStyles: SWF.LINESTYLEARRAY(),
			NumFillBits: SWF.UB(4),
			NumLineBits: SWF.UB(4)
		};
		value.ShapeRecords = getFlaggedArray(SWF.SHAPERECORD.bind(null, value), SWF.UB.bind(null, 6), 0);
		return value;
	},
	SHAPERECORD: shape => {
		const value = {
			TypeFlag: SWF.UB()
		};
		if (value.TypeFlag) {
			if (value.StraightFlag = SWF.UB()) {
				SWF.StraightEdgeRecord(value, shape);
			} else {
				SWF.CurvedEdgeRecord(value, shape);
			}
		} else {
			SWF.StyleChangeRecord(value, shape);
		}
		return value;
	},
	StyleChangeRecord: (value, shape) => {
		value.StateNewStyles = SWF.UB();
		value.StateLineStyle = SWF.UB();
		value.StateFillStyle1 = SWF.UB();
		value.StateFillstyle0 = SWF.UB();
		value.StateMoveTo = SWF.UB();
		if (value.StateMoveTo) {
			value.MoveBits = SWF.UB(5);
			value.MoveDeltaX = SWF.SB(value.MoveBits);
			value.MoveDeltaY = SWF.SB(value.MoveBits);
		}
		if (value.StateFillStyle0) {
			value.FillStyle0 = SWF.UB(shape.NumFillBits);
		}
		if (value.StateFillStyle1) {
			value.FillStyle1 = SWF.UB(shape.NumFillBits);
		}
		if (value.StateLineStyle) {
			value.LineStyle = SWF.UB(value.LineBits);
		}
		if (value.StateNewStyles) {
			value.FillStyles = SWF.FILLSTYLEARRAY();
			value.LineStyles = SWF.LINESTYLEARRAY();
			value.NumFillBits = SWF.UB(4);
			value.NumLineBits = SWF.UB(4);
		}
	},
	StraightEdgeRecord: value => {
		value.NumBits = SWF.UB(4);
		value.GeneralLineFlag = SWF.UB();
		if (value.GeneralLineFlag === 0) {
			value.VertLineFlag = SWF.UB();
		}
		if (value.GeneralLineFlag || value.VertLineFlag === 0) {
			value.DeltaX = SWF.SB(value.NumBits + 2);
		}
		if (value.GeneralLineFlag || value.VertLineFlag === 1) {
			value.DeltaY = SWF.SB(value.NumBits + 2);
		}
	},
	CurvedEdgeRecord: value => {
		value.NumBits = SWF.UB(4);
		const numBitsPlus2 = value.NumBits + 2;
		value.ControlDeltaX = SWF.UB(numBitsPlus2);
		value.ControlDeltaY = SWF.UB(numBitsPlus2);
		value.AnchorDeltaX = SWF.UB(numBitsPlus2);
		value.AnchorDeltaY = SWF.UB(numBitsPlus2);
	},
	DefineShape: value => {
		value.ShapeId = SWF.UI16();
		value.ShapeBounds = SWF.RECT();
		value.Shapes = SWF.SHAPEWITHSTYLE();
	},
	DefineShape2: value => {
		value.ShapeId = SWF.UI16();
		value.ShapeBounds = SWF.RECT();
		value.Shapes = SWF.SHAPEWITHSTYLE();
	},
	DefineShape3: value => {
		value.ShapeId = SWF.UI16();
		value.ShapeBounds = SWF.RECT();
		value.Shapes = SWF.SHAPEWITHSTYLE();
	},
	DefineShape4: value => {
		value.ShapeId = SWF.UI16();
		value.ShapeBounds = SWF.RECT();
		value.EdgeBounds = SWF.RECT();
		SWF.UB(5);
		value.UsesFillWindingRule = SWF.UB();
		value.UsesNonScalingStrokes = SWF.UB();
		value.UsesScalingStrokes = SWF.UB();
		value.Shapes = SWF.SHAPEWITHSTYLE();
	},
	GRADIENT: () => {
		const value = {
			SpreadMode: SWF.UB(2),
			InterpolationMode: SWF.UB(2),
			NumGradients: SWF.UB(4)
		};
		value.GradientRecords = getArray(SWF.GRADRECORD, value.NumGradients);
		return value;
	},
	FOCALGRADIENT: () => {
		const value = {
			SpreadMode: SWF.UB(2),
			InterpolationMode: SWF.UB(2),
			NumGradients: SWF.UB(4)
		};
		value.GradientRecords = getArray(SWF.GRADRECORD, value.NumGradients);
		value.FocalPoint = SWF.FIXED8();
		return value;
	},
	GRADRECORD: () => ({
		Ratio: SWF.UI8(),
		Color: (data.tag.Header.TagCode === 32 ? SWF.RGBA : SWF.RGB)()
	})
};
const tagTypes = {
	4: SWF.PlaceObject,
	26: SWF.PlaceObject2,
	70: SWF.PlaceObject3,
	5: SWF.RemoveObject,
	28: SWF.RemoveObject2,
	1: SWF.ShowFrame,
	9: SWF.SetBackgroundColor,
	43: SWF.FrameLabel,
	24: SWF.Protect,
	0: SWF.End,
	56: SWF.ExportAssets,
	57: SWF.ImportAssets,
	58: SWF.EnableDebugger,
	64: SWF.EnableDebugger2,
	65: SWF.ScriptLimits,
	66: SWF.SetTabIndex,
	67: SWF.FileAttributes,
	71: SWF.ImportAssets2,
	76: SWF.SymbolClass,
	77: SWF.Metadata,
	78: SWF.DefineScalingGrid,
	86: SWF.DefineSceneAndFrameLabelData,
	12: SWF.DoAction,
	59: SWF.DoInitAction,
	82: SWF.DoABC,
	2: SWF.DefineShape,
	22: SWF.DefineShape2,
	32: SWF.DefineShape3,
	83: SWF.DefineShape4
};
const actionTypes = {
	0x81: SWF.ActionGotoFrame,
	0x83: SWF.ActionGetURL,
	0x04: SWF.ActionNextFrame,
	0x05: SWF.ActionPreviousFrame,
	0x06: SWF.ActionPlay,
	0x07: SWF.ActionStop,
	0x08: SWF.ActionToggleQuality,
	0x09: SWF.ActionStopSounds,
	0x8a: SWF.ActionWaitForFrame,
	0x8b: SWF.ActionSetTarget,
	0x8c: SWF.ActionGoToLabel,
	0x96: SWF.ActionPush,
	0x17: SWF.ActionPop,
	0x0a: SWF.ActionAdd,
	0x0b: SWF.ActionSubtract,
	0x0c: SWF.ActionMultiply,
	0x0d: SWF.ActionDivide,
	0x0e: SWF.ActionEquals,
	0x0f: SWF.ActionLess,
	0x10: SWF.ActionAnd,
	0x11: SWF.ActionOr,
	0x12: SWF.ActionNot,
	0x13: SWF.ActionStringEquals,
	0x14: SWF.ActionStringLength,
	0x21: SWF.ActionStringAdd,
	0x15: SWF.ActionStringExtract,
	0x29: SWF.ActionStringLess,
	0x31: SWF.ActionMBStringLength,
	0x35: SWF.ActionMBStringExtract,
	0x18: SWF.ActionToInteger,
	0x32: SWF.ActionCharToAscii,
	0x33: SWF.ActionAsciiToChar,
	0x36: SWF.ActionMBCharToAscii,
	0x37: SWF.ActionMBAsciiToChar,
	0x99: SWF.ActionJump,
	0x9d: SWF.ActionIf,
	0x9e: SWF.ActionCall,
	0x1c: SWF.ActionGetVariable,
	0x1d: SWF.ActionSetVariable,
	0x9a: SWF.ActionGetURL2,
	0x9f: SWF.ActionGotoFrame2,
	0x20: SWF.ActionSetTarget2,
	0x22: SWF.ActionGetProperty,
	0x23: SWF.ActionSetProperty,
	0x24: SWF.ActionCloneSprite,
	0x25: SWF.ActionRemoveSprite,
	0x27: SWF.ActionStartDrag,
	0x28: SWF.ActionEndDrag,
	0x8d: SWF.ActionWaitForFrame2,
	0x26: SWF.ActionTrace,
	0x34: SWF.ActionGetTime,
	0x30: SWF.ActionRandomNumber,
	0x3d: SWF.ActionCallFunction,
	0x52: SWF.ActionCallMethod,
	0x88: SWF.ActionConstantPool,
	0x9b: SWF.ActionDefineFunction,
	0x3c: SWF.ActionDefineLocal,
	0x31: SWF.ActionDefineLocal2,
	0x3a: SWF.ActionDelete,
	0x3b: SWF.ActionDelete2,
	0x46: SWF.ActionEnumerate,
	0x49: SWF.ActionEquals2,
	0x4e: SWF.ActionGetMember,
	0x42: SWF.ActionInitArray,
	0x43: SWF.ActionInitObject,
	0x53: SWF.ActionNewMethod,
	0x40: SWF.ActionNewObject,
	0x4f: SWF.ActionSetMember,
	0x45: SWF.ActionTargetPath,
	0x94: SWF.ActionWith,
	0x4a: SWF.ActionToNumber,
	0x4b: SWF.ActionToString,
	0x44: SWF.ActionTypeOf,
	0x47: SWF.ActionAdd2,
	0x48: SWF.ActionLess2,
	0x3f: SWF.ActionModulo,
	0x60: SWF.ActionBitAnd,
	0x63: SWF.ActionBitLShift,
	0x61: SWF.ActionBitOr,
	0x64: SWF.ActionBitRShift,
	0x65: SWF.ActionBitURShift,
	0x62: SWF.ActionBitXOr,
	0x51: SWF.ActionDecrement,
	0x50: SWF.ActionIncrement,
	0x4c: SWF.ActionPushDuplicate,
	0x3e: SWF.ActionReturn,
	0x4d: SWF.ActionStackSwap,
	0x87: SWF.ActionStoreRegister,
	0x54: SWF.ActionInstanceOf,
	0x55: SWF.ActionEnumerate2,
	0x66: SWF.ActionStrictEquals,
	0x67: SWF.ActionGreater,
	0x68: SWF.ActionStringGreater,
	0x8e: SWF.ActionDefineFunction2,
	0x69: SWF.ActionExtends,
	0x2b: SWF.ActionCastOp,
	0x2c: SWF.ActionImplementsOp,
	0x8f: SWF.ActionTry,
	0x2a: SWF.ActionThrow
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
			data.tag = {
				Header: SWF.RECORDHEADER()
			};
			const tagType = tagTypes[data.tag.Header.TagCode];
			if (tagType) {
				tagType(data.tag);
			} else {
				console.warn(`Unsupported TagCode ${data.tag.Header.TagCode}`);
				data.bytePos += data.tag.Header.Length;
			}
			data.file.Tags.push(data.tag);
		}
		if ((data.bytePos += 8) !== data.file.FileLength) {
			throw new Error(`Final bytePos ${data.bytePos} does not equal FileLength ${data.file.FileLength}`);
		}
		panel.classList.remove("hidden");
	} catch (err) {
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
