import { jsPDF } from "jspdf";
import type { BimScheduleRow } from "@/lib/archviz-suite";
import type { VisionDocument } from "@/lib/builder-data";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { Frame } from "@/lib/frame";
import type { DesignState } from "@/lib/properties";
import { formatSolarTime } from "@/lib/solar-and-materials";

export type ClientPdfPresentationMeta = {
  projectName: string;
  clientName: string;
  preparedBy: string;
  phase: string;
  includeVisualSettings: boolean;
  includeBimSchedule: boolean;
  includePromptAppendix: boolean;
};

export type VisualConfigRow = {
  group: string;
  parameter: string;
  value: string;
};

export type ClientPdfExportInput = {
  visionDoc: VisionDocument;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
  schedule: BimScheduleRow[];
  dictionarySummary?: {
    presetId: string;
    blockCount: number;
    text: string;
    warningsCount: number;
  };
  activeTemplateName?: string | null;
  meta: ClientPdfPresentationMeta;
  previewImageDataUrl?: string | null;
};

export type GeneratedClientPdfResult = {
  filename: string;
  byteLength: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
  blob: Blob;
};

export const PDF_SUBMISSION_PHASES = [
  "Schematic Design · Phase 01",
  "Client Design Review",
  "Competition Submittal",
  "Material & Lighting Sign-Off",
] as const;

export function buildClientPdfVisualConfigRows(
  design: DesignState,
  engine: EngineState,
  scene3d: Scene3DState,
  frame: Frame,
): VisualConfigRow[] {
  const solarSpec = scene3d.geoEnabled
    ? `${formatSolarTime(scene3d.geoHour)} · Month ${scene3d.geoMonth} · Lat ${scene3d.geoLatitude}°`
    : `${scene3d.sunAzimuth}° Az / ${scene3d.sunElevation}° El`;

  return [
    {
      group: "Design Direction",
      parameter: "Discipline & Quality Tier",
      value: `${design.vertical.toUpperCase()} · ${design.range} · ${design.look}`,
    },
    {
      group: "Design Direction",
      parameter: "Atmosphere & Color Base",
      value: `${design.mood} · ${design.color} · ${design.weather}`,
    },
    {
      group: "Output Frame",
      parameter: "Aspect & Resolution",
      value: `${frame.ratio} · ${frame.resolution.toUpperCase()} (${engine.outputMode === "grid-4" ? "4-Up Grid" : "Single Plate"})`,
    },
    {
      group: "Engine & Conditioning",
      parameter: "Workflow & Fidelity",
      value: `${engine.workflowPreset} · ${engine.renderFidelity} · Geometry Lock ${engine.geometryLock}%`,
    },
    {
      group: "Engine & Conditioning",
      parameter: "Facade & Climate Context",
      value: `${engine.facadeTypology} · ${engine.climateRegion}`,
    },
    {
      group: "Engine & Conditioning",
      parameter: "Seed & Stylize Control",
      value: `Seed #${engine.seed}${engine.seedLocked ? " (Locked)" : ""} · --s ${engine.mjStylize} · Edge ${engine.edgeAdherence}%`,
    },
    {
      group: "3D Studio & Optics",
      parameter: "Massing & Primary Material",
      value: `${scene3d.preset} · ${scene3d.primaryMaterial} · ${scene3d.focalLength}mm Lens`,
    },
    {
      group: "3D Studio & Optics",
      parameter: "Solar & HDRI Lighting",
      value: `${design.light} · ${solarSpec} · HDRI: ${scene3d.hdriMood}`,
    },
  ];
}

export function buildPdfFilename(projectName: string): string {
  const slug =
    projectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "oriel-architectural-brief";
  return `${slug}-presentation.pdf`;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [Number.isFinite(r) ? r : 180, Number.isFinite(g) ? g : 140, Number.isFinite(b) ? b : 70];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [Number.isFinite(r) ? r : 180, Number.isFinite(g) ? g : 140, Number.isFinite(b) ? b : 70];
  }
  return [180, 140, 70];
}

