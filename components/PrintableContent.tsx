'use client';

import React from 'react';
import { EstimateRow, ProjectDetails, calculateRowAmount, numberToWordsInIndianStyle } from '../types/estimate';

interface PrintableContentProps {
  project: ProjectDetails;
  rows: EstimateRow[];
  totals: { 
    bsr: number; 
    dsr: number; 
    mr: number; 
    combinedRow: number; 
    electrification: number; 
    grand: number; 
  };
  formatLakhs: (num: number) => string;
  showSubtotalsInPrint: boolean;
  getSubtotalsForSection: (index: number) => { bsr: number; dsr: number; mr: number; total: number };
}

export default function PrintableContent({
  project,
  rows,
  totals,
  formatLakhs,
  showSubtotalsInPrint,
  getSubtotalsForSection,
}: PrintableContentProps) {
  return (
    <div className="w-full bg-white text-black font-sans text-[11px] leading-snug">
      
      {/* Right Aligned Header Group */}
      <div className="flex flex-col items-end mb-6 space-y-0.5 text-right">
        <h2 className="text-[13px] font-black tracking-wide uppercase text-black font-sans">{project.firmName}</h2>
        <h3 className="text-[10px] font-bold text-black font-sans">{project.subtitle}</h3>
        <p className="text-[10px] font-black text-black font-sans">{project.approvedBy}</p>
        <p className="text-[10px] font-black text-black font-sans">Ph-{project.phone}</p>
        <a 
          href={`mailto:${project.email}`} 
          className="text-[10px] font-black text-blue-800 underline font-sans hover:text-blue-900"
        >
          {project.email}
        </a>
      </div>

      {/* Main Title Banner with border tops and bottoms */}
      <div className="border-t-[1.5px] border-b-[1.5px] border-black py-2.5 px-1.5 text-center font-bold uppercase tracking-normal mb-5 leading-normal">
        PROPOSED RESIDENTIAL BUILDING FOR:- {project.title}
      </div>

      {/* Estimated info row block */}
      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          {/* Header Row labels */}
          <tr className="border-b border-black text-center font-bold">
            <td className="w-12 py-1 px-1 border-r border-black font-bold">sl No.</td>
            <td className="py-1 px-2 border-r border-black font-bold uppercase">{project.floorName}</td>
            <td className="w-64 py-1 px-2 font-bold">ESTIMATED COST</td>
          </tr>
          {/* Values Row */}
          <tr className="border-b border-black text-center font-bold">
            <td className="py-1 px-1 border-r border-black"></td>
            <td className="py-1 px-2 border-r border-black">{project.floorArea}</td>
            <td className="py-1 px-2 font-bold">{formatLakhs(totals.grand)} RUPEES IN LAKH</td>
          </tr>
          {/* HT Row */}
          <tr className="text-right">
            <td className="py-1 border-r border-black"></td>
            <td className="py-1 border-r border-black"></td>
            <td className="py-1 px-3 font-bold text-[10px]">H.T OF BUILDING={project.heightOfBuilding}</td>
          </tr>
        </tbody>
      </table>

      {/* Grid Table of quantities */}
      <table className="w-full border-collapse border border-black text-[10.5px]">
        <thead>
          {/* Column Group header labels */}
          <tr className="border-b border-black font-bold text-center">
            <th className="py-1 px-1 border-r border-black w-8 font-bold align-middle" rowSpan={2}>Sl No.</th>
            <th className="py-1 px-1 border-r border-black w-14 font-bold align-middle" rowSpan={2}>SOR No.</th>
            <th className="py-1 px-2 border-r border-black font-bold align-middle" rowSpan={2}>Description of work</th>
            <th className="py-1 px-1 border-r border-black w-10 font-bold align-middle" rowSpan={2}>Unit</th>
            <th className="py-1 px-1 border-r border-black w-16 font-bold align-middle" rowSpan={2}>Rate (Rs.)</th>
            <th className="py-1 px-1 border-r border-black w-16 font-bold align-middle" rowSpan={2}>Quantity</th>
            <th className="py-1 px-1 border-black font-bold text-center" colSpan={3}>Amount (Rs.)</th>
          </tr>
          <tr className="border-b border-black font-bold text-center">
            <th className="py-1 px-1 border-r border-black w-20 font-bold text-center">B.S.R</th>
            <th className="py-1 px-1 border-r border-black w-20 font-bold text-center">D.S.R</th>
            <th className="py-1 px-1 w-20 font-bold text-center">M.R</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const rowAmount = calculateRowAmount(row);

            {/* Print Render: Section Sub-heading */}
            if (row.type === 'section') {
              return (
                <tr key={row.id} className="border-b border-black font-bold text-left bg-transparent">
                  <td colSpan={9} className="py-1 px-2 font-bold tracking-wide uppercase">
                    {row.description}
                  </td>
                </tr>
              );
            }

            {/* Print Render: Filler Row */}
            if (row.type === 'filler') {
              return (
                <tr key={row.id} className="border-b border-black bg-transparent h-4">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black text-right px-1 font-bold text-slate-800">
                    {row.fillerColumn === 'BSR' ? '0.00' : ''}
                  </td>
                  <td className="border-r border-black text-right px-1 font-bold text-slate-800">
                    {row.fillerColumn === 'DSR' ? '0.00' : ''}
                  </td>
                  <td className="text-right px-1 font-bold text-slate-800">
                    {row.fillerColumn === 'MR' ? '0.00' : ''}
                  </td>
                </tr>
              );
            }

            {/* Print Render: standard / sub item */}
            const isSubItem = row.type === 'sub-item';

            return (
              <tr key={row.id} className="border-b border-black">
                {/* Sl No */}
                <td className="py-1 px-1 border-r border-black text-center align-top font-bold">
                  {row.slNo || ''}
                </td>
                
                {/* SOR No */}
                <td className="py-1 px-1 border-r border-black text-center align-top font-mono">
                  {row.sorNo || ''}
                </td>

                {/* Description */}
                <td className="py-1 px-2 border-r border-black text-left align-top font-sans">
                  <div className="flex">
                    {isSubItem && <span className="mr-2 text-white select-none">↳</span>}
                    <span>{row.description}</span>
                  </div>
                </td>

                {/* Unit */}
                <td className="py-1 px-1 border-r border-black text-center align-top">
                  {row.unit || ''}
                </td>

                {/* Rate - Renders RED exactly like screenshot */}
                <td className="py-1 px-1 border-r border-black text-right align-top font-bold text-red-600">
                  {row.rate ? parseFloat(row.rate).toFixed(row.rate.includes('.') && row.rate.split('.')[1].length > 2 ? 3 : 2) : ''}
                </td>

                {/* Quantity */}
                <td className="py-1 px-1 border-r border-black text-right align-top">
                  {row.quantity ? parseFloat(row.quantity).toFixed(2) : ''}
                </td>

                {/* Amount columns */}
                <td className="py-1 px-1 border-r border-black text-right align-top font-bold">
                  {row.source === 'BSR' ? rowAmount.toFixed(2) : ''}
                </td>
                <td className="py-1 px-1 border-r border-black text-right align-top font-bold">
                  {row.source === 'DSR' ? rowAmount.toFixed(2) : ''}
                </td>
                <td className="py-1 px-1 text-right align-top font-bold">
                  {row.source === 'MR' ? rowAmount.toFixed(2) : ''}
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Print totals summary - matching original sheet layout */}
        <tfoot>
          {/* Row 1: GR. TOTAL */}
          <tr className="border-b border-black font-bold">
            <td colSpan={6} className="py-1 px-2 text-right border-r border-black font-bold">GR. TOTAL</td>
            <td className="py-1 px-1 border-r border-black text-right font-bold">
              {totals.bsr.toFixed(2)}
            </td>
            <td className="py-1 px-1 border-r border-black text-right font-bold">
              {totals.dsr.toFixed(2)}
            </td>
            <td className="py-1 px-1 text-right font-bold">
              {totals.mr.toFixed(2)}
            </td>
          </tr>
          {/* Row 2: Combined Row Total */}
          <tr className="border-b border-black font-bold">
            <td colSpan={6} className="py-1 px-2 border-r border-black"></td>
            <td colSpan={3} className="py-1 px-2 text-right font-bold">
              {totals.combinedRow.toFixed(2)}
            </td>
          </tr>
          {/* Row 3: ADD 12% Electrification, Water Supply & Sanitary */}
          <tr className="border-b border-black font-bold">
            <td colSpan={6} className="py-1.5 px-2 text-left border-r border-black font-bold">
              ADD12% FOR ELECTRIFICATION WATER SUPPLY & SANITRY
            </td>
            <td colSpan={3} className="py-1.5 px-2 text-right font-bold">
              {totals.electrification.toFixed(2)}
            </td>
          </tr>
          {/* Row 4: Final combined total */}
          <tr className="border-b border-black font-bold">
            <td colSpan={6} className="py-1.5 px-2 border-r border-black"></td>
            <td colSpan={3} className="py-1.5 px-2 text-right font-bold">
              {totals.grand.toFixed(2)}
            </td>
          </tr>
          {/* Row 5: Words */}
          <tr className="font-bold">
            <td colSpan={9} className="py-2.5 px-2 text-left uppercase text-[9px] font-black leading-relaxed">
              {numberToWordsInIndianStyle(totals.grand)}/
            </td>
          </tr>
        </tfoot>
      </table>

    </div>
  );
}
