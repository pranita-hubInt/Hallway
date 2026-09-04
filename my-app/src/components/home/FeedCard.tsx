'use client';

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Award, Sparkles, Send } from 'lucide-react';
import { FeedPost } from '../../types';
import { useApp } from '../../context/AppContext';

export default function FeedCard({ post }: { post: FeedPost }) {
  const { addReaction, addComment } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Top Header with Category Indicator */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: post.categoryColor }}
          />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {post.title}
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
          {post.timestamp}
        </span>
      </div>

      {/* Post Body Content */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Quota Progress Bar (if quota milestone post) */}
      {post.quotaProgress && (
        <div className="mb-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500 dark:text-slate-400">{post.quotaProgress.label}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{post.quotaProgress.percentage}%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${post.quotaProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Actions & Reactions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Thumbs Up Button */}
          <button
            onClick={() => addReaction(post.id, 'thumbsUp')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              post.reactions.userThumbsUp
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Like update"
          >
            <span>👍</span>
            <span>{post.reactions.thumbsUp}</span>
          </button>

          {/* Clap / React Button */}
          <button
            onClick={() => addReaction(post.id, 'clap')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              post.reactions.userClap
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Clap celebrate"
          >
            <span>👏</span>
            <span>{post.reactions.clap > 0 ? post.reactions.clap : 'React'}</span>
          </button>
        </div>

        {/* Comment Count / Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
          {/* Comment Form */}
          <form onSubmit={handleSendComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a congratulatory comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {post.comments.map((comm) => (
              <div key={comm.id} className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <img src={comm.authorAvatar} alt={comm.authorName} className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{comm.authorName}</span>
                    <span className="text-[10px] text-slate-400">({comm.authorRole})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 pl-5">{comm.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
