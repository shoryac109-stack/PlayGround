export const ATTR = {
  FIRE: { label: '炎', c1: '#ff7a3d', c2: '#521508', glow: '#ffb36b' },
  WATER: { label: '水', c1: '#3ec9ff', c2: '#082a5c', glow: '#9be8ff' },
  EARTH: { label: '地', c1: '#7ee08a', c2: '#17401f', glow: '#c9ffb0' },
  WIND: { label: '風', c1: '#5ef0c8', c2: '#0a3d38', glow: '#b8fff0' },
  LIGHT: { label: '光', c1: '#ffe08a', c2: '#6b470c', glow: '#fff5c2' },
  DARK: { label: '闇', c1: '#c084fc', c2: '#320b55', glow: '#f0c8ff' },
  SPELL: { label: '魔法', c1: '#6ee7ff', c2: '#082c48', glow: '#d0f8ff' },
  TRAP: { label: '罠', c1: '#fb7185', c2: '#450d22', glow: '#ffd0d8' }
};

export const CARD_DEFS = {
  starflame: {
    name: '星焔のドラゴン', en: 'STARFLAME DRAGON', kind: 'monster', attr: 'FIRE', level: 6, atk: 2400, def: 1800,
    art: 'dragon', effect: 'summonBurn', value: 500, text: '召喚時、相手に500ダメージを与える。'
  },
  siren: {
    name: '蒼海のセイレーン', en: 'ABYSS SIREN', kind: 'monster', attr: 'WATER', level: 4, atk: 1600, def: 1200,
    art: 'siren', effect: 'summonHeal', value: 500, text: '召喚時、自分のライフを500回復する。'
  },
  guardian: {
    name: '森羅の守護獣', en: 'VERDANT GUARDIAN', kind: 'monster', attr: 'EARTH', level: 4, atk: 1400, def: 2000,
    art: 'guardian', effect: 'none', text: '古き森を守る霊獣。高い守備力を持つ。'
  },
  knight: {
    name: '雷鳴の騎士', en: 'THUNDER KNIGHT', kind: 'monster', attr: 'LIGHT', level: 4, atk: 1800, def: 1000,
    art: 'knight', effect: 'none', text: '雷をまとい戦場を駆ける騎士。'
  },
  ninja: {
    name: '影縫いの忍者', en: 'SHADOW STITCHER', kind: 'monster', attr: 'DARK', level: 3, atk: 1200, def: 800,
    art: 'ninja', effect: 'summonDraw', value: 1, text: '召喚時、カードを1枚ドローする。'
  },
  phoenix: {
    name: '天穹のフェニックス', en: 'SKYPHOENIX', kind: 'monster', attr: 'LIGHT', level: 5, atk: 2100, def: 1600,
    art: 'phoenix', effect: 'summonHeal', value: 800, text: '召喚時、自分のライフを800回復する。'
  },
  leviathan: {
    name: '深淵のリヴァイアサン', en: 'ABYSS LEVIATHAN', kind: 'monster', attr: 'WATER', level: 5, atk: 2200, def: 1800,
    art: 'leviathan', effect: 'none', text: '深淵より現れる巨大な海竜。'
  },
  swordsman: {
    name: '紅蓮の剣士', en: 'CRIMSON BLADE', kind: 'monster', attr: 'FIRE', level: 4, atk: 1700, def: 1200,
    art: 'swordsman', effect: 'none', text: '紅蓮の炎を宿す剣士。'
  },
  dancer: {
    name: '風精の踊り子', en: 'WIND SYLPH', kind: 'monster', attr: 'WIND', level: 3, atk: 1000, def: 1400,
    art: 'dancer', effect: 'summonBuffAll', value: 200, text: '召喚時、自分モンスター全体のATKを200上げる。'
  },
  wolf: {
    name: '月影の狼', en: 'MOONSHADE WOLF', kind: 'monster', attr: 'DARK', level: 4, atk: 1500, def: 1300,
    art: 'wolf', effect: 'piercing', text: '守備表示モンスターへの攻撃で貫通ダメージを与える。'
  },
  priest: {
    name: '聖光のプリースト', en: 'HALLOWED PRIEST', kind: 'monster', attr: 'LIGHT', level: 3, atk: 800, def: 1800,
    art: 'priest', effect: 'summonHeal', value: 800, text: '召喚時、自分のライフを800回復する。'
  },
  golem: {
    name: '大地のゴーレム', en: 'TERRA GOLEM', kind: 'monster', attr: 'EARTH', level: 5, atk: 2000, def: 2400,
    art: 'golem', effect: 'none', text: '大地の力を宿す巨岩の守護者。'
  },
  guidance: {
    name: '双星の導き', en: 'TWIN STAR GUIDANCE', kind: 'spell', attr: 'SPELL',
    art: 'guidance', effect: 'spellDraw2', text: 'カードを2枚ドローする。'
  },
  fountain: {
    name: '星の泉', en: 'STAR FOUNTAIN', kind: 'spell', attr: 'SPELL',
    art: 'fountain', effect: 'spellHeal', value: 1200, text: '自分のライフを1200回復する。'
  },
  meteor: {
    name: '流星群', en: 'METEOR SHOWER', kind: 'spell', attr: 'SPELL',
    art: 'meteor', effect: 'spellDestroy', text: '相手の攻撃力が最も高いモンスター1体を破壊する。'
  },
  roar: {
    name: '勇気の咆哮', en: 'ROAR OF COURAGE', kind: 'spell', attr: 'SPELL',
    art: 'roar', effect: 'spellBuff', value: 700, text: '自分モンスター1体のATKを700上げる。'
  },
  storm: {
    name: '魔力の嵐', en: 'ARCANE STORM', kind: 'spell', attr: 'SPELL',
    art: 'storm', effect: 'spellBurn', value: 800, text: '相手に800ダメージを与える。'
  },
  mirror: {
    name: '鏡の罠', en: 'MIRROR TRAP', kind: 'trap', attr: 'TRAP',
    art: 'mirror', effect: 'trapMirror', text: '相手の攻撃を無効にし、攻撃モンスターを破壊する。'
  },
  gravity: {
    name: '重力の枷', en: 'GRAVITY SHACKLE', kind: 'trap', attr: 'TRAP',
    art: 'gravity', effect: 'trapGravity', text: '相手の攻撃モンスターのATKを半分にして戦闘を続行する。'
  },
  counter: {
    name: '反撃の業火', en: 'COUNTER FLAME', kind: 'trap', attr: 'TRAP',
    art: 'counter', effect: 'trapCounter', value: 600, text: '相手の攻撃を無効にし、相手に600ダメージを与える。'
  }
};

