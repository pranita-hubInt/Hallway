import mysql, { Pool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@00',
  database: process.env.DB_NAME || 'hallway_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 2000
};

// Global pool to avoid exhaustion in Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var _hallwayDbPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _hallwayDbUnavailable: boolean | undefined;
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

// ==========================================
// Persistent JSON Storage Fallback
// ==========================================

function getStoragePath(): string {
  const custom = process.env.ANNOUNCEMENTS_FILE;
  if (custom) return custom;
  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'announcements.json'),
    path.join(process.cwd(), 'my-app', 'src', 'data', 'announcements.json'),
    path.join(__dirname, '..', 'data', 'announcements.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

function getSeedPath(): string {
  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'announcementsSeed.json'),
    path.join(process.cwd(), 'my-app', 'src', 'data', 'announcementsSeed.json'),
    path.join(__dirname, '..', 'data', 'announcementsSeed.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

function getJsonAnnouncements(): any[] {
  try {
    const storagePath = getStoragePath();
    if (fs.existsSync(storagePath)) {
      const content = fs.readFileSync(storagePath, 'utf-8');
      return JSON.parse(content);
    }
    const seedPath = getSeedPath();
    if (fs.existsSync(seedPath)) {
      const content = fs.readFileSync(seedPath, 'utf-8');
      const list = JSON.parse(content);
      saveJsonAnnouncements(list);
      return list;
    }
    return [];
  } catch (err) {
    console.error('Error reading JSON announcements:', err);
    return [];
  }
}

function saveJsonAnnouncements(data: any[]): boolean {
  try {
    const storagePath = getStoragePath();
    const dir = path.dirname(storagePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving JSON announcements:', err);
    return false;
  }
}

// ==========================================
// Database / Persistent CRUD Operations
// ==========================================

export async function getAnnouncements() {
  if (!global._hallwayDbUnavailable) {
    try {
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
    } catch (err: any) {
      console.warn('MySQL unavailable, using resilient JSON storage fallback:', err?.message || err);
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Read from persistent JSON storage
  return getJsonAnnouncements();
}

export async function getAnnouncementById(id: string) {
  if (!global._hallwayDbUnavailable) {
    try {
      const pool = getPool();
      const [rows] = await pool.query<any[]>('SELECT * FROM announcements WHERE id = ?', [id]);
      if (rows.length > 0) {
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
      return null;
    } catch {
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Read from JSON
  const list = getJsonAnnouncements();
  return list.find((a) => a.id === id) || null;
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
  const id = 'post-' + Date.now();
  const type = data.type || 'announcement';
  const categoryColor = data.categoryColor || CATEGORY_COLORS[type] || '#3B82F6';
  const authorName = data.author?.name || 'Leadership';
  const authorAvatar = data.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  const authorTeam = data.author?.team || `${data.department || 'HQ'} Hub`;
  const department = data.department || 'Sales';
  const reactions = { thumbsUp: 0, clap: 0, heart: 0, userThumbsUp: false, userClap: false, userHeart: false };
  const quotaProgressJson = data.quotaProgress ? JSON.stringify(data.quotaProgress) : null;
  const nowIso = new Date().toISOString();

  if (!global._hallwayDbUnavailable) {
    try {
      const pool = getPool();
      await pool.query(
        `INSERT INTO announcements (
          id, type, category_color, title, timestamp_text,
          author_name, author_avatar, author_team,
          content, quota_progress, reactions, comments_count, department, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          department,
          nowIso
        ]
      );

      const created = await getAnnouncementById(id);
      if (created) return created;
    } catch {
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Save to JSON
  const newPost = {
    id,
    type,
    categoryColor,
    title: data.title.trim(),
    timestamp: 'Just now',
    createdAt: nowIso,
    author: {
      name: authorName,
      avatar: authorAvatar,
      team: authorTeam
    },
    content: data.content.trim(),
    quotaProgress: data.quotaProgress || null,
    reactions,
    commentsCount: 0,
    department,
    comments: []
  };

  const list = getJsonAnnouncements();
  list.unshift(newPost);
  saveJsonAnnouncements(list);
  return newPost;
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
  const commentId = 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const name = commentData.authorName || 'Ranjith';
  const handle = commentData.authorHandle || name.toLowerCase().replace(/\s+/g, '.');
  const nowIso = new Date().toISOString();

  if (!global._hallwayDbUnavailable) {
    try {
      const pool = getPool();
      await ensureAnnouncementExists(pool, announcementId);

      await pool.query(
        `INSERT INTO comments (
          id, announcement_id, author_name, author_handle, author_avatar,
          author_role, content, timestamp_text, likes, user_liked, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          0,
          nowIso
        ]
      );

      await pool.query(
        'UPDATE announcements SET comments_count = (SELECT COUNT(*) FROM comments WHERE announcement_id = ?) WHERE id = ?',
        [announcementId, announcementId]
      );

      const announcement = await getAnnouncementById(announcementId);
      const newComment = announcement?.comments.find((c: any) => c.id === commentId);

      return { comment: newComment, announcement };
    } catch {
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Save to JSON
  const list = getJsonAnnouncements();
  let post = list.find((a) => a.id === announcementId);
  if (!post) {
    post = ensureJsonAnnouncement(announcementId);
  }
  if (!Array.isArray(post.comments)) post.comments = [];

  const newComment = {
    id: commentId,
    authorName: name,
    authorHandle: handle,
    authorAvatar: commentData.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: commentData.authorRole || 'CRM Lead',
    content: commentData.content.trim(),
    timestamp: 'Just now',
    createdAt: nowIso,
    likes: 0,
    userLiked: false
  };

  post.comments.unshift(newComment);
  post.commentsCount = post.comments.length;
  saveJsonAnnouncements(list);

  return { comment: newComment, announcement: post };
}

async function ensureAnnouncementExists(
  pool: Pool,
  id: string,
  defaults?: { title?: string; type?: string; authorName?: string; authorTeam?: string }
) {
  const [rows] = await pool.query<any[]>('SELECT id FROM announcements WHERE id = ?', [id]);
  if (rows.length === 0) {
    const nowIso = new Date().toISOString();
    const type = defaults?.type || 'booking';
    const title = defaults?.title || 'CRM Live Update';
    const categoryColor = CATEGORY_COLORS[type] || '#10B981';
    const initialReactions = { thumbsUp: 0, clap: 0, heart: 0, userThumbsUp: false, userClap: false, userHeart: false };
    await pool.query(
      `INSERT INTO announcements (
        id, type, category_color, title, timestamp_text,
        author_name, author_avatar, author_team,
        content, quota_progress, reactions, comments_count, department, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        type,
        categoryColor,
        title,
        'Live',
        defaults?.authorName || 'Sales Executive',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        defaults?.authorTeam || 'Sales Hub',
        'Live event synced from CRM.',
        null,
        JSON.stringify(initialReactions),
        0,
        'Sales',
        nowIso,
      ]
    );
  }
}

function ensureJsonAnnouncement(id: string, defaults?: { title?: string; type?: string }) {
  const list = getJsonAnnouncements();
  let post = list.find((a) => a.id === id);
  if (!post) {
    const nowIso = new Date().toISOString();
    const type = defaults?.type || 'booking';
    post = {
      id,
      type,
      categoryColor: CATEGORY_COLORS[type] || '#10B981',
      title: defaults?.title || 'CRM Live Update',
      timestamp: 'Live',
      createdAt: nowIso,
      author: {
        name: 'Sales Executive',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        team: 'Sales Hub',
      },
      content: 'Live event synced from CRM.',
      quotaProgress: null,
      reactions: { thumbsUp: 0, clap: 0, heart: 0, userThumbsUp: false, userClap: false, userHeart: false },
      commentsCount: 0,
      department: 'Sales',
      comments: [],
    };
    list.unshift(post);
    saveJsonAnnouncements(list);
  }
  return post;
}

export async function toggleReaction(announcementId: string, reactionType: 'thumbsUp' | 'clap' | 'heart') {
  if (!global._hallwayDbUnavailable) {
    try {
      const pool = getPool();
      await ensureAnnouncementExists(pool, announcementId);

      const [rows] = await pool.query<any[]>('SELECT reactions FROM announcements WHERE id = ?', [announcementId]);
      if (rows.length > 0) {
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
      return null;
    } catch {
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Toggle in JSON
  const list = getJsonAnnouncements();
  let post = list.find((a) => a.id === announcementId);
  if (!post) {
    post = ensureJsonAnnouncement(announcementId);
  }
  if (!post.reactions) post.reactions = { thumbsUp: 0, clap: 0, heart: 0 };

  const userKey = 'user' + reactionType.charAt(0).toUpperCase() + reactionType.slice(1);
  const currentVal = post.reactions[reactionType] || 0;
  const alreadyReacted = Boolean(post.reactions[userKey]);

  post.reactions[reactionType] = Math.max(0, currentVal + (alreadyReacted ? -1 : 1));
  post.reactions[userKey] = !alreadyReacted;

  saveJsonAnnouncements(list);
  return post.reactions;
}

export async function toggleCommentLike(announcementId: string, commentId: string) {
  if (!global._hallwayDbUnavailable) {
    try {
      const pool = getPool();
      const [rows] = await pool.query<any[]>('SELECT likes, user_liked FROM comments WHERE id = ?', [commentId]);
      if (rows.length > 0) {
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
      return null;
    } catch {
      global._hallwayDbUnavailable = true;
    }
  }

  // Fallback: Toggle in JSON
  const list = getJsonAnnouncements();
  const post = list.find((a) => a.id === announcementId);
  if (!post || !Array.isArray(post.comments)) return null;
  const comm = post.comments.find((c: any) => c.id === commentId);
  if (!comm) return null;

  const userLiked = !comm.userLiked;
  comm.likes = Math.max(0, (comm.likes || 0) + (userLiked ? 1 : -1));
  comm.userLiked = userLiked;

  saveJsonAnnouncements(list);
  return comm;
}