export function generateClientBriefPdf(input: ClientPdfExportInput): GeneratedClientPdfResult {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: false,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const contentW = pageW - marginX * 2;
  const bottomLimit = pageH - 18;
  let y = 0;

  const projectTitle = input.meta.projectName.trim() || input.visionDoc.title || "Architectural Vision Brief";
  const clientName = input.meta.clientName.trim() || "Client Presentation Copy";
  const preparedBy = input.meta.preparedBy.trim() || "Oriel Architectural Visualization Studio";
  const phase = input.meta.phase.trim() || "Schematic Design · Phase 01";

  const drawHeaderBand = (isContinuation = false) => {
    doc.setFillColor(24, 21, 18); // #181512
    doc.rect(0, 0, pageW, isContinuation ? 18 : 38, "F");
    doc.setFillColor(212, 176, 106); // #d4b06a champagne gold rule
    doc.rect(0, isContinuation ? 17.2 : 37, pageW, 1, "F");

    if (isContinuation) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(212, 176, 106);
      doc.text("ORIEL ARCHVIZ STUDIO", marginX, 8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(235, 228, 216);
      doc.text(`${projectTitle} · ${phase}`, marginX, 13.5);
      y = 26;
      return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(212, 176, 106);
    doc.text("ORIEL ARCHITECTURAL VISUALIZATION STUDIO · CLIENT SPECIFICATION", marginX, 11);

    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(250, 246, 239);
    const titleLines = doc.splitTextToSize(projectTitle, contentW).slice(0, 2);
    doc.text(titleLines, marginX, 20.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(208, 198, 182);
    const subLines = doc.splitTextToSize(input.visionDoc.subtitle, contentW).slice(0, 1);
    doc.text(subLines, marginX, 31.5);
    y = 46;
  };

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimit) {
      doc.addPage();
      drawHeaderBand(true);
    }
  };

  const drawSectionHeading = (numStr: string, heading: string) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(176, 138, 69);
    doc.text(numStr.toUpperCase(), marginX, y);
    y += 4.5;
    doc.setFont("times", "bold");
    doc.setFontSize(13.5);
    doc.setTextColor(28, 25, 21);
    doc.text(heading, marginX, y);
    y += 2.5;
    doc.setDrawColor(224, 216, 203);
    doc.setLineWidth(0.35);
    doc.line(marginX, y, pageW - marginX, y);
    y += 5.5;
  };

  // Page 1 Header
  drawHeaderBand(false);

  // Client Metadata Block (4-column grid box)
  doc.setFillColor(249, 246, 240);
  doc.setDrawColor(227, 219, 206);
  doc.roundedRect(marginX, y, contentW, 20, 2, 2, "FD");
  const metaCols = [
    { label: "CLIENT / RECIPIENT", val: clientName },
    { label: "PREPARED BY", val: preparedBy },
    { label: "SUBMISSION PHASE", val: phase },
    { label: "DATE & TEMPLATE", val: `${input.visionDoc.date}${input.activeTemplateName ? ` · ${input.activeTemplateName}` : ""}` },
  ];
  const colW = contentW / 4;
  metaCols.forEach((col, i) => {
    const cx = marginX + 3.5 + i * colW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(132, 120, 102);
    doc.text(col.label, cx, y + 6.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(32, 28, 24);
    const lines = doc.splitTextToSize(col.val, colW - 6).slice(0, 2);
    doc.text(lines, cx, y + 11.2);
  });
  y += 26;

  // Optional Hero Visualization Plate Thumbnail
  if (input.previewImageDataUrl && input.previewImageDataUrl.startsWith("data:image/")) {
    try {
      const imgH = 54;
      const imgW = 96; // 16:9 focal thumbnail
      ensureSpace(imgH + 10);
      doc.setFillColor(28, 25, 21);
      doc.roundedRect(marginX, y, contentW, imgH + 4, 2, 2, "F");
      const fmt = input.previewImageDataUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(input.previewImageDataUrl, fmt, marginX + 2, y + 2, imgW, imgH);
      // Right-hand quick plate caption inside the dark showcase frame
      const capX = marginX + imgW + 7;
      const capW = contentW - imgW - 11;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(212, 176, 106);
      doc.text("VISUAL REFERENCE PLATE", capX, y + 10);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(246, 239, 228);
      doc.text(doc.splitTextToSize(input.visionDoc.style?.name ?? input.design.look, capW).slice(0, 2), capX, y + 17);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(200, 190, 176);
      const captionDesc = doc.splitTextToSize(
        `${input.visionDoc.lighting?.name ?? input.design.light} · ${input.visionDoc.camera?.name ?? `${input.scene3d.focalLength}mm Architecture Lens`} · Aspect ${input.frame.ratio}`,
        capW,
      ).slice(0, 4);
      doc.text(captionDesc, capX, y + 29);
      y += imgH + 10;
    } catch {
      // Skip image gracefully if canvas/dataURL fails to decode
    }
  }

  // Section 01: Architectural Brief & Narrative
  drawSectionHeading("Section 01", "Architectural Vision & Brief Specification");
  const slotBlocks = [
    {
      title: "Architectural Style & Massing",
      name: input.visionDoc.style?.name ?? "Custom Architectural Direction",
      desc:
        input.visionDoc.style?.description ??
        "Bespoke spatial envelope balancing proportion, structural clarity, and warm materiality.",
    },
    {
      title: "Lighting Condition & Solar Environment",
      name: input.visionDoc.lighting?.name ?? input.design.light,
      desc:
        input.visionDoc.lighting?.description ??
        "Calibrated architectural lighting emphasizing surface texture and atmospheric depth.",
    },
    {
      title: "Mood & Spatial Psychology",
      name: input.visionDoc.mood?.name ?? input.design.mood,
      desc:
        input.visionDoc.mood?.description ??
        "Refined spatial rhythm designed for human comfort and editorial presentation.",
    },
    {
      title: "Camera Strategy & Framing",
      name: input.visionDoc.camera?.name ?? `${input.scene3d.focalLength}mm Architectural Shift`,
      desc:
        input.visionDoc.camera?.description ??
        "Two-point corrected vertical framing preserving natural architectural perspective.",
    },
  ];

  for (const item of slotBlocks) {
    const descLines = doc.splitTextToSize(item.desc, contentW - 6);
    const blockH = 9 + descLines.length * 4.2;
    ensureSpace(blockH + 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(132, 102, 50);
    doc.text(`${item.title}: `, marginX, y);
    const prefixW = doc.getTextWidth(`${item.title}: `);
    doc.setTextColor(28, 25, 21);
    doc.text(item.name, marginX + prefixW, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(74, 67, 58);
    doc.text(descLines, marginX + 2, y);
    y += descLines.length * 4.2 + 3.5;
  }

  if (input.visionDoc.customNotes.trim()) {
    const noteLines = doc.splitTextToSize(input.visionDoc.customNotes.trim(), contentW - 8);
    const boxH = 10 + noteLines.length * 4.2;
    ensureSpace(boxH + 4);
    doc.setFillColor(246, 242, 234);
    doc.setDrawColor(220, 208, 187);
    doc.roundedRect(marginX, y, contentW, boxH, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(140, 106, 48);
    doc.text("STUDIO DIRECTIVES & PROJECT NOTES", marginX + 4, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 35, 30);
    doc.text(noteLines, marginX + 4, y + 10.5);
    y += boxH + 6;
  }

  // Section 02: Visual Configuration Settings
  if (input.meta.includeVisualSettings) {
    drawSectionHeading("Section 02", "Visual Configuration Settings");
    const configRows = buildClientPdfVisualConfigRows(input.design, input.engine, input.scene3d, input.frame);
    const halfW = (contentW - 4) / 2;
    for (let i = 0; i < configRows.length; i += 2) {
      ensureSpace(16);
      const pair = [configRows[i], configRows[i + 1]].filter(Boolean);
      pair.forEach((row, colIdx) => {
        const rx = marginX + colIdx * (halfW + 4);
        doc.setFillColor(250, 248, 244);
        doc.setDrawColor(228, 221, 210);
        doc.roundedRect(rx, y, halfW, 13.5, 1.2, 1.2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(145, 132, 114);
        doc.text(`${row.group.toUpperCase()} · ${row.parameter.toUpperCase()}`, rx + 3, y + 4.8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(28, 25, 21);
        const valLines = doc.splitTextToSize(row.value, halfW - 6).slice(0, 1);
        doc.text(valLines, rx + 3, y + 10);
      });
      y += 15.5;
    }
    y += 2;
  }

  // Material Palette Swatches Strip
  const swatches = input.visionDoc.style?.swatches ?? ["#d8cfc1", "#9b8c78", "#4e473f", "#1f1c18"];
  const matList = input.visionDoc.style?.materials ?? ["Fair-faced concrete", "White oak", "Honed travertine", "Low-iron glass"];
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 98, 82);
  doc.text("KEY MATERIAL & TONAL SWATCHES", marginX, y);
  y += 4;
  swatches.slice(0, 4).forEach((hex, idx) => {
    const sx = marginX + idx * (contentW / 4);
    const [r, g, b] = hexToRgb(hex);
    doc.setFillColor(r, g, b);
    doc.setDrawColor(180, 170, 155);
    doc.roundedRect(sx, y, 7, 7, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(32, 28, 24);
    doc.text(doc.splitTextToSize(matList[idx] ?? hex, contentW / 4 - 11).slice(0, 1), sx + 9, y + 3.2);
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 110, 96);
    doc.text(hex.toUpperCase(), sx + 9, y + 6.6);
  });
  y += 13;

  // Section 03: BIM Material & Lighting Schedule
  if (input.meta.includeBimSchedule && input.schedule.length > 0) {
    drawSectionHeading("Section 03", "BIM Material & Lighting Schedule");
    const colWidths = [20, 46, 76, 22, 14]; // sums to 178mm = contentW
    const drawTableHeader = () => {
      ensureSpace(12);
      doc.setFillColor(241, 235, 224);
      doc.rect(marginX, y, contentW, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(88, 78, 66);
      const headers = ["CODE", "ELEMENT", "SPECIFICATION", "SWATCH", "AREA"];
      let cx = marginX + 2;
      headers.forEach((h, i) => {
        doc.text(h, i === 4 ? cx + colWidths[i] - 4 : cx, y + 4.8, i === 4 ? { align: "right" } : undefined);
        cx += colWidths[i];
      });
      y += 7;
    };

    drawTableHeader();
    for (const row of input.schedule) {
      const specLines = doc.splitTextToSize(row.specification, colWidths[2] - 4);
      const elLines = doc.splitTextToSize(row.element, colWidths[1] - 4);
      const lineCount = Math.max(specLines.length, elLines.length, 1);
      const rowH = Math.max(8, lineCount * 4 + 3.5);
      if (y + rowH > bottomLimit) {
        doc.addPage();
        drawHeaderBand(true);
        drawTableHeader();
      }
      doc.setDrawColor(232, 225, 214);
      doc.line(marginX, y + rowH, marginX + contentW, y + rowH);

      let cx = marginX + 2;
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.setTextColor(176, 138, 69);
      doc.text(row.code, cx, y + 5);
      cx += colWidths[0];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(28, 25, 21);
      doc.text(elLines, cx, y + 5);
      cx += colWidths[1];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(78, 70, 60);
      doc.text(specLines, cx, y + 5);
      cx += colWidths[2];

      const [r, g, b] = hexToRgb(row.finishHex);
      doc.setFillColor(r, g, b);
      doc.setDrawColor(180, 172, 160);
      doc.rect(cx, y + 2.5, 3.5, 3.5, "FD");
      doc.setFont("courier", "normal");
      doc.setFontSize(7.2);
      doc.setTextColor(65, 58, 50);
      doc.text(row.finishHex, cx + 5, y + 5.2);
      cx += colWidths[3];

      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.setTextColor(28, 25, 21);
      doc.text(`${row.areaSharePct}%`, cx + colWidths[4] - 4, y + 5, { align: "right" });
      y += rowH;
    }
    y += 6;
  }

  // Section 04: Compiled AI Prompt & Dictionary Appendix
  if (input.meta.includePromptAppendix) {
    drawSectionHeading("Section 04", "Compiled Diffusion Prompt & Conditioning Spec");
    const promptLines = doc.splitTextToSize(input.visionDoc.synthesizedPrompt, contentW - 8);
    const boxH = 9 + promptLines.length * 4;
    ensureSpace(boxH + 6);
    doc.setFillColor(28, 25, 21);
    doc.roundedRect(marginX, y, contentW, boxH, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(212, 176, 106);
    const dictLine = input.dictionarySummary
      ? `SYNTHESIZED PROMPT · DICTIONARY SCENARIO: ${input.dictionarySummary.presetId.toUpperCase()} (${input.dictionarySummary.blockCount} BLOCKS)`
      : "SYNTHESIZED ARCHITECTURAL GENERATION PROMPT";
    doc.text(dictLine, marginX + 4, y + 5.2);
    doc.setFont("courier", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(238, 232, 222);
    doc.text(promptLines, marginX + 4, y + 9.5);
    y += boxH + 6;
  }

  // Page Footers across all pages
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(224, 216, 203);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageH - 12, pageW - marginX, pageH - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(125, 114, 98);
    doc.text(`Prepared by ${preparedBy} · ${clientName}`, marginX, pageH - 7.5);
    doc.text(`Page ${p} of ${pageCount}`, pageW - marginX, pageH - 7.5, { align: "right" });
  }

  const arrayBuffer = doc.output("arraybuffer");
  const blob = doc.output("blob");
  const filename = buildPdfFilename(projectTitle);

  return {
    filename,
    byteLength: arrayBuffer.byteLength,
    pageCount,
    arrayBuffer,
    blob,
  };
}
