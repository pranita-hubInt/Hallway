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
  addNewPost: (title: string, content: string, type: FeedPost['type'], department?: FeedPost['department']) => Promise<void>;
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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
  const [notificationsCount, setNotificationsCount] = useState<number>(99);
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

  // Fetch announcements from Express backend
  const refreshFeed = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeedPosts(data);
        }
      }
    } catch {
      // Backend not running yet or offline, fallback to mock data
    }
  };

  useEffect(() => {
    refreshFeed();
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

    try {
      await fetch(`${API_BASE}/announcements/${postId}/reactions`, {
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

    try {
      await fetch(`${API_BASE}/announcements/${postId}/comments/${commentId}/like`, {
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

    try {
      const res = await fetch(`${API_BASE}/announcements/${postId}/comments`, {
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
    type: FeedPost['type'],
    department: FeedPost['department'] = 'Sales'
  ) => {
    const colors = {
      booking: '#10B981',
      quota: '#8B5CF6',
      performer: '#F59E0B',
      announcement: '#EF4444',
      general: '#3B82F6'
    };

    const newPost: FeedPost = {
      id: 'post-' + Date.now(),
      type,
      categoryColor: colors[type] || '#3B82F6',
      title: title.trim(),
      timestamp: 'Just Now',
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        team: currentUser.department + ' Hub'
      },
      content: content.trim(),
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

    setFeedPosts((prev) => [newPost, ...prev]);

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          type,
          department,
          author: newPost.author
        })
      });
      if (res.ok) {
        const created = await res.json();
        setFeedPosts((prev) => [created, ...prev.filter((p) => p.id !== newPost.id)]);
      }
    } catch {
      // Offline fallback preserved
    }
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
