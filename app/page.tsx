'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { QUESTION_BANK, buildReport, inferStoryTags } from '@/lib/ncrisg';

type Lang = 'en' | 'zh';
type Panel = 'home' | 'test' | 'report' | 'story' | 'wall' | 'globe' | 'account' | 'about' | 'pay';

const founderStory = `YONI
我早已没有回头路
为照顾你
我离开了
爱人
家人 朋友

燃尽了 时间 精力
独行
内耗
自我怀疑
但唯独接住了一切对你的质疑

这不只是意志力
这是我们与所有不确定性的较量

——致YONI

YONI是谁？
是品牌吗？ 平台吗？
不。
她 是你自己。

这个平台从不是工具
它只是让你看见
最有生命力的你`;

const T = {
  en: {
    title: 'YONI — who are you',
    intro: 'Have you ever really felt yourself? Do you know where many of your sudden emotional reactions and unconscious behaviors come from?',
    startTest: 'Start Test',
    enterStory: 'Enter Scene Replay',
    joined: 'Joined',
    challenge: 'YONI Does Not Avoid Challenge',
    wall: 'Public Wall',
    globe: 'Global Globe',
    account: 'Account',
    about: 'About',
    pay: 'Value Exchange',
    terms: 'Terms',
    privacy: 'Privacy',
    disclaimer: 'Disclaimer',
    storyInput: 'Have you ever really felt yourself? Write your scene here...'
  },
  zh: {
    title: 'YONI — who are you',
    intro: '你感受过自己吗？你知道自己很多突然的情绪举动（个人无意识）都来自过去的哪里吗？',
    startTest: '开始测试',
    enterStory: '进入情景再现',
    joined: '加入人数',
    challenge: 'YONI 不回避质疑',
    wall: '公告墙',
    globe: '祈福地球',
    account: '账号',
    about: '关于',
    pay: '价值交换',
    terms: '用户协议',
    privacy: '隐私政策',
    disclaimer: '免责声明',
    storyInput: '你感受过自己吗？把你的经历写在这里……'
  }
};

const scenarioMap = {
  relationship: { en:'Relationship', zh:'情感' },
  social: { en:'Social', zh:'人际' },
  work: { en:'Workplace', zh:'上下级' },
  project: { en:'Project', zh:'项目' }
};

