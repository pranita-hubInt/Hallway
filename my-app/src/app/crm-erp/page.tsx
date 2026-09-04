'use client';

import React, { useState } from 'react';
import {
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  UserCheck,
  CheckCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { crmLeadsMock } from '../../data/mockData';

export default function CrmErpPage() {
  const { crmLeads, addCrmLead, deleteCrmLead, searchQuery } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadCode, setLeadCode] = useState('IV-HSHHODSR12');
  const [owner, setOwner] = useState('Alice');

  const filteredLeads = crmLeads.filter((l) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.leadName.toLowerCase().includes(q) ||
        l.leadCode.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) return;
    addCrmLead({
      enquiryDate: '03 Sept 2026',
      leadName,
      leadCode,
      tags: [
        { label: 'IVR Call', bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300' },
        { label: 'Fresh Data', bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300' }
      ],
      status: 'Fresh Data',
      journeyTrack: { label: 'FRESH DATA', currentStep: 1, totalSteps: 3 },
      owner,
      engagement: 'Just now Updated',
      dueDate: 'Today',
      dueTime: '6:00 PM'
    });
    setLeadName('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header & Heatmap Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Journey Phase Heatmap
        </h1>
        {/* Heatmap Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Higher count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Medium count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Lower count</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Loading milestone counts from CRM API...
      </p>

      {/* Summary Cards with Golden/Amber Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Summary Card */}
        <div className="bg-white dark:bg-[#0D1829] border-2 border-[#F59E0B] rounded-3xl p-6 shadow-xs relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 block mb-2">
            SUMMARY
          </span>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Total
            </h2>
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              0
            </span>
          </div>
          <p className="text-[11px] text-right text-slate-400 mt-2 font-medium">
            assigned - this month
          </p>
        </div>

        {/* Verified Summary Card */}
        <div className="bg-white dark:bg-[#0D1829] border-2 border-[#F59E0B] rounded-3xl p-6 shadow-xs relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-400 block mb-2">
            SUMMARY
          </span>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Verified
            </h2>
            <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
              0
            </span>
          </div>
          <p className="text-[11px] text-right text-slate-400 mt-2 font-medium">
            verified - this month
          </p>
        </div>
      </div>

      {/* Journey Phases Collapsible Header Card */}
      <div className="bg-white dark:bg-[#0D1829] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Journey phases
        </span>
        <button className="text-xs font-bold text-amber-500 hover:text-amber-600">
          Open
        </button>
      </div>

      {/* Filter & Action Bar */}
      <div className="bg-white dark:bg-[#0D1829] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          {/* Filter 0 Button */}
          <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
            <span className="text-slate-400 font-normal">0</span>
          </button>

          {/* Sort Button */}
          <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Lead Types Button */}
          <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            # Lead Types
          </button>

          {/* Total Leads Blue Pill */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>Total Leads</span>
            <span className="px-1.5 py-0.5 bg-blue-700/80 rounded-md font-mono text-[11px]">
              2,846
            </span>
          </button>
        </div>
      </div>

      {/* Leads Data Table (Matches exact columns & cells from screenshot) */}
      <div className="bg-white dark:bg-[#0D1829] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/40">
              <th className="py-3.5 pl-4 w-10">
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-blue-600" />
              </th>
              <th className="py-3.5">ENQUIRY DATE</th>
              <th className="py-3.5">LEAD NAME</th>
              <th className="py-3.5">STATUS</th>
              <th className="py-3.5">JOURNEY TRACK</th>
              <th className="py-3.5">OWNER</th>
              <th className="py-3.5">ENGAGEMENT</th>
              <th className="py-3.5">DUE DATE</th>
              <th className="py-3.5 pr-4 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-medium">
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Checkbox */}
                <td className="py-4 pl-4">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-blue-600" />
                </td>

                {/* Enquiry Date */}
                <td className="py-4 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap">
                  {lead.enquiryDate}
                </td>

                {/* Lead Name & Subtext Badges */}
                <td className="py-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">
                      {lead.leadName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mb-1.5">
                      {lead.leadCode}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {lead.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${t.bg} ${t.text}`}
                        >
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 text-slate-600 dark:text-slate-400 text-xs">
                  {lead.status}
                </td>

                {/* Journey Track */}
                <td className="py-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      {lead.journeyTrack.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${(lead.journeyTrack.currentStep / lead.journeyTrack.totalSteps) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lead.journeyTrack.currentStep}/{lead.journeyTrack.totalSteps}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="py-4 text-slate-800 dark:text-slate-200 font-bold">
                  {lead.owner}
                </td>

                {/* Engagement */}
                <td className="py-4 text-slate-500 dark:text-slate-400 text-xs">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {lead.engagement.split(' ')[0]} {lead.engagement.split(' ')[1]} {lead.engagement.split(' ')[2]}
                    </p>
                    <p className="text-[10px] text-slate-400">Updated</p>
                  </div>
                </td>

                {/* Due Date */}
                <td className="py-4">
                  <div>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{lead.dueDate}</p>
                    <p className="text-[11px] text-slate-400">{lead.dueTime}</p>
                  </div>
                </td>

                {/* Actions: Assign & Delete Buttons */}
                <td className="py-4 pr-4">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => alert(`Assigning lead ${lead.leadName} to team member...`)}
                      className="w-20 py-1 rounded-md border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-center"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => deleteCrmLead(lead.id)}
                      className="w-20 py-0.5 text-rose-500 hover:text-rose-600 text-[10px] font-semibold text-center hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0D1829] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Ingest New Lead Record</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Name / Customer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Phase 2 High Intent Prospect"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Code</label>
                <input
                  type="text"
                  required
                  value={leadCode}
                  onChange={(e) => setLeadCode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign Owner</label>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Alice">Alice</option>
                  <option value="Rahul Sharma">Rahul Sharma</option>
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Marcus Wei">Marcus Wei</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
