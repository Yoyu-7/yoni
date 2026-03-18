import { NextRequest, NextResponse } from 'next/server';
import { store, uid } from '@/lib/store';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  if (!email) return NextResponse.json({ ok:false, message:'Email required' }, { status:400 });
  if (store.users.has(email)) return NextResponse.json({ ok:false, message:'User exists' }, { status:400 });
  store.users.set(email, { id: uid('user'), email, password: String(body.password || ''), name: String(body.name || ''), role:'user', member:false });
  return NextResponse.json({ ok:true, message:'Account created' });
}