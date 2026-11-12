import { M as sanitizeDesign, N as sanitizeFrame, S as STUDIES, k as assembleBrief, w as TEMPLATES } from "./frame-Bbmy5oak.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-CqbehVbp.js
function parseInput(input) {
	const data = input;
	const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "";
	const image = typeof data.image === "string" && data.image.startsWith("data:image/") ? data.image : void 0;
	if (image && image.length > 25e5) throw new Error("That image is too large. Try a smaller photo.");
	return {
		idea,
		image,
		templateId: typeof data.templateId === "string" ? data.templateId.slice(0, 80) : void 0,
		studyId: typeof data.studyId === "string" ? data.studyId.slice(0, 80) : void 0,
		design: sanitizeDesign(data.design),
		frame: sanitizeFrame(data.frame)
	};
}
function libraryPrompt(data) {
	if (data.studyId) return STUDIES.find((item) => item.id === data.studyId)?.prompt;
	if (data.templateId) return TEMPLATES.find((item) => item.id === data.templateId)?.prompt;
}
var generatePlate_createServerFn_handler = createServerRpc({
	id: "59971a0ccc36de086fd91d2c8d337fabb9420074790beb05e8c717ef794a8f8f",
	name: "generatePlate",
	filename: "src/lib/generate.ts"
}, (opts) => generatePlate.__executeServer(opts));
var generatePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(generatePlate_createServerFn_handler, async ({ data }) => {
	const key = process.env.XAI_API_KEY;
	if (!key) throw new Error("Image generation is not configured.");
	const { charge, refund } = await import("./credits.server-B7C2uEBU.mjs");
	const wallet = await charge(50, data.image ? "edit" : "plate");
	try {
		const { dictionaryBrief } = await import("./blocks.server-KoMtz2Ws.mjs");
		const prompt = [assembleBrief(data.design, data.idea, libraryPrompt(data)), dictionaryBrief(data.design.vertical, data.design.advanced)].filter(Boolean).join("\n\n").slice(0, 8e3);
		const endpoint = data.image ? "https://api.x.ai/v1/images/edits" : "https://api.x.ai/v1/images/generations";
		const body = data.image ? {
			model: "grok-imagine-image",
			prompt,
			image: {
				url: data.image,
				type: "image_url"
			},
			aspect_ratio: data.frame.ratio,
			resolution: data.frame.resolution
		} : {
			model: "grok-imagine-image",
			prompt,
			aspect_ratio: data.frame.ratio,
			resolution: data.frame.resolution
		};
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
		if (!response.ok) {
			const detail = await response.text();
			throw new Error(detail.replace(/sk-[a-zA-Z0-9_-]+/g, "").slice(0, 180) || "Generation failed.");
		}
		const url = (await response.json()).data?.[0]?.url;
		if (!url) throw new Error("No image came back.");
		return {
			url,
			cost: 50,
			credits: wallet.credits,
			frame: data.frame
		};
	} catch (error) {
		await refund(50, "plate-refund").catch(() => void 0);
		throw error instanceof Error ? error : /* @__PURE__ */ new Error("Generation failed.");
	}
});
function designFacts(design, idea) {
	const picks = Object.entries(design.picks).filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep").slice(0, 6).map(([key, value]) => `${key}: ${value}`).join("; ");
	return [
		`Space: ${design.vertical}`,
		`Look: ${design.look}`,
		`Range: ${design.range}`,
		`Light: ${design.light}`,
		`Time: ${design.time}`,
		`Camera: ${design.camera}`,
		`Mood: ${design.mood}`,
		`Color: ${design.color}`,
		picks ? `Materials: ${picks}` : "",
		idea ? `Request: ${idea}` : "Request: redesign the space while keeping the camera and layout."
	].filter(Boolean).join("\n");
}
function fallbackIdea(design, idea) {
	const picks = Object.entries(design.picks).filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep").slice(0, 3).map(([, value]) => value).join(", ");
	const lead = idea.trim().replace(/[. ]+$/, "");
	const tail = `${design.look} ${design.vertical}, ${design.light.toLowerCase()} light${picks ? `, ${picks}` : ""}`;
	return (lead ? `${lead}. Hold the layout. Finish it as ${tail}.` : `Redesign this ${design.vertical} as ${tail}. Hold the camera.`).slice(0, 400);
}
var enhanceIdea_createServerFn_handler = createServerRpc({
	id: "93625d71a6a82f6db479f7e153142e22888c8d7791218dad1a9aa6847d52c617",
	name: "enhanceIdea",
	filename: "src/lib/generate.ts"
}, (opts) => enhanceIdea.__executeServer(opts));
var enhanceIdea = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		idea: typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "",
		design: sanitizeDesign(data.design)
	};
}).handler(enhanceIdea_createServerFn_handler, async ({ data }) => {
	const fallback = fallbackIdea(data.design, data.idea);
	const key = process.env.XAI_API_KEY;
	if (!key) return { idea: fallback };
	try {
		const response = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			signal: AbortSignal.timeout(8e3),
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "grok-3-mini",
				temperature: .4,
				messages: [{
					role: "system",
					content: "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, the materials, and the light. Keep the camera and layout. No labels, no bullet list, under 40 words."
				}, {
					role: "user",
					content: designFacts(data.design, data.idea)
				}]
			})
		});
		if (!response.ok) return { idea: fallback };
		const text = (await response.json()).choices?.[0]?.message?.content?.replace(/\s+/g, " ").trim();
		if (!text) return { idea: fallback };
		return { idea: text.slice(0, 400) };
	} catch {
		return { idea: fallback };
	}
});
//#endregion
export { enhanceIdea_createServerFn_handler, generatePlate_createServerFn_handler };
