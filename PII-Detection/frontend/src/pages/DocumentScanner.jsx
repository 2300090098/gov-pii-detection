import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, AlertCircle, FileSearch, ArrowRight, CheckCircle2 } from 'lucide-react';
import Dropzone from '../components/Dropzone.jsx';
import { api } from '../services/api.js';

export default function DocumentScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select or drop a valid document first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress(10);

    try {
      const response = await api.scanDocument(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success && response.scan) {
        // Navigate to the detection results view with scan record state
        navigate(`/results/${response.scan.id}`, { state: { scan: response.scan } });
      } else {
        throw new Error(response.error || 'Scan processing failed.');
      }
    } catch (err) {
      setError(err.message || 'Error executing document PII scan. Ensure backend is running.');
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-100">Document PII Inspector</h2>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
            MULTI-FORMAT
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF, DOCX, or TXT documents to automatically extract text, identify potential government-issued PII (Aadhaar, PAN, Passport, DL, Voter ID, Beneficiary), mask sensitive entities, and calculate risk levels.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <Dropzone
          onFileSelected={(file) => {
            setSelectedFile(file);
            setError('');
          }}
          selectedFile={selectedFile}
          onClear={() => {
            setSelectedFile(null);
            setError('');
            setUploadProgress(0);
          }}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
        />

        {/* Scan Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Files are shredded and deleted immediately from disk after in-memory parsing.</span>
          </div>

          <button
            onClick={handleScan}
            disabled={!selectedFile || isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFile && !isLoading
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>{isLoading ? 'Scanning Document Pipeline...' : 'Initiate Deep Security Scan'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Security Best Practices Reminder */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Privacy & Security Compliance Protocols</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
          <li><strong>Zero Raw Storage:</strong> Detected sensitive numbers are masked at the service boundary before persistence.</li>
          <li><strong>Privacy-Preserving AI:</strong> Gemini API receives anonymized context windows with target tokens redacted.</li>
          <li><strong>Synthetic Data Only:</strong> Never upload real classified government documents for ad-hoc testing.</li>
        </ul>
      </div>
    </div>
  );
}
