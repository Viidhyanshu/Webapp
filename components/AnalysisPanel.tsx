'use client';

import React from 'react';
import { ProjectDetails } from '../types/estimate';

interface AnalysisPanelProps {
  totals: { bsr: number; dsr: number; mr: number; grand: number };
  project: ProjectDetails;
  setProject: React.Dispatch<React.SetStateAction<ProjectDetails>>;
  formatLakhs: (num: number) => string;
}

export default function AnalysisPanel({
  totals,
  project,
  setProject,
  formatLakhs
}: AnalysisPanelProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300">
      <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estimate Analysis</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--background)] rounded-xl p-3 border border-[var(--border-color)] transition-colors duration-300">
          <p className="text-xs text-[var(--text-muted)]">Total B.S.R</p>
          <p className="text-base font-bold text-blue-600 dark:text-blue-400">
            ₹{totals.bsr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[var(--background)] rounded-xl p-3 border border-[var(--border-color)] transition-colors duration-300">
          <p className="text-xs text-[var(--text-muted)]">Total D.S.R</p>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">
            ₹{totals.dsr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[var(--background)] rounded-xl p-3 border border-[var(--border-color)] transition-colors duration-300">
          <p className="text-xs text-[var(--text-muted)]">Total M.R</p>
          <p className="text-base font-bold text-pink-600 dark:text-pink-400">
            ₹{totals.mr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[var(--background)] rounded-xl p-3 border border-[var(--border-color)] transition-colors duration-300">
          <p className="text-xs text-[var(--text-muted)]">Active Area</p>
          <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {project.floorArea} m²
          </p>
        </div>
      </div>

      {/* Grand computed cost */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-950/40 dark:to-slate-900 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Auto-Calculated Total</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">
          ₹{totals.grand.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{formatLakhs(totals.grand)} Lakh Rupees</p>
      </div>

      {/* Manual display cost */}
      <div className="bg-[var(--background)] rounded-xl p-3 border border-[var(--border-color)] transition-colors duration-300">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-[var(--text-muted)] font-medium">Header Estimated Cost (Lakhs)</label>
        </div>
        <input
          type="text"
          value={formatLakhs(totals.grand)}
          readOnly
          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm font-bold text-[var(--foreground)] opacity-70 cursor-not-allowed focus:outline-none transition-colors duration-300"
        />
      </div>

    </div>
  );
}