export default function Page() {
  const [lang, setLang] = useState<Lang>('en');
  const t = T[lang];
  const [panel, setPanel] = useState<Panel>('home');
  const [counter, setCounter] = useState(1000);
  const [scenario, setScenario] = useState<keyof typeof QUESTION_BANK>('relationship');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [report, setReport] = useState<any>(null);
  const [scene, setScene] = useState('');
  const [storyTags, setStoryTags] = useState<string[]>([]);
  const [storyEnding, setStoryEnding] = useState('YONI stays with you. The final decision is yours.');
  const [storyAnim, setStoryAnim] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [memorialMode, setMemorialMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const globeRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setCounter(v => v + Math.floor(Math.random() * 5) + 1), 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { document.body.classList.toggle('focused', focusMode); }, [focusMode]);

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(d=>setMemorialMode(!!d.memorialMode)).catch(()=>{});
    fetch('/api/photos').then(r=>r.json()).then(d=>setPhotos(d.photos || [])).catch(()=>{});
    const saved = localStorage.getItem('yoni_report');
    if (saved) setReport(JSON.parse(saved));
    const savedLang = localStorage.getItem('yoni_lang') as Lang | null;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => { localStorage.setItem('yoni_lang', lang); }, [lang]);

  useEffect(() => {
    const canvas = globeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const cities = [
      { x: 0.23, y: 0.33, name: 'New York', coord: 'NY-101' },
      { x: 0.56, y: 0.29, name: 'Paris', coord: 'PA-224' },
      { x: 0.72, y: 0.36, name: 'Tokyo', coord: 'TK-778' },
      { x: 0.67, y: 0.58, name: 'Singapore', coord: 'SG-412' },
      { x: 0.46, y: 0.67, name: 'Cape Town', coord: 'CT-509' },
    ];
    let r = 0;
    const loop = () => {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w/2; const cy = h/2; const radius = Math.min(w, h) * 0.28;
      const grad = ctx.createRadialGradient(cx-30, cy-30, 10, cx, cy, radius);
      grad.addColorStop(0, '#c7d9ff'); grad.addColorStop(0.45, '#9fb7ea'); grad.addColorStop(1, '#dce8ff');
      ctx.beginPath(); ctx.fillStyle = grad; ctx.arc(cx, cy, radius, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(30,41,59,.14)'; ctx.lineWidth = 1;
      for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.ellipse(cx, cy, radius, radius*(0.24 + Math.abs(i)*0.08), 0, 0, Math.PI*2); ctx.stroke(); }
      for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.ellipse(cx + Math.sin(r + i*0.4)*12, cy, radius*(0.24 + Math.abs(i)*0.08), radius, Math.PI/2, 0, Math.PI*2); ctx.stroke(); }
      cities.forEach((c, idx) => {
        const x = c.x * w + Math.sin(r + idx) * 4; const y = c.y * h;
        ctx.beginPath(); ctx.fillStyle = 'rgba(17,24,39,.9)'; ctx.arc(x, y, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.strokeStyle = 'rgba(17,24,39,.18)'; ctx.arc(x, y, 8 + Math.sin(r*2+idx)*2, 0, Math.PI*2); ctx.stroke();
      });
      r += 0.01; raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [panel]);

  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && ['u','s','c','x','a'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('contextmenu', onContext); document.removeEventListener('keydown', onKey); };
  }, []);

  const currentQuestions = useMemo(() => QUESTION_BANK[scenario], [scenario]);

  function handleScore(key: string, value: number) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  async function generateReport() {
    const scores: Record<string, number> = {};
    ['N','C','R','I','S'].forEach(k => { scores[k] = answers[k] ? answers[k] * 20 : 40; });
    const built = buildReport(scores, scenario);
    setReport(built);
    localStorage.setItem('yoni_report', JSON.stringify(built));
    await fetch('/api/report', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(built) }).catch(()=>{});
    setPanel('report');
  }

  function chooseEnding(choice: string) {
    const map: Record<string, any> = {
      protect: { anim:'animProtect', en:'Protection is not weakness. It is how you take control back first.', zh:'保护不是软弱，而是先拿回主导权。' },
      fight: { anim:'animFight', en:'This is not impulsive revenge. It is a boundary becoming visible.', zh:'这不是失控反扑，而是边界开始显形。' },
      freeze: { anim:'animFreeze', en:'The old script takes over. Fear expands. This is not failure. It is data.', zh:'旧脚本接管，恐惧扩大。这不是失败，这是数据。' },
      leave: { anim:'animLeave', en:'You do not abandon yourself. You exit pressure and recover choice.', zh:'你不是逃避，而是退出高压，拿回选择权。' }
    };
    setStoryAnim(map[choice].anim);
    setStoryEnding(lang === 'en' ? map[choice].en : map[choice].zh);
  }

  async function loadScene() {
    const tags = inferStoryTags(scene);
    setStoryTags(tags);
    setStoryAnim('');
    setStoryEnding(lang === 'en'
      ? `Scene loaded. The other side may be driven by ${tags.join(' / ')}. YONI stays with you. Your choice is still yours.`
      : `场景已载入。对方此刻可能被 ${tags.join(' / ')} 驱动。YONI 会陪你进去，但选择仍然是你的。`
    );
    await fetch('/api/story', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ scene, tags }) }).catch(()=>{});
  }

  async function toggleMemorialMode() {
    const next = !memorialMode;
    setMemorialMode(next);
    await fetch('/api/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ memorialMode: next }) }).catch(()=>{});
  }

  return (
    <div className="container">
      <div className="watermark">YONI · creator protected</div>

      <div className="focusMode">
        <button className="focusBtn" onClick={() => setFocusMode(v => !v)}>{lang === 'en' ? 'Detach' : '抽离'}</button>
        <button className="focusBtn" onClick={() => setPanel('home')}>{lang === 'en' ? 'Calm' : '静心'}</button>
      </div>

      <div className="topbar">
        <div className="brand">
          <div className="brandIcon">Y</div>
          <div>
            <div className="brandTitle">YONI</div>
            <div className="brandSub">{lang === 'en' ? 'YOU ARE NOT FIXED' : '你不被定义'}</div>
          </div>
        </div>

        <div className="nav">
          <button className="tinySwitch" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}>{lang === 'en' ? '中文' : 'EN'}</button>
          {[
            ['home', 'Home'],
            ['test', lang === 'en' ? 'Test' : '测试'],
            ['report', lang === 'en' ? 'Report' : '报告'],
            ['story', 'Lab'],
            ['wall', t.wall],
            ['globe', t.globe],
            ['account', t.account],
            ['about', t.about],
            ['pay', t.pay]
          ].map(([id,label])=>(
            <button key={id} className={`navBtn ${panel===id?'active':''}`} onClick={()=>setPanel(id as Panel)}>{label}</button>
          ))}
        </div>
      </div>

      <section className={`panel ${panel==='home'?'active':''}`}>
        <div className="hero">
          <div className="heroGrid">
            <div>
              <div className="tag">YONI · {lang === 'en' ? 'You are not fixed' : '你不被定义'}</div>
              <h1>{t.title}</h1>
              <div className="sub">{t.intro}</div>

              <div className="notice" style={{marginTop:18}}>
                <strong style={{color:'var(--text-strong)'}}>YONI</strong><br />
                {lang === 'en'
                  ? 'The platform is not here to define you. It is here to identify your current position and move you forward.'
                  : '这个平台不是为了定义你，而是为了识别你当前的位置，并推动你继续向前。'}
              </div>

              <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:16}}>
                <button className="btn primary" onClick={()=>setPanel('test')}>{t.startTest}</button>
                <button className="btn ghost" onClick={()=>setPanel('story')}>{t.enterStory}</button>
              </div>
            </div>

            <div className="card soft">
              <div className="quote">{lang === 'en' ? '“A result is not a sentence. It is an entry point.”' : '“结果不是判决书，而是入口。”'}</div>
              <div className="divider" />
              <div className="grid3">
                <div className="kpiItem"><strong>5</strong><span className="small">NCRISG Variables</span></div>
                <div className="kpiItem"><strong>99</strong><span className="small">Member Tier</span></div>
                <div className="kpiItem"><strong>{counter}</strong><span className="small">{t.joined}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid2 publicPanels">
          <div className="card">
            <h2>{t.joined}</h2>
            <div className="small">{lang === 'en' ? 'The active count starts from 1000 and grows automatically.' : '活动增加人数设定为 1000 起，并自动滚动递增。'}</div>
            <div className="divider" />
            <div className="counter">{counter.toLocaleString('en-US')}+</div>
          </div>

          <div className="card">
            <h2>{t.challenge}</h2>
            <div className="small">{lang === 'en' ? 'YONI does not avoid challenge. It identifies patterns, returns judgment to you, and stays neutral.' : 'YONI 不回避质疑。它识别模式，把判断权还给你，并保持中立。'}</div>
            <div className="divider" />
            <div className="small">{lang === 'en' ? 'No politics. No hate. No exploitation. Neutral by design.' : '不涉政、不站队、不歧视、不煽动，平台设计上保持中立。'}</div>
          </div>
        </div>

        <div className="card publicPanels">
          <h2>{lang === 'en' ? 'Brand Story' : '品牌故事'}</h2>
          <div className="storyline">{founderStory}</div>
        </div>
      </section>

      <section className={`panel ${panel==='test'?'active':''}`}>
        <div className="card">
          <h2>{lang === 'en' ? 'Category Test' : '分类测试'}</h2>
          <div className="scenarioRow">
            {Object.entries(scenarioMap).map(([key,val])=>(
              <button key={key} className={`scenarioBtn ${scenario===key?'active':''}`} onClick={()=>setScenario(key as any)}>
                {lang === 'en' ? val.en : val.zh}
              </button>
            ))}
          </div>
          <div className="questionList">
            {currentQuestions.map((q, idx)=>(
              <div key={idx} className="questionCard">
                <div className="qcn">Q{idx+1} · {q.key} {lang === 'en' ? q.en : q.cn}</div>
                <div className="qen">{lang === 'en' ? q.cn : q.en}</div>
                <div className="scoreRow">
                  {[1,2,3,4,5].map(v=>(
                    <button key={v} className={`scoreBtn ${answers[q.key]===v?'active':''}`} onClick={()=>handleScore(q.key, v)}>{v}</button>
                  ))}
                </div>
                <div className="hrBlue" />
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
            <button className="btn primary" onClick={generateReport}>{lang === 'en' ? 'Generate Report' : '生成报告'}</button>
            <button className="btn" onClick={()=>{setAnswers({}); setReport(null); localStorage.removeItem('yoni_report');}}>{lang === 'en' ? 'Reset' : '重置'}</button>
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='report'?'active':''}`}>
        <div className="grid2">
          <div className="reportBox">
            <h2>{lang === 'en' ? 'Current Portrait' : '当前结构画像'}</h2>
            <div className="small">{report ? `${lang === 'en' ? 'Scenario' : '分类'}: ${scenarioMap[report.scenario as keyof typeof scenarioMap]?.[lang] || report.scenario}` : (lang === 'en' ? 'Finish the test first.' : '请先完成测试。')}</div>
            <div className="divider" />
            {report ? Object.entries(report.scores).map(([k,v]: any)=>(
              <div key={k} style={{marginBottom:12}}>
                <div><strong>{k}</strong> {v}</div>
                <div className="bar"><div className="fill" style={{width:`${v}%`}} /></div>
              </div>
            )) : <div className="small">{lang === 'en' ? 'No report yet.' : '暂无报告。'}</div>}
          </div>
          <div className="reportBox">
            <h2>{lang === 'en' ? 'Current Track' : '当前轨道'}</h2>
            {report ? <div className="small"><p><strong>{report.currentTrack}</strong></p><p>{lang === 'en' ? 'Next track:' : '下一轨道：'} {report.nextTrack}</p><p>{report.summary}</p></div> : <div className="small">{lang === 'en' ? 'Track appears after report generation.' : '生成报告后显示轨道。'}</div>}
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='story'?'active':''}`}>
        <div className="storyGrid">
          <div className="card">
            <h2>{lang === 'en' ? 'Scene Replay Engine' : '情景再现引擎'}</h2>
            <textarea className="textarea" value={scene} onChange={e=>setScene(e.target.value)} placeholder={t.storyInput} />
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
              <button className="btn primary" onClick={loadScene}>{lang === 'en' ? 'Load Scene' : '载入场景'}</button>
              <button className="btn" onClick={()=>{setScene(''); setStoryTags([]); setStoryEnding(lang === 'en' ? 'YONI stays with you. The final decision is yours.' : 'YONI 会陪你进去，但最后做决定的是你。'); setStoryAnim('');}}>{lang === 'en' ? 'Reset Scene' : '重置剧情'}</button>
            </div>
            <div className="divider" />
            <h3>{lang === 'en' ? 'Opponent Tags' : '对方状态标签'}</h3>
            <div className="statusTags">{storyTags.length ? storyTags.map(tag => <span key={tag} className="statusTag">{tag}</span>) : <span className="statusTag">{lang === 'en' ? 'Waiting for input' : '等待输入场景'}</span>}</div>
            <div className="divider" />
            <h3>{lang === 'en' ? 'Choices' : '你的选择'}</h3>
            <div className="choiceGrid">
              <button className="choiceBtn" onClick={()=>chooseEnding('protect')}><strong>{lang === 'en' ? 'Protect' : '保护自己'}</strong><span>{lang === 'en' ? 'Stabilize first.' : '先稳住自己。'}</span></button>
              <button className="choiceBtn" onClick={()=>chooseEnding('fight')}><strong>{lang === 'en' ? 'Resist' : '反抗'}</strong><span>{lang === 'en' ? 'Make boundary visible.' : '让边界显形。'}</span></button>
              <button className="choiceBtn" onClick={()=>chooseEnding('freeze')}><strong>{lang === 'en' ? 'Freeze' : '僵住'}</strong><span>{lang === 'en' ? 'Observe the old script.' : '观察旧脚本。'}</span></button>
              <button className="choiceBtn" onClick={()=>chooseEnding('leave')}><strong>{lang === 'en' ? 'Leave' : '离开现场'}</strong><span>{lang === 'en' ? 'Exit pressure first.' : '先退出高压。'}</span></button>
            </div>
          </div>
          <div className="card">
            <h2>{lang === 'en' ? 'Scene Replay' : '情景再现'}</h2>
            <div className="stageShell">
              <div className={`stage ${storyAnim}`}>
                <div className="fearCloud" />
                <div className="shield" />
                <div className="floatLabels">{storyTags.map(tag => <div key={tag} className="floatPill">{tag}</div>)}</div>
                <div className="figure yoni"><div className="head" /><div className="bodyStick" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /><div className="figureName">YONI</div></div>
                <div className="figure other"><div className="head" /><div className="bodyStick" /><div className="arm left" /><div className="arm right" /><div className="leg left" /><div className="leg right" /><div className="figureName">{lang === 'en' ? 'Other' : '对方'}</div></div>
                <div className="ground" />
              </div>
              <div className="endingBox"><strong>{lang === 'en' ? 'Laboratory Output' : '实验室输出'}</strong><br /><br />{storyEnding}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='wall'?'active':''}`}>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <div>
              <h2>{memorialMode ? (lang === 'en' ? 'AI Memorial Mode' : 'AI 公益悼念模式') : (lang === 'en' ? 'Global Anonymous Photo Wall' : '全球匿名公用照片墙')}</h2>
              <div className="small">{memorialMode ? (lang === 'en' ? 'Upload disabled. Official memorial content only.' : '上传已关闭，仅展示官方悼念内容。') : (lang === 'en' ? 'Anonymous upload, daily archive, coordinate search.' : '匿名上传、每日归档、坐标搜索。')}</div>
            </div>
            <button className="btn" onClick={toggleMemorialMode}>{memorialMode ? (lang === 'en' ? 'Switch to Public Wall' : '切回公用墙') : (lang === 'en' ? 'Switch to Memorial' : '切到悼念模式')}</button>
          </div>
          <div className="divider" />
          <div className="wallGrid">
            {(photos.length ? photos : Array.from({length:12}).map((_,i)=>({ id:`demo-${i+1}`, url:`https://picsum.photos/seed/yoni${i+1}/400/400`, date:'2026-03-18', coord:`W-${100+i}` }))).map((p:any)=>(
              <div key={p.id} className="wallItem">
                <img src={p.url} alt="" />
                <div className="wallMeta">{p.date} · {p.coord}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='globe'?'active':''}`}>
        <div className="card">
          <h2>{lang === 'en' ? 'YONI Global Blessing Globe' : 'YONI 全球祈福地球'}</h2>
          <div className="globeShell">
            <canvas id="globeCanvas" ref={globeRef}></canvas>
            <div className="globeOverlay">
              <div className="globePill">{lang === 'en' ? 'Global neutral blessing mode' : '全球中立祈福模式'}</div>
              <div className="globePill">{lang === 'en' ? 'Anonymous light points enabled' : '匿名点灯已开启'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='account'?'active':''}`}>
        <div className="grid2">
          <div className="card">
            <h2>{lang === 'en' ? 'Register' : '注册'}</h2>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const email = String(fd.get('email') || '');
              const password = String(fd.get('password') || '');
              const name = String(fd.get('name') || '');
              const res = await fetch('/api/auth/register', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password,name})});
              const data = await res.json(); alert(data.message || 'ok');
            }} style={{display:'grid',gap:12}}>
              <input className="input" name="name" placeholder={lang === 'en' ? 'Name' : '昵称'} />
              <input className="input" type="email" name="email" placeholder="Email" />
              <input className="input" type="password" name="password" placeholder={lang === 'en' ? 'Password' : '密码'} />
              <button className="btn primary" type="submit">{lang === 'en' ? 'Create account' : '创建账号'}</button>
            </form>
          </div>
          <div className="card">
            <h2>{lang === 'en' ? 'Login' : '登录'}</h2>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const email = String(fd.get('email') || '');
              const password = String(fd.get('password') || '');
              const res = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})});
              const data = await res.json(); alert(data.message || 'ok');
            }} style={{display:'grid',gap:12}}>
              <input className="input" type="email" name="email" placeholder="Email" />
              <input className="input" type="password" name="password" placeholder={lang === 'en' ? 'Password' : '密码'} />
              <button className="btn primary" type="submit">{lang === 'en' ? 'Login' : '登录'}</button>
            </form>
          </div>
        </div>
      </section>

      <section className={`panel ${panel==='about'?'active':''}`}>
        <div className="card">
          <h2>{lang === 'en' ? 'About YONI' : '关于 YONI'}</h2>
          <div className="storyline">{founderStory}</div>
        </div>
      </section>

      <section className={`panel ${panel==='pay'?'active':''}`}>
        <div className="card soft">
          <h2>{lang === 'en' ? 'Value Exchange' : '价值交换'}</h2>
          <div className="storyline" style={{fontSize:36}}>
            {lang === 'en' ? 'We are only doing value exchange\n99 RMB for a new life script\nAre you willing?' : '我们只是在做价值交换\n99元买一个新的人生剧本\n你愿意吗'}
          </div>
          <div className="divider" />
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn primary" onClick={async ()=>{
              const res = await fetch('/api/pay/checkout', {method:'POST'});
              const data = await res.json();
              alert(data.message || 'checkout created');
            }}>{lang === 'en' ? 'Open 99 RMB membership' : '开通 99 元会员'}</button>
            <button className="btn ghost" onClick={()=>setPanel('home')}>{lang === 'en' ? 'Continue browsing' : '继续浏览'}</button>
          </div>
        </div>
      </section>

      <div className="footer">
        <div>YONI · {lang === 'en' ? 'You are not fixed' : '你不被定义'}</div>
        <div className="legalLinks">
          <a href="/legal/terms" target="_blank">{t.terms}</a>
          <a href="/legal/privacy" target="_blank">{t.privacy}</a>
          <a href="/legal/disclaimer" target="_blank">{t.disclaimer}</a>
        </div>
        <div className="copyright">
          © YONI / NCRISG. All content, structures, narratives, variable systems, interaction logic, archives, reports, and platform mechanisms are original works belonging to the creator. Unauthorized copying, scraping, reverse engineering, resale, commercial use, impersonation, or derivative reproduction is strictly prohibited. All legal rights are reserved. Infringement will be investigated.
        </div>
      </div>

      <a className="adminHiddenLink" href="/admin">admin</a>

      <div className="guide">
        <strong>YONI</strong>
        <div className="small">{lang === 'en' ? 'A hidden focus mode is available. Reduce noise and return to the core.' : '全站可一键抽离、静心，减少干扰，回到核心。'}</div>
        <button onClick={()=>setPanel('story')}>{lang === 'en' ? 'Enter lab' : '进入实验室'}</button>
      </div>
    </div>
  );
}