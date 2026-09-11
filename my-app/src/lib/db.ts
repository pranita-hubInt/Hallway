import mysql, { Pool } from 'mysql2/promise';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Root@123',
  database: process.env.DB_NAME || 'hallway_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Global pool to avoid exhaustion in Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var _hallwayDbPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global._hallwayDbPool) {
    global._hallwayDbPool = mysql.createPool(DB_CONFIG);
  }
  return global._hallwayDbPool;
}

export const CATEGORY_COLORS: Record<string, string> = {
  announcement: '#EF4444',
  booking: '#10B981',
  quota: '#8B5CF6',
  performer: '#F59E0B',
  general: '#3B82F6'
};

export async function getAnnouncements() {
  const pool = getPool();
  const [rows] = await pool.query<any[]>(
    'SELECT * FROM announcements ORDER BY created_at DESC'
  );

  const announcements = [];
  for (const row of rows) {
    const [comments] = await pool.query<any[]>(
      'SELECT * FROM comments WHERE announcement_id = ? ORDER BY created_at DESC',
      [row.id]
    );

    let quotaProgress = null;
    if (row.quota_progress) {
      quotaProgress = typeof row.quota_progress === 'string' ? JSON.parse(row.quota_progress) : row.quota_progress;
    }

    let reactions = { thumbsUp: 0, clap: 0, heart: 0, userThumbsUp: false, userClap: false, userHeart: false };
    if (row.reactions) {
      reactions = typeof row.reactions === 'string' ? JSON.parse(row.reactions) : row.reactions;
    }

    announcements.push({
      id: row.id,
      type: row.type || 'announcement',
      categoryColor: row.category_color || CATEGORY_COLORS[row.type] || '#3B82F6',
      title: row.title,
      timestamp: row.timestamp_text || 'Just Now',
      createdAt: row.created_at,
      author: {
        name: row.author_name || 'Leadership',
        avatar: row.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        team: row.author_team || `${row.department || 'Sales'} Hub`
      },
      content: row.content,
      quotaProgress,
      reactions,
      commentsCount: comments.length,
      department: row.department || 'Sales',
      comments: comments.map((c) => ({
        id: c.id,
        authorName: c.author_name,
        authorHandle: c.author_handle,
        authorAvatar: c.author_avatar || '',
        authorRole: c.author_role || 'Team Member',
        content: c.content,
        timestamp: c.timestamp_text || 'Just now',
        createdAt: c.created_at,
        likes: c.likes || 0,
        userLiked: Boolean(c.user_liked)
      }))
    });
  }

  return announcements;
}

export async function getAnnouncementById(id: string) {
  const pool = getPool();
  const [rows] = await pool.query<any[]>('SELECT * FROM announcements WHERE id = ?', [id]);
  if (rows.length === 0) return null;

  const row = rows[0];
  const [comments] = await pool.query<any[]>(
    'SELECT * FROM comments WHERE announcement_id = ? ORDER BY created_at DESC',
    [row.id]
  );

  let quotaProgress = null;
  if (row.quota_progress) {
    quotaProgress = typeof row.quota_progress === 'string' ? JSON.parse(row.quota_progress) : row.quota_progress;
  }

  let reactions = { thumbsUp: 0, clap: 0, heart: 0, userThumbsUp: false, userClap: false, userHeart: false };
  if (row.reactions) {
    reactions = typeof row.reactions === 'string' ? JSON.parse(row.reactions) : row.reactions;
  }

  return {
    id: row.id,
    type: row.type || 'announcement',
    categoryColor: row.category_color || CATEGORY_COLORS[row.type] || '#3B82F6',
    title: row.title,
    timestamp: row.timestamp_text || 'Just Now',
    createdAt: row.created_at,
    author: {
      name: row.author_name || 'Leadership',
      avatar: row.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      team: row.author_team || `${row.department || 'Sales'} Hub`
    },
    content: row.content,
    quotaProgress,
    reactions,
    commentsCount: comments.length,
    department: row.department || 'Sales',
    comments: comments.map((c) => ({
      id: c.id,
      authorName: c.author_name,
      authorHandle: c.author_handle,
      authorAvatar: c.author_avatar || '',
      authorRole: c.author_role || 'Team Member',
      content: c.content,
      timestamp: c.timestamp_text || 'Just now',
      createdAt: c.created_at,
      likes: c.likes || 0,
      userLiked: Boolean(c.user_liked)
    }))
  };
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  type?: 'booking' | 'quota' | 'performer' | 'announcement' | 'general';
  categoryColor?: string;
  department?: string;
  author?: {
    name?: string;
    avatar?: string;
    team?: string;
  };
  quotaProgress?: {
    current: number;
    target: number;
    label: string;
    percentage: number;
  } | null;
}

