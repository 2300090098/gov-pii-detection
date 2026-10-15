/**
 * Modular Detection Engine Coordinator
 * Pipeline:
 * Input -> Pattern Detection -> Context Analysis -> Gemini AI -> Deduplication -> Confidence -> Risk -> Masking -> Security Report
 */
import { extractPatternCandidates } from './patterns.js';
import { runContextAnalysis } from './contextAnalyzer.js';
import { runGeminiAnalysis } from './geminiAnalyzer.js';
import { maskValue, maskContextSnippet, generateRedactedDocument } from './masker.js';
import { classifyScanRisk } from './riskClassifier.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Resolves overlapping or duplicate candidate spans
 */
function deduplicateDetections(candidates) {
  // Sort by start index ascending, then length descending
  const sorted = [...candidates].sort((a, b) => {
    if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
    return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex);
  });

  const deduplicated = [];
  for (const current of sorted) {
    const isOverlapping = deduplicated.some(existing => {
      // Overlap condition
      return Math.max(existing.startIndex, current.startIndex) < Math.min(existing.endIndex, current.endIndex);
    });

    if (!isOverlapping) {
      deduplicated.push(current);
    }
  }

  return deduplicated;
}

/**
 * Master scan execution function
 */
export async function executeDetectionPipeline(text, options = {}) {
  const {
    fileName = 'Pasted Text',
    userId = 'anonymous',
    enabledCategories = null,
    confidenceThreshold = 0.50,
    enableGemini = true
  } = options;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      id: uuidv4(),
      fileName,
      userId,
      timestamp: new Date().toISOString(),
      detectionCount: 0,
      riskLevel: 'LOW',
      riskScore: 0,
      categoriesDetected: [],
      detections: [],
      summary: 'Empty or blank input text provided.',
      remediationAdvice: ['Upload or input a valid document.'],
      redactedTextPreview: ''
    };
  }

  // 1. Tier 1: Pattern / Regex Extraction
  const rawCandidates = extractPatternCandidates(text, enabledCategories);

  // 2. Tier 2: Context / NLP Heuristic Analysis
  const contextCandidates = runContextAnalysis(rawCandidates, text);

  // 3. Tier 3: Gemini AI Semantic Verification (if enabled)
  let verifiedCandidates = contextCandidates;
  if (enableGemini) {
    verifiedCandidates = await runGeminiAnalysis(contextCandidates, text.substring(0, 1000));
  }

  // 4. Deduplicate overlapping character spans
  const deduplicated = deduplicateDetections(verifiedCandidates);

  // 5. Filter by confidence threshold
  const thresholdFiltered = deduplicated.filter(cand => cand.confidence >= confidenceThreshold);

  // 6. Tier 4 & 5: Masking & Safe Snippets Generation
  // Note: rawValue is purposefully omitted from the final response object to satisfy zero-leakage requirements!
  const safeDetections = thresholdFiltered.map((item, idx) => {
    const masked = maskValue(item.category, item.rawValue);
    const safeSnippet = maskContextSnippet(item.surroundingSnippet, item.rawValue, masked);

    return {
      id: `det-${idx + 1}`,
      category: item.category,
      label: item.label,
      maskedValue: masked,
      confidence: item.confidence,
      source: item.source,
      riskLevel: item.riskWeight,
      location: {
        startIndex: item.startIndex,
        endIndex: item.endIndex,
        approximateLine: (text.substring(0, item.startIndex).match(/\n/g) || []).length + 1
      },
      contextSnippet: safeSnippet,
      aiReasoning: item.aiReasoning || null
    };
  });

  // 7. Risk Classification & Remediation Guidance
  const riskAnalysis = classifyScanRisk(safeDetections);

  // 8. Categories summary
  const categoriesDetected = [...new Set(safeDetections.map(d => d.category))];

  // 9. Redacted document preview for UI
  const redactedTextPreview = generateRedactedDocument(text, safeDetections);

  const scanId = uuidv4();
  const timestamp = new Date().toISOString();

  const scanResult = {
    id: scanId,
    userId,
    fileName,
    timestamp,
    detectionCount: safeDetections.length,
    riskLevel: riskAnalysis.riskLevel,
    riskScore: riskAnalysis.riskScore,
    summary: riskAnalysis.summary,
    remediationAdvice: riskAnalysis.remediationAdvice,
    categoriesDetected,
    detections: safeDetections,
    redactedTextPreview: redactedTextPreview.substring(0, 5000), // bounded preview length
    meta: {
      inputLength: text.length,
      engineVersion: '2.1.0-gemini3.8',
      aiAssisted: enableGemini && Boolean(process.env.GEMINI_API_KEY)
    }
  };

  return scanResult;
}
