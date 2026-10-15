/**
 * Pattern Detection Tier for Government-Issued and Sensitive PII
 * Implements regex patterns and algorithmic validation (Verhoeff Checksum for Aadhaar)
 */

// Verhoeff Algorithm Tables for Aadhaar Checksum Validation
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const verhoeffInv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a 12-digit number using the Verhoeff checksum algorithm
 */
export function validateVerhoeff(numStr) {
  const clean = numStr.replace(/\D/g, '');
  if (clean.length !== 12) return false;
  
  // UIDAI specifies 1st digit cannot be 0 or 1
  if (clean[0] === '0' || clean[0] === '1') return false;

  let c = 0;
  const reversed = clean.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][reversed[i]]];
  }
  return c === 0;
}

export const PII_PATTERNS = [
  {
    category: 'Aadhaar-like',
    label: 'Potential Aadhaar Identifier',
    // Matches 12 digits with optional spaces or hyphens: 4 digits + 4 digits + 4 digits
    regex: /\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b/g,
    validator: (match) => {
      const clean = match.replace(/\D/g, '');
      const validChecksum = validateVerhoeff(clean);
      return {
        isValidChecksum: validChecksum,
        confidenceBonus: validChecksum ? 0.25 : 0.05
      };
    },
    baseConfidence: 0.65,
    riskWeight: 'HIGH'
  },
  {
    category: 'PAN-like',
    label: 'Potential PAN Identifier',
    // 5 letters + 4 digits + 1 letter (4th letter typically P, C, H, F, A, T, B, L, J, G)
    regex: /\b([A-Z]{5}[0-9]{4}[A-Z])\b/g,
    validator: (match) => {
      const fourthChar = match[3];
      const validFourth = ['P', 'C', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'].includes(fourthChar);
      return {
        isValidStructure: true,
        confidenceBonus: validFourth ? 0.2 : 0.05
      };
    },
    baseConfidence: 0.70,
    riskWeight: 'HIGH'
  },
  {
    category: 'Passport-like',
    label: 'Potential Passport Identifier',
    // Indian Passport: 1 uppercase letter followed by 7 digits
    regex: /\b([A-PR-WYa-pr-wy][1-9]\d{6})\b/g,
    baseConfidence: 0.60,
    riskWeight: 'HIGH'
  },
  {
    category: 'Driving Licence-like',
    label: 'Potential Driving Licence',
    // State code (2 letters) + RTO (2 digits) + Year (4 digits) + 7 digits, or standard format
    regex: /\b([A-Z]{2}[ -]?[0-9]{2}[ -]?(?:19|20)\d{2}[ -]?[0-9]{7})\b/g,
    baseConfidence: 0.65,
    riskWeight: 'HIGH'
  },
  {
    category: 'Voter ID-like',
    label: 'Potential Voter ID (EPIC)',
    // 3 letters followed by 7 digits
    regex: /\b([A-Z]{3}[0-9]{7})\b/g,
    baseConfidence: 0.60,
    riskWeight: 'HIGH'
  },
  {
    category: 'Gov ID/Beneficiary',
    label: 'Potential Gov/Beneficiary ID',
    // ABHA ID (14 digits) or EPFO/UAN (12 digits)
    regex: /\b(\d{2}[ -]\d{4}[ -]\d{4}[ -]\d{4})\b|\b(?:UAN|EPFO|ABHA|PPO)[ :#-]*([0-9]{10,14})\b/gi,
    baseConfidence: 0.65,
    riskWeight: 'HIGH'
  },
  {
    category: 'Phone Number',
    label: 'Potential Phone Number',
    // Indian mobile and standard landlines: +91 / 0 prefix followed by 10 digits starting with 6-9
    regex: /(?:(?:\+91|0)[ -]?)?[6-9]\d{4}[ -]?\d{5}\b/g,
    baseConfidence: 0.55,
    riskWeight: 'MEDIUM'
  },
  {
    category: 'Email Address',
    label: 'Potential Email Address',
    // Standard RFC-compliant email pattern
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    baseConfidence: 0.85,
    riskWeight: 'LOW'
  }
];

/**
 * Executes pattern matching across input text
 * Returns candidate list with location offsets and surrounding context windows
 */
export function extractPatternCandidates(text, enabledCategories = null) {
  const candidates = [];
  const activePatterns = enabledCategories
    ? PII_PATTERNS.filter(p => enabledCategories[p.category] !== false)
    : PII_PATTERNS;

  for (const pattern of activePatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      const rawValue = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + rawValue.length;

      // Extract window for context analysis (-60 chars to +60 chars)
      const windowStart = Math.max(0, startIndex - 60);
      const windowEnd = Math.min(text.length, endIndex + 60);
      const surroundingSnippet = text.substring(windowStart, windowEnd);

      let confidence = pattern.baseConfidence;
      if (pattern.validator) {
        const validation = pattern.validator(rawValue);
        if (validation && validation.confidenceBonus) {
          confidence += validation.confidenceBonus;
        }
      }

      candidates.push({
        category: pattern.category,
        label: pattern.label,
        rawValue,
        startIndex,
        endIndex,
        surroundingSnippet,
        baseConfidence: Math.min(0.95, confidence),
        riskWeight: pattern.riskWeight,
        source: 'pattern'
      });
    }
  }

  return candidates;
}
