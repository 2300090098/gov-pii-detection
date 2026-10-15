# Implementation Plan - PII-Detection System

Full-stack cybersecurity platform: **"Detection of Government-Issued PII Embedded in Documents and Data"**

## Project Structure

```
PII-Detection/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── MaskedSnippet.jsx
│   │   │   ├── Dropzone.jsx
│   │   │   ├── SyntheticTemplates.jsx
│   │   │   ├── PiiTable.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DocumentScanner.jsx
│   │   │   ├── TextScanner.jsx
│   │   │   ├── DetectionResults.jsx
│   │   │   ├── ScanHistory.jsx
│   │   │   ├── SecurityReport.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── firebase.js
│   │   │   └── reportGenerator.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── routes/
│   │   ├── scanRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── settingsRoutes.js
│   ├── controllers/
│   │   ├── scanController.js
│   │   ├── historyController.js
│   │   ├── dashboardController.js
│   │   └── settingsController.js
│   ├── services/
│   │   ├── textExtractor.js
│   │   ├── fileService.js
│   │   └── piiDetector/
│   │       ├── index.js
│   │       ├── patterns.js
│   │       ├── contextAnalyzer.js
│   │       ├── geminiAnalyzer.js
│   │       ├── masker.js
│   │       └── riskClassifier.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── database/
│   │   ├── firebase.js
│   │   └── localDb.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── implementation_plan.md
```

## Detection Pipeline

1. **Input**: PDF, DOCX, TXT file, or raw pasted text.
2. **Text Extraction**: `pdf-parse` for PDF, `mammoth` for DOCX, utf-8 buffer decoding for TXT.
3. **Pattern / Regex Detection**:
   - Aadhaar-like identifiers (12 digits, with Verhoeff checksum algorithm validation)
   - PAN-like identifiers (10 characters: 5 letters, 4 digits, 1 letter)
   - Passport-like identifiers (1 letter + 7 digits)
   - Driving Licence-like identifiers (State code + RTO + year + digits)
   - Voter ID (EPIC)-like identifiers (3 letters + 7 digits)
   - Government employee/beneficiary identifiers (UAN/EPFO 12 digits, ABHA ID 14 digits, PPO)
   - Phone numbers & Email addresses
   - Custom configurable patterns
4. **Context / NLP Analysis**:
   - Proximity analysis to key anchor terms ("UID", "Aadhaar", "Income Tax", "PAN No", "Republic of India", "Passport", "EPFO", "Beneficiary", etc.)
   - Boosts confidence for strong positive context; lowers confidence / marks false-positive indicators for code/hash/numeric serials.
5. **Gemini AI Analysis (`@google/genai`)**:
   - Model: `gemini-3.8-flash`
   - Privacy-preserving prompt: candidate excerpts are provided with targeted context to confirm semantic government PII vs. random string, without leaking unnecessary document text.
   - Graceful fallback if no API key is set.
6. **Deduplication & Confidence Normalization**:
   - Merges duplicate/overlapping spans, aggregates multi-tier confidence scores.
7. **Risk Classification**:
   - LOW / MEDIUM / HIGH based on sensitivity, count, and combinations of identifiers.
8. **Data Masking**:
   - Masked representations (`XXXX-XXXX-1234`, `ABCXXXXX5K`, `u***@example.com`).
   - Context snippets masked before reaching frontend or storage.
9. **Persistence & Security Report**:
   - Store only masked metadata, counts, categories, risk level in Firestore/localDb.
   - Instant file cleanup from `uploads/`.
