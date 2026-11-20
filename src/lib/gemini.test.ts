import test from "node:test";
import assert from "node:assert/strict";
import {
  GEMINI_TEXT_MODEL,
  cleanGeminiError,
  getGeminiStatus,
  handleGeminiVisionRequest,
  isGeminiAuthError,
  parseDataUrl,
  resolveGeminiApiKeys,
  toGeminiAspectRatio,
  type GeminiVisionClientLike,
} from "./gemini.server.ts";

test("toGeminiAspectRatio and parseDataUrl validate Studio ratios and inline images", () => {
  assert.equal(toGeminiAspectRatio("16:9"), "16:9");
  assert.equal(toGeminiAspectRatio("3:2"), "4:3");
  assert.equal(toGeminiAspectRatio("9:16"), "9:16");
  assert.equal(toGeminiAspectRatio("1:1"), "1:1");

  const parsed = parseDataUrl("data:image/png;base64,aGVsbG8=");
  assert.deepEqual(parsed, { mimeType: "image/png", data: "aGVsbG8=" });
  assert.equal(parseDataUrl("https://example.com/a.jpg"), null);
});

test("cleanGeminiError redacts Google API keys and isGeminiAuthError classifies auth errors", () => {
  const err400 = cleanGeminiError(new Error("API_KEY_INVALID AIzaSyFakeSecret12345 AQ.FakeToken999"));
  assert.ok(!err400.message.includes("AIzaSyFakeSecret12345"));
  assert.ok(!err400.message.includes("AQ.FakeToken999"));
  assert.match(err400.message, /Settings > Secrets/i);
  assert.equal(isGeminiAuthError(err400), true);

  const err429 = cleanGeminiError(new Error("429 RESOURCE_EXHAUSTED"));
  assert.match(err429.message, /429/);
  assert.equal(isGeminiAuthError(err429), false);
});

test("getGeminiStatus prioritizes GEMINI_API_KEY, ignores placeholders including MY_GEMINI_API_KEY, and supports api/update secrets", () => {
  const prevGem = process.env.GEMINI_API_KEY;
  const prevUpdate = process.env.update;
  const prevApi = process.env.api;
  try {
    delete process.env.update;
    delete process.env.api;
    process.env.GEMINI_API_KEY = "placeholder";
    assert.equal(getGeminiStatus().configured, false);

    process.env.GEMINI_API_KEY = "MY_GEMINI_API_KEY";
    assert.equal(getGeminiStatus().configured, false);
    assert.deepEqual(resolveGeminiApiKeys(), []);

    process.env.api = "AQ.test-vertex-express-key";
    assert.equal(getGeminiStatus().configured, true);
    assert.deepEqual(resolveGeminiApiKeys(), ["AQ.test-vertex-express-key"]);

    delete process.env.GEMINI_API_KEY;
    process.env.update = "AQ.test-key-valid-length";
    const withUpdate = getGeminiStatus();
    assert.equal(withUpdate.configured, true);
    assert.equal(withUpdate.textModel, GEMINI_TEXT_MODEL);
    assert.equal(withUpdate.fastImageModel, "gemini-3.1-flash-lite-image");
    assert.equal(withUpdate.hqImageModel, "gemini-nano-banana-2.1");

    process.env.GEMINI_API_KEY = "AIzaSyPrimaryPaidKeyExample123";
    assert.deepEqual(resolveGeminiApiKeys(), [
      "AIzaSyPrimaryPaidKeyExample123",
      "AQ.test-vertex-express-key",
      "AQ.test-key-valid-length",
    ]);
  } finally {
    if (prevGem !== undefined) process.env.GEMINI_API_KEY = prevGem;
    else delete process.env.GEMINI_API_KEY;
    if (prevUpdate !== undefined) process.env.update = prevUpdate;
    else delete process.env.update;
    if (prevApi !== undefined) process.env.api = prevApi;
    else delete process.env.api;
  }
});

test("handleGeminiVisionRequest returns 503 when GEMINI_API_KEY is unset and streams SSE with client", async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const missingReq = new Request("http://localhost/api/gemini/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "What is in this architectural image?",
        imageUrl: "data:image/png;base64,aGVsbG8=",
      }),
    });
    const missingRes = await handleGeminiVisionRequest(missingReq);
    assert.equal(missingRes.status, 503);
    const missingJson = (await missingRes.json()) as { configured?: boolean };
    assert.equal(missingJson.configured, false);

    const mockClient: GeminiVisionClientLike = {
      models: {
        generateContent: (async () => ({ text: "Travertine courtyard." })) as unknown as GeminiVisionClientLike["models"]["generateContent"],
        generateContentStream: (async () =>
          (async function* () {
            yield { text: "Travertine " };
            yield { text: "courtyard." };
          })()) as unknown as GeminiVisionClientLike["models"]["generateContentStream"],
      },
    };

    const okReq = new Request("http://localhost/api/gemini/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Describe materials",
        imageUrl: "data:image/png;base64,aGVsbG8=",
        stream: true,
      }),
    });
    const okRes = await handleGeminiVisionRequest(okReq, { client: mockClient });
    assert.equal(okRes.status, 200);
    assert.match(okRes.headers.get("content-type") ?? "", /text\/event-stream/);
    const streamText = await okRes.text();
    assert.match(streamText, /Travertine /);
    assert.match(streamText, /\[DONE\]/);
  } finally {
    if (prevKey !== undefined) process.env.GEMINI_API_KEY = prevKey;
    else delete process.env.GEMINI_API_KEY;
  }
});
