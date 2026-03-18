import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ ok:true, message:'Starter checkout endpoint created. Connect Stripe / Lemon Squeezy / Creem in production.', price:99, currency:'CNY' });
}