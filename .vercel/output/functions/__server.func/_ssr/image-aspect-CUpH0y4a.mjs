//#region node_modules/.nitro/vite/services/ssr/assets/image-aspect-CUpH0y4a.js
var GEMINI_RATIO_TABLE = [
	{
		label: "1:1",
		value: 1
	},
	{
		label: "5:4",
		value: 5 / 4
	},
	{
		label: "4:5",
		value: 4 / 5
	},
	{
		label: "4:3",
		value: 4 / 3
	},
	{
		label: "3:4",
		value: 3 / 4
	},
	{
		label: "3:2",
		value: 3 / 2
	},
	{
		label: "2:3",
		value: 2 / 3
	},
	{
		label: "16:9",
		value: 16 / 9
	},
	{
		label: "9:16",
		value: 9 / 16
	},
	{
		label: "21:9",
		value: 21 / 9
	}
];
var FRAME_RATIO_TABLE = [
	{
		label: "1:1",
		value: 1
	},
	{
		label: "4:3",
		value: 4 / 3
	},
	{
		label: "3:2",
		value: 3 / 2
	},
	{
		label: "16:9",
		value: 16 / 9
	},
	{
		label: "9:16",
		value: 9 / 16
	}
];
function matchClosestGeminiAspectRatio(width, height) {
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return "16:9";
	const target = width / height;
	let best = GEMINI_RATIO_TABLE[0];
	let bestDiff = Math.abs(Math.log(target / best.value));
	for (let i = 1; i < GEMINI_RATIO_TABLE.length; i++) {
		const candidate = GEMINI_RATIO_TABLE[i];
		const diff = Math.abs(Math.log(target / candidate.value));
		if (diff < bestDiff) {
			best = candidate;
			bestDiff = diff;
		}
	}
	return best.label;
}
function matchClosestFrameRatio(width, height) {
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return "16:9";
	const target = width / height;
	let best = FRAME_RATIO_TABLE[0];
	let bestDiff = Math.abs(Math.log(target / best.value));
	for (let i = 1; i < FRAME_RATIO_TABLE.length; i++) {
		const candidate = FRAME_RATIO_TABLE[i];
		const diff = Math.abs(Math.log(target / candidate.value));
		if (diff < bestDiff) {
			best = candidate;
			bestDiff = diff;
		}
	}
	return best.label;
}
function decodeBase64Prefix(base64, maxBytes = 65536) {
	const safeBase64Len = Math.min(base64.length, Math.ceil(maxBytes * 4 / 3));
	const alignedLen = safeBase64Len - safeBase64Len % 4;
	const slice = base64.slice(0, alignedLen);
	if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(slice, "base64"));
	const bin = atob(slice);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}
function readU16BE(bytes, offset) {
	return bytes[offset] << 8 | bytes[offset + 1];
}
function readU32BE(bytes, offset) {
	return (bytes[offset] << 24 >>> 0) + (bytes[offset + 1] << 16 >>> 0) + (bytes[offset + 2] << 8 >>> 0) + bytes[offset + 3];
}
function readU16LE(bytes, offset) {
	return bytes[offset] | bytes[offset + 1] << 8;
}
function readU24LE(bytes, offset) {
	return bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16;
}
function parseImageDimensionsFromBytes(bytes) {
	if (bytes.length < 16) return null;
	if (bytes.length >= 24 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) {
		const width = readU32BE(bytes, 16);
		const height = readU32BE(bytes, 20);
		if (width > 0 && height > 0) return {
			width,
			height
		};
	}
	if (bytes.length >= 30 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) {
		const chunk = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
		if (chunk === "VP8X" && bytes.length >= 30) {
			const width = readU24LE(bytes, 24) + 1;
			const height = readU24LE(bytes, 27) + 1;
			if (width > 0 && height > 0) return {
				width,
				height
			};
		}
		if (chunk === "VP8 " && bytes.length >= 30) {
			const width = readU16LE(bytes, 26) & 16383;
			const height = readU16LE(bytes, 28) & 16383;
			if (width > 0 && height > 0) return {
				width,
				height
			};
		}
		if (chunk === "VP8L" && bytes.length >= 25) {
			const b0 = bytes[21];
			const b1 = bytes[22];
			const b2 = bytes[23];
			const b3 = bytes[24];
			const width = 1 + ((b1 & 63) << 8 | b0);
			const height = 1 + ((b3 & 15) << 10 | b2 << 2 | (b1 & 192) >> 6);
			if (width > 0 && height > 0) return {
				width,
				height
			};
		}
	}
	if (bytes[0] === 255 && bytes[1] === 216) {
		let offset = 2;
		while (offset + 9 < bytes.length) {
			if (bytes[offset] !== 255) {
				offset++;
				continue;
			}
			while (offset < bytes.length && bytes[offset] === 255) offset++;
			if (offset >= bytes.length) break;
			const marker = bytes[offset++];
			if (marker === 216 || marker === 1 || marker >= 208 && marker <= 215) continue;
			if (marker === 217 || marker === 218) break;
			if (offset + 2 > bytes.length) break;
			const segmentLength = readU16BE(bytes, offset);
			if (segmentLength < 2) break;
			if ((marker === 192 || marker === 193 || marker === 194 || marker === 195 || marker === 197 || marker === 198 || marker === 199 || marker === 201 || marker === 202 || marker === 203) && offset + 7 < bytes.length) {
				const height = readU16BE(bytes, offset + 3);
				const width = readU16BE(bytes, offset + 5);
				if (width > 0 && height > 0) return {
					width,
					height
				};
			}
			offset += segmentLength;
		}
	}
	return null;
}
function parseImageDimensionsFromDataUrl(dataUrl) {
	if (!dataUrl || !dataUrl.startsWith("data:image/")) return null;
	const comma = dataUrl.indexOf(",");
	if (comma === -1) return null;
	const base64 = dataUrl.slice(comma + 1);
	if (!base64) return null;
	try {
		const dims = parseImageDimensionsFromBytes(decodeBase64Prefix(base64, 65536));
		if (!dims) return null;
		return {
			width: dims.width,
			height: dims.height,
			aspect: dims.width / dims.height,
			geminiRatio: matchClosestGeminiAspectRatio(dims.width, dims.height),
			frameRatio: matchClosestFrameRatio(dims.width, dims.height)
		};
	} catch {
		return null;
	}
}
function buildPixelLockedCameraContract(dims, geometryLock = 90) {
	const lockPct = Math.max(55, Math.min(100, Math.round(geometryLock || 90)));
	const dimSpec = dims ? ` (${dims.width}×${dims.height}, aspect ${dims.geminiRatio})` : "";
	return [
		`STRICT PIXEL-TO-PIXEL CAMERA REGISTRATION LOCK (${lockPct}%):`,
		`Treat Image #1${dimSpec} as a fixed pixel-registered base plate.`,
		"Lock the EXACT camera position, camera elevation/altitude, pitch, roll, yaw, focal length, field of view, horizon line, vanishing points, crop boundaries, and silhouette pixel-for-pixel to Image #1.",
		"Do NOT zoom in or out, do NOT re-frame, do NOT crop or add letterbox bars, do NOT rotate or tilt the camera, and do NOT straighten verticals if Image #1 is an elevated or oblique view.",
		"Every wall corner, roof parapet, window frame, staircase, terrain rock, and horizon ridge must overlay Image #1 at the exact same pixel coordinates.",
		"Apply ONLY the requested material, lighting, atmosphere, or local styling changes directly onto the existing pixels of Image #1."
	].join(" ");
}
//#endregion
export { parseImageDimensionsFromDataUrl as n, buildPixelLockedCameraContract as t };
