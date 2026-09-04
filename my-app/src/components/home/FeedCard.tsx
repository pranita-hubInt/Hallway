'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Sparkles, UserCheck, ChevronDown, Award } from 'lucide-react';
import { FeedPost } from '../../types';
import { useApp } from '../../context/AppContext';
import { alternateUserMock, currentUserMock, designerUserMock } from '../../data/mockData';

export default function FeedCard({ post }: { post: FeedPost }) {
  const { addReaction, addComment, likeComment, currentUser } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active commenting persona (defaults to current logged-in user, but allows switching, e.g., to Ranjith)
  const [activePersona, setActivePersona] = useState<{
    name: string;
    handle: string;
    avatar: string;
    role: string;
  }>({
    name: currentUser.name === 'Super Admin' ? 'Ranjith' : currentUser.name,
    handle: currentUser.name === 'Super Admin' ? 'ranjith' : currentUser.name.toLowerCase().replace(/\s+/g, '.'),
    avatar: currentUser.name === 'Super Admin' ? alternateUserMock.avatar : currentUser.avatar,
    role: currentUser.name === 'Super Admin' ? 'CRM Lead' : currentUser.role
  });

  const [showPersonaPicker, setShowPersonaPicker] = useState(false);

  const availablePersonas = [
    {
      name: 'Ranjith',
      handle: 'ranjith',
      avatar: alternateUserMock.avatar,
      role: 'CRM Lead'
    },
    {
      name: 'Super Admin',
      handle: 'admin',
      avatar: currentUserMock.avatar,
      role: 'Leadership HQ'
    },
    {
      name: 'Maya Lin',
      handle: 'maya.lin',
      avatar: designerUserMock.avatar,
      role: 'Design Lead'
    },
    {
      name: 'Michael Vance',
      handle: 'michael.v',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'Alpha Squad Lead'
    }
  ];

  const handleSendComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(post.id, commentInput, {
        name: activePersona.name,
        handle: activePersona.handle,
        avatar: activePersona.avatar,
        role: activePersona.role
      });
      setCommentInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickEmoji = (emoji: string) => {
    setCommentInput((prev) => prev + emoji);
  };

  const isPerformerPost = post.type === 'performer' || post.title.toLowerCase().includes('sarah');

  return (
    <div className="bg-white dark:bg-[#0D1829] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
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
          {isPerformerPost && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase border border-amber-400/30">
              <Award className="w-3 h-3" />
              <span>Corridor MVP</span>
            </span>
          )}
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

      {/* Card Actions & Reactions (Instagram style toolbar) */}
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

          {/* Instagram Heart Button */}
          <button
            onClick={() => addReaction(post.id, 'heart')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              post.reactions.userHeart
                ? 'bg-red-50 dark:bg-red-950/40 text-red-500 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400'
            }`}
            title="Love this update"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                post.reactions.userHeart ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
            <span>{post.reactions.heart || 0}</span>
          </button>
        </div>

        {/* Comment Count / Drawer Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-semibold ${
            showComments
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
        </button>
      </div>

      {/* Expandable Instagram-Style Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
          
          {/* Quick Congratulate Chips (Specially for Sarah or milestones) */}
          {isPerformerPost && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Cheers for Sarah Jenkins:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '🎉 Incredible performance Sarah!',
                  '👏 Unmatched conversion velocity! 🔥',
                  '🚀 Inspiring the entire corridor!',
                  '🙌 Best numbers this quarter!'
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCommentInput(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shadow-2xs font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Commenter Banner (Instagram "Commenting as @ranjith") */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-sky-500/50"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white truncate">
                    {activePersona.name}
                  </span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-medium">
                    @{activePersona.handle}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{activePersona.role}</p>
              </div>
            </div>

            {/* Switch Persona Dropdown Toggle */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowPersonaPicker(!showPersonaPicker)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold hover:border-sky-400 transition-colors"
              >
                <span>Switch profile</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPersonaPicker && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-30 text-xs animate-in fade-in duration-100">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Comment as team member:
                  </p>
                  {availablePersonas.map((p) => (
                    <button
                      key={p.handle}
                      type="button"
                      onClick={() => {
                        setActivePersona(p);
                        setShowPersonaPicker(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                        activePersona.handle === p.handle
                          ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{p.handle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instagram-Style Comment Input Box */}
          <form onSubmit={handleSendComment} className="space-y-2">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500/40 focus-within:border-sky-500 transition-all">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600 shrink-0"
              />
              <input
                type="text"
                placeholder={`Add a comment as @${activePersona.handle}...`}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              
              {/* Quick Emojis inside input like Instagram */}
              <div className="hidden sm:flex items-center gap-1 shrink-0 text-xs">
                {['❤️', '🔥', '👏', '🎉'].map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => handleQuickEmoji(emo)}
                    className="hover:scale-125 transition-transform p-0.5"
                    title={`Add ${emo}`}
                  >
                    {emo}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!commentInput.trim() || isSubmitting}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center gap-1 shadow-xs"
              >
                <span>Post</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Instagram-Style Comments Thread List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="text-xs leading-relaxed min-w-0">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {comm.authorName}
                        </span>
                        {comm.authorHandle && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            @{comm.authorHandle}
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          {comm.authorRole}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap break-words">
                        {comm.content}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                        <span>{comm.timestamp}</span>
                        {comm.likes && comm.likes > 0 ? (
                          <span className="font-semibold text-slate-500 dark:text-slate-400">
                            {comm.likes} {comm.likes === 1 ? 'like' : 'likes'}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setCommentInput(`@${comm.authorHandle || comm.authorName.toLowerCase()} `)}
                          className="hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram-Style Comment Like Heart Button */}
                  <button
                    type="button"
                    onClick={() => likeComment(post.id, comm.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Like comment"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        comm.userLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                No comments yet. Start the conversation as @{activePersona.handle}!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

