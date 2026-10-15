/**
 * Risk Classification Tier
 * Evaluates systemic data protection risks based on sensitivity weights,
 * combinations of identifiers, and context strength.
 * Note: Detections are labeled as "Potential PII" and not legally definitive claims.
 */

const CATEGORY_SEVERITY_WEIGHTS = {
  'Aadhaar-like': 45,
  'PAN-like': 40,
  'Passport-like': 45,
  'Driving Licence-like': 35,
  'Voter ID-like': 35,
  'Gov ID/Beneficiary': 40,
  'Phone Number': 15,
  'Email Address': 10,
  'Other Sensitive': 20
};

export function classifyScanRisk(detections) {
  if (!detections || detections.length === 0) {
    return {
      riskLevel: 'LOW',
      riskScore: 0,
      summary: 'No potential government or sensitive PII detected.',
      remediationAdvice: [
        'No immediate action required. Document appears clean of recognized government-issued PII patterns.',
        'Continue regular auditing for unformatted or handwritten sensitive records.'
      ]
    };
  }

  // Count by category
  const categoryCounts = {};
  let rawScore = 0;
  let hasGovId = false;

  for (const det of detections) {
    categoryCounts[det.category] = (categoryCounts[det.category] || 0) + 1;
    const baseWeight = CATEGORY_SEVERITY_WEIGHTS[det.category] || 15;
    
    // Scale by confidence
    rawScore += baseWeight * (det.confidence || 0.7);

    if ([
      'Aadhaar-like', 'PAN-like', 'Passport-like', 
      'Driving Licence-like', 'Voter ID-like', 'Gov ID/Beneficiary'
    ].includes(det.category)) {
      hasGovId = true;
    }
  }

  // Multiplier for combination of diverse identifier categories (identity stacking risk)
  const uniqueCategories = Object.keys(categoryCounts).length;
  if (uniqueCategories >= 3) {
    rawScore *= 1.35;
  } else if (uniqueCategories >= 2) {
    rawScore *= 1.15;
  }

  // Normalize risk score to 0 - 100 range
  const normalizedScore = Math.min(100, Math.round(rawScore));

  let riskLevel = 'LOW';
  let summary = '';
  const remediationAdvice = [];

  if (hasGovId || normalizedScore >= 60) {
    riskLevel = 'HIGH';
    summary = 'Critical Risk: High probability of government-issued identity documents detected. Direct exposure hazard.';
    remediationAdvice.push('Apply immediate irreversible masking or tokenization before sharing or storing this document.');
    remediationAdvice.push('Restrict file permissions to authorized personnel with strict Role-Based Access Control (RBAC).');
    remediationAdvice.push('Store encrypted at rest using AES-256 with key management isolated from data storage.');
    remediationAdvice.push('Audit data flow for compliance under the Digital Personal Data Protection (DPDP) Act / ISO 27701.');
  } else if (normalizedScore >= 30 || uniqueCategories >= 2 || detections.length > 2) {
    riskLevel = 'MEDIUM';
    summary = 'Moderate Risk: Potential personal contact information or isolated sensitive identifiers detected.';
    remediationAdvice.push('Review masked context snippets to verify whether the identified records are intended for public distribution.');
    remediationAdvice.push('Mask phone numbers and email addresses if the document is intended for external parties.');
    remediationAdvice.push('Implement retention limits and automated purge policies for temporary files.');
  } else {
    riskLevel = 'LOW';
    summary = 'Low Risk: Isolated, non-government contact attributes detected.';
    remediationAdvice.push('Standard data handling protocols apply.');
    remediationAdvice.push('Verify that contact information is authorized for business publication.');
  }

  return {
    riskLevel,
    riskScore: normalizedScore,
    summary,
    remediationAdvice
  };
}
