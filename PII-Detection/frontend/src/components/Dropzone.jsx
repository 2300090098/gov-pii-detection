import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Shield, FileCheck, Sparkles, Cpu, Lock } from 'lucide-react';

export default function Dropzone({ onFileSelected, selectedFile, onClear, isLoading, uploadProgress }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef(null);

  const ALLOWED_EXTS = ['.pdf', '.docx', '.txt'];
  const MAX_SIZE_MB = 15;

  const validateFile = (file) => {
    setValidationError('');
    if (!file) return false;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setValidationError(`Invalid file format "${ext}". Only PDF, DOCX, and TXT files are accepted.`);
      return false;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`File size exceeds ${MAX_SIZE_MB}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return false;
    }

    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.dataTransfer?.files?.[0] || e.target.files?.[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 border-2 border-dashed overflow-hidden ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-[1.01]'
              : 'border-slate-700/80 bg-slate-950/60 hover:border-cyan-500/60 hover:bg-slate-900/60 shadow-xl'
          }`}
        >
          {/* Subtle scanning grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base font-bold text-slate-100">
                Drag and drop confidential document here, or <span className="text-cyan-400 underline underline-offset-4 decoration-cyan-500/60 hover:text-cyan-300 font-extrabold">browse files</span>
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Automatic text parsing for <strong className="text-cyan-300">PDF, Word (DOCX)</strong>, and <strong className="text-cyan-300">TXT</strong> files up to <strong className="text-slate-200">15MB</strong>.
              </p>
            </div>

            {/* Supported Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 font-semibold shadow-inner">
                .PDF
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 font-semibold shadow-inner">
                .DOCX
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 font-semibold shadow-inner">
                .TXT
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Zero-Persistence Guarantee: Files shredded immediately after extraction</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="cyber-card rounded-3xl p-6 relative overflow-hidden border border-cyan-500/40 shadow-2xl">
          {/* Scanline overlay when loading */}
          {isLoading && <div className="scanline-overlay absolute inset-0 z-20 pointer-events-none" />}

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <FileCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>{selectedFile.name}</span>
                  <span className="text-[11px] font-mono bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </h4>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payload validated. Ready for Multi-Tier PII inspection pipeline.</span>
                </p>
              </div>
            </div>

            {!isLoading && (
              <button
                onClick={onClear}
                className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-rose-500/30"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {isLoading && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 relative z-10 space-y-2">
              <div className="flex justify-between text-xs text-slate-200">
                <span className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Deconstructing document & calculating risk matrix...</span>
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {uploadProgress > 0 ? `${uploadProgress}%` : 'Processing'}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                  style={{ width: `${uploadProgress > 0 ? uploadProgress : 70}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {validationError && (
        <div className="mt-3 flex items-center gap-2.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 px-4 py-3 rounded-2xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
