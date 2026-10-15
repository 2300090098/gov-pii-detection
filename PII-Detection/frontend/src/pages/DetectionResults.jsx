import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileDown, 
  Printer, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  Bot,
  FileText,
  Lock,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge.jsx';
import PiiTable from '../components/PiiTable.jsx';
import { api } from '../services/api.js';
import { exportScanPdfReport } from '../services/reportGenerator.js';

export default function DetectionResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [scan, setScan] = useState(location.state?.scan || null);
  const [isLoading, setIsLoading] = useState(!scan && Boolean(id));
  const [error, setError] = useState('');
  const [showRedactedPreview, setShowRedactedPreview] = useState(false);

  useEffect(() => {
    if (!scan && id) {
      setIsLoading(true);
      api.getScanById(id)
        .then((res) => {
          if (res.success && res.scan) {
            setScan(res.scan);
          } else {
            setError('Scan record not found in audit registry.');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to retrieve scan record');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, scan]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
        <p className="text-xs font-mono text-cyan-300 font-semibold tracking-wider uppercase">
          Compiling Security Audit Telemetry...
        </p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-100">Unable to Load Scan Results</h3>
        <p className="text-xs text-slate-400">{error || 'No scan record specified.'}</p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-850 rounded-xl transition-all border border-slate-800"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
              <span>Security Scan Audit Record</span>
              <RiskBadge level={scan.riskLevel} score={scan.riskScore} size="sm" />
            </h2>
            <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-400 mt-1">
              <span>Target: <strong className="text-slate-200">{scan.fileName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {new Date(scan.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportScanPdfReport(scan)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 stroke-[2.5]" />
            <span>Download Audit PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
          <Link
            to={`/reports/${scan.id}`}
            state={{ scan }}
            className="inline-flex items-center gap-2 bg-slate-900 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/60 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Formal Report</span>
          </Link>
        </div>
      </div>

      {/* High-Impact Executive Risk Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
        scan.riskLevel === 'HIGH'
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.18)]'
          : scan.riskLevel === 'MEDIUM'
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.18)]'
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.18)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <RiskBadge level={scan.riskLevel} score={scan.riskScore} size="lg" />
              <span className="text-xs font-mono text-slate-400">
                Exposure Metric: <strong className="text-slate-100 font-bold">{scan.riskScore}/100</strong>
              </span>
            </div>

            <p className="text-base font-semibold text-slate-100 leading-relaxed mt-2">
              {scan.summary}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              Compliance Mandate: In accordance with Privacy by Design standards, all detected entities are flagged as Potential PII and subjected to mandatory masking before long-term indexing.
            </p>
          </div>

          {/* Stats Box */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex-shrink-0 self-start md:self-auto shadow-inner">
            <div className="text-center px-4 border-r border-slate-800">
              <div className="text-2xl font-extrabold font-mono text-cyan-400">{scan.detectionCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Detections</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-extrabold font-mono text-slate-100">
                {(scan.categoriesDetected || []).length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Badges */}
      <div className="cyber-card rounded-2xl p-4 flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Flagged Schemas:</span>
        </span>
        {scan.categoriesDetected && scan.categoriesDetected.length > 0 ? (
          scan.categoriesDetected.map((cat, idx) => (
            <span
              key={idx}
              className="text-xs font-mono font-semibold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-xl shadow-sm"
            >
              {cat}
            </span>
          ))
        ) : (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payload Clean (No PII Identified)</span>
          </span>
        )}
      </div>

      {/* Main Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Redacted Entities Register</span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              {scan.detections?.length || 0} findings
            </span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Complete raw values masked</span>
          </span>
        </div>

        <PiiTable detections={scan.detections || []} />
      </div>

      {/* Redacted Document Preview Toggle */}
      {scan.redactedTextPreview && (
        <div className="cyber-card rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-100">
                Redacted Workload Preview (Full Text with In-Place Masking)
              </h4>
            </div>
            <button
              onClick={() => setShowRedactedPreview(!showRedactedPreview)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold bg-cyan-950/50 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition-all"
            >
              {showRedactedPreview ? 'Collapse View' : 'Expand Full Redacted Preview'}
            </button>
          </div>

          {showRedactedPreview && (
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap shadow-inner border-l-4 border-l-cyan-400">
              {scan.redactedTextPreview}
            </div>
          )}
        </div>
      )}

      {/* Remediation Recommendations */}
      <div className="cyber-card rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Recommended Security Remediation & Handling Procedures
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(scan.remediationAdvice || []).map((advice, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-sm">
              <span className="w-6 h-6 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
                {i + 1}
              </span>
              <span>{advice}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
