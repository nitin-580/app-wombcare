/**
 * WombCare - AI Health Content Scrubbing Filter
 * Ensures AI responses comply with Google Play health policies:
 * - Replaces medical/diagnostic claims with wellness/coaching terminology.
 * - Appends a persistent medical disclaimer warning.
 */

const REPLACEMENTS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /\bcure pcos\b/gi, replacement: "support PCOS wellness" },
  { pattern: /\bcure pcod\b/gi, replacement: "support PCOD wellness" },
  { pattern: /\bcuring pcos\b/gi, replacement: "managing PCOS symptoms" },
  { pattern: /\bcuring pcod\b/gi, replacement: "managing PCOD symptoms" },
  { pattern: /\b(reverse|reversing) pcos\b/gi, replacement: "manage PCOS symptoms" },
  { pattern: /\b(reverse|reversing) pcod\b/gi, replacement: "manage PCOD symptoms" },
  { pattern: /\bpcos reversal\b/gi, replacement: "PCOS symptom support" },
  { pattern: /\bpcod reversal\b/gi, replacement: "PCOD symptom support" },
  { pattern: /\bdiagnose\b/gi, replacement: "evaluate wellness indicators for" },
  { pattern: /\bdiagnosis\b/gi, replacement: "wellness assessment" },
  { pattern: /\btreatment plan\b/gi, replacement: "lifestyle coaching plan" },
  { pattern: /\bprescribe\b/gi, replacement: "suggest wellness guidelines for" },
  { pattern: /\bprescription\b/gi, replacement: "lifestyle suggestion" },
  { pattern: /\bmedical device\b/gi, replacement: "wellness coaching app" },
];

export function scrubTerminology(text: string): string {
  if (!text) return "";
  let scrubbed = text;
  for (const { pattern, replacement } of REPLACEMENTS) {
    scrubbed = scrubbed.replace(pattern, replacement);
  }
  return scrubbed;
}

export function scrubHealthContent(text: string): string {
  if (!text) return "";
  const scrubbed = scrubTerminology(text);
  const disclaimerSuffix = 
    "\n\n*Disclaimer: WombCare AI offers lifestyle suggestions and wellness coaching, not clinical diagnoses or medical treatments. Always consult a doctor for medical conditions.*";
  return scrubbed + disclaimerSuffix;
}
