import React from 'react';
import { Sparkles, FileText, CheckCircle2, ShieldAlert, ArrowUpRight } from 'lucide-react';

const SYNTHETIC_PRESETS = [
  {
    id: 'sample-tax-record',
    name: 'Indian Income Tax & ID Verification Form',
    tags: ['Aadhaar', 'PAN', 'Phone', 'Email'],
    riskExpected: 'HIGH',
    description: 'Simulates a formal IT Department tax return containing synthetic Aadhaar UID and PAN number.',
    text: `CONFIDENTIAL - TAX ASSESSMENT SUMMARY RECORD
Government of India - Income Tax Department
Assessment Year: 2025-2026

Assessee Name: Rajesh Kumar Sharma (Synthetic Test Profile)
Date of Birth: 14/08/1986
Father's Name: Mohan Lal Sharma

PERMANENT ACCOUNT NUMBER (PAN):
PAN No: ABCPS1234F
Status: Individual Taxpayer | Jurisdiction: Ward 12(3), New Delhi

UNIQUE IDENTIFICATION (AADHAAR) PROOF:
Aadhaar UID: 3675 9834 6012
UIDAI Enrollment Reference: 2049/71029/03841
Verification Status: e-KYC Verified by Resident Portal

PRIMARY CONTACT INFORMATION:
Mobile Phone: +91 98765 43210
Primary Email: rajesh.k.sharma.test@cyber-gov-shield.org
Alternate Contact: +91 87654 32109

BANK ACCOUNT DETAILS FOR REFUND:
Bank: State Bank of India
Account Number: 30948291039
IFSC Code: SBIN0001234
Refund Amount: Rs. 14,850/-

Audit Flag: Internal security audit review pending.`
  },
  {
    id: 'sample-hr-onboarding',
    name: 'Employee HR Onboarding & Social Security Dossier',
    tags: ['Passport', 'DL', 'Voter ID', 'EPFO/UAN'],
    riskExpected: 'HIGH',
    description: 'New employee background verification with synthetic Passport, DL, Voter ID, and EPFO/UAN.',
    text: `INTERNAL HR COMPLIANCE DOSSIER - NEW JOINER VERIFICATION
Organization: CyberSafe Technologies Private Limited
Employee ID: CST-2026-8942
Candidate Name: Priya Venkatesh Iyer (Synthetic Test Subject)

GOVERNMENT IDENTITY CREDENTIALS SUBMITTED:

1. Republic of India Passport:
   Passport No: K8392014
   Nationality: Indian
   Place of Issue: Chennai Regional Passport Office
   Date of Issue: 12/03/2021 | Valid Until: 11/03/2031

2. State Transport Department Driving Licence:
   DL No: TN02-2019-0048192
   Issuing RTO: Anna Nagar, Chennai
   Licence to Drive: LMV, MCWG

3. Election Commission of India Voter ID (EPIC):
   EPIC Card No: TNV3849102
   Constituency: Chennai South

4. Ministry of Labour & Employment Social Security:
   EPFO Universal Account Number (UAN): 101294857291
   Pension Payment Scheme (EPS) Member ID: TBCHE0019283000

CONTACT DIRECTORY:
Work Email: priya.iyer@cybersafe-example.in
Personal Tel: +91 94441 23456

Declaration: All submitted verification proofs are retained under company data protection guidelines.`
  },
  {
    id: 'sample-health-scheme',
    name: 'Ayushman Bharat Beneficiary Health Record',
    tags: ['ABHA ID', 'CGHS', 'Beneficiary'],
    riskExpected: 'HIGH',
    description: 'National Health Authority scheme record with synthetic 14-digit ABHA ID and CGHS code.',
    text: `NATIONAL HEALTH AUTHORITY - GOVERNMENT OF INDIA
Ayushman Bharat Digital Mission (ABDM)
Beneficiary Health Card Record (Synthetic Test Data)

Beneficiary Name: Sunita Devi Patel
Gender: Female | Age: 42
Family ID: 8941029481

AYUSHMAN BHARAT HEALTH ACCOUNT (ABHA):
ABHA ID: 91-8492-1049-5820
ABHA Address: sunita.patel@abdm

PENSION & WELFARE IDENTIFIERS:
Central Government Health Scheme (CGHS) Beneficiary ID: CGHS-4910294
Pension Payment Order (PPO) Number: 491029481029

REGISTERED HEALTHCARE FACILITY:
Primary Health Centre: Sector 4 District Hospital, Ahmedabad
Emergency Contact Number: +91 98250 12345
Registered Notification Email: sunita.patel.health@internal-test.org

Note: This electronic record is generated for authorized hospital administration only.`
  },
  {
    id: 'sample-clean-document',
    name: 'Clean Technical Policy Document (Zero PII)',
    tags: ['Clean', 'No PII', 'Zero Exposure'],
    riskExpected: 'LOW',
    description: 'Technical document with system specifications and zero sensitive personal data.',
    text: `CYBERSECURITY ARCHITECTURE & SYSTEM OVERVIEW
Platform: SentinelGov PII Detection Service
Version: 2.1.0

System Architecture Principles:
1. Multi-tier Detection: Combines deterministic pattern engines, local context heuristics, and deep language models.
2. Zero-Storage Policy: Complete raw PII values are discarded immediately after in-memory classification.
3. Strict Ephemeral File Processing: Uploaded files are streamed through memory or purged from disk immediately.
4. Defense in Depth: Role-based access control, cryptographic field masking, and comprehensive audit trail generation.

Performance Metrics:
- Text scan latency: < 80ms
- Multi-page document extraction: < 1.2s
- Concurrency limit: 100 requests per minute per IP

All telemetry data collected is anonymized in accordance with international privacy guidelines.`
  }
];

export default function SyntheticTemplates({ onSelectTemplate }) {
  return (
    <div className="cyber-card rounded-3xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Synthetic Dummy Test Scenarios (100% Synthetic - No Real PII)</span>
        </h3>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
          Click to Auto-Fill
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SYNTHETIC_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectTemplate(preset)}
            className="flex flex-col text-left p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-200 group relative overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{preset.name}</span>
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    preset.riskExpected === 'HIGH'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {preset.riskExpected} RISK
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-relaxed">
              {preset.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {preset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono bg-slate-900 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export { SYNTHETIC_PRESETS };
