'use client';

import React, { useState, useEffect, useRef } from 'react';
import PrintableContent from '../components/PrintableContent';
import AnalysisPanel from '../components/AnalysisPanel';
import HeaderSettings from '../components/HeaderSettings';
import EstimateTable from '../components/EstimateTable';
import { 
  EstimateRow, 
  ProjectDetails, 
  DEFAULT_PROJECT_DETAILS, 
  DEFAULT_ROWS, 
  parseNum, 
  calculateRowAmount 
} from '../types/estimate';

export default function Home() {
  const [project, setProject] = useState<ProjectDetails>(DEFAULT_PROJECT_DETAILS);
  const [rows, setRows] = useState<EstimateRow[]>(DEFAULT_ROWS);
  const [activeTab, setActiveTab] = useState<'workspace' | 'preview'>('workspace');
  const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Default to light mode
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showSubtotalsInPrint, setShowSubtotalsInPrint] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedProject = localStorage.getItem('est_project_details');
    const savedRows = localStorage.getItem('est_rows');
    
    if (savedProject) setProject(JSON.parse(savedProject));
    if (savedRows) setRows(JSON.parse(savedRows));
    
    // Force light theme
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('est_project_details', JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem('est_rows', JSON.stringify(rows));
  }, [rows]);

  // Calculate sums per column
  const getTotals = () => {
    let bsrTotal = 0;
    let dsrTotal = 0;
    let mrTotal = 0;

    rows.forEach(row => {
      if (row.type === 'item' || row.type === 'sub-item') {
        const amt = calculateRowAmount(row);
        if (row.source === 'BSR') bsrTotal += amt;
        else if (row.source === 'DSR') dsrTotal += amt;
        else if (row.source === 'MR') mrTotal += amt;
      }
    });

    const grandTotal = bsrTotal + dsrTotal + mrTotal;
    return {
      bsr: bsrTotal,
      dsr: dsrTotal,
      mr: mrTotal,
      grand: grandTotal
    };
  };

  const totals = getTotals();

  // Convert number to Lakhs format (e.g. 1262430.56 -> 12.62)
  const formatLakhs = (num: number): string => {
    return (num / 100000).toFixed(2);
  };

  // Add a new row of a specific type
  const addRow = (type: 'section' | 'item' | 'sub-item' | 'filler', indexAfter?: number) => {
    const newId = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRow: EstimateRow = {
      id: newId,
      type,
      description: type === 'section' ? 'NEW SECTION/SUB-HEAD' : type === 'filler' ? '' : 'New Description',
      slNo: type === 'item' ? '' : undefined,
      sorNo: type === 'item' || type === 'sub-item' ? '' : undefined,
      unit: type === 'item' || type === 'sub-item' ? 'Cum.' : undefined,
      rate: type === 'item' || type === 'sub-item' ? '0.00' : undefined,
      quantity: type === 'item' || type === 'sub-item' ? '0.00' : undefined,
      source: type === 'item' || type === 'sub-item' ? 'BSR' : undefined,
      fillerColumn: type === 'filler' ? 'DSR' : undefined,
    };

    setRows(prevRows => {
      if (indexAfter !== undefined) {
        const copy = [...prevRows];
        copy.splice(indexAfter + 1, 0, newRow);
        return copy;
      }
      return [...prevRows, newRow];
    });
    setSelectedRowId(newId);
  };

  // Delete a row
  const deleteRow = (id: string) => {
    setRows(prevRows => prevRows.filter(row => row.id !== id));
    if (selectedRowId === id) setSelectedRowId(null);
  };

  // Move a row up or down
  const moveRow = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rows.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setRows(prevRows => {
      const copy = [...prevRows];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Reset to default template data
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the estimate to the default template? All current edits will be overwritten.')) {
      setProject(DEFAULT_PROJECT_DETAILS);
      setRows(DEFAULT_ROWS);
      setSelectedRowId(null);
    }
  };

  // Export estimate as JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ project, rows }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const sanitizedTitle = project.title.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadAnchor.setAttribute("download", `estimate_${sanitizedTitle || 'project'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import estimate from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.project && parsed.rows) {
          setProject(parsed.project);
          setRows(parsed.rows);
          setSelectedRowId(null);
          alert('Estimate imported successfully!');
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // clear input
  };

  // Trigger Print window
  const handlePrint = () => {
    window.print();
  };

  // Calculate segment totals for UI headers
  const getSubtotalsForSection = (sectionIndex: number) => {
    let bsr = 0, dsr = 0, mr = 0;
    
    // Find next section index or end
    let nextSecIndex = rows.length;
    for (let i = sectionIndex + 1; i < rows.length; i++) {
      if (rows[i].type === 'section') {
        nextSecIndex = i;
        break;
      }
    }

    for (let i = sectionIndex + 1; i < nextSecIndex; i++) {
      const row = rows[i];
      if (row.type === 'item' || row.type === 'sub-item') {
        const amt = calculateRowAmount(row);
        if (row.source === 'BSR') bsr += amt;
        else if (row.source === 'DSR') dsr += amt;
        else if (row.source === 'MR') mr += amt;
      }
    }

    return { bsr, dsr, mr, total: bsr + dsr + mr };
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportJSON} 
        accept=".json" 
        className="hidden" 
      />

      {/* Theme-Aware Workspace Header */}
      <header className="no-print bg-[var(--card-bg)] border-b border-[var(--border-color)] px-6 py-4 flex flex-wrap justify-end items-center gap-4 z-10 shadow-sm transition-colors duration-300">

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-[var(--background)] p-1.5 rounded-xl flex items-center border border-[var(--border-color)] shadow-inner transition-colors duration-300">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workspace' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Workspace Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Print Preview
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border-color)] mx-1"></div>

          {/* Action buttons */}
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 01-2.25 2.25H8.59a2.25 2.25 0 01-2.25-2.25M17.66 18l.22 1.44a2.25 2.25 0 01-2.227 2.56H8.347a2.25 2.25 0 01-2.227-2.56l.22-1.44M18 9.75v3.375c0 .621-.504 1.125-1.125 1.125H7.125A1.125 1.125 0 016 13.125V9.75M8.25 9.75V5.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V9.75m-6 0h6" />
            </svg>
            Print Estimate
          </button>


          <button
            onClick={handleReset}
            title="Reset to original screenshot state"
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset Default
          </button>

        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col xl:flex-row gap-6 p-4 md:p-6 transition-colors duration-300">
        
        {/* Workspace Mode: Display side options and editor */}
        {activeTab === 'workspace' && (
          <>
            {/* Sidebar Details and Settings Panel */}
            <section className="xl:w-80 flex flex-col gap-6 no-print">
              <AnalysisPanel 
                totals={totals}
                project={project}
                setProject={setProject}
                formatLakhs={formatLakhs}
              />
              <HeaderSettings 
                project={project}
                setProject={setProject}
              />
            </section>

            {/* Main Interactive Table Workspace */}
            <section className="flex-1 flex flex-col gap-4 min-w-0">
              <EstimateTable 
                rows={rows}
                setRows={setRows}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                showSubtotalsInPrint={showSubtotalsInPrint}
                setShowSubtotalsInPrint={setShowSubtotalsInPrint}
                addRow={addRow}
                deleteRow={deleteRow}
                moveRow={moveRow}
                getSubtotalsForSection={getSubtotalsForSection}
                totals={totals}
                formatLakhs={formatLakhs}
              />
            </section>
          </>
        )}

        {/* Print Preview Mode: Standard White A4 Sheet */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col items-center gap-6 overflow-y-auto no-print">
            

            {/* Paper Sheet Preview container */}
            <div className="w-full max-w-[800px] bg-white text-black p-10 shadow-2xl border border-gray-200 min-h-[1100px] flex flex-col font-sans relative">
              <PrintableContent 
                project={project}
                rows={rows}
                totals={totals}
                formatLakhs={formatLakhs}
                showSubtotalsInPrint={showSubtotalsInPrint}
                getSubtotalsForSection={getSubtotalsForSection}
              />
            </div>
          </div>
        )}

      </main>

      {/* Actual content loaded for physical print triggers, always rendered but hidden in DOM unless media = print */}
      <div className="print-only hidden">
        <PrintableContent 
          project={project}
          rows={rows}
          totals={totals}
          formatLakhs={formatLakhs}
          showSubtotalsInPrint={showSubtotalsInPrint}
          getSubtotalsForSection={getSubtotalsForSection}
        />
      </div>

    </div>
  );
}
