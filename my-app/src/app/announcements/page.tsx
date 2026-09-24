'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isTodayOrYesterday } from '../../lib/hallwayDisplay';
import FeedCard from '../../components/home/FeedCard';
import NewPostModal from '../../components/home/NewPostModal';

export default function AnnouncementsPage() {
  const { feedPosts, searchQuery, setSearchQuery, refreshFeed } = useApp();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<'ALL' | 'ANNOUNCEMENTS' | 'PERFORMERS'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshFeed();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFeed();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter posts (only today's and 1-day before news)
  const filteredAnnouncements = feedPosts.filter((post) => {
    if (!isTodayOrYesterday(post.createdAt, post.timestamp)) return false;
    if (tagFilter === 'ANNOUNCEMENTS' && post.type !== 'announcement' && post.type !== 'general') return false;
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

  // Ensure newly broadcasted announcements appear strictly first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // 1. Broadcast announcements (announcement, performer, general) take priority over background CRM sync cards
    const isBroadcastA = a.type === 'announcement' || a.type === 'performer' || a.type === 'general' || a.id?.startsWith('post-');
    const isBroadcastB = b.type === 'announcement' || b.type === 'performer' || b.type === 'general' || b.id?.startsWith('post-');

    if (isBroadcastA && !isBroadcastB) return -1;
    if (!isBroadcastA && isBroadcastB) return 1;

    // 2. Sort by creation time / timestamp descending (newest first)
    const getTime = (p: typeof a) => {
      if (p.createdAt) {
        const t = new Date(p.createdAt).getTime();
        if (!isNaN(t)) return t;
      }
      if (p.id?.startsWith('post-')) {
        const num = Number(p.id.replace('post-', ''));
        if (!isNaN(num)) return num;
      }
      return 0;
    };
    return getTime(b) - getTime(a);
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
            onClick={handleRefresh}
            title="Refresh announcements from database"
            className="p-2 bg-white dark:bg-[#0D1829] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
          </button>

          <button
            onClick={() => setIsNewPostOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-rose-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast</span>
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

      <div className="space-y-4 max-w-3xl">
        {sortedAnnouncements.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}

        {sortedAnnouncements.length === 0 && (
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
