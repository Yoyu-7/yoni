import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { store } from '@/lib/store';

export default async function Dashboard() {
  const c = cookies();
  if (c.get('yoni_admin')?.value !== 'true') redirect('/admin');
  return (
    <div style={{maxWidth:980,margin:'40px auto',padding:24}}>
      <h1>YONI Founder Dashboard</h1>
      <p>This is the hidden control layer for content, moderation, and platform switches.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        <div style={{padding:18,border:'1px solid #ddd',borderRadius:16}}>Memorial Mode: {String(store.settings.memorialMode)}</div>
        <div style={{padding:18,border:'1px solid #ddd',borderRadius:16}}>Photos: {store.photos.length}</div>
        <div style={{padding:18,border:'1px solid #ddd',borderRadius:16}}>Reports: {store.reports.length}</div>
        <div style={{padding:18,border:'1px solid #ddd',borderRadius:16}}>Users: {store.users.size}</div>
      </div>
    </div>
  );
}