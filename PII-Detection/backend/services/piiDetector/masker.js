/**
 * Privacy & Data Masking Tier
 * Guarantees that complete raw sensitive values are never displayed in the UI,
 * logged to outputs, or stored in database records.
 */

/**
 * Masks an Aadhaar number: keeps only the last 4 digits
 * Example: 2345 6789 0123 -> XXXX-XXXX-0123
 */
export function maskAadhaar(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.length < 4) return 'XXXX-XXXX-XXXX';
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

/**
 * Masks a PAN number: shows first char and last two chars
 * Example: ABCDE1234F -> AXXXXXX34F
 */
export function maskPAN(val) {
  const clean = val.trim();
  if (clean.length < 3) return 'AXXXXXX00X';
  const first = clean.charAt(0);
  const last2 = clean.slice(-2);
  return `${first}XXXXXX${last2}`;
}

/**
 * Masks an Indian Passport: first letter and last 2 digits
 * Example: J1234567 -> JXXXXX67
 */
export function maskPassport(val) {
  const clean = val.trim();
  if (clean.length < 3) return 'PXXXXXXX';
  const first = clean.charAt(0);
  const last2 = clean.slice(-2);
  return `${first}XXXXX${last2}`;
}

/**
 * Masks a Driving Licence: state code and last 4 digits
 * Example: MH1420110062821 -> MH-XXXX-2821
 */
export function maskDrivingLicence(val) {
  const clean = val.replace(/[\s-]/g, '');
  if (clean.length < 6) return 'DL-XXXX-XXXX';
  const prefix = clean.substring(0, 2).toUpperCase();
  const last4 = clean.slice(-4);
  return `${prefix}-XXXX-${last4}`;
}

/**
 * Masks a Voter ID (EPIC): 2 letters + XXXX + last 3 digits
 * Example: WBF1234567 -> WBXXXX567
 */
export function maskVoterID(val) {
  const clean = val.replace(/[\s-]/g, '');
  if (clean.length < 5) return 'XX-XXXX-XXX';
  const prefix = clean.substring(0, 2).toUpperCase();
  const last3 = clean.slice(-3);
  return `${prefix}XXXX${last3}`;
}

/**
 * Masks Gov Beneficiary IDs (UAN, ABHA, PPO): shows last 4 digits
 */
export function maskGovID(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.length < 4) return 'ID-XXXX-XXXX';
  const last4 = digits.slice(-4);
  return `ID-XXXX-${last4}`;
}

/**
 * Masks Phone numbers: keeps last 3 digits
 * Example: +91 9876543210 -> +91-XXXXX-210
 */
export function maskPhone(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.length < 4) return '+91-XXXXX-XXX';
  const last3 = digits.slice(-3);
  const prefix = val.includes('+91') ? '+91-' : '';
  return `${prefix}XXXXX-${last3}`;
}

/**
 * Masks Email address: first char + ***@domain
 * Example: user.name@domain.com -> u***@domain.com
 */
export function maskEmail(val) {
  const parts = val.split('@');
  if (parts.length !== 2) return 'x***@domain.com';
  const [username, domain] = parts;
  const firstChar = username.charAt(0) || 'u';
  return `${firstChar}***@${domain}`;
}

/**
 * General router for masking by category
 */
export function maskValue(category, rawValue) {
  switch (category) {
    case 'Aadhaar-like':
      return maskAadhaar(rawValue);
    case 'PAN-like':
      return maskPAN(rawValue);
    case 'Passport-like':
      return maskPassport(rawValue);
    case 'Driving Licence-like':
      return maskDrivingLicence(rawValue);
    case 'Voter ID-like':
      return maskVoterID(rawValue);
    case 'Gov ID/Beneficiary':
      return maskGovID(rawValue);
    case 'Phone Number':
      return maskPhone(rawValue);
    case 'Email Address':
      return maskEmail(rawValue);
    default:
      if (rawValue.length > 4) {
        return rawValue.substring(0, 2) + 'XXXX' + rawValue.slice(-2);
      }
      return 'XXXX';
  }
}

/**
 * Safely masks occurrences of rawValue inside context snippets
 */
export function maskContextSnippet(snippet, rawValue, maskedValue) {
  if (!snippet || !rawValue) return '';
  return snippet.split(rawValue).join(maskedValue);
}

/**
 * Generates fully redacted preview text where all detected spans are replaced with masked tokens
 */
export function generateRedactedDocument(fullText, detections) {
  if (!fullText) return '';
  // Sort detections by startIndex descending to replace without offsetting indices
  const sorted = [...detections].sort((a, b) => b.startIndex - a.startIndex);
  let redacted = fullText;

  for (const det of sorted) {
    if (det.startIndex !== undefined && det.endIndex !== undefined) {
      const before = redacted.substring(0, det.startIndex);
      const after = redacted.substring(det.endIndex);
      redacted = before + `[${det.category}: ${det.maskedValue}]` + after;
    }
  }

  return redacted;
}
