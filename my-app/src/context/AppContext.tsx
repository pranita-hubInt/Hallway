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
  addReaction: (postId: string, reactionType: 'thumbsUp' | 'clap') => void;
  addComment: (postId: string, content: string) => void;
  addNewPost: (title: string, content: string, type: FeedPost['type'], department?: FeedPost['department']) => void;
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

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('hub-theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
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
      } catch (e) {}
      return nextTheme;
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const addReaction = (postId: string, reactionType: 'thumbsUp' | 'clap') => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const isThumbs = reactionType === 'thumbsUp';
        const alreadyReacted = isThumbs ? post.reactions.userThumbsUp : post.reactions.userClap;

        return {
          ...post,
          reactions: {
            ...post.reactions,
            [isThumbs ? 'thumbsUp' : 'clap']: isThumbs
              ? post.reactions.thumbsUp + (alreadyReacted ? -1 : 1)
              : post.reactions.clap + (alreadyReacted ? -1 : 1),
            [isThumbs ? 'userThumbsUp' : 'userClap']: !alreadyReacted
          }
        };
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: 'comm-' + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: content.trim(),
      timestamp: 'Just now'
    };

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
  };

  const addNewPost = (
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
      title,
      timestamp: 'Just Now',
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        team: currentUser.department + ' Hub'
      },
      content,
      reactions: {
        thumbsUp: 1,
        clap: 1,
        userThumbsUp: true,
        userClap: false
      },
      commentsCount: 0,
      comments: [],
      department
    };

    setFeedPosts((prev) => [newPost, ...prev]);
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
