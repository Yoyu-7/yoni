import { NextRequest, NextResponse } from 'next/server';
import { store, uid } from '@/lib/store';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = { id: uid('report'), ...body, createdAt: new Date().toISOString() };
  store.reports.push(item);
  return NextResponse.json({ ok: true, id: item.id });
}