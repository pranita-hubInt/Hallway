import {
  User,
  FeedPost,
  CalendarEvent,
  ActionItem,
  LeaderboardMember,
  LeaderboardTeam,
  IndividualRecord,
  TeamRecord,
  CrmLeadItem,
  DesignProject
} from '../types';

export const currentUserMock: User = {
  id: 'u1',
  name: 'Super Admin',
  role: 'SUPER_ADMIN',
  initials: 'SA',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'admin@hows.internal',
  department: 'Sales',
  isOnline: true,
};

export const alternateUserMock: User = {
  id: 'u2',
  name: 'Ranjith',
  role: 'CRM_LEAD',
  initials: 'RJ',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  email: 'ranjith@hows.internal',
  department: 'Sales',
  isOnline: true,
};

export const designerUserMock: User = {
  id: 'u3',
  name: 'Maya Lin',
  role: 'DESIGN_LEAD',
  initials: 'ML',
  avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
  email: 'maya.lin@hows.internal',
  department: 'Design',
  isOnline: true,
};

export const crmLeadsMock: CrmLeadItem[] = [
  {
    id: 'lead-1',
    enquiryDate: '03 Sept 2026',
    leadName: 'IVR 2266',
    leadCode: 'IV-HSHHODSR11',
    tags: [
      { label: 'IVR Call', bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300' },
      { label: 'Unverified', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300' },
      { label: 'Call Delayed', bg: 'bg-pink-100 dark:bg-pink-950/60', text: 'text-pink-700 dark:text-pink-300' },
      { label: 'Presales', bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300' }
    ],
    status: 'Fresh Data',
    journeyTrack: { label: 'FRESH DATA', currentStep: 1, totalSteps: 3 },
    owner: 'Alice',
    engagement: '19 min ago Updated',
    dueDate: 'Today',
    dueTime: '5:55 PM'
  },
  {
    id: 'lead-2',
    enquiryDate: '03 Sept 2026',
    leadName: 'Sarjapura High-Intent Lead #408',
    leadCode: 'SJ-VIP-9942',
    tags: [
      { label: 'Walk-in', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' },
      { label: 'Verified', bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300' },
      { label: 'Presales', bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300' }
    ],
    status: 'In Discussion',
    journeyTrack: { label: 'PROPOSAL SENT', currentStep: 2, totalSteps: 3 },
    owner: 'Rahul Sharma',
    engagement: '35 min ago Updated',
    dueDate: 'Today',
    dueTime: '6:30 PM'
  },
  {
    id: 'lead-3',
    enquiryDate: '02 Sept 2026',
    leadName: 'Whitefield Skydeck Commercial Suite',
    leadCode: 'WF-CORP-104',
    tags: [
      { label: 'Enterprise Inbound', bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300' },
      { label: 'Contract Escrow', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300' }
    ],
    status: 'Escrow Review',
    journeyTrack: { label: 'FINAL CLOSING', currentStep: 3, totalSteps: 3 },
    owner: 'Sarah Jenkins',
    engagement: '2 hours ago Updated',
    dueDate: 'Tomorrow',
    dueTime: '11:00 AM'
  }
];

export const initialFeedPosts: FeedPost[] = [
  {
    id: 'post-1',
    type: 'booking',
    categoryColor: '#10B981',
    title: 'New Booking: ₹42L by Sarjapura Team',
    timestamp: 'Just Now',
    author: {
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      team: 'Sarjapura Enterprise Hub'
    },
    content: 'Rahul closed the Deal #4828 at Sarjapura phase 2. Incredible work team!',
    reactions: {
      thumbsUp: 12,
      clap: 5,
      userThumbsUp: false,
      userClap: true
    },
    commentsCount: 3,
    department: 'Sales',
    comments: [
      {
        id: 'c1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        authorRole: 'Enterprise AE',
        content: 'Phenomenal turnaround on this! Big congratulations Rahul & team!',
        timestamp: '2m ago'
      }
    ]
  },
  {
    id: 'post-2',
    type: 'quota',
    categoryColor: '#8B5CF6',
    title: 'JP Nagar hit 80% of target!',
    timestamp: '45 mins ago',
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      team: 'JP Nagar Branch'
    },
    content: "The JP Nagar office is on track to smash this month's quota. Keep pushing!",
    quotaProgress: {
      current: 80,
      target: 100,
      label: 'Monthly Quota',
      percentage: 80
    },
    reactions: {
      thumbsUp: 8,
      clap: 3,
      userThumbsUp: true,
      userClap: false
    },
    commentsCount: 1,
    department: 'Sales',
    comments: []
  },
  {
    id: 'post-3',
    type: 'performer',
    categoryColor: '#F59E0B',
    title: 'Weekly Top Performer Announced',
    timestamp: '2 hours ago',
    author: {
      name: 'Hallway People Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      team: 'HQ Leadership'
    },
    content: 'Congratulations to Sarah Jenkins for securing the most walk-in conversions this week.',
    reactions: {
      thumbsUp: 24,
      clap: 9,
      userThumbsUp: true,
      userClap: true
    },
    commentsCount: 12,
    department: 'Sales',
    comments: []
  }
];

export const calendarEventsMock: CalendarEvent[] = [
  {
    id: 'ev-1',
    time: '10:30 AM',
    title: 'Sales Review',
    location: 'Conference Room A',
    isLink: false,
    category: 'review'
  },
  {
    id: 'ev-2',
    time: '12:00 PM',
    title: 'Design Review',
    location: 'Zoom link',
    isLink: true,
    linkUrl: 'https://zoom.us/j/demo-hallway-review',
    category: 'meeting'
  }
];

export const actionItemsMock: ActionItem[] = [
  {
    id: 'act-1',
    title: 'Lead follow-ups',
    count: 7,
    badgeColor: '#1E293B',
    urgent: true,
    items: [
      { id: 'l1', name: 'Sarjapura Phase 3 Walk-in (Mr. Arvind)', detail: 'High intent VIP prospect', done: false },
      { id: 'l2', name: 'Koramangala Commercial Space #402', detail: 'Negotiation stage pricing review', done: false }
    ]
  },
  {
    id: 'act-2',
    title: 'Approvals waiting',
    count: 2,
    badgeColor: '#EF4444',
    urgent: true,
    items: [
      { id: 'ap1', name: 'Deal #4828 Discount Waiver (Rahul S.)', detail: 'Special 1.5% end-of-month commercial waiver', done: false }
    ]
  }
];

export const leaderboardMembersMock: LeaderboardMember[] = [
  {
    rank: 1,
    id: 'm1',
    name: 'Sarah Jenkins',
    role: 'Enterprise AE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    revenue: 1200000,
    revenueFormatted: '$1.2M',
    bookings: 14,
    conversionRate: 95,
    trend: 'up'
  },
  {
    rank: 2,
    id: 'm2',
    name: 'Marcus Wei',
    role: 'Mid-Market AE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    revenue: 840000,
    revenueFormatted: '$840K',
    bookings: 22,
    conversionRate: 82,
    trend: 'up'
  },
  {
    rank: 3,
    id: 'm3',
    name: 'Elena Rostova',
    role: 'Enterprise SE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    revenue: 750000,
    revenueFormatted: '$750K',
    bookings: 9,
    conversionRate: 78,
    trend: 'steady'
  }
];

export const leaderboardTeamsMock: LeaderboardTeam[] = [
  {
    rank: 1,
    id: 't1',
    teamName: 'Alpha Squad',
    leadName: 'Michael Vance',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    totalRevenue: '$12.4M',
    dealsClosed: 84,
    winRate: 89.4
  }
];

export const individualRecordsMock: IndividualRecord[] = [
  {
    id: 'rec-1',
    title: 'Highest Single Booking',
    holderName: 'Sarah Jenkins',
    holderRole: 'Enterprise AE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    value: '$4.2M',
    subValue: 'Enterprise Deal - Q3 2023',
    department: 'Sales',
    dateAwarded: 'Sep 2023',
    verified: true,
    description: 'Closed the multi-tower commercial lease with Prestige Global Infrastructure.'
  },
  {
    id: 'rec-2',
    title: 'Fastest Deal Close',
    holderName: 'Marcus Chen',
    holderRole: 'Mid-Market AE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    value: '14 Days',
    subValue: 'Initial Contact to Signed',
    department: 'Sales',
    dateAwarded: 'Aug 2023',
    verified: true,
    description: 'Completed discovery, proposal, legal verification, and escrow deposit in under 14 days.'
  },
  {
    id: 'rec-3',
    title: 'Highest Customer Rating',
    holderName: 'Elena Rodriguez',
    holderRole: 'Client Success Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    value: '4.99/5',
    subValue: 'Over 300+ Reviews',
    department: 'Operations',
    dateAwarded: 'Oct 2023',
    verified: true,
    description: 'Maintained near-flawless CSAT scores across all luxury and enterprise buyer handovers.'
  },
  {
    id: 'rec-4',
    title: 'Sales Execution Streak',
    holderName: 'David Kim',
    holderRole: 'Growth AE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    value: '412 Days',
    subValue: 'Active Streak',
    department: 'Sales',
    dateAwarded: 'Ongoing',
    verified: true,
    description: 'Achieved consecutive weekly conversion milestones without missing target for 58 straight weeks.'
  }
];

export const teamRecordsMock: TeamRecord[] = [
  {
    id: 'trec-1',
    teamName: 'Alpha Squad',
    leadName: 'Led by Michael Vance',
    value: '$12.4M',
    metricLabel: 'Highest Quarterly Revenue',
    department: 'Sales',
    verified: true
  }
];

export const designProjectsMock: DesignProject[] = [
  {
    id: 'des-201',
    projectName: 'Sarjapura Penthouse Luxury 3D Visualization',
    clientName: 'Prestige Global',
    stage: '3D Staging',
    designer: 'Maya Lin',
    renderThumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&auto=format&fit=crop&q=80',
    progress: 75,
    deadline: 'Tomorrow, 5 PM'
  },
  {
    id: 'des-202',
    projectName: 'Whitefield Skydeck Executive Floor Plan',
    clientName: 'AeroSpace Tech',
    stage: 'Material Selection',
    designer: 'Maya Lin',
    renderThumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&auto=format&fit=crop&q=80',
    progress: 90,
    deadline: 'Oct 28'
  }
];
