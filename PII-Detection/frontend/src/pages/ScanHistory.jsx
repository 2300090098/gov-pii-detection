import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  RefreshCw, 
  AlertTriangle,
  History,
  FileText
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge.jsx';
import { api } from '../services/api.js';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const fetchScans = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.getScans();
      if (response.success) {
        setScans(response.scans || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve scan history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete scan record for "${fileName}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await api.deleteScan(id);
      if (res.success) {
        setScans(scans.filter(s => s.id !== id));
      }
    } catch (err) {
      alert(`Could not delete scan: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredScans = scans.filter(s => {
    const matchesSearch = 
      (s.fileName && s.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.categoriesDetected && s.categoriesDetected.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">Audit Scan History Registry</h2>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              {scans.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted metadata, risk classification scores, and category logs. In accordance with privacy safeguards, complete raw values are never stored.
          </p>
        </div>

        <button
          onClick={fetchScans}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or detected category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Risk Level:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-300 px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MEDIUM">Medium Risk Only</option>
            <option value="LOW">Low Risk Only</option>
          </select>
        </div>
      </div>

      {/* Scans List Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Document / File</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4">Findings</th>
                <th className="py-3 px-4">Categories Detected</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
                    <span>Loading scan records...</span>
                  </td>
                </tr>
              ) : filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">No scan history records found.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Submit a document or pasted text scan to create an audit record.</p>
                  </td>
                </tr>
              ) : (
                filteredScans.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{item.fileName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {item.id.substring(0, 18)}...</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 px-2 py-0.5 rounded text-[11px]">
                        {item.detectionCount} PII
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(item.categoriesDetected || []).map((cat, idx) => (
                          <span key={idx} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={item.riskLevel} score={item.riskScore} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 text-[11px] bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.fileName)}
                          disabled={deletingId === item.id}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                          title="Delete scan from registry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
