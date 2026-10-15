/**
 * Context & NLP Heuristic Analysis Tier
 * Analyzes surrounding semantic cues to adjust confidence scores and filter false positives
 */

const CONTEXT_KEYWORDS = {
  'Aadhaar-like': [
    'aadhaar', 'uid', 'uidai', 'unique identification', 'resident', 
    'mera aadhaar', 'enrollment', 'vid', 'virtual id', 'identity proof',
    'father', 'dob', 'government of india', 'poi', 'poa'
  ],
  'PAN-like': [
    'pan', 'permanent account number', 'income tax', 'income-tax', 
    'form 16', 'itr', 'nsdl', 'utiitsl', 'taxpayer', 'assessee', 
    'tax invoice', 'father\'s name', 'assessment year'
  ],
  'Passport-like': [
    'passport', 'republic of india', 'nationality', 'place of issue',
    'date of expiry', 'visa', 'consular', 'immigration', 'travel document',
    'surname', 'given name', 'type p'
  ],
  'Driving Licence-like': [
    'driving licence', 'driver\'s license', 'dl no', 'transport department',
    'rto', 'motor vehicle', 'licence to drive', 'valid till', 'authorization'
  ],
  'Voter ID-like': [
    'voter', 'epic', 'election commission', 'elector', 'electoral', 
    'constituency', 'identity card', 'polling station'
  ],
  'Gov ID/Beneficiary': [
    'uan', 'epfo', 'provident fund', 'pension', 'ppo', 'ayushman', 
    'abha', 'cghs', 'pmjay', 'beneficiary', 'employee code', 'gov employee',
    'pran', 'nps'
  ],
  'Phone Number': [
    'phone', 'mobile', 'tel', 'contact', 'call', 'cell', 'whatsapp', 
    'telephone', 'helpline', 'sms', 'reach out'
  ],
  'Email Address': [
    'email', 'mail', 'e-mail', 'contact', 'inbox', 'reach out', 'write to'
  ]
};

// Patterns that typically signal false positive alphanumeric matches
const FALSE_POSITIVE_INDICATORS = [
  'commit', 'sha256', 'md5', 'hash', 'uuid', 'guid', 'git', 'checksum', 
  'barcode', 'sku', 'product id', 'tracking id', 'css', 'hex', 'color', 
  'rgb', '0x', 'const ', 'let ', 'var ', 'function', 'class '
];

/**
 * Analyzes the context window for a candidate
 * Returns adjusted confidence and context flags
 */
export function analyzeContext(candidate, fullText) {
  const snippet = candidate.surroundingSnippet.toLowerCase();
  const category = candidate.category;
  const keywords = CONTEXT_KEYWORDS[category] || [];

  let contextScore = 0;
  const matchedKeywords = [];

  // Check for positive context cues
  for (const kw of keywords) {
    if (snippet.includes(kw)) {
      contextScore += 0.12;
      matchedKeywords.push(kw);
    }
  }

  // Check for false positive indicators
  let falsePositiveSuspected = false;
  for (const fp of FALSE_POSITIVE_INDICATORS) {
    if (snippet.includes(fp)) {
      contextScore -= 0.25;
      falsePositiveSuspected = true;
      break;
    }
  }

  // Cap confidence between 0.3 and 0.98
  let adjustedConfidence = candidate.baseConfidence + contextScore;
  adjustedConfidence = Math.max(0.30, Math.min(0.98, adjustedConfidence));

  return {
    ...candidate,
    confidence: Number(adjustedConfidence.toFixed(2)),
    matchedKeywords,
    hasStrongContext: matchedKeywords.length > 0,
    falsePositiveSuspected,
    source: matchedKeywords.length > 0 ? 'pattern_and_context' : 'pattern'
  };
}

/**
 * Enhances an array of pattern candidates with context analysis
 */
export function runContextAnalysis(candidates, fullText) {
  return candidates.map(cand => analyzeContext(cand, fullText));
}
