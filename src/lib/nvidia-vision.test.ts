import assert from "node:assert/strict";
import test from "node:test";
import {
  NVIDIA_FLUX_DEV_URL,
  NVIDIA_FLUX_SCHNELL_URL,
  NVIDIA_INVOKE_URL,
  NVIDIA_SAMPLE_IMAGE_URL,
  NVIDIA_VISION_MODEL,
  buildNvidiaFluxPayload,
  buildNvidiaVisionPayload,
  extractNvidiaSseDelta,
  isValidVisionImageUrl,
  parseNvidiaFluxResponse,
  sanitizeNvidiaVisionError,
  toNvidiaFluxDimensions,
} from "./nvidia-vision.ts";
import {
  detectGroundedSam2BoxesWithNvidia,
  enhanceIdeaWithNvidia,
  generateImageWithNvidia,
  handleNvidiaVisionRequest,
} from "./nvidia-vision.server.ts";

test("buildNvidiaVisionPayload produces exact minimaxai/minimax-m3.1-flash payload defaults", () => {
  const payload = buildNvidiaVisionPayload({
    imageUrl: NVIDIA_SAMPLE_IMAGE_URL,
  });

  assert.equal(payload.model, NVIDIA_VISION_MODEL);
  assert.equal(payload.model, "minimaxai/minimax-m3.1-flash");
  assert.equal(payload.max_tokens, 16384);
  assert.equal(payload.seed, 0);
  assert.equal(payload.stream, true);
  assert.equal(payload.temperature, 1);
  assert.equal(payload.top_p, 0.95);
  assert.deepEqual(payload.messages, [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this image?" },
        { type: "image_url", image_url: { url: NVIDIA_SAMPLE_IMAGE_URL } },
      ],
    },
  ]);
});

test("toNvidiaFluxDimensions and buildNvidiaFluxPayload map aspect ratios and ControlNet modes cleanly", () => {
  assert.deepEqual(toNvidiaFluxDimensions("16:9"), { width: 1344, height: 768 });
  assert.deepEqual(toNvidiaFluxDimensions("9:16"), { width: 768, height: 1344 });
  assert.deepEqual(toNvidiaFluxDimensions("1:1"), { width: 1024, height: 1024 });

  const fastDraft = buildNvidiaFluxPayload({ prompt: "Travertine courtyard", ratio: "16:9", fast: true, seed: 42 });
  assert.equal(fastDraft.endpoint, NVIDIA_FLUX_SCHNELL_URL);
  assert.equal(fastDraft.payload.steps, 4);
  assert.equal(fastDraft.payload.cfg_scale, 0);

  const depthPass = buildNvidiaFluxPayload({
    prompt: "Concrete pavilion",
    ratio: "4:3",
    fast: true,
    depthImage: "data:image/png;base64,ZmFrZWRlcHRo",
  });
  assert.equal(depthPass.endpoint, NVIDIA_FLUX_DEV_URL);
  assert.equal(depthPass.payload.mode, "depth");
  assert.equal(depthPass.payload.image, "ZmFrZWRlcHRo");
});

test("parseNvidiaFluxResponse returns data URL and rejects filtered artifacts", () => {
  const jpegUrl = parseNvidiaFluxResponse({
    artifacts: [{ base64: "/9j/4AAQSkZJRg==", finishReason: "SUCCESS" }],
  });
  assert.equal(jpegUrl, "data:image/jpeg;base64,/9j/4AAQSkZJRg==");

  assert.throws(
    () =>
      parseNvidiaFluxResponse({
        artifacts: [{ base64: "iVBORw0KGgo=", finishReason: "CONTENT_FILTERED" }],
      }),
    /filtered/i,
  );
});

test("isValidVisionImageUrl accepts HTTPS URLs and base64 image data URLs and rejects unsafe URLs", () => {
  assert.equal(isValidVisionImageUrl(NVIDIA_SAMPLE_IMAGE_URL), true);
  assert.equal(isValidVisionImageUrl("data:image/png;base64,iVBORw0KGgo="), true);
  assert.equal(isValidVisionImageUrl("javascript:alert(1)"), false);
  assert.equal(isValidVisionImageUrl("/viz/p01-pavilion-day.jpg"), false);
  assert.equal(isValidVisionImageUrl(""), false);
});

test("extractNvidiaSseDelta parses content deltas, reasoning deltas, and [DONE]", () => {
  const chunk = extractNvidiaSseDelta(
    'data: {"choices":[{"delta":{"content":"Warm travertine courtyard","reasoning_content":"Inspecting cladding"}}]}',
  );
  assert.equal(chunk.done, false);
  assert.equal(chunk.deltaText, "Warm travertine courtyard");
  assert.equal(chunk.reasoningText, "Inspecting cladding");

  const done = extractNvidiaSseDelta("data: [DONE]");
  assert.equal(done.done, true);
  assert.equal(done.deltaText, "");
});

