import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Copy,
  Link2,
  Loader2,
  RotateCcw,
  ScanEye,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { toCompactDataUrlForSegmentation } from "@/lib/cv-pipeline";
import {
  NVIDIA_DEFAULT_PROMPT,
  NVIDIA_SAMPLE_IMAGE_URL,
  NVIDIA_VISION_MODEL,
  NVIDIA_VISION_QUICK_PROMPTS,
  extractNvidiaSseDelta,
  resolveNvidiaApiUrl,
} from "@/lib/nvidia-vision";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

type VisionProvider = "gemini" | "nvidia";

const GEMINI_VISION_MODEL = "gemini-4-hydrogen";

type NvidiaVisionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultImageUrl: string;
};

export function NvidiaVisionDialog({
  open,
  onOpenChange,
  defaultImageUrl,
}: NvidiaVisionDialogProps) {
  const setIdea = useOriel((state) => state.setIdea);
  const pushChat = useOriel((state) => state.pushChat);
  const pushLog = useOriel((state) => state.pushLog);

  const [provider, setProvider] = useState<VisionProvider>("gemini");
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [prompt, setPrompt] = useState(NVIDIA_DEFAULT_PROMPT);
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [output, setOutput] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const [nvidiaConfigured, setNvidiaConfigured] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    setImageUrl((prev) => (prev.trim() ? prev : defaultImageUrl));
    let cancelled = false;
    void Promise.all([
      fetch(resolveNvidiaApiUrl("/api/gemini/vision"))
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      fetch(resolveNvidiaApiUrl("/api/nvidia-vision"))
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ]).then(([gemData, nvData]: [{ configured?: boolean } | null, { configured?: boolean } | null]) => {
      if (cancelled) return;
      const hasGem = typeof gemData?.configured === "boolean" ? gemData.configured : null;
      const hasNv = typeof nvData?.configured === "boolean" ? nvData.configured : null;
      setGeminiConfigured(hasGem);
      setNvidiaConfigured(hasNv);
      if (hasGem === false && hasNv === true) {
        setProvider("nvidia");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, defaultImageUrl]);

  useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setStreaming(false);
    }
  }, [open]);

  const activeModel = provider === "gemini" ? GEMINI_VISION_MODEL : NVIDIA_VISION_MODEL;
  const activeEndpoint = provider === "gemini" ? "/api/gemini/vision" : "/api/nvidia-vision";
  const serverConfigured = provider === "gemini" ? geminiConfigured : nvidiaConfigured;

  async function resolveSubmittableImageUrl(raw: string): Promise<string> {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:image/")) {
      return trimmed;
    }
    return toCompactDataUrlForSegmentation(trimmed);
  }

  async function runVisionAnalysis() {
    if (streaming) return;
    const rawTarget = imageUrl.trim() || defaultImageUrl;
    if (!rawTarget) {
      toast.message("Select a canvas image or paste an HTTPS image URL first.");
      return;
    }

    setErrorMsg(null);
    setOutput("");
    setReasoning("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const preparedUrl = await resolveSubmittableImageUrl(rawTarget);
      const response = await fetch(resolveNvidiaApiUrl(activeEndpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: prompt.trim() || NVIDIA_DEFAULT_PROMPT,
          imageUrl: preparedUrl,
          stream: streamEnabled,
          ...(provider === "nvidia"
            ? {
                maxTokens: 16384,
                seed: 0,
                temperature: 1,
                topP: 0.95,
              }
            : { seed: 0 }),
        }),
      });

      if (!response.ok) {
        const errJson = (await response.json().catch(() => null)) as { error?: string } | null;
        const msg = errJson?.error || `Vision request failed (HTTP ${response.status}).`;
        setErrorMsg(msg);
        if (response.status === 503) {
          if (provider === "gemini") setGeminiConfigured(false);
          else setNvidiaConfigured(false);
        }
        return;
      }

      if (provider === "gemini") setGeminiConfigured(true);
      else setNvidiaConfigured(true);

      if (!streamEnabled || !response.body) {
        const json = (await response.json()) as {
          choices?: Array<{ message?: { content?: string; reasoning_content?: string } }>;
        };
        const content = json.choices?.[0]?.message?.content ?? "";
        const reason = json.choices?.[0]?.message?.reasoning_content ?? "";
        setOutput(content);
        setReasoning(reason);
        pushLog({
          title: `Vision Inspect · ${activeModel}`,
          model: "gpt",
          text: content.slice(0, 160) || prompt,
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const parsed = extractNvidiaSseDelta(line);
          if (parsed.error) {
            setErrorMsg(parsed.error);
            break;
          }
          if (parsed.reasoningText) {
            setReasoning((prev) => prev + parsed.reasoningText);
          }
          if (parsed.deltaText) {
            accumulated += parsed.deltaText;
            setOutput((prev) => prev + parsed.deltaText);
          }
          if (parsed.done) break;
        }
      }

      if (buffer.trim()) {
        const parsed = extractNvidiaSseDelta(buffer);
        if (parsed.deltaText) {
          accumulated += parsed.deltaText;
          setOutput((prev) => prev + parsed.deltaText);
        }
      }

      if (accumulated.trim()) {
        pushLog({
          title: `Vision Inspect · ${activeModel}`,
          model: "gpt",
          text: accumulated.trim().slice(0, 160),
        });
      }
    } catch (error) {
      if ((error as { name?: string })?.name !== "AbortError") {
        setErrorMsg(error instanceof Error ? error.message : "Vision analysis failed.");
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }

  function stopStream() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }

  function applyToStudioIdea() {
    const clean = output.replace(/\s+/g, " ").trim().slice(0, 600);
    if (!clean) return;
    setIdea(clean);
    pushChat("studio", `Applied Vision AI analysis (${activeModel}) to prompt.`);
    toast.success("Applied Vision AI analysis to Studio prompt");
    onOpenChange(false);
  }

  async function copyOutput() {
    if (!output.trim()) return;
    try {
      await navigator.clipboard.writeText(output.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
      toast.success("Copied vision response");
    } catch {
      toast.error("Could not copy text");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45" />
        <Dialog.Content
          data-testid="nvidia-vision-dialog"
          className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[min(860px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-[#d1c5b8]/60 bg-[#fbf9f5] p-5 text-[#1b1c1a] shadow-2xl"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#d1c5b8]/45 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[#c5a880]/25 text-[#725b38]">
                <ScanEye className="size-4" />
              </span>
              <div>
                <Dialog.Title className="font-serif text-lg font-semibold text-[#1b1c1a]">
                  Scene Vision Inspector
                </Dialog.Title>
                <Dialog.Description className="font-mono text-[11px] text-[#4d463c]">
                  {provider === "gemini" ? "Google Gemini" : "NVIDIA NIM"} · {activeModel} · Stream SSE
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                role="group"
                aria-label="Vision AI provider"
                className="inline-flex rounded-full border border-[#d1c5b8]/60 bg-white p-0.5 text-[11px]"
              >
                <button
                  type="button"
                  data-testid="vision-provider-gemini"
                  onClick={() => {
                    setProvider("gemini");
                    setErrorMsg(null);
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 transition",
                    provider === "gemini"
                      ? "bg-[#c5a880] font-semibold text-[#281800]"
                      : "text-[#4d463c] hover:text-[#1b1c1a]",
                  )}
                >
                  Gemini 4
                </button>
                <button
                  type="button"
                  data-testid="vision-provider-nvidia"
                  onClick={() => {
                    setProvider("nvidia");
                    setErrorMsg(null);
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 transition",
                    provider === "nvidia"
                      ? "bg-[#c5a880] font-semibold text-[#281800]"
                      : "text-[#4d463c] hover:text-[#1b1c1a]",
                  )}
                >
                  NVIDIA NIM
                </button>
              </div>

              <Dialog.Close
                aria-label="Close Scene Vision Inspector"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a]"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>
          </div>

          {serverConfigured === false ? (
            <div
              data-testid="nvidia-missing-key-banner"
              className="mt-3 rounded-2xl border border-[#c5a880]/60 bg-[#f5efe4] px-3.5 py-2.5 text-xs text-[#513d1d]"
            >
              Server secret{" "}
              <code className="mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono font-semibold">
                {provider === "gemini" ? "GEMINI_API_KEY" : "NVIDIA_API_KEY"}
              </code>{" "}
              is not configured yet. Set it in <strong>Settings &gt; Secrets</strong> to stream live{" "}
              <code className="mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono">{activeModel}</code>{" "}
              responses through{" "}
              <code className="mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono">{activeEndpoint}</code>.
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-[270px_1fr]">
            {/* Image Preview & Source Selector */}
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-2xl border border-[#d1c5b8]/60 bg-[#161412]">
                {imageUrl.trim() ? (
                  <img
                    src={imageUrl}
                    alt="Target scene for vision inspection"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center text-xs text-[#dfd5c6]">No image selected</div>
                )}
              </div>

              <label className="block text-[11px] font-medium text-[#4d463c]">
                <span className="mb-1 inline-flex items-center gap-1">
                  <Link2 className="size-3 text-[#725b38]" /> Image URL or Canvas Data
                </span>
                <input
                  type="text"
                  data-testid="nvidia-vision-image-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or active studio plate"
                  className="h-9 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 font-mono text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38]"
                />
              </label>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setImageUrl(defaultImageUrl)}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] text-[#1b1c1a] hover:border-[#725b38]"
                >
                  <RotateCcw className="size-3 text-[#725b38]" /> Use Canvas
                </button>
                <button
                  type="button"
                  data-testid="nvidia-sample-url-btn"
                  onClick={() => setImageUrl(NVIDIA_SAMPLE_IMAGE_URL)}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] text-[#1b1c1a] hover:border-[#725b38]"
                >
                  Sample URL
                </button>
              </div>
            </div>

            {/* Prompt & Streaming Response */}
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {NVIDIA_VISION_QUICK_PROMPTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrompt(item.prompt)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] transition",
                      prompt.trim() === item.prompt
                        ? "bg-[#c5a880] font-semibold text-[#281800]"
                        : "border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:border-[#725b38] hover:text-[#1b1c1a]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <textarea
                data-testid="nvidia-vision-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder={`Ask ${activeModel} about materials, spatial massing, lighting, or furnishings...`}
                className="w-full resize-none rounded-2xl border border-[#d1c5b8]/60 bg-white p-3 text-xs text-[#1b1c1a] outline-none focus:border-[#725b38]"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-[#4d463c]">
                  <input
                    type="checkbox"
                    checked={streamEnabled}
                    onChange={(e) => setStreamEnabled(e.target.checked)}
                    className="accent-[#725b38]"
                  />
                  <span>
                    {provider === "gemini"
                      ? "Stream tokens (SSE · @google/genai)"
                      : "Stream tokens (max 16,384 · temp 1 · top_p 0.95)"}
                  </span>
                </label>

                <div className="flex items-center gap-1.5">
                  {streaming ? (
                    <button
                      type="button"
                      onClick={stopStream}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-700"
                    >
                      <Square className="size-3" /> Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-testid="nvidia-vision-run-btn"
                      disabled={serverConfigured === false}
                      onClick={() => void runVisionAnalysis()}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#c5a880] px-4 text-xs font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Sparkles className="size-3.5" /> Analyze Image
                    </button>
                  )}
                </div>
              </div>

              {errorMsg ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-500/35 bg-rose-50 px-3 py-2 text-xs text-rose-800"
                >
                  {errorMsg}
                </div>
              ) : null}

              <div className="flex min-h-[150px] flex-1 flex-col rounded-2xl border border-[#d1c5b8]/55 bg-white p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-[#d1c5b8]/35 pb-1.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#725b38]">
                    {streaming ? <Loader2 className="size-3 animate-spin" /> : null}
                    {streaming ? "Streaming Response…" : "Vision Output"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {output.trim() ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void copyOutput()}
                          className="inline-flex h-6 items-center gap-1 rounded-full border border-[#d1c5b8]/60 px-2 text-[10px] text-[#4d463c] hover:text-[#1b1c1a]"
                        >
                          {copied ? <Check className="size-3 text-emerald-700" /> : <Copy className="size-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={applyToStudioIdea}
                          className="inline-flex h-6 items-center gap-1 rounded-full bg-[#1b1c1a] px-2.5 text-[10px] font-medium text-[#fbf9f5] hover:bg-[#323330]"
                        >
                          <Send className="size-2.5" /> Use as Studio Idea
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                {reasoning ? (
                  <details className="mb-2 rounded-xl bg-[#f5f3ef] px-2.5 py-1.5 text-[11px] text-[#4d463c]">
                    <summary className="cursor-pointer font-medium text-[#725b38]">Model reasoning trace</summary>
                    <p className="mt-1 whitespace-pre-wrap font-mono text-[10px]">{reasoning}</p>
                  </details>
                ) : null}

                <div
                  data-testid="nvidia-vision-output"
                  className="max-h-56 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-[#1b1c1a]"
                >
                  {output || (
                    <span className="text-[#7f766a]">
                      Click Analyze Image to stream architectural inspection from {activeModel}.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
