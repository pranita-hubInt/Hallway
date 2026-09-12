'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  FeedPost,
  ActionItem,
  CrmLeadItem,
  DesignProject
} from '../types';
import {
  currentUserMock,
  alternateUserMock,
  designerUserMock,
  initialFeedPosts,
  actionItemsMock,
  crmLeadsMock,
  designProjectsMock
} from '../data/mockData';
import { getStoredCrmUser, fetchFeed, fetchTargets } from '../lib/crmApi';

interface AppContextType {
  currentUser: User;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  feedPosts: FeedPost[];
  addReaction: (postId: string, reactionType: 'thumbsUp' | 'clap' | 'heart') => void;
  addComment: (
    postId: string,
    content: string,
    customAuthor?: { name: string; avatar: string; role: string; handle?: string }
  ) => Promise<void>;
  likeComment: (postId: string, commentId: string) => void;
  refreshFeed: () => Promise<void>;
  addNewPost: (
    title: string,
    content: string,
    type?: FeedPost['type'],
    department?: FeedPost['department'],
    quotaProgress?: FeedPost['quotaProgress'],
    author?: { name: string; avatar: string; team: string }
  ) => Promise<FeedPost | null>;
  actionItems: ActionItem[];
  toggleActionItem: (groupId: string, itemId: string) => void;
  crmLeads: CrmLeadItem[];
  addCrmLead: (lead: Omit<CrmLeadItem, 'id'>) => void;
  deleteCrmLead: (id: string) => void;
  designProjects: DesignProject[];
  addDesignProject: (project: Omit<DesignProject, 'id'>) => void;
  login: (email?: string, name?: string, role?: string, department?: User['department']) => void;
  logout: () => void;
  switchUser: (targetRole?: 'admin' | 'crm' | 'design') => void;
  notificationsCount: number;
  clearNotifications: () => void;
  activeTimeframe: 'Today' | 'MTD' | 'QTD';
  setActiveTimeframe: (tf: 'Today' | 'MTD' | 'QTD') => void;
  activeLeaderboardView: 'Individual' | 'Team';
  setActiveLeaderboardView: (v: 'Individual' | 'Team') => void;
}

const HALLWAY_LOCAL_API = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');

function formatBranchName(raw?: string): string {
  if (!raw) return 'Hub Sales';
  const clean = raw.trim().toUpperCase();
  if (clean === 'JP_NAGAR' || clean === 'JP NAGAR') return 'JP Nagar Hub';
  if (clean === 'SARJAPURA' || clean === 'SARJAPUR') return 'Sarjapura Hub';
  if (clean === 'HBR' || clean === 'HBR_LAYOUT') return 'HBR Layout Hub';
  return `${raw} Hub`;
}

const BRANCH_TARGET_CONFIGS = [
  { id: 'JP_NAGAR', name: 'JP Nagar', team: 'JP Nagar Hub' },
  { id: 'SARJAPURA', name: 'Sarjapura', team: 'Sarjapura Hub' },
  { id: 'HBR', name: 'HBR Layout', team: 'HBR Layout Hub' },
];