export const DECK_LIST = [
  'starflame', 'siren', 'guardian', 'knight', 'ninja', 'phoenix',
  'leviathan', 'swordsman', 'dancer', 'wolf', 'priest', 'golem',
  'guidance', 'fountain', 'meteor', 'roar', 'storm',
  'mirror', 'gravity', 'counter'
];

export const OPPONENTS = [
  { name: '星詠みのルカ', initials: 'LR', tag: 'PLATINUM', hue: 268 },
  { name: '蒼刃のカイ', initials: 'KA', tag: 'DIAMOND', hue: 198 },
  { name: '紅蓮のミナ', initials: 'MN', tag: 'GOLD', hue: 16 },
  { name: '月影のシオン', initials: 'SH', tag: 'PLATINUM', hue: 286 },
  { name: '疾風のレン', initials: 'RN', tag: 'DIAMOND', hue: 158 },
  { name: '深淵のノア', initials: 'NO', tag: 'MASTER', hue: 224 }
];

const ART = {
  dragon: `
    <path d="M20 74 C26 62 38 58 42 48 C45 40 41 31 47 24 C54 15 68 18 73 29 C76 36 72 43 66 46 C78 50 85 62 80 74 C76 84 64 87 55 81 C50 78 46 73 39 72 C32 72 27 77 20 82 Z" fill="FG" opacity=".92" stroke="none"/>
    <path d="M50 30 C56 33 60 40 57 47 C54 54 45 55 41 48 C37 41 42 32 50 30 Z" fill="BG" opacity=".75" stroke="none"/>
    <path d="M64 34 L88 18 L82 46 Z" fill="FG" opacity=".5" stroke="none"/>
    <path d="M28 48 L8 34 L18 58 Z" fill="FG" opacity=".4" stroke="none"/>
    <circle cx="60" cy="36" r="2.4" fill="#fff" stroke="none"/>
    <path d="M30 78 C44 68 58 70 72 78" fill="none" stroke="#fff" stroke-opacity=".35"/>
  `,
  siren: `
    <path d="M12 72 Q26 58 40 72 T68 72 T92 72" fill="none" stroke="FG" stroke-width="2.2" stroke-opacity=".8"/>
    <path d="M12 80 Q30 68 48 80 T84 80" fill="none" stroke="FG" stroke-width="1.2" stroke-opacity=".4"/>
    <path d="M50 22 C57 22 61 28 60 36 L65 64 L35 64 L40 36 C39 28 43 22 50 22 Z" fill="FG" opacity=".9" stroke="none"/>
    <path d="M50 26 C44 26 42 34 44 40 C38 44 34 52 36 60 L64 60 C66 52 62 44 56 40 C58 34 56 26 50 26 Z" fill="BG" opacity=".65" stroke="none"/>
    <path d="M42 38 Q50 32 58 38" fill="none" stroke="#fff" stroke-opacity=".6"/>
    <circle cx="50" cy="40" r="1.8" fill="#fff" stroke="none"/>
    <path d="M28 50 Q20 44 18 34 M72 50 Q80 44 82 34" fill="none" stroke="FG" stroke-opacity=".6"/>
  `,
  guardian: `
    <path d="M50 24 L58 40 L54 66 L46 66 L42 40 Z" fill="FG" stroke="none"/>
    <path d="M50 40 C38 30 26 38 26 50 C26 62 38 68 50 62 C62 68 74 62 74 50 C74 38 62 30 50 40 Z" fill="FG" opacity=".55" stroke="none"/>
    <path d="M50 58 L42 82 M50 58 L58 82 M50 64 L38 76 M50 64 L62 76" fill="none" stroke="FG" stroke-width="2" stroke-opacity=".7"/>
    <circle cx="38" cy="48" r="2" fill="#fff" stroke="none"/>
    <circle cx="62" cy="44" r="1.5" fill="#fff" stroke="none"/>
  `,
  knight: `
    <path d="M50 20 L68 30 L68 52 L50 64 L32 52 L32 30 Z" fill="FG" opacity=".75" stroke="none"/>
    <path d="M50 30 L60 36 L60 50 L50 58 L40 50 L40 36 Z" fill="BG" opacity=".8" stroke="none"/>
    <path d="M42 42 L58 42 M50 36 L50 52" stroke="#fff" stroke-opacity=".7"/>
    <path d="M22 76 L78 20 M78 76 L22 20" stroke="FG" stroke-width="2.4" stroke-opacity=".5"/>
  `,
  ninja: `
    <path d="M28 50 C28 34 38 24 50 24 C62 24 72 34 72 50 C72 64 62 72 50 72 C38 72 28 64 28 50 Z" fill="FG" opacity=".8" stroke="none"/>
    <path d="M30 46 Q50 38 70 46 L70 52 Q50 44 30 52 Z" fill="BG" opacity=".9" stroke="none"/>
    <path d="M36 48 L46 50 M54 50 L64 48" stroke="#fff" stroke-width="2.4"/>
    <path d="M50 68 L42 84 M50 68 L58 84" stroke="FG" stroke-opacity=".7"/>
    <path d="M22 58 Q30 68 40 64" fill="none" stroke="FG" stroke-opacity=".5"/>
  `,
  phoenix: `
    <path d="M50 30 C42 18 20 20 14 40 C26 40 34 46 38 56 C30 54 22 58 18 66 C32 70 42 64 50 58 C58 64 68 70 82 66 C78 58 70 54 62 56 C66 46 74 40 86 40 C80 20 58 18 50 30 Z" fill="FG" opacity=".8" stroke="none"/>
    <path d="M50 38 C54 44 54 54 50 62 C46 54 46 44 50 38 Z" fill="#fff" opacity=".65" stroke="none"/>
    <path d="M50 62 L44 82 M50 62 L56 82" stroke="FG" stroke-opacity=".6"/>
  `,
  leviathan: `
    <path d="M20 76 C14 62 26 50 40 54 C54 58 46 72 58 74 C72 76 80 64 76 50 C72 36 56 34 50 44 C44 54 56 58 62 50" fill="none" stroke="FG" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M76 50 C84 44 88 34 82 26 C76 18 64 20 62 30 C60 40 70 44 76 38" fill="none" stroke="FG" stroke-width="2.4" stroke-opacity=".7"/>
    <circle cx="78" cy="30" r="1.8" fill="#fff" stroke="none"/>
    <path d="M20 76 L10 84 M28 72 L22 84" stroke="FG" stroke-opacity=".6"/>
  `,
  swordsman: `
    <path d="M26 78 L74 22 M30 26 L78 74" stroke="FG" stroke-width="3" stroke-linecap="round"/>
    <path d="M18 70 L30 82 M70 82 L82 70" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <circle cx="50" cy="50" r="10" fill="BG" opacity=".8" stroke="FG"/>
    <path d="M50 40 L50 60 M40 50 L60 50" stroke="#fff" stroke-opacity=".7"/>
  `,
  dancer: `
    <path d="M30 78 C22 60 34 46 48 40 C62 34 76 40 78 54 C80 68 68 78 56 74 C46 70 44 58 52 52 C60 46 70 52 68 60" fill="none" stroke="FG" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M50 20 C56 20 60 26 58 32 C56 38 48 40 44 34 C40 28 44 20 50 20 Z" fill="FG" opacity=".9" stroke="none"/>
    <path d="M50 38 L46 52 M50 38 L56 50" stroke="FG" stroke-opacity=".7"/>
    <circle cx="22" cy="34" r="2" fill="#fff" stroke="none"/>
    <circle cx="80" cy="70" r="1.5" fill="#fff" stroke="none"/>
  `,
  wolf: `
    <path d="M28 30 L36 46 L64 46 L72 30 L78 58 L70 78 L50 70 L30 78 L22 58 Z" fill="FG" opacity=".85" stroke="none"/>
    <path d="M36 46 L30 54 L42 58 L50 50 L58 58 L70 54 L64 46 Z" fill="BG" opacity=".9" stroke="none"/>
    <circle cx="40" cy="56" r="2.2" fill="#fff" stroke="none"/>
    <circle cx="60" cy="56" r="2.2" fill="#fff" stroke="none"/>
    <path d="M46 64 L50 68 L54 64" fill="none" stroke="#fff" stroke-opacity=".7"/>
  `,
  priest: `
    <circle cx="50" cy="30" r="14" fill="none" stroke="FG" stroke-width="2"/>
    <path d="M50 22 L50 38 M42 30 L58 30" stroke="#fff" stroke-opacity=".7"/>
    <path d="M50 44 C42 44 36 52 36 62 L36 76 L64 76 L64 62 C64 52 58 44 50 44 Z" fill="FG" opacity=".8" stroke="none"/>
    <path d="M28 24 L28 80 M22 34 L34 34" stroke="FG" stroke-opacity=".5"/>
  `,
  golem: `
    <rect x="28" y="34" width="44" height="34" rx="6" fill="FG" opacity=".8" stroke="none"/>
    <rect x="20" y="44" width="10" height="26" rx="4" fill="FG" opacity=".6" stroke="none"/>
    <rect x="70" y="44" width="10" height="26" rx="4" fill="FG" opacity=".6" stroke="none"/>
    <rect x="36" y="68" width="10" height="18" rx="4" fill="FG" opacity=".65" stroke="none"/>
    <rect x="54" y="68" width="10" height="18" rx="4" fill="FG" opacity=".65" stroke="none"/>
    <circle cx="42" cy="48" r="2.2" fill="#fff" stroke="none"/>
    <circle cx="58" cy="48" r="2.2" fill="#fff" stroke="none"/>
    <path d="M42 58 L58 58" stroke="#fff" stroke-opacity=".5"/>
  `,
  guidance: `
    <path d="M50 18 L56 40 L78 46 L56 52 L50 74 L44 52 L22 46 L44 40 Z" fill="FG" opacity=".85" stroke="none"/>
    <circle cx="28" cy="28" r="3" fill="#fff" stroke="none"/>
    <circle cx="74" cy="66" r="2" fill="#fff" stroke="none"/>
    <path d="M20 60 L34 60 M66 32 L80 32" stroke="FG" stroke-opacity=".5"/>
  `,
  fountain: `
    <path d="M50 22 C50 34 34 40 34 54 C34 66 42 76 50 78 C58 76 66 66 66 54 C66 40 50 34 50 22 Z" fill="FG" opacity=".7" stroke="none"/>
    <path d="M28 76 Q50 68 72 76" fill="none" stroke="FG" stroke-width="2"/>
    <path d="M36 58 Q50 50 64 58" fill="none" stroke="#fff" stroke-opacity=".5"/>
    <circle cx="50" cy="34" r="2" fill="#fff" stroke="none"/>
  `,
  meteor: `
    <path d="M22 24 L52 54 M30 16 L58 44 M14 34 L44 64" stroke="FG" stroke-width="2.4" stroke-opacity=".7"/>
    <circle cx="66" cy="66" r="14" fill="FG" opacity=".8" stroke="none"/>
    <circle cx="62" cy="62" r="4" fill="#fff" opacity=".65" stroke="none"/>
    <path d="M80 26 L86 20 M76 18 L78 12" stroke="#fff" stroke-opacity=".4"/>
  `,
  roar: `
    <path d="M26 50 C26 36 36 26 50 26 C64 26 74 36 74 50 C74 64 64 74 50 74 C36 74 26 64 26 50 Z" fill="FG" opacity=".55" stroke="none"/>
    <path d="M40 48 Q46 42 52 48 L56 44 L60 50 L56 56 L52 52 Q46 58 40 52 Z" fill="BG" opacity=".9" stroke="none"/>
    <path d="M16 34 L6 28 M16 50 L4 50 M16 66 L6 72" stroke="FG" stroke-width="2.4" stroke-opacity=".7"/>
    <path d="M84 34 L94 28 M84 50 L96 50 M84 66 L94 72" stroke="FG" stroke-width="2.4" stroke-opacity=".7"/>
  `,
  storm: `
    <path d="M56 12 L34 52 L50 52 L42 88 L68 44 L52 44 Z" fill="FG" opacity=".9" stroke="none"/>
    <path d="M24 24 L14 16 M20 46 L8 42 M78 70 L90 78" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
  `,
  mirror: `
    <path d="M30 20 L64 18 L74 48 L54 76 L24 54 Z" fill="FG" opacity=".35" stroke="FG"/>
    <path d="M36 28 L62 26 L68 46 L52 66 L32 50 Z" fill="BG" opacity=".55" stroke="none"/>
    <path d="M44 30 L54 48 L48 62" fill="none" stroke="#fff" stroke-opacity=".65"/>
    <path d="M20 82 L80 22" stroke="#fff" stroke-opacity=".2"/>
  `,
  gravity: `
    <circle cx="50" cy="50" r="26" fill="none" stroke="FG" stroke-width="2.4"/>
    <circle cx="50" cy="50" r="16" fill="none" stroke="FG" stroke-opacity=".6"/>
    <circle cx="50" cy="50" r="5" fill="FG" stroke="none"/>
    <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="FG" stroke-opacity=".5"/>
    <path d="M26 26 L34 34 M74 26 L66 34 M26 74 L34 66 M74 74 L66 66" stroke="FG" stroke-opacity=".35"/>
  `,
  counter: `
    <path d="M50 16 C44 30 34 34 34 48 C34 60 42 68 50 76 C58 68 66 60 66 48 C66 34 56 30 50 16 Z" fill="FG" opacity=".8" stroke="none"/>
    <path d="M50 34 C46 42 42 46 42 54 C42 62 46 66 50 70 C54 66 58 62 58 54 C58 46 54 42 50 34 Z" fill="#fff" opacity=".55" stroke="none"/>
    <path d="M20 30 L10 22 M80 30 L90 22" stroke="FG" stroke-opacity=".5" stroke-width="2"/>
  `,
  sigil: `
    <path d="M50 18 L58 42 L82 50 L58 58 L50 82 L42 58 L18 50 L42 42 Z" fill="FG" opacity=".8" stroke="none"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="FG" stroke-opacity=".4"/>
  `
};

