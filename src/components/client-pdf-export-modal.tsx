import { Download, FileText, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BimScheduleRow } from "@/lib/archviz-suite";
import {
  PDF_SUBMISSION_PHASES,
  buildClientPdfVisualConfigRows,
  generateClientBriefPdf,
  type ClientPdfPresentationMeta,
} from "@/lib/brief-pdf";
import type { VisionDocument } from "@/lib/builder-data";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { Frame } from "@/lib/frame";
import type { DesignState } from "@/lib/properties";

type ClientPdfExportModalProps = {
  open: boolean;
  onClose: () => void;
  visionDoc: VisionDocument;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
  schedule: BimScheduleRow[];
  dictionarySummary: {
    presetId: string;
    blockCount: number;
    text: string;
    warningsCount: number;
  };
  activeTemplateName: string | null;
  previewImageUrl: string | null;
};

async function imageUrlToJpegDataUrl(src: string | null): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("data:image/")) return src;
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = src;
    });
    const canvas = document.createElement("canvas");
    const targetW = 768;
    const targetH = 432;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const srcRatio = loaded.naturalWidth / Math.max(1, loaded.naturalHeight);
    const dstRatio = targetW / targetH;
    let sx = 0;
    let sy = 0;
    let sw = loaded.naturalWidth;
    let sh = loaded.naturalHeight;
    if (srcRatio > dstRatio) {
      sw = loaded.naturalHeight * dstRatio;
      sx = (loaded.naturalWidth - sw) * 0.5;
    } else {
      sh = loaded.naturalWidth / dstRatio;
      sy = (loaded.naturalHeight - sh) * 0.5;
    }
    ctx.drawImage(loaded, sx, sy, sw, sh, 0, 0, targetW, targetH);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

