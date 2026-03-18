import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const user = store.users.get(email);
  if (!user || user.password !== password) return NextResponse.json({ ok:false, message:'Invalid credentials' }, { status:401 });
  const res = NextResponse.json({ ok:true, message:'Logged in', user:{ email:user.email, name:user.name, member:user.member } });
  res.cookies.set('yoni_user', email, { httpOnly:true, sameSite:'lax', path:'/' });
  return res;
}