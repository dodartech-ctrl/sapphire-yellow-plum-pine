import { t as createServerFn } from "./ssr.mjs";
import { $ as assembleBrief, G as STUDIES, _t as sanitizeEngineState, ft as pickFourFallbackPlates, gt as sanitizeDesign, it as compileEngineBrief, nt as buildUploadedImageSystemPrefix, pt as pickServerFallbackPlate, q as TEMPLATES, vt as sanitizeFrame, yt as sanitizeScene3DState } from "./preset-transform-Du2fVesw.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-C8bKIzYz.js
function cleanDataUrl(value) {
	if (typeof value !== "string" || !value.startsWith("data:image/")) return void 0;
	if (value.length > 65e5) throw new Error("That image is too large. Try a smaller photo under 5 MB.");
	return value;
}
function formatCloudFallbackWarning(providerErrors, hasAuthError) {
	if (hasAuthError) return "Cloud AI key unavailable — rendered Studio preview composite. Verify your billing-enabled key in Settings > Secrets for live cloud rendering.";
	const first = providerErrors.find((msg) => msg.trim().length > 0);
	return first ? `${first} Showing Studio preview composite.` : void 0;
}
function cleanDictionaryBlocks(value) {
	if (!Array.isArray(value)) return void 0;
	return value.filter((id) => typeof id === "string" && id.length <= 64).slice(0, 64);
}
function cleanDictionaryParams(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
	const out = {};
	for (const [blockId, entry] of Object.entries(value).slice(0, 32)) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
		const row = {};
		for (const [k, v] of Object.entries(entry).slice(0, 12)) if (typeof v === "string") row[k.slice(0, 40)] = v.slice(0, 400);
		if (Object.keys(row).length > 0) out[blockId.slice(0, 64)] = row;
	}
	return out;
}
function parseInput(input) {
	const data = input;
	return {
		idea: typeof data.idea === "string" ? data.idea.trim().slice(0, 1200) : "",
		image: cleanDataUrl(data.image),
		sketchImage: cleanDataUrl(data.sketchImage),
		maskImage: cleanDataUrl(data.maskImage),
		depthImage: cleanDataUrl(data.depthImage),
		normalImage: cleanDataUrl(data.normalImage),
		clayImage: cleanDataUrl(data.clayImage),
		annotatorImage: cleanDataUrl(data.annotatorImage),
		styleRefImage: cleanDataUrl(data.styleRefImage),
		materialRefImage: cleanDataUrl(data.materialRefImage),
		lightingRefImage: cleanDataUrl(data.lightingRefImage),
		exampleRefImage: cleanDataUrl(data.exampleRefImage),
		houseStyleDirective: typeof data.houseStyleDirective === "string" ? data.houseStyleDirective.slice(0, 500) : void 0,
		templateId: typeof data.templateId === "string" ? data.templateId.slice(0, 80) : void 0,
		studyId: typeof data.studyId === "string" ? data.studyId.slice(0, 80) : void 0,
		dictionaryBlocks: cleanDictionaryBlocks(data.dictionaryBlocks),
		dictionaryParams: cleanDictionaryParams(data.dictionaryParams),
		design: sanitizeDesign(data.design),
		frame: sanitizeFrame(data.frame),
		engine: sanitizeEngineState(data.engine),
		scene3d: sanitizeScene3DState(data.scene3d),
		nanoBananaModel: typeof data.nanoBananaModel === "string" && [
			"gemini-nano-banana-2.1",
			"gemini-3.1-flash-lite-image",
			"gemini-3-pro-image"
		].includes(data.nanoBananaModel) ? data.nanoBananaModel : void 0,
		nanoBananaResolution: data.nanoBananaResolution === "512" || data.nanoBananaResolution === "1K" || data.nanoBananaResolution === "2K" || data.nanoBananaResolution === "4K" ? data.nanoBananaResolution : void 0,
		budgetCostMode: data.budgetCostMode === "free-only" || data.budgetCostMode === "paise-eco" || data.budgetCostMode === "pro-unlocked" ? data.budgetCostMode : void 0,
		budgetCapPaise: typeof data.budgetCapPaise === "number" && Number.isFinite(data.budgetCapPaise) ? Math.max(0, Math.min(5e5, Math.round(data.budgetCapPaise))) : void 0,
		budgetMaxPerImagePaise: typeof data.budgetMaxPerImagePaise === "number" && Number.isFinite(data.budgetMaxPerImagePaise) ? Math.max(30, Math.min(2e3, Math.round(data.budgetMaxPerImagePaise))) : void 0
	};
}
function libraryPrompt(data) {
	if (data.studyId) return STUDIES.find((item) => item.id === data.studyId)?.prompt;
	if (data.templateId) return TEMPLATES.find((item) => item.id === data.templateId)?.prompt;
}
function budgetClientOverride(data) {
	if (data.budgetCostMode === void 0 && data.budgetCapPaise === void 0 && data.budgetMaxPerImagePaise === void 0) return;
	return {
		...data.budgetCostMode ? { costMode: data.budgetCostMode } : {},
		...typeof data.budgetCapPaise === "number" ? { capPaise: data.budgetCapPaise } : {},
		...typeof data.budgetMaxPerImagePaise === "number" ? { maxPerImagePaise: data.budgetMaxPerImagePaise } : {}
	};
}
function geminiAttachments(data, plan) {
	const isUploadedPhotoEdit = Boolean(data.image);
	return {
		sourceImage: data.image ?? data.sketchImage,
		sketchImage: data.sketchImage,
		maskImage: data.maskImage,
		depthImage: isUploadedPhotoEdit ? void 0 : data.depthImage,
		normalImage: isUploadedPhotoEdit ? void 0 : data.normalImage,
		clayImage: isUploadedPhotoEdit ? void 0 : data.clayImage,
		annotatorImage: isUploadedPhotoEdit ? void 0 : data.annotatorImage,
		styleRefImage: data.styleRefImage,
		materialRefImage: data.materialRefImage,
		lightingRefImage: data.lightingRefImage,
		exampleRefImage: data.exampleRefImage,
		lockSourceAspect: isUploadedPhotoEdit,
		geometryLock: data.engine.geometryLock,
		modelOverride: plan?.effectiveModel ?? data.nanoBananaModel,
		imageSizeOverride: plan?.effectiveResolution ?? data.nanoBananaResolution,
		timeoutMs: plan?.timeoutMs,
		maxPromptChars: plan?.maxPromptChars,
		maxReferences: plan?.maxReferences
	};
}
async function callXaiImage(key, prompt, frame, sourceImage) {
	const endpoint = sourceImage ? "https://api.x.ai/v1/images/edits" : "https://api.x.ai/v1/images/generations";
	const body = sourceImage ? {
		model: "grok-imagine-image",
		prompt,
		image: {
			url: sourceImage,
			type: "image_url"
		},
		aspect_ratio: frame.ratio,
		resolution: frame.resolution
	} : {
		model: "grok-imagine-image",
		prompt,
		aspect_ratio: frame.ratio,
		resolution: frame.resolution
	};
	const response = await fetch(endpoint, {
		method: "POST",
		signal: AbortSignal.timeout(25e3),
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
	return url;
}
var generatePlate_createServerFn_handler = createServerRpc({
	id: "59971a0ccc36de086fd91d2c8d337fabb9420074790beb05e8c717ef794a8f8f",
	name: "generatePlate",
	filename: "src/lib/generate.ts"
}, (opts) => generatePlate.__executeServer(opts));
var generatePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(generatePlate_createServerFn_handler, async ({ data }) => {
	const { dictionaryBrief } = await import("./blocks.server-CgZ2QVvV.mjs");
	const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
		hasSketch: Boolean(data.sketchImage),
		hasMask: Boolean(data.maskImage),
		hasUploadedImage: Boolean(data.image),
		frame: data.frame
	});
	const prompt = [
		data.image ? buildUploadedImageSystemPrefix(data.engine.geometryLock) : void 0,
		assembleBrief(data.design, data.idea, data.image ? void 0 : libraryPrompt(data), { hasUploadedImage: Boolean(data.image) }),
		data.houseStyleDirective,
		compiled.prompt,
		dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams)
	].filter(Boolean).join("\n\n").slice(0, 8e3);
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? (data.frame.resolution === "2k" ? "2K" : "1K"),
		imageCount: 1,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	const { charge, refund, readWallet } = await import("./credits.server-DSzWD2gw.mjs");
	if (!plan.useCloud) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
			cost: 0,
			costPaise: 0,
			credits: wallet.credits,
			budget,
			budgetBlocked: plan.blockedByCap,
			frame: data.frame,
			fallback: true,
			seed: compiled.seed,
			summary: compiled.parametersSummary,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	if (!nvidiaEnabled && !geminiEnabled && !xaiKey) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
			cost: 0,
			costPaise: 0,
			credits: wallet.credits,
			budget,
			frame: data.frame,
			fallback: true,
			seed: compiled.seed,
			summary: compiled.parametersSummary
		};
	}
	const wallet = await charge(50, data.image ? "edit" : "plate");
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const url = await generateImageWithGemini(prompt.slice(0, plan.maxPromptChars), data.frame, geminiAttachments(data, plan));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			cost: 50,
			costPaise: plan.totalCostPaise,
			credits: wallet.credits,
			budget,
			frame: data.frame,
			fallback: false,
			seed: compiled.seed,
			summary: `${compiled.parametersSummary} · ${plan.effectiveModel} (${plan.effectiveResolution} · ${plan.totalCostPaise}p)`,
			...plan.clampedForEco && plan.notice ? { warning: plan.notice } : {}
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const url = await generateImageWithNvidia(prompt, data.frame, {
			seed: compiled.seed,
			fast: data.engine.renderFidelity === "draft",
			depthImage: data.depthImage,
			annotatorImage: data.annotatorImage,
			sketchImage: data.sketchImage,
			sourceImage: data.image
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			cost: 50,
			costPaise: plan.totalCostPaise,
			credits: wallet.credits,
			budget,
			frame: data.frame,
			fallback: false,
			seed: compiled.seed,
			summary: compiled.parametersSummary
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const source = data.image ?? data.sketchImage;
		const url = await callXaiImage(xaiKey, prompt, data.frame, source);
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			cost: 50,
			costPaise: plan.totalCostPaise,
			credits: wallet.credits,
			budget,
			frame: data.frame,
			fallback: false,
			seed: compiled.seed,
			summary: compiled.parametersSummary
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(50, "plate-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + 50 })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 1
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
		cost: 0,
		costPaise: 0,
		credits: refreshed.credits,
		budget,
		frame: data.frame,
		fallback: true,
		seed: compiled.seed,
		summary: compiled.parametersSummary,
		...warning ? { warning } : {}
	};
});
var generateVariations_createServerFn_handler = createServerRpc({
	id: "f40bbf6df3672110cff53c266c5def91e8bb97ddb689d1d22995561ce3723814",
	name: "generateVariations",
	filename: "src/lib/generate.ts"
}, (opts) => generateVariations.__executeServer(opts));
var generateVariations = createServerFn({ method: "POST" }).validator(parseInput).handler(generateVariations_createServerFn_handler, async ({ data }) => {
	const { dictionaryBrief } = await import("./blocks.server-CgZ2QVvV.mjs");
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? (data.frame.resolution === "2k" ? "2K" : "1K"),
		imageCount: 4,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	const { charge, refund, readWallet } = await import("./credits.server-DSzWD2gw.mjs");
	const compiled0 = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
		hasSketch: Boolean(data.sketchImage),
		variationIndex: 0,
		frame: data.frame
	});
	if (!plan.useCloud || !nvidiaEnabled && !geminiEnabled && !xaiKey) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 4
		})]);
		return {
			urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed, data.idea),
			fallback: true,
			credits: wallet.credits,
			budget,
			costPaise: 0,
			budgetBlocked: plan.blockedByCap,
			frame: data.frame,
			seed: compiled0.seed,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	const batchCost = 100;
	const wallet = await charge(batchCost, "variation-grid");
	const buildVariationPrompt = (idx) => {
		const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
			hasSketch: Boolean(data.sketchImage),
			hasUploadedImage: Boolean(data.image),
			variationIndex: idx,
			frame: data.frame
		});
		return [
			data.image ? buildUploadedImageSystemPrefix(data.engine.geometryLock) : void 0,
			assembleBrief(data.design, data.idea, data.image ? void 0 : libraryPrompt(data), { hasUploadedImage: Boolean(data.image) }),
			data.houseStyleDirective,
			compiled.prompt,
			dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams)
		].filter(Boolean).join("\n\n").slice(0, plan.maxPromptChars);
	};
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const urls = await Promise.all([
			0,
			1,
			2,
			3
		].map((idx) => generateImageWithGemini(buildVariationPrompt(idx), data.frame, geminiAttachments(data, plan))));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 4,
			freeImages: 0
		});
		return {
			urls,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled0.seed,
			...plan.clampedForEco && plan.notice ? { warning: plan.notice } : {}
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const urls = await Promise.all([
			0,
			1,
			2,
			3
		].map((idx) => generateImageWithNvidia(buildVariationPrompt(idx), data.frame, {
			seed: compiled0.seed + idx,
			fast: data.engine.renderFidelity === "draft",
			depthImage: data.depthImage,
			annotatorImage: data.annotatorImage,
			sketchImage: data.sketchImage,
			sourceImage: data.image
		})));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 4,
			freeImages: 0
		});
		return {
			urls,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled0.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const source = data.image ?? data.sketchImage;
		const urls = await Promise.all([
			0,
			1,
			2,
			3
		].map((idx) => callXaiImage(xaiKey, buildVariationPrompt(idx), data.frame, source)));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 4,
			freeImages: 0
		});
		return {
			urls,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled0.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(batchCost, "grid-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + batchCost })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 4
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed, data.idea),
		fallback: true,
		credits: refreshed.credits,
		budget,
		costPaise: 0,
		frame: data.frame,
		seed: compiled0.seed,
		...warning ? { warning } : {}
	};
});
var segmentObjectWithSam2_createServerFn_handler = createServerRpc({
	id: "037e055ad6815023db80de12590a5949bca56a79dd279edcbc8488806038d614",
	name: "segmentObjectWithSam2",
	filename: "src/lib/generate.ts"
}, (opts) => segmentObjectWithSam2.__executeServer(opts));
var segmentObjectWithSam2 = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const cp = data.clickPoint && typeof data.clickPoint === "object" && typeof data.clickPoint.xNorm === "number" && typeof data.clickPoint.yNorm === "number" ? {
		xNorm: Math.max(0, Math.min(1, Number(data.clickPoint.xNorm))),
		yNorm: Math.max(0, Math.min(1, Number(data.clickPoint.yNorm)))
	} : void 0;
	return {
		image: cleanDataUrl(data.image),
		prompt: typeof data.prompt === "string" ? data.prompt.trim().slice(0, 120) : "architectural element",
		clickPoint: cp
	};
}).handler(segmentObjectWithSam2_createServerFn_handler, async ({ data }) => {
	const { heuristicSemanticBoxesForPrompt, normalizeGroundedBoxes } = await import("./cv-pipeline-EdvoIUBz.mjs").then((n) => n.n);
	const { hasNvidiaKey, detectGroundedSam2BoxesWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, detectGroundedSam2BoxesWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const prompt = data.prompt || "architectural element";
	if (hasGeminiKey() && data.image) try {
		const boxes = await detectGroundedSam2BoxesWithGemini(data.image, prompt, data.clickPoint);
		if (boxes.length > 0) return {
			boxes: normalizeGroundedBoxes(boxes, prompt),
			fallback: false,
			model: "grounded-sam-2-gemini"
		};
	} catch (error) {
		if (!hasNvidiaKey()) return {
			boxes: heuristicSemanticBoxesForPrompt(prompt),
			fallback: true,
			model: "grounded-sam-2-local",
			...!isGeminiAuthError(error) ? { warning: error instanceof Error ? error.message : "Server Grounded-SAM 2 fallback used." } : {}
		};
	}
	if (hasNvidiaKey() && data.image) try {
		const boxes = await detectGroundedSam2BoxesWithNvidia(data.image, prompt, data.clickPoint);
		if (boxes.length > 0) return {
			boxes: normalizeGroundedBoxes(boxes, prompt),
			fallback: false,
			model: "grounded-sam-2-nvidia"
		};
	} catch (error) {
		return {
			boxes: heuristicSemanticBoxesForPrompt(prompt),
			fallback: true,
			model: "grounded-sam-2-local",
			warning: error instanceof Error ? error.message : "NVIDIA Grounded-SAM 2 fallback used."
		};
	}
	return {
		boxes: heuristicSemanticBoxesForPrompt(prompt),
		fallback: true,
		model: "grounded-sam-2-local"
	};
});
var inpaintPlate_createServerFn_handler = createServerRpc({
	id: "d5fac5773d220c85e2ff9e6587fa77a4305f5ce3330a44cfb848036672ded511",
	name: "inpaintPlate",
	filename: "src/lib/generate.ts"
}, (opts) => inpaintPlate.__executeServer(opts));
var inpaintPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(inpaintPlate_createServerFn_handler, async ({ data }) => {
	const { dictionaryBrief } = await import("./blocks.server-CgZ2QVvV.mjs");
	const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
		hasMask: true,
		hasUploadedImage: Boolean(data.image),
		inpaintNote: data.idea,
		frame: data.frame
	});
	const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams);
	const fullPrompt = [
		`IOPAINT SERVER PIPELINE · TASK: ${data.engine.iopaintTask === "erase" ? "OBJECT_REMOVAL" : data.engine.iopaintTask === "replace" ? "TEXTURE_REPLACEMENT" : data.engine.iopaintTask === "anytext" ? "ANYTEXT_SIGNAGE" : data.engine.iopaintTask === "paint-by-example" ? "PAINT_BY_EXAMPLE" : "DIRECTIONAL_OUTPAINT"} · ENGINE MODEL: ${data.engine.iopaintModel}`,
		data.houseStyleDirective,
		compiled.prompt,
		dictSection
	].filter(Boolean).join("\n\n").slice(0, 4200);
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? "1K",
		imageCount: 1,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	const { charge, refund, readWallet } = await import("./credits.server-DSzWD2gw.mjs");
	if (!plan.useCloud || !nvidiaEnabled && !geminiEnabled && !xaiKey || !data.image) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 1, data.idea),
			fallback: true,
			credits: wallet.credits,
			budget,
			costPaise: 0,
			frame: data.frame,
			seed: compiled.seed,
			modelUsed: data.engine.iopaintModel,
			operation: data.engine.iopaintTask,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	const wallet = await charge(50, "inpaint");
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const url = await generateImageWithGemini(fullPrompt.slice(0, plan.maxPromptChars), data.frame, geminiAttachments(data, plan));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled.seed,
			modelUsed: data.engine.iopaintModel,
			operation: data.engine.iopaintTask
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const url = await generateImageWithNvidia(fullPrompt, data.frame, {
			seed: compiled.seed,
			depthImage: data.depthImage,
			annotatorImage: data.annotatorImage,
			sketchImage: data.sketchImage,
			sourceImage: data.image
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled.seed,
			modelUsed: `nvidia-flux · ${data.engine.iopaintModel}`,
			operation: data.engine.iopaintTask
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const url = await callXaiImage(xaiKey, fullPrompt, data.frame, data.image);
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame,
			seed: compiled.seed,
			modelUsed: data.engine.iopaintModel,
			operation: data.engine.iopaintTask
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(50, "inpaint-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + 50 })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 1
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		url: data.image,
		fallback: true,
		credits: refreshed.credits,
		budget,
		costPaise: 0,
		frame: data.frame,
		seed: compiled.seed,
		modelUsed: data.engine.iopaintModel,
		operation: data.engine.iopaintTask,
		...warning ? { warning } : {}
	};
});
var enhancePlate_createServerFn_handler = createServerRpc({
	id: "944a4a4b92de36fdddb21e29a99ad8ed445a5d30f920324e781fa6de501356ec",
	name: "enhancePlate",
	filename: "src/lib/generate.ts"
}, (opts) => enhancePlate.__executeServer(opts));
var enhancePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(enhancePlate_createServerFn_handler, async ({ data }) => {
	const { dictionaryBrief } = await import("./blocks.server-CgZ2QVvV.mjs");
	const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
	const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, ["upscale-safety", ...data.dictionaryBlocks ?? []], data.dictionaryParams);
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? "1K",
		imageCount: 1,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	const { charge, refund, readWallet } = await import("./credits.server-DSzWD2gw.mjs");
	if (!plan.useCloud || !nvidiaEnabled && !geminiEnabled && !xaiKey || !data.image) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
			fallback: true,
			credits: wallet.credits,
			budget,
			costPaise: 0,
			frame: data.frame,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	const wallet = await charge(50, "enhance");
	const enhancePrompt = `GENERATIVE TILED SUPER-RESOLUTION (${data.engine.upscaleFactor}x · ${data.engine.esrganModel}): Synthesize crisp brick mortar, travertine pores, timber grain, foliage leaves, and contact shadows while holding every camera line identically.\n${compiled.prompt}\n\n${dictSection}`.slice(0, plan.maxPromptChars);
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const url = await generateImageWithGemini(enhancePrompt, data.frame, {
			sourceImage: data.image,
			modelOverride: plan.effectiveModel,
			imageSizeOverride: plan.effectiveResolution,
			timeoutMs: plan.timeoutMs,
			maxPromptChars: plan.maxPromptChars,
			maxReferences: 1
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const url = await generateImageWithNvidia(enhancePrompt, data.frame, {
			seed: compiled.seed,
			sourceImage: data.image
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const url = await callXaiImage(xaiKey, enhancePrompt, data.frame, data.image);
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			frame: data.frame
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(50, "enhance-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + 50 })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 1
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
		fallback: true,
		credits: refreshed.credits,
		budget,
		costPaise: 0,
		frame: data.frame,
		...warning ? { warning } : {}
	};
});
var relightPlate_createServerFn_handler = createServerRpc({
	id: "3aa4774a98dde2188f519b06cea522ac413b9eceb98d3c50b0a36001a741fa82",
	name: "relightPlate",
	filename: "src/lib/generate.ts"
}, (opts) => relightPlate.__executeServer(opts));
var relightPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(relightPlate_createServerFn_handler, async ({ data }) => {
	const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { readWallet, charge, refund } = await import("./credits.server-DSzWD2gw.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? "1K",
		imageCount: 1,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	if (!plan.useCloud || !nvidiaEnabled && !geminiEnabled && !xaiKey || !data.image) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
			fallback: true,
			credits: wallet.credits,
			budget,
			costPaise: 0,
			seed: compiled.seed,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	const wallet = await charge(50, "relight");
	const relightPrompt = `CONSISTENT GEOMETRY RELIGHT (${data.engine.relightPreset}): Lock architecture, furnishings, and framing 100%. Transform ONLY sky dome, sun direction, snow/season accents, and interior practical light glow.\n${compiled.prompt}`.slice(0, plan.maxPromptChars);
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const url = await generateImageWithGemini(relightPrompt, data.frame, geminiAttachments(data, plan));
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const url = await generateImageWithNvidia(relightPrompt, data.frame, {
			seed: compiled.seed,
			depthImage: data.depthImage,
			annotatorImage: data.annotatorImage,
			sourceImage: data.image
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const url = await callXaiImage(xaiKey, relightPrompt, data.frame, data.image);
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(50, "relight-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + 50 })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 1
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		url: data.image,
		fallback: true,
		credits: refreshed.credits,
		budget,
		costPaise: 0,
		seed: compiled.seed,
		...warning ? { warning } : {}
	};
});
var outpaintPlate_createServerFn_handler = createServerRpc({
	id: "a9a820a09f8d4439537588257104fbf39812809b3801dbb0fc1f5cfa0d370865",
	name: "outpaintPlate",
	filename: "src/lib/generate.ts"
}, (opts) => outpaintPlate.__executeServer(opts));
var outpaintPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(outpaintPlate_createServerFn_handler, async ({ data }) => {
	const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
	const { hasNvidiaKey, generateImageWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { planServerBudgetRender, recordServerRenderOutcome } = await import("./budget-guard.server-Bt5MHPpc.mjs");
	const { readWallet, charge, refund } = await import("./credits.server-DSzWD2gw.mjs");
	const { plan } = await planServerBudgetRender({
		requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
		requestedResolution: data.nanoBananaResolution ?? "1K",
		imageCount: 1,
		clientOverride: budgetClientOverride(data)
	});
	const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
	const geminiEnabled = hasGeminiKey();
	const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : void 0;
	if (!plan.useCloud || !nvidiaEnabled && !geminiEnabled && !xaiKey || !data.image) {
		const [wallet, budget] = await Promise.all([readWallet().catch(() => ({ credits: 4500 })), recordServerRenderOutcome({
			billedPaise: 0,
			liveImages: 0,
			freeImages: 1
		})]);
		return {
			url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
			fallback: true,
			credits: wallet.credits,
			budget,
			costPaise: 0,
			seed: compiled.seed,
			...plan.notice ? { warning: plan.notice } : {}
		};
	}
	const wallet = await charge(50, "outpaint");
	const outpaintPrompt = `SEAMLESS ARCHITECTURAL OUTPAINT (${data.engine.outpaintRatio}): Preserve center architectural render cleanly while expanding surrounding context, foreground landscape, and sky.\n${compiled.prompt}`.slice(0, plan.maxPromptChars);
	const aspectOverride = data.engine.outpaintRatio === "9:16" ? "9:16" : "16:9";
	const providerErrors = [];
	let hasAuthError = false;
	if (geminiEnabled) try {
		const url = await generateImageWithGemini(outpaintPrompt, data.frame, {
			sourceImage: data.image,
			aspectOverride,
			modelOverride: plan.effectiveModel,
			imageSizeOverride: plan.effectiveResolution,
			timeoutMs: plan.timeoutMs,
			maxPromptChars: plan.maxPromptChars,
			maxReferences: 1
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (isGeminiAuthError(error)) hasAuthError = true;
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (nvidiaEnabled) try {
		const url = await generateImageWithNvidia(outpaintPrompt, {
			...data.frame,
			ratio: aspectOverride
		}, {
			seed: compiled.seed,
			sourceImage: data.image
		});
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	if (xaiKey) try {
		const url = await callXaiImage(xaiKey, outpaintPrompt, data.frame, data.image);
		const budget = await recordServerRenderOutcome({
			billedPaise: plan.totalCostPaise,
			liveImages: 1,
			freeImages: 0
		});
		return {
			url,
			fallback: false,
			credits: wallet.credits,
			budget,
			costPaise: plan.totalCostPaise,
			seed: compiled.seed
		};
	} catch (error) {
		if (error instanceof Error) providerErrors.push(error.message);
	}
	await refund(50, "outpaint-refund").catch(() => void 0);
	const [refreshed, budget] = await Promise.all([readWallet().catch(() => ({ credits: wallet.credits + 50 })), recordServerRenderOutcome({
		billedPaise: 0,
		liveImages: 0,
		freeImages: 1
	})]);
	const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
	return {
		url: data.image,
		fallback: true,
		credits: refreshed.credits,
		budget,
		costPaise: 0,
		seed: compiled.seed,
		...warning ? { warning } : {}
	};
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
	const { hasGeminiKey, enhanceIdeaWithGemini, isGeminiAuthError } = await import("./gemini.server-B5XhX7GM.mjs");
	const { hasNvidiaKey, enhanceIdeaWithNvidia } = await import("./nvidia-vision.server-BatUx53V.mjs");
	const nvidiaEnabled = hasNvidiaKey();
	if (hasGeminiKey()) try {
		return { idea: await enhanceIdeaWithGemini(designFacts(data.design, data.idea)) };
	} catch (error) {
		if (!nvidiaEnabled && !process.env.XAI_API_KEY) return {
			idea: fallback,
			...!isGeminiAuthError(error) ? { warning: error instanceof Error ? error.message : "Gemini prompt enhancement unavailable." } : {}
		};
	}
	if (nvidiaEnabled) try {
		return { idea: await enhanceIdeaWithNvidia(designFacts(data.design, data.idea)) };
	} catch (error) {
		if (!process.env.XAI_API_KEY) return {
			idea: fallback,
			warning: error instanceof Error ? error.message : "NVIDIA prompt enhancement unavailable."
		};
	}
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
export { enhanceIdea_createServerFn_handler, enhancePlate_createServerFn_handler, generatePlate_createServerFn_handler, generateVariations_createServerFn_handler, inpaintPlate_createServerFn_handler, outpaintPlate_createServerFn_handler, relightPlate_createServerFn_handler, segmentObjectWithSam2_createServerFn_handler };
