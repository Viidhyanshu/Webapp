'use client';

import React from 'react';
import { ProjectDetails } from '../types/estimate';

interface HeaderSettingsProps {
  project: ProjectDetails;
  setProject: React.Dispatch<React.SetStateAction<ProjectDetails>>;
}

export default function HeaderSettings({ project, setProject }: HeaderSettingsProps) {
  const updateField = (field: keyof ProjectDetails, val: string) => {
    setProject(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Card: Project & Header Settings */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Sheet Headers</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Company / Firm Name</label>
            <input
              type="text"
              value={project.firmName}
              onChange={(e) => updateField('firmName', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Subtitle</label>
            <input
              type="text"
              value={project.subtitle}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Approved Authority Info</label>
            <input
              type="text"
              value={project.approvedBy}
              onChange={(e) => updateField('approvedBy', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Contact Phone</label>
            <input
              type="text"
              value={project.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Contact Email</label>
            <input
              type="text"
              value={project.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Floor Designation</label>
            <input
              type="text"
              value={project.floorName}
              onChange={(e) => updateField('floorName', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Floor Area Value</label>
            <input
              type="text"
              value={project.floorArea}
              onChange={(e) => updateField('floorArea', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Height of Building</label>
            <input
              type="text"
              value={project.heightOfBuilding}
              onChange={(e) => updateField('heightOfBuilding', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* Card: Document Title */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Building Description Details</h3>
        <textarea
          value={project.title}
          rows={6}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-3 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none font-sans transition-colors duration-300"
        />
      </div>
    </div>
  );
}
