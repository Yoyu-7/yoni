import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
export async function GET() { return NextResponse.json(store.settings); }
export async function POST(req: NextRequest) {
  const body = await req.json();
  store.settings = { ...store.settings, ...body };
  return NextResponse.json({ ok: true, settings: store.settings });
}