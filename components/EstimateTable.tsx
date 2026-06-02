'use client';

import React from 'react';
import { EstimateRow, calculateRowAmount } from '../types/estimate';

interface EstimateTableProps {
  rows: EstimateRow[];
  setRows: React.Dispatch<React.SetStateAction<EstimateRow[]>>;
  selectedRowId: string | null;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string | null>>;
  showSubtotalsInPrint: boolean;
  setShowSubtotalsInPrint: React.Dispatch<React.SetStateAction<boolean>>;
  addRow: (type: 'section' | 'item' | 'sub-item' | 'filler', indexAfter?: number) => void;
  deleteRow: (id: string) => void;
  moveRow: (index: number, direction: 'up' | 'down') => void;
  getSubtotalsForSection: (index: number) => { bsr: number; dsr: number; mr: number; total: number };
  totals: { bsr: number; dsr: number; mr: number; grand: number };
  formatLakhs: (num: number) => string;
}

export default function EstimateTable({
  rows,
  setRows,
  selectedRowId,
  setSelectedRowId,
  showSubtotalsInPrint,
  setShowSubtotalsInPrint,
  addRow,
  deleteRow,
  moveRow,
  getSubtotalsForSection,
  totals,
  formatLakhs
}: EstimateTableProps) {
  
  // Helper to update a field on a specific row
  const updateRowField = (id: string, field: keyof EstimateRow, value: any) => {
    setRows(prevRows =>
      prevRows.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      
      {/* Quick Row Actions Toolbar */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-3 rounded-2xl flex flex-wrap gap-2 items-center text-[var(--foreground)] shadow-sm transition-colors duration-300">
        <span className="text-xs font-semibold text-[var(--text-muted)] mr-2 uppercase tracking-wide">Insert Row:</span>
        
        <button
          onClick={() => addRow('item')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Standard Item
        </button>

        <button
          onClick={() => addRow('sub-item')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Sub-Item (Child)
        </button>

        <button
          onClick={() => addRow('section')}
          className="bg-slate-600 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Sub-Heading
        </button>

        <button
          onClick={() => addRow('filler')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-amber-700"
          title="Adds an empty spreadsheet line containing 0.00 in a chosen column, matching the screenshot layout style"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Filler row (0.00)
        </button>

        <div className="h-5 w-px bg-[var(--border-color)] mx-2"></div>

        {/* Print view options */}
        <div className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            id="showSubtotalsCheck"
            checked={showSubtotalsInPrint}
            onChange={(e) => setShowSubtotalsInPrint(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 bg-[var(--input-bg)] border-[var(--border-color)] cursor-pointer"
          />
          <label htmlFor="showSubtotalsCheck" className="text-[var(--text-muted)] font-medium cursor-pointer">Show subtotals in print</label>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col min-h-[500px] transition-colors duration-300">
        
        {/* Scrollable table grid */}
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full border-collapse text-xs select-none">
            
            {/* Header Columns */}
            <thead className="bg-[var(--table-hdr-bg)] text-[var(--foreground)] border-b border-[var(--border-color)] sticky top-0 z-10 transition-colors duration-300">
              <tr>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-center font-bold w-12">Actions</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-center font-bold w-12">Sl No</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-center font-bold w-20">SOR No.</th>
                <th className="px-4 py-3 border-r border-[var(--border-color)] text-left font-bold min-w-[280px]">Description of Work</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-center font-bold w-16">Unit</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-right font-bold w-24">Rate (Rs.)</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-right font-bold w-20">Quantity</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-right font-bold w-28 bg-blue-500/5">B.S.R (Rs.)</th>
                <th className="px-3 py-3 border-r border-[var(--border-color)] text-right font-bold w-28 bg-amber-500/5">D.S.R (Rs.)</th>
                <th className="px-3 py-3 text-right font-bold w-28 bg-pink-500/5">M.R (Rs.)</th>
              </tr>
            </thead>

            {/* Table Rows Body */}
            <tbody className="divide-y divide-[var(--border-color)] transition-colors duration-300">
              {rows.map((row, idx) => {
                const isSelected = selectedRowId === row.id;
                const rowAmount = calculateRowAmount(row);

                {/* RENDER TYPE: SECTION (Sub-heading) */}
                if (row.type === 'section') {
                  const subTotals = getSubtotalsForSection(idx);
                  return (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedRowId(row.id)}
                      className={`group transition ${isSelected ? 'bg-blue-500/10' : 'bg-[var(--table-hdr-bg)]/30 hover:bg-[var(--table-hdr-bg)]/50'}`}
                    >
                      {/* Action Cells */}
                      <td className="p-2 border-r border-[var(--border-color)] text-center flex items-center justify-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteRow(row.id); }}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                          title="Delete sub-heading"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                        <div className="flex flex-col">
                          <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'up'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▲</button>
                          <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'down'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▼</button>
                        </div>
                      </td>

                      {/* Merged Section Title input */}
                      <td colSpan={6} className="px-4 py-2.5 border-r border-[var(--border-color)] text-left font-bold">
                        <input
                          type="text"
                          value={row.description}
                          onChange={(e) => updateRowField(row.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-[var(--accent)] font-bold focus:outline-none tracking-wide text-blue-600 dark:text-blue-400 py-0.5"
                          placeholder="Enter Sub-heading label"
                        />
                      </td>
                      
                      {/* Subtotals display inside workspace for ease of access */}
                      <td className="px-3 py-2.5 border-r border-[var(--border-color)] text-right bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold">
                        ₹{subTotals.bsr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 border-r border-[var(--border-color)] text-right bg-amber-500/5 text-amber-600 dark:text-amber-400 font-bold">
                        ₹{subTotals.dsr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right bg-pink-500/5 text-pink-600 dark:text-pink-400 font-bold">
                        ₹{subTotals.mr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                }

                {/* RENDER TYPE: FILLER ROW (just has 0.00 in one column) */}
                if (row.type === 'filler') {
                  return (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedRowId(row.id)}
                      className={`group transition ${isSelected ? 'bg-blue-500/10' : 'bg-transparent hover:bg-[var(--table-row-hover)]'}`}
                    >
                      {/* Action Cells */}
                      <td className="p-2 border-r border-[var(--border-color)] text-center flex items-center justify-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteRow(row.id); }}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                        <div className="flex flex-col">
                          <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'up'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▲</button>
                          <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'down'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▼</button>
                        </div>
                      </td>

                      <td className="px-2 py-1 border-r border-[var(--border-color)]"></td>
                      <td className="px-2 py-1 border-r border-[var(--border-color)]"></td>
                      <td className="px-3 py-1 border-r border-[var(--border-color)] italic text-[var(--text-muted)]">
                        <span>(Filler Calculation Row) - Routing 0.00 to </span>
                        <select 
                          value={row.fillerColumn}
                          onChange={(e) => updateRowField(row.id, 'fillerColumn', e.target.value)}
                          className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] text-[var(--foreground)] rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="BSR">B.S.R</option>
                          <option value="DSR">D.S.R</option>
                          <option value="MR">M.R</option>
                        </select>
                      </td>
                      <td className="px-2 py-1 border-r border-[var(--border-color)]"></td>
                      <td className="px-2 py-1 border-r border-[var(--border-color)]"></td>
                      <td className="px-2 py-1 border-r border-[var(--border-color)]"></td>
                      
                      <td className="px-3 py-1 border-r border-[var(--border-color)] text-right text-[var(--text-muted)] font-bold bg-blue-500/5">
                        {row.fillerColumn === 'BSR' ? '0.00' : ''}
                      </td>
                      <td className="px-3 py-1 border-r border-[var(--border-color)] text-right text-[var(--text-muted)] font-bold bg-amber-500/5">
                        {row.fillerColumn === 'DSR' ? '0.00' : ''}
                      </td>
                      <td className="px-3 py-1 text-right text-[var(--text-muted)] font-bold bg-pink-500/5">
                        {row.fillerColumn === 'MR' ? '0.00' : ''}
                      </td>
                    </tr>
                  );
                }

                {/* RENDER TYPE: STANDARD ITEM OR SUB-ITEM */}
                const isSubItem = row.type === 'sub-item';

                return (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedRowId(row.id)}
                    className={`group transition ${
                      isSelected 
                        ? 'bg-blue-500/10' 
                        : 'bg-transparent hover:bg-[var(--table-row-hover)]'
                    }`}
                  >
                    {/* Action Buttons */}
                    <td className="p-2 border-r border-[var(--border-color)] text-center flex items-center justify-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteRow(row.id); }}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                        title="Delete row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                      <div className="flex flex-col">
                        <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'up'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▲</button>
                        <button onClick={(e) => { e.stopPropagation(); moveRow(idx, 'down'); }} className="text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer">▼</button>
                      </div>
                    </td>

                    {/* Sl No */}
                    <td className="px-2 py-1.5 border-r border-[var(--border-color)] text-center font-medium">
                      <input
                        type="text"
                        value={row.slNo || ''}
                        onChange={(e) => updateRowField(row.id, 'slNo', e.target.value)}
                        className={`w-full text-center bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5 ${
                          isSubItem ? 'text-[var(--text-muted)] font-normal' : 'font-bold text-[var(--foreground)]'
                        }`}
                        placeholder="—"
                      />
                    </td>

                    {/* SOR No. */}
                    <td className="px-2 py-1.5 border-r border-[var(--border-color)] text-center">
                      <input
                        type="text"
                        value={row.sorNo || ''}
                        onChange={(e) => updateRowField(row.id, 'sorNo', e.target.value)}
                        className="w-full text-center bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5 font-mono text-[var(--foreground)]"
                        placeholder="No."
                      />
                    </td>

                    {/* Description of work */}
                    <td className="px-3 py-1.5 border-r border-[var(--border-color)] text-left font-sans">
                      <div className="flex gap-2 items-start">
                        {isSubItem && <span className="text-[var(--text-muted)] select-none pl-2">↳</span>}
                        <textarea
                          value={row.description}
                          rows={row.description && row.description.length > 80 ? 3 : 1}
                          onChange={(e) => updateRowField(row.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5 font-sans text-[var(--foreground)] resize-y"
                          placeholder="Description of the work item..."
                        />
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-2 py-1.5 border-r border-[var(--border-color)] text-center text-[var(--foreground)]">
                      <input
                        type="text"
                        value={row.unit || ''}
                        onChange={(e) => updateRowField(row.id, 'unit', e.target.value)}
                        className="w-full text-center bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5"
                        placeholder="Unit"
                      />
                    </td>

                    {/* Rate (Rs.) */}
                    <td className="px-2 py-1.5 border-r border-[var(--border-color)] text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="text"
                          value={row.rate || ''}
                          onChange={(e) => updateRowField(row.id, 'rate', e.target.value)}
                          className="w-full text-right bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5 font-bold text-red-605 dark:text-red-400 text-red-600"
                          placeholder="0.00"
                        />
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-2 py-1.5 border-r border-[var(--border-color)] text-right">
                      <input
                        type="text"
                        value={row.quantity || ''}
                        onChange={(e) => updateRowField(row.id, 'quantity', e.target.value)}
                        className="w-full text-right bg-transparent border-b border-transparent focus:border-[var(--accent)] focus:outline-none py-0.5 text-[var(--foreground)]"
                        placeholder="0.00"
                      />
                    </td>

                    {/* Amount BSR Column */}
                    <td className="px-3 py-1.5 border-r border-[var(--border-color)] text-right font-bold bg-blue-500/5">
                      {row.source === 'BSR' ? (
                        <span className="text-blue-600 dark:text-blue-300">{rowAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400/50 dark:text-slate-600/50">0.00</span>
                      )}
                      <select 
                        value={row.source}
                        onChange={(e) => updateRowField(row.id, 'source', e.target.value)}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 ml-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] text-[var(--foreground)] rounded px-1 focus:outline-none cursor-pointer"
                      >
                        <option value="BSR">BSR</option>
                        <option value="DSR">DSR</option>
                        <option value="MR">MR</option>
                      </select>
                    </td>

                    {/* Amount DSR Column */}
                    <td className="px-3 py-1.5 border-r border-[var(--border-color)] text-right font-bold bg-amber-500/5">
                      {row.source === 'DSR' ? (
                        <span className="text-amber-600 dark:text-amber-300">{rowAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400/50 dark:text-slate-600/50">0.00</span>
                      )}
                      <select 
                        value={row.source}
                        onChange={(e) => updateRowField(row.id, 'source', e.target.value)}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 ml-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] text-[var(--foreground)] rounded px-1 focus:outline-none cursor-pointer"
                      >
                        <option value="BSR">BSR</option>
                        <option value="DSR">DSR</option>
                        <option value="MR">MR</option>
                      </select>
                    </td>

                    {/* Amount MR Column */}
                    <td className="px-3 py-1.5 text-right font-bold bg-pink-500/5">
                      {row.source === 'MR' ? (
                        <span className="text-pink-600 dark:text-pink-300">{rowAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400/50 dark:text-slate-600/50">0.00</span>
                      )}
                      <select 
                        value={row.source}
                        onChange={(e) => updateRowField(row.id, 'source', e.target.value)}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 ml-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] text-[var(--foreground)] rounded px-1 focus:outline-none cursor-pointer"
                      >
                        <option value="BSR">BSR</option>
                        <option value="DSR">DSR</option>
                        <option value="MR">MR</option>
                      </select>
                    </td>

                  </tr>
                );
              })}
            </tbody>

            {/* Table Grand Totals Footer */}
            <tfoot className="bg-[var(--card-bg)] text-[var(--foreground)] font-black border-t-2 border-[var(--border-color)] transition-colors duration-300">
              <tr>
                <td colSpan={7} className="px-4 py-3 text-right text-[var(--foreground)] font-bold">GRAND TOTALS:</td>
                <td className="px-3 py-3 border-r border-[var(--border-color)] text-right text-blue-600 dark:text-blue-400 bg-blue-500/10">
                  ₹{totals.bsr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-3 border-r border-[var(--border-color)] text-right text-amber-600 dark:text-amber-400 bg-amber-500/10">
                  ₹{totals.dsr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-3 text-right text-pink-600 dark:text-pink-400 bg-pink-500/10">
                  ₹{totals.mr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-[var(--background)]">
                <td colSpan={7} className="px-4 py-2.5 text-right text-[var(--text-muted)] font-medium">COMBINED ESTIMATED VALUE:</td>
                <td colSpan={3} className="px-4 py-2.5 text-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  ₹{totals.grand.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({formatLakhs(totals.grand)} Lakh)
                </td>
              </tr>
            </tfoot>

          </table>
        </div>

        {/* Footer status text */}
        <div className="bg-[var(--background)] border-t border-[var(--border-color)] p-3 text-[var(--text-muted)] text-xs flex justify-between">
          <span>Row Count: {rows.length} rows</span>
          <span>Click any text/cell to edit values instantly. Changes auto-save locally.</span>
        </div>

      </div>

    </div>
  );
}