test("sanitizeNvidiaVisionError redacts nvapi tokens", () => {
  const cleaned = sanitizeNvidiaVisionError("Unauthorized: Bearer nvapi-secretToken12345 failed");
  assert.equal(cleaned.includes("nvapi-secretToken12345"), false);
  assert.equal(cleaned.includes("[REDACTED]"), true);
});

test("handleNvidiaVisionRequest returns 503 when NVIDIA_API_KEY is unset and proxies SSE when set", async () => {
  const prev = process.env.NVIDIA_API_KEY;
  try {
    delete process.env.NVIDIA_API_KEY;
    const missingReq = new Request("http://localhost/api/nvidia-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: NVIDIA_SAMPLE_IMAGE_URL, prompt: "What is in this image?" }),
    });
    const missingRes = await handleNvidiaVisionRequest(missingReq);
    assert.equal(missingRes.status, 503);

    process.env.NVIDIA_API_KEY = "nvapi-test-only-token";
    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    let capturedBody: Record<string, unknown> = {};

    const mockFetch: typeof fetch = async (url, init) => {
      capturedUrl = String(url);
      capturedHeaders = Object.fromEntries(new Headers(init?.headers).entries());
      capturedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response('data: {"choices":[{"delta":{"content":"Stone facade"}}]}\n\ndata: [DONE]\n\n', {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      });
    };

    const okReq = new Request("http://localhost/api/nvidia-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: NVIDIA_SAMPLE_IMAGE_URL,
        prompt: "What is in this image?",
        stream: true,
      }),
    });
    const okRes = await handleNvidiaVisionRequest(okReq, mockFetch);
    assert.equal(okRes.status, 200);
    assert.equal(capturedUrl, NVIDIA_INVOKE_URL);
    assert.equal(capturedHeaders.authorization, "Bearer nvapi-test-only-token");
    assert.equal(capturedHeaders.accept, "text/event-stream");
    assert.equal(capturedBody.model, "minimaxai/minimax-m3.1-flash");
    assert.equal(capturedBody.max_tokens, 16384);
    assert.equal(capturedBody.stream, true);
    const bodyText = await okRes.text();
    assert.match(bodyText, /Stone facade/);
  } finally {
    if (prev === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = prev;
  }
});

test("generateImageWithNvidia, enhanceIdeaWithNvidia, and detectGroundedSam2BoxesWithNvidia invoke NVIDIA NIM APIs", async () => {
  const prev = process.env.NVIDIA_API_KEY;
  try {
    process.env.NVIDIA_API_KEY = "nvapi-test-only-token";

    const fluxMock: typeof fetch = async (url) => {
      assert.equal(String(url), NVIDIA_FLUX_DEV_URL);
      return Response.json({ artifacts: [{ base64: "iVBORw0KGgo=", finishReason: "SUCCESS" }] });
    };
    const imgUrl = await generateImageWithNvidia(
      "Warm travertine villa",
      { ratio: "16:9", resolution: "1k" },
      { seed: 7 },
      fluxMock,
    );
    assert.equal(imgUrl, "data:image/png;base64,iVBORw0KGgo=");

    const ideaMock: typeof fetch = async (url) => {
      assert.equal(String(url), NVIDIA_INVOKE_URL);
      return Response.json({
        choices: [{ message: { content: "Sunlit travertine living pavilion with honed limestone floors." } }],
      });
    };
    const enhanced = await enhanceIdeaWithNvidia("Space: interior\nLook: Modern luxury", ideaMock);
    assert.match(enhanced, /travertine/i);

    const samMock: typeof fetch = async (url) => {
      assert.equal(String(url), NVIDIA_INVOKE_URL);
      return Response.json({
        choices: [
          {
            message: {
              content: '{"boxes":[{"label":"Sectional sofa","box_2d":[420,120,860,640],"confidence":0.94}]}',
            },
          },
        ],
      });
    };
    const boxes = await detectGroundedSam2BoxesWithNvidia(
      "data:image/png;base64,iVBORw0KGgo=",
      "sofa",
      undefined,
      samMock,
    );
    assert.equal(boxes.length, 1);
    assert.equal(boxes[0].label, "Sectional sofa");
    assert.deepEqual(boxes[0].box_2d, [420, 120, 860, 640]);
  } finally {
    if (prev === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = prev;
  }
});
