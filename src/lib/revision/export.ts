/** Delivery: approved images, the machine-readable record, and the one-page finish and change record. */
import { jsPDF } from "jspdf";
import { setImages } from "./engine.ts";
import { downloadDataUrl, downloadText } from "./browser.ts";
import type { RevProject } from "./store.ts";
import { approvalValidFor, buildManifest, type Approval, type ExportManifest, type VersionSet } from "./versions.ts";

const safe = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "view";

export function latestValidApproval(project: RevProject, set: VersionSet): Approval | null {
  return [...project.approvals].reverse().find((a) => approvalValidFor(set, a)) ?? null;
}

export function manifestFor(project: RevProject, set: VersionSet, approval: Approval): ExportManifest {
  return buildManifest({
    projectName: project.name,
    set,
    approval,
    changeRequest: project.feedback,
    fileFor: (v) => `${safe(project.name)}_${safe(v.viewName)}_${set.id.slice(0, 8)}.png`,
  });
}

async function imageSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.width, h: img.height });
    img.onerror = () => resolve({ w: 4, h: 3 });
    img.src = dataUrl;
  });
}

export async function buildChangeRecordPdf(project: RevProject, set: VersionSet, approval: Approval): Promise<jsPDF> {
  const manifest = manifestFor(project, set, approval);
  const images = await setImages(project.id, set);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  let y = M;
  const line = (text: string, size = 10, bold = false, gap = 14) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const rows = doc.splitTextToSize(text, W - M * 2) as string[];
    for (const row of rows) {
      doc.text(row, M, y);
      y += gap;
    }
  };
  line("Finish and change record", 18, true, 22);
  line(project.name, 12, true, 18);
  y += 4;
  line(`Revision ID: ${set.id}`, 8);
  line(`Branch: ${set.branch}${set.parentId ? `  ·  Parent: ${set.parentId.slice(0, 16)}…` : ""}`, 8);
  line(`Approved by ${approval.approver} on ${new Date(approval.at).toLocaleDateString()} (${approval.source === "client-link" ? "client review link" : "designer sign-off"})`, 9, true);
  if (approval.note) line(`Note: ${approval.note}`, 9);
  y += 6;
  line("Client request", 11, true);
  line(project.feedback || "Not recorded.", 10);
  y += 4;
  line("Finish", 11, true);
  const f = manifest.finish;
  line(`${f.label}  ·  role: ${f.role}`, 10);
  line(`Supplier: ${f.supplier || "not supplied"}   SKU: ${f.sku || "not supplied"}   Grain: ${f.grain || "not specified"}`, 9);
  y += 6;
  line("Views (before / after)", 11, true);
  const colW = (W - M * 2 - 12) / 2;
  for (const img of images) {
    if (!img.before || !img.after) continue;
    const size = await imageSize(img.after);
    const h = Math.min(150, colW * (size.h / size.w));
    if (y + h + 36 > doc.internal.pageSize.getHeight() - M) {
      doc.addPage();
      y = M;
    }
    line(img.name, 9, true, 12);
    doc.addImage(img.before, "PNG", M, y, colW, h);
    doc.addImage(img.after, "PNG", M + colW + 12, y, colW, h);
    y += h + 14;
  }
  const hashes = manifest.views.map((v) => `${v.viewName}: ${v.resultHash.slice(0, 20)}…`).join("   ");
  line(`Result hashes: ${hashes}`, 7, false, 10);
  y += 4;
  for (const note of manifest.notes) line(note, 8, false, 11);
  return doc;
}

/** Download the approved images, the JSON record and the PDF. Throws unless the approval belongs to this exact set. */
export async function exportApproved(project: RevProject, set: VersionSet, approval: Approval): Promise<void> {
  const manifest = manifestFor(project, set, approval); // throws if the approval is not valid for this set
  const images = await setImages(project.id, set);
  for (const img of images) {
    const entry = manifest.views.find((v) => v.viewName === img.name);
    if (img.after && entry) downloadDataUrl(entry.file, img.after);
  }
  downloadText(`${safe(project.name)}_record_${set.id.slice(0, 8)}.json`, JSON.stringify(manifest, null, 2));
  const pdf = await buildChangeRecordPdf(project, set, approval);
  pdf.save(`${safe(project.name)}_change-record_${set.id.slice(0, 8)}.pdf`);
}