let artSeq = 0;

export function number(value) {
  return Math.round(value).toLocaleString('en-US');
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

export function effAtk(card) {
  if (!card) return 0;
  if (card.battleAtkOverride !== null && card.battleAtkOverride !== undefined) {
    return Math.max(0, card.battleAtkOverride);
  }
  return Math.max(0, card.atk + (card.atkBoost || 0) + (card.tempAtk || 0));
}

export function effDef(card) {
  return Math.max(0, (card.def || 0) + (card.defBoost || 0));
}

function starDots(seed) {
  let dots = '';
  for (let i = 0; i < 18; i += 1) {
    const x = (i * 37 + seed * 13) % 100;
    const y = (i * 61 + seed * 7) % 100;
    const r = i % 4 === 0 ? 0.8 : 0.45;
    const opacity = 0.14 + (i % 5) * 0.07;
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="none" opacity="${opacity.toFixed(2)}"/>`;
  }
  return dots;
}

export function artSVG(card) {
  const uid = ++artSeq;
  const palette = ATTR[card.attr] || ATTR.SPELL;
  const shapes = ART[card.art] || ART.sigil;
  const body = shapes.replaceAll('FG', `url(#fg${uid})`).replaceAll('BG', `url(#bg${uid})`);
  return `<svg class="art-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="a${uid}" cx="50%" cy="34%" r="72%">
        <stop offset="0%" stop-color="${palette.c1}" stop-opacity=".58"/>
        <stop offset="52%" stop-color="${palette.c2}" stop-opacity=".9"/>
        <stop offset="100%" stop-color="#05060f"/>
      </radialGradient>
      <linearGradient id="fg${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.glow}"/>
        <stop offset="52%" stop-color="${palette.c1}"/>
        <stop offset="100%" stop-color="${palette.c2}"/>
      </linearGradient>
      <linearGradient id="bg${uid}" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stop-color="${palette.c2}"/>
        <stop offset="100%" stop-color="${palette.c1}"/>
      </linearGradient>
      <filter id="g${uid}" x="-45%" y="-45%" width="190%" height="190%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" fill="url(#a${uid})" stroke="none"/>
    <g>${starDots(uid)}</g>
    <circle cx="50" cy="50" r="36" fill="none" stroke="${palette.c1}" stroke-opacity=".18" stroke-width=".6"/>
    <g filter="url(#g${uid})">${body}</g>
    <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="${palette.c1}" stroke-opacity=".22"/>
  </svg>`;
}

export function cardFaceHTML(card) {
  const palette = ATTR[card.attr] || ATTR.SPELL;
  const monster = card.kind === 'monster';
  const stars = monster ? '★'.repeat(Math.min(card.level || 1, 6)) : '';
  const foot = monster
    ? `<span class="atk">ATK ${number(effAtk(card))}</span><span class="def">DEF ${number(effDef(card))}</span>`
    : `<span class="type-tag">${palette.label}</span><span>${card.kind === 'spell' ? 'SPELL' : 'TRAP'}</span>`;
  return `<div class="card-inner">
    <div class="card-head">
      <span class="card-name">${escapeHtml(card.name)}</span>
      ${monster ? `<span class="card-lv">${stars}</span>` : ''}
    </div>
    <div class="card-art">${artSVG(card)}</div>
    <div class="card-foot">${foot}</div>
  </div>`;
}

export function boardCardHTML(card) {
  if (card.faceDown) {
    return `<div class="card-back">
      <span class="back-emblem">✦</span>
      <span class="back-text">RUMUMA</span>
    </div><span class="tile-badge tile-badge--set">SET</span>`;
  }
  const monster = card.kind === 'monster';
  const defense = monster && card.position === 'defense';
  const stats = monster
    ? `<span class="atk">${number(effAtk(card))}</span><span class="def">${number(effDef(card))}</span>`
    : `<span>${card.kind === 'spell' ? 'SPELL' : 'TRAP'}</span><span>${ATTR[card.attr]?.label || ''}</span>`;
  return `<div class="tile-card ${card.attr} ${defense ? 'is-defense' : ''}">
    <div class="tile-art">${artSVG(card)}</div>
    <div class="tile-shade"></div>
    <div class="tile-name">${escapeHtml(card.name)}</div>
    <div class="tile-stats">${stats}</div>
  </div>${defense ? '<span class="tile-badge tile-badge--def">DEF</span>' : ''}`;
}
