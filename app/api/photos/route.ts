import { NextRequest, NextResponse } from 'next/server';
import { store, uid, today } from '@/lib/store';
export async function GET() { return NextResponse.json({ photos: store.photos }); }
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (store.settings.memorialMode) return NextResponse.json({ ok:false, message:'Uploads are disabled in memorial mode.' }, { status:403 });
  const item = { id: uid('photo'), url: body.url || 'https://picsum.photos/seed/' + Math.random().toString(36).slice(2,8) + '/800/800', date: today(), coord: body.coord || `W-${Math.floor(Math.random()*900)+100}`, createdAt: new Date().toISOString() };
  store.photos.unshift(item);
  return NextResponse.json({ ok:true, photo:item });
}