import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret = process.env.ADMIN_SECRET || 'change-me';
  if (body.secret !== secret) return NextResponse.json({ ok:false, message:'Unauthorized' }, { status:401 });
  const res = NextResponse.json({ ok:true, message:'Admin login ok' });
  res.cookies.set('yoni_admin', 'true', { httpOnly:true, sameSite:'lax', path:'/' });
  return res;
}