function resolveCrmAvatar(name?: string): string {
  if (!name) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  const lower = name.toLowerCase();
  if (lower.includes('meghana')) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('shaddisha')) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('aman')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('sharanya')) return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('danush')) return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('jayashree')) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('somashekar')) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('bilal')) return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80';
  return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(currentUserMock);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeDepartment, setActiveDepartment] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialFeedPosts);
  const [actionItems, setActionItems] = useState<ActionItem[]>(actionItemsMock);
  const [crmLeads, setCrmLeads] = useState<CrmLeadItem[]>(crmLeadsMock);
  const [designProjects, setDesignProjects] = useState<DesignProject[]>(designProjectsMock);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [activeTimeframe, setActiveTimeframe] = useState<'Today' | 'MTD' | 'QTD'>('Today');
  const [activeLeaderboardView, setActiveLeaderboardView] = useState<'Individual' | 'Team'>('Individual');

  // Initialize theme from localStorage without effect warning
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('hub-theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync active logged-in user if available from CRM session
  useEffect(() => {
    const storedUser = getStoredCrmUser();
    if (storedUser?.username) {
      setCurrentUser((prev) => ({
        ...prev,
        name: storedUser.username === 'admin' ? 'Super Admin' : storedUser.username,
        role: storedUser.role || prev.role,
        department: (storedUser.branch as any) || prev.department,
      }));
    }
  }, []);

  // Fetch announcements and live CRM targets / bookings
  const refreshFeed = async () => {
    try {
      const apiUrl = HALLWAY_LOCAL_API || '/api';
      const announcementsPromise = fetch(`${apiUrl}/announcements`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const crmFeedPromise = fetchFeed('', { limit: 15 })
        .then((res) => res?.feed || [])
        .catch(() => []);

      const crmTargetsPromise = fetchTargets('', {})
        .then((res) => res?.cards || [])
        .catch(() => []);

      const branchTargetPromises = BRANCH_TARGET_CONFIGS.map(async (b) => {
        try {
          const res = await fetchTargets('', { branchId: b.id });
          return (res?.cards || []).map((card) => ({
            ...card,
            branchId: b.id,
            branchName: b.name,
            team: b.team,
          }));
        } catch {
          return [];
        }
      });

      const [announcementsData, crmItems, overallTargetsData, ...branchTargetsArrays] = await Promise.all([
        announcementsPromise,
        crmFeedPromise,
        crmTargetsPromise,
        ...branchTargetPromises,
      ]);

      const allTargets: any[] = [];
      // 1. Add overall company-wide target FIRST so it appears at the top of the list
      if (Array.isArray(overallTargetsData)) {
        for (const card of overallTargetsData) {
          allTargets.push({
            ...card,
            branchId: 'all',
            branchName: 'All Hubs (Overall)',
            team: 'Operations HQ',
          });
        }
      }
      // 2. Add branch-wise targets (JP Nagar, Sarjapura, HBR)
      for (const list of branchTargetsArrays) {
        if (Array.isArray(list)) allTargets.push(...list);
      }

      const announcementsMap = new Map<string, FeedPost>();
      if (Array.isArray(announcementsData)) {
        for (const a of announcementsData) {
          if (a?.id) announcementsMap.set(a.id, a);
        }
      }

      const combined: FeedPost[] = [];
      const seenIds = new Set<string>();

      // 1. Live Target Pacing from CRM (Branch-wise: JP Nagar, Sarjapura, HBR & Overall)
      if (Array.isArray(allTargets) && allTargets.length > 0) {
        for (const target of allTargets) {
          const id = `crm-target-${target.branchId || 'overall'}-${target.yearMonth || 'current'}`;
          const existing = announcementsMap.get(id);
          const branchPrefix = target.branchName ? `${target.branchName}: ` : '';
          const title = `${branchPrefix}${target.title}: ${target.current} achieved (${target.progress}%)`;
          const content =
            target.branchName && target.branchId !== 'all'
              ? `${target.branchName} Hub monthly gross booking pacing is at ${target.current} towards the ${target.target} branch target (${target.progress}% achieved). Synced directly from CRM ${target.targetSource || 'sales_targets'}.`
              : `Monthly gross booking pacing across all corridors is at ${target.current} towards the ${target.target} target (${target.progress}% achieved). Synced directly from CRM ${target.targetSource || 'sales_targets'}.`;

          combined.push({
            id,
            type: 'quota',
            categoryColor: '#8B5CF6',
            title,
            timestamp: 'Live Pacing',
            createdAt: new Date().toISOString(),
            author: {
              name:
                target.branchName && target.branchId !== 'all'
                  ? `${target.branchName} Operations`
                  : 'Hub Operations',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              team: target.team || 'Operations HQ',
            },
            content,
            quotaProgress: {
              current: target.currentInr || target.progress,
              target: target.targetInr || 100,
              label: target.branchName ? `${target.branchName} Target` : target.title,
              percentage: target.progress,
              currentFormatted: target.current,
              targetFormatted: target.target,
            },
            reactions: existing?.reactions || { thumbsUp: 0, clap: 0, heart: 0 },
            commentsCount: existing?.commentsCount || 0,
            comments: existing?.comments || [],
            department: 'Sales',
          });
          seenIds.add(id);
        }
      }

      // 2. Real Live CRM Closed Deal Bookings from booking_token_record (excluding tokens)
      if (Array.isArray(crmItems) && crmItems.length > 0) {
        for (const item of crmItems) {
          // Exclude tokens: only closed deal bookings should appear in the feed
          if (
            item.type === 'token' ||
            item.id?.startsWith('token-') ||
            item.title?.toLowerCase().includes('token')
          ) {
            continue;
          }

          const id = `crm-${item.id}`;
          if (seenIds.has(id)) continue;
          const existing = announcementsMap.get(id);

          const authorName = item.author?.name || 'Sales Executive';
          const authorTeam = formatBranchName(item.author?.team);
          const avatar = item.author?.avatar || resolveCrmAvatar(authorName);

          combined.push({
            id,
            type: item.type === 'quota' ? 'quota' : item.type === 'performer' ? 'performer' : 'booking',
            categoryColor:
              item.type === 'quota'
                ? '#8B5CF6'
                : item.type === 'performer'
                ? '#F59E0B'
                : '#10B981',
            title: item.title ? item.title.replace(/^New booking/i, 'Gross booking') : item.title,
            timestamp: item.timestamp || 'Recent deal',
            createdAt: item.createdAt || new Date().toISOString(),
            author: {
              name: authorName,
              avatar,
              team: authorTeam,
            },
            content: item.content,
            reactions: existing?.reactions || { thumbsUp: 0, clap: 0, heart: 0 },
            commentsCount: existing?.commentsCount || 0,
            comments: existing?.comments || [],
            department: (item.department as any) || 'Sales',
          });
          seenIds.add(id);
        }
      }

      // 3. User Broadcast Announcements (manual announcements, excluding any legacy tokens or meetings)
      if (Array.isArray(announcementsData)) {
        for (const post of announcementsData) {
          if (!seenIds.has(post.id)) {
            if (
              post.id?.startsWith('crm-token-') ||
              post.id?.startsWith('crm-event-') ||
              post.title?.toLowerCase().startsWith('new token') ||
              post.title?.toLowerCase().includes('client consultation') ||
              post.title?.toLowerCase().includes('virtual meeting') ||
              post.title?.toLowerCase().includes('showroom visit')
            ) {
              continue;
            }
            combined.push(post);
            seenIds.add(post.id);
          }
        }
      }

      setFeedPosts(combined);
    } catch {
      // Offline fallback preserved in state
    }
  };

  // Initial load, periodic background polling (every 25s), and tab focus re-sync
  useEffect(() => {
    void refreshFeed();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        void refreshFeed();
      }
    }, 25000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshFeed();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('hub-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // ignore
      }
      return nextTheme;
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const addReaction = async (postId: string, reactionType: 'thumbsUp' | 'clap' | 'heart') => {
    // Optimistic UI update
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const userKey = ('user' + reactionType.charAt(0).toUpperCase() + reactionType.slice(1)) as
          | 'userThumbsUp'
          | 'userClap'
          | 'userHeart';
        const alreadyReacted = Boolean(post.reactions[userKey]);
        const currentCount = post.reactions[reactionType] || 0;

        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: Math.max(0, currentCount + (alreadyReacted ? -1 : 1)),
            [userKey]: !alreadyReacted
          }
        };
      })
    );

    if (!HALLWAY_LOCAL_API) return;
    try {
      await fetch(`${HALLWAY_LOCAL_API}/announcements/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType })
      });
    } catch {
      // Silent catch for offline
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    // Optimistic UI update
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updatedComments = post.comments.map((comm) => {
          if (comm.id !== commentId) return comm;
          const nextLiked = !comm.userLiked;
          return {
            ...comm,
            userLiked: nextLiked,
            likes: Math.max(0, (comm.likes || 0) + (nextLiked ? 1 : -1))
          };
        });
        return {
          ...post,
          comments: updatedComments
        };
      })
    );

    if (!HALLWAY_LOCAL_API) return;
    try {
      await fetch(`${HALLWAY_LOCAL_API}/announcements/${postId}/comments/${commentId}/like`, {
        method: 'POST'
      });
    } catch {
      // Silent catch
    }
  };

  const addComment = async (
    postId: string,
    content: string,
    customAuthor?: { name: string; avatar: string; role: string; handle?: string }
  ) => {
    if (!content.trim()) return;

    const authorName = customAuthor?.name || currentUser.name;
    const authorRole = customAuthor?.role || currentUser.role;
    const authorAvatar = customAuthor?.avatar || currentUser.avatar;
    const authorHandle = customAuthor?.handle || authorName.toLowerCase().replace(/\s+/g, '.');

    const newComment = {
      id: 'comm-' + Date.now(),
      authorName,
      authorHandle,
      authorAvatar,
      authorRole,
      content: content.trim(),
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      likes: 0,
      userLiked: false
    };

    // Optimistic UI update
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [newComment, ...post.comments]
        };
      })
    );

    if (!HALLWAY_LOCAL_API) return;
    try {
      const res = await fetch(`${HALLWAY_LOCAL_API}/announcements/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          authorName,
          authorHandle,
          authorAvatar,
          authorRole
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.announcement) {
          setFeedPosts((prev) =>
            prev.map((p) => (p.id === postId ? data.announcement : p))
          );
        }
      }
    } catch {
      // Offline fallback preserved in state
    }
  };

  const addNewPost = async (
    title: string,
    content: string,
    type: FeedPost['type'] = 'announcement',
    department: FeedPost['department'] = 'Sales',
    quotaProgress?: FeedPost['quotaProgress'],
    customAuthor?: { name: string; avatar: string; team: string }
  ): Promise<FeedPost | null> => {
    const colors: Record<string, string> = {
      booking: '#10B981',
      quota: '#8B5CF6',
      performer: '#F59E0B',
      announcement: '#EF4444',
      general: '#3B82F6'
    };

    const author = customAuthor || {
      name: currentUser.name,
      avatar: currentUser.avatar,
      team: currentUser.department + ' Hub'
    };

    const newPost: FeedPost = {
      id: 'post-' + Date.now(),
      type,
      categoryColor: colors[type] || '#3B82F6',
      title: title.trim(),
      timestamp: 'Just Now',
      author,
      content: content.trim(),
      quotaProgress: quotaProgress || undefined,
      reactions: {
        thumbsUp: 1,
        clap: 1,
        heart: 1,
        userThumbsUp: true,
        userClap: false,
        userHeart: false
      },
      commentsCount: 0,
      comments: [],
      department
    };

    // Optimistically prepend to UI
    setFeedPosts((prev) => [newPost, ...prev]);

    const apiUrl = HALLWAY_LOCAL_API || '/api';
    try {
      const res = await fetch(`${apiUrl}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          type,
          department,
          author,
          quotaProgress: quotaProgress || null
        })
      });
      if (res.ok) {
        const created: FeedPost = await res.json();
        setFeedPosts((prev) => [created, ...prev.filter((p) => p.id !== newPost.id)]);
        return created;
      }
    } catch (err) {
      console.error('Failed to post announcement to server:', err);
    }
    return newPost;
  };

  const toggleActionItem = (groupId: string, itemId: string) => {
    setActionItems((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const updatedItems = group.items.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        const remainingCount = updatedItems.filter((i) => !i.done).length;
        return {
          ...group,
          items: updatedItems,
          count: remainingCount
        };
      })
    );
  };

  const addCrmLead = (lead: Omit<CrmLeadItem, 'id'>) => {
    const newLead: CrmLeadItem = {
      ...lead,
      id: 'lead-' + Date.now()
    };
    setCrmLeads((prev) => [newLead, ...prev]);
  };

  const deleteCrmLead = (id: string) => {
    setCrmLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const addDesignProject = (project: Omit<DesignProject, 'id'>) => {
    const newProj: DesignProject = {
      ...project,
      id: 'des-' + Date.now()
    };
    setDesignProjects((prev) => [newProj, ...prev]);
  };

  const login = (
    email?: string,
    name?: string,
    role?: string,
    department: User['department'] = 'Sales'
  ) => {
    setIsAuthenticated(true);
    if (department === 'Design' || email?.includes('maya')) {
      setCurrentUser(designerUserMock);
    } else if (email?.includes('ranjith')) {
      setCurrentUser(alternateUserMock);
    } else {
      setCurrentUser(currentUserMock);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (target?: 'admin' | 'crm' | 'design') => {
    if (target === 'design') {
      setCurrentUser(designerUserMock);
    } else if (target === 'crm') {
      setCurrentUser(alternateUserMock);
    } else {
      if (currentUser.id === 'u1') setCurrentUser(alternateUserMock);
      else if (currentUser.id === 'u2') setCurrentUser(designerUserMock);
      else setCurrentUser(currentUserMock);
    }
  };

  const clearNotifications = () => {
    setNotificationsCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        theme,
        toggleTheme,
        isAuthenticated,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        activeDepartment,
        setActiveDepartment,
        searchQuery,
        setSearchQuery,
        feedPosts,
        addReaction,
        addComment,
        likeComment,
        refreshFeed,
        addNewPost,
        actionItems,
        toggleActionItem,
        crmLeads,
        addCrmLead,
        deleteCrmLead,
        designProjects,
        addDesignProject,
        login,
        logout,
        switchUser,
        notificationsCount,
        clearNotifications,
        activeTimeframe,
        setActiveTimeframe,
        activeLeaderboardView,
        setActiveLeaderboardView
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
