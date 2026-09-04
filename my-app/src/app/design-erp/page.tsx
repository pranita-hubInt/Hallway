'use client';

import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Layers,
  Plus,
  Clock,
  CheckCircle2,
  Eye,
  FileText,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { designProjectsMock } from '../../data/mockData';

export default function DesignErpPage() {
  const { designProjects, addDesignProject, searchQuery } = useApp();
  const [activeStage, setActiveStage] = useState('All');
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [stage, setStage] = useState<'Concept Drafting' | '3D Staging' | 'Material Selection' | 'Client Sign-off' | 'Approved'>('3D Staging');

  const filteredProjects = designProjects.filter((p) => {
    if (activeStage !== 'All' && p.stage !== activeStage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.projectName.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    addDesignProject({
      projectName,
      clientName: clientName || 'Enterprise Client',
      stage,
      designer: 'Maya Lin',
      renderThumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&auto=format&fit=crop&q=80',
      progress: stage === 'Approved' ? 100 : 65,
      deadline: 'Nov 05'
    });
    setProjectName('');
    setClientName('');
    setShowNewProjModal(false);
  };

  const stages = ['All', 'Concept Drafting', '3D Staging', 'Material Selection', 'Client Sign-off', 'Approved'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-xl">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Design ERP • Studio Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Spatial 3D visualization, blueprint staging, and interior palette sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowNewProjModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-950/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Design Sheet</span>
        </button>
      </div>

      {/* Studio KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Active 3D Staging', value: '14 Renders', sub: '4 awaiting client review', color: 'text-purple-500' },
          { title: 'Render Turnaround', value: '2.4 Days', sub: '98% on-time milestone', color: 'text-emerald-500' },
          { title: 'Material Palette Sign-offs', value: '38 Specs', sub: 'Sarjapura & Whitefield', color: 'text-blue-500' },
          { title: 'Client Approval CSAT', value: '4.98/5', sub: 'Rank #1 Design Team', color: 'text-amber-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{kpi.title}</span>
            <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {stages.map((st) => {
          const isActive = activeStage === st;
          return (
            <button
              key={st}
              onClick={() => setActiveStage(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Design Projects Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all group"
          >
            {/* 3D Render Thumbnail with Overlay */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={p.renderThumbnail}
                alt={p.projectName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <button
                onClick={() => setPreviewImage(p.renderThumbnail)}
                className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-xs hover:bg-white"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect 3D</span>
              </button>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-purple-300 text-[10px] font-extrabold uppercase border border-purple-500/40 backdrop-blur-xs">
                {p.stage}
              </span>
            </div>

            {/* Project Details */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  {p.projectName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client: <span className="text-slate-600 dark:text-slate-300 font-medium">{p.clientName}</span> • Lead: {p.designer}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Design Completion</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{p.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Deadline: {p.deadline}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Blueprint</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
            >
              ✕
            </button>
            <img src={previewImage} alt="3D Staging View" className="w-full h-96 object-cover rounded-2xl" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Spatial Staging Preview • High Fidelity Render</p>
                <p className="text-xs text-slate-400">Color Profile: Manrope Architectural Palette #4828</p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit New Design Sheet</h3>
              <button onClick={() => setShowNewProjModal(false)} className="text-xs text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Specification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Villa 3D Living Area Staging"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Global"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Design Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Concept Drafting">Concept Drafting</option>
                  <option value="3D Staging">3D Staging</option>
                  <option value="Material Selection">Material Selection</option>
                  <option value="Client Sign-off">Client Sign-off</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Publish Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
