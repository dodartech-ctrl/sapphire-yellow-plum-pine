//#region node_modules/.nitro/vite/services/ssr/assets/agent-tools-CaaKcI8V.js
var AGENT_TOOLS = [
	{
		name: "read_studio",
		description: "Read the current prompt, frame, vertical, and credits.",
		parameters: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "set_prompt",
		description: "Replace the prompt used for the next plate.",
		parameters: {
			type: "object",
			properties: { idea: {
				type: "string",
				description: "The design change to make."
			} },
			required: ["idea"]
		}
	},
	{
		name: "set_vertical",
		description: "Switch the studio vertical.",
		parameters: {
			type: "object",
			properties: { vertical: {
				type: "string",
				enum: [
					"interior",
					"exterior",
					"amenities",
					"landscape"
				]
			} },
			required: ["vertical"]
		}
	},
	{
		name: "set_resolution",
		description: "Set the preview and generation frame.",
		parameters: {
			type: "object",
			properties: {
				ratio: {
					type: "string",
					enum: [
						"16:9",
						"4:3",
						"3:2",
						"1:1",
						"9:16"
					]
				},
				resolution: {
					type: "string",
					enum: ["1k", "2k"]
				}
			},
			required: ["ratio", "resolution"]
		}
	},
	{
		name: "set_view",
		description: "Show source, result, or compare. Source or result closes compare.",
		parameters: {
			type: "object",
			properties: { view: {
				type: "string",
				enum: [
					"source",
					"result",
					"compare"
				]
			} },
			required: ["view"]
		}
	},
	{
		name: "generate_plate",
		description: "Generate a plate at the current prompt and frame. Spends 50 credits. Call only when the user asked to generate.",
		parameters: {
			type: "object",
			properties: {}
		}
	}
];
var NAMES = new Set(AGENT_TOOLS.map((tool) => tool.name));
function allowedCall(name, args, index) {
	if (!NAMES.has(name)) return null;
	const input = args && typeof args === "object" && !Array.isArray(args) ? args : {};
	return {
		id: `call_${index}`,
		name,
		arguments: input
	};
}
function planLocally(message) {
	const text = message.toLowerCase();
	const calls = [];
	const vertical = [
		"interior",
		"exterior",
		"amenities",
		"landscape"
	].find((item) => text.includes(item));
	if (vertical) calls.push({
		id: `call_${calls.length}`,
		name: "set_vertical",
		arguments: { vertical }
	});
	const ratio = [
		"16:9",
		"4:3",
		"3:2",
		"1:1",
		"9:16"
	].find((item) => text.includes(item));
	const resolution = text.includes("2k") ? "2k" : text.includes("1k") ? "1k" : void 0;
	if (ratio || resolution) calls.push({
		id: `call_${calls.length}`,
		name: "set_resolution",
		arguments: {
			ratio: ratio ?? "16:9",
			resolution: resolution ?? "1k"
		}
	});
	if (/\bcompare\b/.test(text)) calls.push({
		id: `call_${calls.length}`,
		name: "set_view",
		arguments: { view: "compare" }
	});
	else if (/\bresult\b/.test(text)) calls.push({
		id: `call_${calls.length}`,
		name: "set_view",
		arguments: { view: "result" }
	});
	else if (/\bsource\b/.test(text)) calls.push({
		id: `call_${calls.length}`,
		name: "set_view",
		arguments: { view: "source" }
	});
	const generate = /\b(generate|render)\b/.test(text);
	if (!(calls.length > 0 && text.replace(/[^a-z0-9]+/g, " ").trim().split(" ").length < 6 && !generate)) calls.push({
		id: `call_${calls.length}`,
		name: "set_prompt",
		arguments: { idea: message.trim().slice(0, 800) }
	});
	if (generate) calls.push({
		id: `call_${calls.length}`,
		name: "generate_plate",
		arguments: {}
	});
	if (!calls.length) calls.push({
		id: "call_0",
		name: "read_studio",
		arguments: {}
	});
	return calls.map((call, index) => ({
		...call,
		id: `call_${index}`
	}));
}
//#endregion
export { allowedCall as n, planLocally as r, AGENT_TOOLS as t };
