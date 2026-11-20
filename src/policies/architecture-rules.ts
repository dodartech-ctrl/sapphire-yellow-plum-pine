import type { GeometryConstraints, NanoBananaGenerateRequest } from "@/schemas/nano-banana.schema";

export const ARCHITECTURE_POLICIES = {
  geometry: {
    preserve: true,
    priority: 100,
    description: "Preserve building volume, structural grid, and overall silhouette when locked.",
  },
  windows: {
    preserve: true,
    priority: 95,
    description: "Maintain existing window locations, aperture proportions, and rhythm.",
  },
  floors: {
    preserve: true,
    priority: 100,
    description: "Preserve floor count, slab datums, and floor-to-floor proportions.",
  },
  roof: {
    preserve: true,
    priority: 90,
    description: "Maintain roofline silhouette and structural overhang profile.",
  },
  camera: {
    preserve: true,
    priority: 85,
    description: "Keep camera vantage point, eye-level horizon, and perspective lines.",
  },
  materials: {
    customizable: true,
    priority: 60,
    description: "Surface cladding, finishes, stone, wood, glazing tint, and tactile PBR materials.",
  },
  lighting: {
    customizable: true,
    priority: 50,
    description: "Solar azimuth, elevation, golden hour, dusk practicals, and atmosphere.",
  },
  vegetation: {
    customizable: true,
    priority: 40,
    description: "Landscape framing, courtyard planting, trees, and site entourage.",
  },
} as const;

export interface PolicyConflict {
  field: "geometry" | "windows" | "floors" | "roof" | "facade" | "camera" | "safety";
  reason: string;
  resolution: "block" | "ask" | "allow";
  policyPriority: number;
  suggestion: string;
}

export interface SafetyAuditResult {
  safe: boolean;
  sanitizedPrompt: string;
  injectionDetected: boolean;
  blockedReasons: string[];
  warnings: string[];
}

const INJECTION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern: /ignore\s+(all\s+)?((previous|prior|system|above)\s+)+(instructions?|rules?|policies?)/i,
    label: "Attempted system policy override phrase",
  },
  {
    pattern: /(reveal|print|dump|leak)\s+(the\s+)?(system\s+prompt|api[_\s-]?key|environment\s+variables?|secrets?)/i,
    label: "Attempted credential or system prompt exfiltration",
  },
  {
    pattern: /\b(skipValidation|bypassPolicy|isAdmin\s*:\s*true)\b/i,
    label: "Attempted privileged control flag injection",
  },
];

const DISALLOWED_CONTENT_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /\b(csam|child\s+exploitation|bioweapon|bomb\s+making|terrorist\s+attack)\b/i,
    reason: "Request violates platform safety policy.",
  },
];

const SECRET_REDACTION_PATTERNS: RegExp[] = [
  /\bAIza[0-9A-Za-z_-]{20,}\b/g,
  /\bsk-[0-9A-Za-z_-]{16,}\b/g,
  /\bxai-[0-9A-Za-z_-]{16,}\b/g,
  /\bBearer\s+[0-9A-Za-z._-]{16,}\b/gi,
];

export function redactSecrets(raw: string): string {
  let clean = raw;
  for (const pattern of SECRET_REDACTION_PATTERNS) {
    clean = clean.replace(pattern, "[REDACTED_SECRET]");
  }
  return clean;
}

