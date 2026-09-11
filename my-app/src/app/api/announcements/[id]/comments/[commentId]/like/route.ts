import { NextResponse } from 'next/server';
import { toggleCommentLike } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string; commentId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id, commentId } = await context.params;
    const comment = await toggleCommentLike(id, commentId);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment });
  } catch (err: any) {
    console.error('Error toggling comment like:', err);
    return NextResponse.json(
      { error: 'Failed to update comment like', details: err.message },
      { status: 500 }
    );
  }
}
