'use client';
import { useState } from 'react';
export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div style={{maxWidth:480,margin:'60px auto',padding:24}}>
      <h1>YONI Founder Access</h1>
      <p>Hidden founder entry. Not visible to ordinary users.</p>
      <input value={secret} onChange={e=>setSecret(e.target.value)} placeholder="Admin secret" style={{width:'100%',padding:12,borderRadius:12,border:'1px solid #ddd'}} />
      <button onClick={async ()=>{
        const res = await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret})});
        const data = await res.json();
        setMsg(data.message || 'ok');
        if (data.ok) window.location.href = '/admin/dashboard';
      }} style={{marginTop:12,padding:'12px 16px',borderRadius:12,border:'1px solid #111',background:'#111',color:'#fff'}}>Login</button>
      <div style={{marginTop:12}}>{msg}</div>
    </div>
  );
}