export function ClientPdfExportModal({
  open,
  onClose,
  visionDoc,
  design,
  engine,
  scene3d,
  frame,
  schedule,
  dictionarySummary,
  activeTemplateName,
  previewImageUrl,
}: ClientPdfExportModalProps) {
  const [meta, setMeta] = useState<ClientPdfPresentationMeta>({
    projectName: visionDoc.title,
    clientName: "Private Client & Design Committee",
    preparedBy: "Oriel Archviz Studio",
    phase: PDF_SUBMISSION_PHASES[0],
    includeVisualSettings: true,
    includeBimSchedule: true,
    includePromptAppendix: true,
  });
  const [exporting, setExporting] = useState(false);
  const [lastExportSummary, setLastExportSummary] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMeta((prev) => ({
        ...prev,
        projectName: visionDoc.title || prev.projectName,
      }));
    }
  }, [open, visionDoc.title]);

  if (!open) return null;

  const visualRows = buildClientPdfVisualConfigRows(design, engine, scene3d, frame);

  async function handleDownloadPdf() {
    setExporting(true);
    try {
      const previewDataUrl = await imageUrlToJpegDataUrl(previewImageUrl);
      const pdf = generateClientBriefPdf({
        visionDoc,
        design,
        engine,
        scene3d,
        frame,
        schedule,
        dictionarySummary,
        activeTemplateName,
        meta,
        previewImageDataUrl: previewDataUrl,
      });

      const url = URL.createObjectURL(pdf.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdf.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      const kb = Math.max(1, Math.round(pdf.byteLength / 1024));
      const summary = `${pdf.filename} (${pdf.pageCount} page${pdf.pageCount === 1 ? "" : "s"} · ${kb} KB)`;
      setLastExportSummary(summary);
      toast.success(`Exported Client PDF: ${summary}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate PDF document.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Client Presentation PDF"
      data-testid="client-pdf-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <FileText className="size-4 text-[#b08a45]" />
            <div>
              <h2 className="font-serif text-lg font-semibold text-fg">
                Client Presentation PDF Export
              </h2>
              <p className="text-xs text-muted">
                Formatted A4 specification compiling brief narratives, visual settings, and BIM schedule.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close PDF export modal"
            className="grid size-8 place-items-center rounded-lg border border-line bg-raised text-muted hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Two-Column Body: Presentation Metadata Inputs + Live A4 Preview Sheet */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-12">
          {/* Left: Form Controls */}
          <div className="space-y-3.5 lg:col-span-5">
            <label className="block text-xs">
              <span className="font-medium text-fg">Project Title</span>
              <input
                type="text"
                aria-label="PDF project title"
                value={meta.projectName}
                onChange={(e) => setMeta((m) => ({ ...m, projectName: e.target.value }))}
                className="mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-fg">Client / Recipient</span>
              <input
                type="text"
                aria-label="PDF client name"
                value={meta.clientName}
                onChange={(e) => setMeta((m) => ({ ...m, clientName: e.target.value }))}
                className="mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-fg">Prepared By (Studio / Firm)</span>
              <input
                type="text"
                aria-label="PDF prepared by"
                value={meta.preparedBy}
                onChange={(e) => setMeta((m) => ({ ...m, preparedBy: e.target.value }))}
                className="mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
              />
            </label>

            <label className="block text-xs">
              <span className="font-medium text-fg">Submission Phase</span>
              <select
                aria-label="PDF submission phase"
                value={meta.phase}
                onChange={(e) => setMeta((m) => ({ ...m, phase: e.target.value }))}
                className="mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
              >
                {PDF_SUBMISSION_PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-2 border-t border-line pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
                Included Document Sections
              </p>
              <label className="flex items-center gap-2 text-xs text-fg">
                <input
                  type="checkbox"
                  checked={meta.includeVisualSettings}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, includeVisualSettings: e.target.checked }))
                  }
                  className="size-4 accent-[#b08a45]"
                />
                <span>Visual Configuration Settings Matrix ({visualRows.length} params)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-fg">
                <input
                  type="checkbox"
                  checked={meta.includeBimSchedule}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, includeBimSchedule: e.target.checked }))
                  }
                  className="size-4 accent-[#b08a45]"
                />
                <span>BIM Material &amp; Lighting Schedule ({schedule.length} rows)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-fg">
                <input
                  type="checkbox"
                  checked={meta.includePromptAppendix}
                  onChange={(e) =>
                    setMeta((m) => ({ ...m, includePromptAppendix: e.target.checked }))
                  }
                  className="size-4 accent-[#b08a45]"
                />
                <span>Compiled AI Prompt &amp; Dictionary Appendix</span>
              </label>
            </div>

            {lastExportSummary ? (
              <p
                data-testid="pdf-export-status"
                className="rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-3 py-2 font-mono text-[11px] text-emerald-800"
              >
                Saved: {lastExportSummary}
              </p>
            ) : null}
          </div>

          {/* Right: Live A4 Presentation Sheet Preview */}
          <div className="rounded-2xl border border-line bg-[#ebe5da] p-4 lg:col-span-7">
            <div className="mx-auto overflow-hidden rounded-lg border border-[#d6ccb9] bg-white shadow-sm">
              {/* Obsidian Cover Header */}
              <div className="border-b-2 border-[#d4b06a] bg-[#181512] px-5 py-4 text-[#faf6ef]">
                <p className="font-mono text-[9px] font-semibold tracking-widest text-[#d4b06a]">
                  ORIEL ARCHVIZ STUDIO · CLIENT SPECIFICATION
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold leading-snug">
                  {meta.projectName || visionDoc.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#d0c6b6]">{visionDoc.subtitle}</p>
              </div>

              <div className="space-y-3.5 p-4 text-[11px] text-[#1c1915]">
                {/* Client Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#e3dbce] bg-[#f9f6f0] p-2.5 sm:grid-cols-4">
                  <div>
                    <p className="text-[9px] font-semibold text-[#847866]">CLIENT</p>
                    <p className="truncate font-medium">{meta.clientName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#847866]">PREPARED BY</p>
                    <p className="truncate font-medium">{meta.preparedBy}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#847866]">PHASE</p>
                    <p className="truncate font-medium">{meta.phase}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold text-[#847866]">TEMPLATE</p>
                    <p className="truncate font-medium">{activeTemplateName ?? "Custom Brief"}</p>
                  </div>
                </div>

                {/* Narrative Highlights */}
                <div>
                  <p className="border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold">
                    01. Architectural Vision &amp; Brief
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-[#4a433a]">
                    {visionDoc.style?.description ?? visionDoc.synthesizedPrompt}
                  </p>
                </div>

                {meta.includeVisualSettings ? (
                  <div>
                    <p className="border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold">
                      02. Visual Configuration Settings
                    </p>
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {visualRows.slice(0, 6).map((row) => (
                        <div
                          key={row.parameter}
                          className="rounded border border-[#e4ddcf] bg-[#faf8f4] px-2 py-1"
                        >
                          <p className="text-[8px] font-semibold text-[#918472] uppercase">
                            {row.parameter}
                          </p>
                          <p className="truncate font-mono text-[10px]">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {meta.includeBimSchedule ? (
                  <div>
                    <p className="border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold">
                      03. BIM Material &amp; Lighting Schedule
                    </p>
                    <div className="mt-1.5 space-y-1">
                      {schedule.map((row) => (
                        <div
                          key={row.code}
                          className="flex items-center justify-between gap-2 border-b border-[#f0eae0] py-1 text-[10px]"
                        >
                          <span className="font-mono font-semibold text-[#b08a45]">{row.code}</span>
                          <span className="min-w-0 flex-1 truncate font-medium">{row.element}</span>
                          <span className="font-mono tabular-nums text-[#4a433a]">
                            {row.areaSharePct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-raised/50 px-5 py-3">
          <span className="text-xs text-muted">
            Exports multi-section vector A4 PDF via client-side engine.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-lg border border-line bg-surface px-4 text-xs font-medium text-muted hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="download-client-pdf-btn"
              disabled={exporting}
              onClick={() => void handleDownloadPdf()}
              className="gold-fill inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-55"
            >
              {exporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Download Client PDF (.pdf)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