export function sanitizeUntrustedInput(raw: string): string {
  const withoutControls = Array.from(redactSecrets(raw))
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127) ? ch : " ";
    })
    .join("");
  return withoutControls
    .replace(/```/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

export function detectPromptInjection(rawPrompt: string): SafetyAuditResult {
  const sanitizedPrompt = sanitizeUntrustedInput(rawPrompt);
  const blockedReasons: string[] = [];
  const warnings: string[] = [];
  let injectionDetected = false;

  for (const rule of DISALLOWED_CONTENT_PATTERNS) {
    if (rule.pattern.test(sanitizedPrompt)) {
      blockedReasons.push(rule.reason);
    }
  }

  for (const rule of INJECTION_PATTERNS) {
    if (rule.pattern.test(sanitizedPrompt)) {
      injectionDetected = true;
      warnings.push(`${rule.label} isolated as untrusted user data.`);
    }
  }

  return {
    safe: blockedReasons.length === 0,
    sanitizedPrompt,
    injectionDetected,
    blockedReasons,
    warnings,
  };
}

export interface DetectedUserIntentSignals {
  requestedWindowMovement: boolean;
  requestedFloorChange: boolean;
  requestedRoofRedesign: boolean;
  requestedFullFacadeRebuild: boolean;
  requestedCameraShift: boolean;
}

export function extractStructuralSignals(prompt: string): DetectedUserIntentSignals {
  const p = prompt.toLowerCase();
  return {
    requestedWindowMovement:
      /\b(move|relocate|remove|delete|shift|rearrange|eliminate|enlarge|widen|shrink|resize|expand)\b[^.]{0,36}\b(window|windows|glazing|openings?|fenestration)\b/i.test(
        p,
      ) ||
      /\b(window|windows|opening|openings)\b[^.]{0,28}\b(bigger|larger|wider|smaller|taller|shorter|moved|resized)\b/i.test(
        p,
      ) ||
      /\b(new\s+window\s+layout|different\s+window\s+positions)\b/i.test(p),
    requestedFloorChange:
      /\b(add|remove|delete|extra|double|reduce)\b[^.]{0,28}\b(floor|floors|story|stories|storey|storeys|level|levels)\b/i.test(
        p,
      ),
    requestedRoofRedesign:
      /\b(replace|change|convert|redesign|remove)\b[^.]{0,28}\b(roof|roofline|pitched\s+roof|flat\s+roof|gable)\b/i.test(
        p,
      ),
    requestedFullFacadeRebuild:
      /\b(redesign\s+the\s+entire\s+fa[cç]ade|rebuild\s+the\s+(entire\s+)?(building|structure|massing)|completely\s+change\s+(the\s+)?geometry)\b/i.test(
        p,
      ),
    requestedCameraShift:
      /\b(switch\s+to\s+aerial|bird['’]?s?\s*eye\s+view|drone\s+view|top[\s-]down\s+view|change\s+camera\s+angle)\b/i.test(
        p,
      ),
  };
}

export function resolveArchitecturalConflicts(
  constraints: Pick<
    GeometryConstraints,
    | "preserveGeometry"
    | "preserveWindows"
    | "preserveFloors"
    | "preserveRoof"
    | "preserveFacadeStructure"
    | "preserveCamera"
    | "allowStructuralChanges"
  >,
  promptOrSignals: string | Partial<DetectedUserIntentSignals>,
  hasSourceImage = true,
): PolicyConflict[] {
  if (!hasSourceImage) {
    return [];
  }

  const signals: DetectedUserIntentSignals =
    typeof promptOrSignals === "string"
      ? extractStructuralSignals(promptOrSignals)
      : {
          requestedWindowMovement: Boolean(promptOrSignals.requestedWindowMovement),
          requestedFloorChange: Boolean(promptOrSignals.requestedFloorChange),
          requestedRoofRedesign: Boolean(promptOrSignals.requestedRoofRedesign),
          requestedFullFacadeRebuild: Boolean(promptOrSignals.requestedFullFacadeRebuild),
          requestedCameraShift: Boolean(promptOrSignals.requestedCameraShift),
        };

  const conflicts: PolicyConflict[] = [];

  if (constraints.preserveWindows && signals.requestedWindowMovement) {
    conflicts.push({
      field: "windows",
      reason: "Window movement or removal conflicts with active Preserve Windows lock.",
      resolution: constraints.allowStructuralChanges ? "allow" : "ask",
      policyPriority: ARCHITECTURE_POLICIES.windows.priority,
      suggestion: "Disable 'Preserve Windows' or keep existing fenestration positions while updating mullions and glazing.",
    });
  }

  if (constraints.preserveFloors && signals.requestedFloorChange) {
    conflicts.push({
      field: "floors",
      reason: "Adding or removing floors conflicts with active Preserve Floors policy.",
      resolution: constraints.allowStructuralChanges ? "ask" : "block",
      policyPriority: ARCHITECTURE_POLICIES.floors.priority,
      suggestion: "Enable 'Allow Structural Changes' and unlock 'Preserve Floors' to modify story count.",
    });
  }

  if ((constraints.preserveGeometry || constraints.preserveFacadeStructure) && signals.requestedFullFacadeRebuild) {
    conflicts.push({
      field: "facade",
      reason: "Full structural facade redesign conflicts with Preserve Geometry / Facade Structure lock.",
      resolution: constraints.allowStructuralChanges ? "allow" : "ask",
      policyPriority: ARCHITECTURE_POLICIES.geometry.priority,
      suggestion: "Keep structural massing fixed and restyle cladding materials, or unlock Geometry Preservation.",
    });
  }

  if (constraints.preserveRoof && signals.requestedRoofRedesign) {
    conflicts.push({
      field: "roof",
      reason: "Roof profile change conflicts with Preserve Roof lock.",
      resolution: constraints.allowStructuralChanges ? "allow" : "ask",
      policyPriority: ARCHITECTURE_POLICIES.roof.priority,
      suggestion: "Keep roofline geometry fixed and update roofing material, or unlock Preserve Roof.",
    });
  }

  if (constraints.preserveCamera && signals.requestedCameraShift) {
    conflicts.push({
      field: "camera",
      reason: "Camera angle shift conflicts with Preserve Camera composition lock.",
      resolution: "ask",
      policyPriority: ARCHITECTURE_POLICIES.camera.priority,
      suggestion: "Unlock 'Preserve Camera' to render from an alternate drone or oblique vantage point.",
    });
  }

  return conflicts;
}

export function evaluatePolicyGate(
  request: NanoBananaGenerateRequest,
  hasSourceImage: boolean,
): {
  safety: SafetyAuditResult;
  conflicts: PolicyConflict[];
  requiresConfirmation: boolean;
  blocked: boolean;
} {
  const safety = detectPromptInjection(request.prompt);
  if (!safety.safe) {
    return {
      safety,
      conflicts: safety.blockedReasons.map((reason) => ({
        field: "safety",
        reason,
        resolution: "block",
        policyPriority: 1000,
        suggestion: "Revise the architectural prompt to comply with studio safety standards.",
      })),
      requiresConfirmation: false,
      blocked: true,
    };
  }

  const conflicts = resolveArchitecturalConflicts(request.constraints, safety.sanitizedPrompt, hasSourceImage);
  const blocked = conflicts.some((c) => c.resolution === "block");
  const requiresConfirmation =
    !blocked && !request.confirmConflicts && conflicts.some((c) => c.resolution === "ask");

  return {
    safety,
    conflicts,
    requiresConfirmation,
    blocked,
  };
}
