export const QUESTION_BANK: Record<string, { key: string; cn: string; en: string }[]> = {
  relationship: [
    { key:'N', cn:'当对方开始降温，我的内在秩序会松掉。', en:'When the other person cools down, my inner order loosens.' },
    { key:'C', cn:'我会自动脑补最坏剧情。', en:'I automatically imagine the worst script.' },
    { key:'R', cn:'我很容易把价值感交给对方。', en:'I easily hand my worth to the other person.' },
    { key:'I', cn:'这不是我第一次进入这种关系形状。', en:'This is not the first time I entered this relationship pattern.' },
    { key:'S', cn:'我能控制投入节奏而不是被情绪推动。', en:'I can control my pace instead of being pushed by emotion.' }
  ],
  social: [
    { key:'N', cn:'别人一句评价会在我心里停留很久。', en:'A single comment stays inside me for too long.' },
    { key:'C', cn:'我会脑补别人怎么看我。', en:'I imagine what others think of me.' },
    { key:'R', cn:'我很在意自己在别人眼里的位置。', en:'I care deeply about my position in other people’s eyes.' },
    { key:'I', cn:'我常回到同一种关系位置。', en:'I often return to the same social position.' },
    { key:'S', cn:'我能在人际场里保持位置感。', en:'I can keep my position in social situations.' }
  ],
  work: [
    { key:'N', cn:'权威态度一变，我的系统立刻警觉。', en:'A change in authority tone triggers me fast.' },
    { key:'C', cn:'我会过度解读上级的措辞和停顿。', en:'I overread wording and pauses from authority.' },
    { key:'R', cn:'我会把工作评价当成自我价值证明。', en:'I use work evaluation as proof of self-worth.' },
    { key:'I', cn:'我会在权力关系里重复熟悉位置。', en:'I repeat familiar positions in power relationships.' },
    { key:'S', cn:'我知道如何和上级保持边界又不破坏合作。', en:'I know how to keep boundaries with authority without breaking cooperation.' }
  ],
  project: [
    { key:'N', cn:'项目波动时，我的系统也会过度摇晃。', en:'When the project shakes, my system shakes too.' },
    { key:'C', cn:'我会把一个坏信号放大成全局失败。', en:'I magnify one bad signal into total failure.' },
    { key:'R', cn:'项目成败强烈影响我对自己的评价。', en:'Project outcome strongly affects my self-evaluation.' },
    { key:'I', cn:'我会重复类似的决策错误。', en:'I repeat similar decision mistakes.' },
    { key:'S', cn:'我知道什么时候推进，什么时候止损。', en:'I know when to push and when to cut losses.' }
  ]
};

export const TRACKS: Record<string, string> = {
  N: 'Stabilize Track',
  C: 'Reframe Track',
  R: 'Identity Track',
  I: 'Pattern Track',
  S: 'Strategy Track'
};

export const NEXT_TRACK: Record<string, string> = {
  'Stabilize Track': 'Reframe Track',
  'Reframe Track': 'Identity Track',
  'Identity Track': 'Pattern Track',
  'Pattern Track': 'Strategy Track',
  'Strategy Track': 'Consolidation Track'
};

export function buildReport(scores: Record<string, number>, scenario: string) {
  const weakest = Object.entries(scores).sort((a,b)=>a[1]-b[1])[0]?.[0] || 'N';
  const currentTrack = TRACKS[weakest] || 'Stabilize Track';
  const nextTrack = NEXT_TRACK[currentTrack] || 'Reframe Track';

  const map: Record<string, any> = {
    N: {
      summary: 'The first thing collapsing is not the outside world. It is your inner system stability.',
      risk: 'You may let emotional pressure hijack judgment.',
      action: 'Reduce stimulation. Slow down. Restore rhythm before strategy.',
      causal: 'When N drops, interpretation, position, and strategy all get dragged down.'
    },
    C: {
      summary: 'The first distortion is not reality itself. It is your interpretation of reality.',
      risk: 'Automatic catastrophic thinking can distort action.',
      action: 'Separate evidence from projection. Return to facts.',
      causal: 'When C distorts, you act on imagined stories instead of reality.'
    },
    R: {
      summary: 'The first imbalance is self-value positioning.',
      risk: 'You may hand your worth to the outside world.',
      action: 'Rebuild internal value and boundaries before pushing forward.',
      causal: 'When R is unstable, feedback from others becomes a verdict on self-worth.'
    },
    I: {
      summary: 'The first issue is pattern repetition.',
      risk: 'You may unconsciously replay the same emotional script.',
      action: 'Identify the old pattern before trying a new move.',
      causal: 'When I repeats, the past keeps entering the present as if it were destiny.'
    },
    S: {
      summary: 'The first issue is strategy and timing.',
      risk: 'You may push, freeze, or retreat at the wrong time.',
      action: 'Rebuild timing, boundary, and investment rhythm.',
      causal: 'When S fails, even good intentions create poor results.'
    }
  };

  return { weakest, currentTrack, nextTrack, ...map[weakest], scenario, scores };
}

export function inferStoryTags(input: string) {
  const rules = [
    { keys:['angry','rage','shout','attack','骂','吼','愤怒'], tag:'Anger / 愤怒' },
    { keys:['money','use','benefit','利益','利用'], tag:'Interest / 利益' },
    { keys:['face','shame','面子','羞耻'], tag:'Face / 面子' },
    { keys:['authority','boss','parent','teacher','权威','上级','父母'], tag:'Authority / 权威' },
    { keys:['control','must','压迫','控制'], tag:'Control / 控制' },
    { keys:['leave','cold','ignore','抽离','冷淡'], tag:'Withdrawal / 抽离' }
  ];
  const text = input.toLowerCase();
  const tags = rules.filter(r=>r.keys.some(k=>text.includes(k.toLowerCase()))).map(r=>r.tag);
  return [...new Set(tags)].slice(0,4).length ? [...new Set(tags)].slice(0,4) : ['Authority / 权威','Control / 控制','Face / 面子'];
}