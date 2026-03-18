import { NextRequest, NextResponse } from 'next/server';
import { inferStoryTags } from '@/lib/ncrisg';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const scene = String(body.scene || '');
  return NextResponse.json({ ok: true, tags: inferStoryTags(scene) });
}