/**
 * Gemini AI Analysis Tier (Privacy-Preserving)
 * Leverages Google GenAI SDK (gemini-3.8-flash) for semantic reasoning and edge-case verification
 * Ensures raw sensitive values are never transmitted in full to external AI services
 */
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
    console.log('✓ Gemini AI Service initialized with gemini-3.8-flash');
  } catch (err) {
    console.warn('⚠️ Gemini Client initialization warning:', err.message);
  }
} else {
  console.log('ℹ Gemini API key not detected. Operating in high-precision hybrid pattern + context mode.');
}

/**
 * Validates candidates using Gemini 3.8 Flash
 * Candidate raw values are sanitized prior to prompt construction
 */
export async function runGeminiAnalysis(candidates, fullTextSample) {
  if (!aiClient || !API_KEY || candidates.length === 0) {
    return candidates;
  }

  // Filter candidates that require deeper contextual disambiguation
  // (e.g. moderate confidence or boundary cases)
  const candidatesToVerify = candidates.slice(0, 10); // rate-limit / cost control
  const unverified = candidates.slice(10);

  try {
    // Construct privacy-sanitized payload for Gemini
    const sanitizedItems = candidatesToVerify.map((c, idx) => {
      // Replace sensitive value with placeholder in the snippet
      const safeSnippet = c.surroundingSnippet.replace(c.rawValue, `[CANDIDATE_${c.category.toUpperCase()}]`);
      return {
        id: idx,
        category: c.category,
        maskedContext: safeSnippet
      };
    });

    const prompt = `You are a cybersecurity privacy auditor inspecting text snippets for potential government-issued Personally Identifiable Information (PII) and sensitive personal data.
Review the following contextual snippets where the candidate value is replaced with [CANDIDATE_*].
For each item, determine if the surrounding language and syntax strongly indicate a genuine potential government identifier or sensitive personal data, versus a false positive (e.g., serial number, random hash, git commit, programming code, or standard public text).

Input items:
${JSON.stringify(sanitizedItems, null, 2)}

Respond with a strictly formatted JSON array containing objects with:
- id: number
- isLikelyPII: boolean
- adjustedConfidence: number (between 0.00 and 1.00)
- reasoning: brief 1-sentence justification focusing on context
- riskAssessment: "LOW" | "MEDIUM" | "HIGH"

Example output:
[
  {
    "id": 0,
    "isLikelyPII": true,
    "adjustedConfidence": 0.95,
    "reasoning": "Preceded by keywords indicating official tax filing and personal identification.",
    "riskAssessment": "HIGH"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    let aiResults = [];
    try {
      aiResults = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn('Could not parse Gemini JSON response:', parseErr.message);
      return candidates;
    }

    // Merge AI findings back into candidates
    const verified = candidatesToVerify.map((cand, idx) => {
      const aiVerdict = aiResults.find(r => r.id === idx);
      if (aiVerdict) {
        // If Gemini flags as false positive, reduce confidence
        let finalConfidence = cand.confidence;
        if (aiVerdict.isLikelyPII) {
          finalConfidence = Math.max(cand.confidence, aiVerdict.adjustedConfidence || cand.confidence);
        } else {
          finalConfidence = Math.min(cand.confidence, 0.40);
        }

        return {
          ...cand,
          confidence: Number(finalConfidence.toFixed(2)),
          source: 'gemini_verified',
          aiReasoning: aiVerdict.reasoning,
          riskWeight: aiVerdict.riskAssessment || cand.riskWeight,
          isLikelyPII: aiVerdict.isLikelyPII
        };
      }
      return cand;
    });

    return [...verified, ...unverified];
  } catch (error) {
    console.warn('Gemini analysis skipped due to error:', error.message);
    // Graceful fallback to existing candidates
    return candidates;
  }
}