export async function createAnnouncement(data: CreateAnnouncementInput) {
  const pool = getPool();
  const id = 'post-' + Date.now();
  const type = data.type || 'announcement';
  const categoryColor = data.categoryColor || CATEGORY_COLORS[type] || '#3B82F6';
  const authorName = data.author?.name || 'Leadership';
  const authorAvatar = data.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  const authorTeam = data.author?.team || `${data.department || 'HQ'} Hub`;
  const department = data.department || 'Sales';
  const reactions = { thumbsUp: 1, clap: 1, heart: 1, userThumbsUp: true, userClap: false, userHeart: false };
  const quotaProgressJson = data.quotaProgress ? JSON.stringify(data.quotaProgress) : null;

  await pool.query(
    `INSERT INTO announcements (
      id, type, category_color, title, timestamp_text,
      author_name, author_avatar, author_team,
      content, quota_progress, reactions, comments_count, department
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      type,
      categoryColor,
      data.title.trim(),
      'Just Now',
      authorName,
      authorAvatar,
      authorTeam,
      data.content.trim(),
      quotaProgressJson,
      JSON.stringify(reactions),
      0,
      department
    ]
  );

  return getAnnouncementById(id);
}

export async function addComment(
  announcementId: string,
  commentData: {
    content: string;
    authorName?: string;
    authorHandle?: string;
    authorAvatar?: string;
    authorRole?: string;
  }
) {
  const pool = getPool();
  const commentId = 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const name = commentData.authorName || 'Ranjith';
  const handle = commentData.authorHandle || name.toLowerCase().replace(/\s+/g, '.');

  await pool.query(
    `INSERT INTO comments (
      id, announcement_id, author_name, author_handle, author_avatar,
      author_role, content, timestamp_text, likes, user_liked
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      commentId,
      announcementId,
      name,
      handle,
      commentData.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      commentData.authorRole || 'CRM Lead',
      commentData.content.trim(),
      'Just now',
      0,
      0
    ]
  );

  await pool.query(
    'UPDATE announcements SET comments_count = (SELECT COUNT(*) FROM comments WHERE announcement_id = ?) WHERE id = ?',
    [announcementId, announcementId]
  );

  const announcement = await getAnnouncementById(announcementId);
  const newComment = announcement?.comments.find((c: any) => c.id === commentId);

  return { comment: newComment, announcement };
}

export async function toggleReaction(announcementId: string, reactionType: 'thumbsUp' | 'clap' | 'heart') {
  const pool = getPool();
  const [rows] = await pool.query<any[]>('SELECT reactions FROM announcements WHERE id = ?', [announcementId]);
  if (rows.length === 0) return null;

  const reactions = typeof rows[0].reactions === 'string'
    ? JSON.parse(rows[0].reactions)
    : (rows[0].reactions || { thumbsUp: 0, clap: 0, heart: 0 });

  const userKey = 'user' + reactionType.charAt(0).toUpperCase() + reactionType.slice(1);
  const currentVal = reactions[reactionType] || 0;
  const alreadyReacted = reactions[userKey];

  reactions[reactionType] = Math.max(0, currentVal + (alreadyReacted ? -1 : 1));
  reactions[userKey] = !alreadyReacted;

  await pool.query('UPDATE announcements SET reactions = ? WHERE id = ?', [
    JSON.stringify(reactions),
    announcementId
  ]);

  return reactions;
}

export async function toggleCommentLike(announcementId: string, commentId: string) {
  const pool = getPool();
  const [rows] = await pool.query<any[]>('SELECT likes, user_liked FROM comments WHERE id = ?', [commentId]);
  if (rows.length === 0) return null;

  const userLiked = !rows[0].user_liked;
  const likes = Math.max(0, (rows[0].likes || 0) + (userLiked ? 1 : -1));

  await pool.query('UPDATE comments SET likes = ?, user_liked = ? WHERE id = ?', [
    likes,
    userLiked ? 1 : 0,
    commentId
  ]);

  const [updated] = await pool.query<any[]>('SELECT * FROM comments WHERE id = ?', [commentId]);
  const c = updated[0];

  return {
    id: c.id,
    authorName: c.author_name,
    authorHandle: c.author_handle,
    authorAvatar: c.author_avatar,
    authorRole: c.author_role,
    content: c.content,
    timestamp: c.timestamp_text,
    likes: c.likes,
    userLiked: Boolean(c.user_liked)
  };
}
