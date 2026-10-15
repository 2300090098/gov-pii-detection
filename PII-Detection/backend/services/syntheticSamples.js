/**
 * 100% Synthetic Dummy PII Samples for Cybersecurity Testing
 * Note: These values are mathematically formatted test values and do NOT represent real individuals.
 */

export const SYNTHETIC_SAMPLES = [
  {
    id: 'sample-tax-record',
    name: 'Indian Income Tax & ID Verification Form (Synthetic)',
    description: 'Contains synthetic Aadhaar, PAN, Phone, and Email in official tax assessment context.',
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
    name: 'Employee HR Onboarding & Social Security Dossier (Synthetic)',
    description: 'Contains synthetic Passport, Driving Licence, Voter ID, and EPFO/UAN number.',
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
    name: 'Ayushman Bharat Beneficiary Health Card (Synthetic)',
    description: 'Contains synthetic ABHA Health ID and Beneficiary Scheme Numbers.',
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
    description: 'Contains system architecture notes with zero personal or government identifiers.',
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
