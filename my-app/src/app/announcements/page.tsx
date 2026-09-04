'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import FeedCard from '../../components/home/FeedCard';
import NewPostModal from '../../components/home/NewPostModal';

export default function AnnouncementsPage() {
  const { feedPosts, searchQuery, setSearchQuery } = useApp();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<'ALL' | 'ANNOUNCEMENTS' | 'PERFORMERS'>('ALL');

  // Filter posts
  const filteredAnnouncements = feedPosts.filter((post) => {
    if (tagFilter === 'ANNOUNCEMENTS' && post.type !== 'announcement') return false;
    if (tagFilter === 'PERFORMERS' && post.type !== 'performer') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.author?.name.toLowerCase().includes(q) ||
        post.comments?.some((c) => c.content.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-rose-600 dark:text-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Executive Announcements & Broadcasts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official corridor broadcasts, campaign releases, townhalls, and performer recognitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New</span>
          </button>
        </div>
      </div>

      {/* Filter and In-Page Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Updates' },
            { id: 'ANNOUNCEMENTS', label: '📢 Corridor Broadcasts' },
            { id: 'PERFORMERS', label: '🏆 MVP & Performers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTagFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tagFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0D1829] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search status if searching */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Filtering by: <strong className="text-slate-900 dark:text-white">"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-500 hover:underline font-semibold"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Announcements Feed with Live Comments & Reactions */}
      <div className="space-y-4 max-w-3xl">
        {filteredAnnouncements.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#0D1829] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-sm font-semibold text-slate-500">
              No announcements matching current filter or search query.
            </p>
          </div>
        )}
      </div>

      <NewPostModal isOpen={isNewPostOpen} onClose={() => setIsNewPostOpen(false)} />
    </div>
  );
}

