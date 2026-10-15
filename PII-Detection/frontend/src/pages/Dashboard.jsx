import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileUp, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import StatsCards from '../components/StatsCards.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import { api } from '../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Risk distribution data for Pie Chart
  const riskPieData = [
    { name: 'High Risk', value: stats?.highRiskScans || 0, color: '#f43f5e' },
    { name: 'Medium Risk', value: stats?.mediumRiskScans || 0, color: '#f59e0b' },
    { name: 'Low Risk', value: stats?.lowRiskScans || 0, color: '#10b981' }
  ].filter(d => d.value > 0);

  // Category breakdown for Bar Chart
  const categoryBarData = Object.entries(stats?.categoryCounts || {})
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      category: category.replace('-like', '').replace('/Beneficiary', ''),
      count
    }));

  return (
    <div className="space-y-6">
      {/* Tactical Cyber Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-[0_10px_40px_rgba(6,182,212,0.12)]">
        {/* Holographic light elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-semibold tracking-wider uppercase shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>AI-Assisted PII Sentinel Engine</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Zero Raw PII Storage
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
              Government PII Detection &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Threat Neutralization
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Inspect incoming PDF, DOCX, and text payloads for Aadhaar, PAN, Passport, Driving Licence, and Beneficiary records. Automated masking, risk calculations, and compliance audit reports.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <Link
              to="/scanner/document"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] group cursor-pointer"
            >
              <FileUp className="w-4 h-4 stroke-[2.5]" />
              <span>Scan Documents</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/scanner/text"
              className="inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 px-5 py-3 rounded-2xl text-xs font-semibold transition-all shadow-md"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Direct Text Scanner</span>
            </Link>

            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800 rounded-2xl transition-all self-center sm:self-auto"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <StatsCards stats={stats} />

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="cyber-card rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Threat Severity Matrix</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Classified risk breakdown across all inspected files</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-md font-semibold">
              REALTIME METRICS
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            {riskPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#07090e" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0d121e', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <span>No scan data recorded yet. Upload a document to start populating risk metrics.</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-around border-t border-slate-800/80 pt-4 text-xs font-mono">
            <span className="flex items-center gap-2 text-rose-400 font-semibold bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High: {stats?.highRiskScans || 0}
            </span>
            <span className="flex items-center gap-2 text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Medium: {stats?.mediumRiskScans || 0}
            </span>
            <span className="flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Low: {stats?.lowRiskScans || 0}
            </span>
          </div>
        </div>

        {/* PII Category Breakdown */}
        <div className="cyber-card rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>PII Category Registry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Frequency distribution of detected sensitive schemas</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 rounded-md font-semibold">
              MULTI-TIER RULES
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoryBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0}
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0d121e', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <Sparkles className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <span>Zero category detections logged. Execute a scan or load a synthetic scenario.</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-400 text-center font-mono">
            Monitored: Aadhaar • PAN • Passport • Driving Licence • Voter ID • Gov Beneficiary (ABHA/UAN)
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="cyber-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Recent Security Scan Audits</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
                Telemetry Log
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Inspected document records with anonymized metadata</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold group"
          >
            <span>View Complete Registry</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Document / File Name</th>
                <th className="py-3 px-4">Audit Timestamp</th>
                <th className="py-3 px-4">Detected PII</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4">Risk Classification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats?.recentScans && stats.recentScans.length > 0 ? (
                stats.recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-850/60 transition-colors group">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {scan.fileName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {scan.detectionCount} Flagged
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(scan.categoriesDetected || []).slice(0, 3).map((cat, i) => (
                          <span key={i} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50">
                            {cat}
                          </span>
                        ))}
                        {(scan.categoriesDetected || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-mono font-bold">
                            +{(scan.categoriesDetected || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={scan.riskLevel} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/results/${scan.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <span>Audit Report</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-slate-300 font-medium">No previous scans found in registry.</p>
                    <p className="text-xs text-slate-500 mt-1">Upload a document or inspect text to generate security telemetry.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
