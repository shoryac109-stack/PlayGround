(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const PALETTES = {
    fire: { a1: '#ff8a4c', a2: '#ffd166', a3: '#fff3c4', bg: 'radial-gradient(circle at 50% 30%, #6b1d12, #1a0608 72%)', glow: 'rgba(255,120,60,.55)' },
    water: { a1: '#54c8ff', a2: '#a5f3fc', a3: '#e0fbff', bg: 'radial-gradient(circle at 50% 30%, #0d3f68, #04101e 72%)', glow: 'rgba(60,180,255,.5)' },
    earth: { a1: '#a3e635', a2: '#fde68a', a3: '#f7ffd6', bg: 'radial-gradient(circle at 50% 30%, #2d4a12, #0a1405 72%)', glow: 'rgba(140,220,70,.45)' },
    light: { a1: '#fde68a', a2: '#fbbf24', a3: '#fffbe6', bg: 'radial-gradient(circle at 50% 30%, #6b5210, #1a1304 72%)', glow: 'rgba(255,210,90,.55)' },
    dark: { a1: '#c084fc', a2: '#7c3aed', a3: '#f3e8ff', bg: 'radial-gradient(circle at 50% 30%, #3a145e, #10031c 72%)', glow: 'rgba(170,90,255,.5)' },
    wind: { a1: '#34d399', a2: '#a7f3d0', a3: '#e9fff7', bg: 'radial-gradient(circle at 50% 30%, #0d4a38, #041610 72%)', glow: 'rgba(60,220,160,.45)' },
    spell: { a1: '#67e8f9', a2: '#a78bfa', a3: '#f0fdff', bg: 'radial-gradient(circle at 50% 30%, #123c52, #06101e 72%)', glow: 'rgba(90,220,255,.5)' },
    trap: { a1: '#fb7185', a2: '#f472b6', a3: '#ffe4ef', bg: 'radial-gradient(circle at 50% 30%, #52132e, #16040f 72%)', glow: 'rgba(255,80,140,.5)' }
  };

  const ATTR_LABEL = { fire: '炎', water: '水', earth: '地', light: '光', dark: '闇', wind: '風', spell: '魔法', trap: '罠' };

  const CARD_POOL = {
    flameDragon: { name: '紅蓮の竜騎', kind: 'monster', attribute: 'fire', race: 'ドラゴン', atk: 2400, def: 1800, level: 7, art: 'dragon', sigil: '炎' },
    seaSerpent: { name: '深淵のサーペント', kind: 'monster', attribute: 'water', race: '海竜', atk: 2300, def: 900, level: 6, art: 'serpent', sigil: '海' },
    volcanoGiant: { name: '火山の巨人', kind: 'monster', attribute: 'fire', race: '岩石', atk: 2500, def: 1200, level: 7, art: 'golem', sigil: '火' },
    abyssDemon: { name: '冥府の魔王', kind: 'monster', attribute: 'dark', race: '悪魔', atk: 2600, def: 2000, level: 8, art: 'demon', sigil: '冥' },
    goldenGolem: { name: '黄金のゴーレム', kind: 'monster', attribute: 'earth', race: '岩石', atk: 2200, def: 2400, level: 6, art: 'golem', sigil: '岩' },
    skyPhoenix: { name: '天空のフェニックス', kind: 'monster', attribute: 'fire', race: '鳥獣', atk: 2100, def: 1500, level: 6, art: 'phoenix', sigil: '天' },
    thunderBlade: { name: '雷鳴の剣士', kind: 'monster', attribute: 'light', race: '戦士', atk: 2000, def: 1200, level: 4, art: 'knight', sigil: '雷' },
    holyAngel: { name: '聖光の天使', kind: 'monster', attribute: 'light', race: '天使', atk: 1900, def: 1700, level: 4, art: 'angel', sigil: '光' },
    forestBeast: { name: '森の守護獣', kind: 'monster', attribute: 'earth', race: '獣', atk: 1800, def: 1400, level: 4, art: 'wolf', sigil: '森' },
    shadowMage: { name: '影の魔術師', kind: 'monster', attribute: 'dark', race: '魔法使い', atk: 1700, def: 1600, level: 4, art: 'mage', sigil: '影' },
    galeNinja: { name: '疾風の忍者', kind: 'monster', attribute: 'wind', race: '戦士', atk: 1600, def: 1000, level: 4, art: 'ninja', sigil: '風' },
    siren: { name: '蒼海のセイレーン', kind: 'monster', attribute: 'water', race: '海竜', atk: 1600, def: 2000, level: 4, art: 'siren', sigil: '歌' },
    moonWolf: { name: '月影の狼', kind: 'monster', attribute: 'dark', race: '獣', atk: 1500, def: 1100, level: 3, art: 'wolf', sigil: '月' },
    ironGuardian: { name: '鉄壁のガーディアン', kind: 'monster', attribute: 'earth', race: '岩石', atk: 1200, def: 2600, level: 4, art: 'golem', sigil: '壁' },
    starPriestess: { name: '星読みの巫女', kind: 'monster', attribute: 'light', race: '魔法使い', atk: 1000, def: 1800, level: 3, art: 'priestess', sigil: '星' },
    greedyTome: { name: '強欲の書物', kind: 'spell', attribute: 'spell', race: '通常魔法', effect: 'draw2', rarity: 'SR', art: 'tome', sigil: '書' },
    warriorGain: { name: '戦士の鼓舞', kind: 'spell', attribute: 'spell', race: '速攻魔法', effect: 'buff1000', target: 'ownMonster', rarity: 'R', art: 'sword', sigil: '攻' },
    judgmentBolt: { name: '裁きの雷', kind: 'spell', attribute: 'spell', race: '通常魔法', effect: 'destroy', target: 'enemyMonster', rarity: 'SR', art: 'bolt', sigil: '雷' },
    healingSpring: { name: '癒しの泉', kind: 'spell', attribute: 'spell', race: '通常魔法', effect: 'heal1200', rarity: 'R', art: 'spring', sigil: '癒' },
    swiftWind: { name: '疾風の加護', kind: 'spell', attribute: 'spell', race: '速攻魔法', effect: 'extraAttack', target: 'ownMonster', rarity: 'R', art: 'wind', sigil: '風' },
    mirrorBarrier: { name: 'ミラー・バリア', kind: 'trap', attribute: 'trap', race: '通常罠', effect: 'negateDamage1000', rarity: 'SR', art: 'mirror', sigil: '鏡' },
    pitfall: { name: '落とし穴', kind: 'trap', attribute: 'trap', race: '通常罠', effect: 'destroyAttacker', rarity: 'R', art: 'pitfall', sigil: '穴' },
    healingMist: { name: '守りの霧', kind: 'trap', attribute: 'trap', race: '通常罠', effect: 'negateHeal500', rarity: 'R', art: 'mist', sigil: '霧' }
  };

  const DECKS = {
    aggro: {
      key: 'aggro',
      name: '紅蓮覇道',
      short: '炎',
      desc: '高ATKで押し切る最速デッキ',
      tag: 'AGGRO',
      gradient: 'linear-gradient(145deg,#ff9a5c,#8f2415 58%,#2a0807)',
      list: ['flameDragon', 'flameDragon', 'volcanoGiant', 'volcanoGiant', 'thunderBlade', 'thunderBlade', 'skyPhoenix', 'galeNinja', 'galeNinja', 'forestBeast', 'forestBeast', 'shadowMage', 'warriorGain', 'warriorGain', 'judgmentBolt', 'judgmentBolt', 'greedyTome', 'mirrorBarrier', 'pitfall', 'swiftWind']
    },
    control: {
      key: 'control',
      name: '蒼海幻獣',
      short: '海',
      desc: '守りと除去で相手を焦らす',
      tag: 'CONTROL',
      gradient: 'linear-gradient(145deg,#54c8ff,#0d3f68 58%,#04101e)',
      list: ['seaSerpent', 'seaSerpent', 'siren', 'siren', 'ironGuardian', 'ironGuardian', 'starPriestess', 'starPriestess', 'moonWolf', 'moonWolf', 'holyAngel', 'shadowMage', 'healingSpring', 'healingSpring', 'judgmentBolt', 'greedyTome', 'greedyTome', 'mirrorBarrier', 'pitfall', 'healingMist']
    },
    balance: {
      key: 'balance',
      name: '聖光天軍',
      short: '光',
      desc: '攻守のバランスが取れた万能型',
      tag: 'BALANCE',
      gradient: 'linear-gradient(145deg,#fde68a,#8a6412 58%,#1a1304)',
      list: ['holyAngel', 'holyAngel', 'thunderBlade', 'thunderBlade', 'starPriestess', 'starPriestess', 'goldenGolem', 'goldenGolem', 'forestBeast', 'skyPhoenix', 'siren', 'abyssDemon', 'warriorGain', 'warriorGain', 'judgmentBolt', 'judgmentBolt', 'healingSpring', 'greedyTome', 'mirrorBarrier', 'pitfall']
    }
  };

  const OPPONENTS = [
    { name: '紅蓮のK', rank: 'GOLD III', deckKey: 'aggro', glyph: '炎' },
    { name: '蒼海のルカ', rank: 'PLATINUM I', deckKey: 'control', glyph: '海' },
    { name: '聖光のミナ', rank: 'GOLD I', deckKey: 'balance', glyph: '光' },
    { name: '月影のゼロ', rank: 'SILVER II', deckKey: 'control', glyph: '闇' },
    { name: '疾風のハヤテ', rank: 'PLATINUM III', deckKey: 'aggro', glyph: '風' },
    { name: '星読みのシオン', rank: 'GOLD II', deckKey: 'balance', glyph: '星' }
  ];

  const G = {
    screen: 'lobby',
    deckKey: 'aggro',
    tilt: false,
    tiltSeen: false,
    tiltZero: null,
    sound: true,
    roomCode: 'RM-0000',
    opponent: null,
    turn: 'player',
    turnCount: 1,
    player: null,
    ai: null,
    selected: null,
    pending: null,
    busy: false,
    over: false,
    result: null,
    reason: null,
    stats: { damage: 0 },
    uid: 0,
    matchTimer: null,
    foundTimer: null,
    vsTimer: null,
    toastTimer: null,
    handDealt: 0,
    rooms: []
  };

  let audioCtx = null;
  let tiltHandler = null;

  function artSVG(kind) {
    const open = '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
    const close = '</svg>';
    const art = {
      dragon: '<path d="M9 79C22 68 20 48 33 33 38 27 44 21 53 14l-4 15 10-8-4 14 12-7-7 15c9 4 15 13 18 24l-12-5 3 13-12-8-6 15-8-15-9 9-1-14-9 8z" fill="var(--a1)"/><path d="M46 34l-3 10 9-5-2 10 10-4" fill="none" stroke="var(--a2)" stroke-width="2.2" stroke-linecap="round"/><circle cx="58" cy="49" r="2.6" fill="var(--a3)"/><path d="M63 57l9 3-7 3" fill="var(--a2)" opacity=".85"/><path d="M20 74l-8 6M26 78l-4 8" stroke="var(--a2)" stroke-width="1.4" opacity=".55"/>',
      serpent: '<path d="M22 86c20 2 18-18 8-24-12-8-2-24 12-22 12 2 14 14 6 20-7 6-2 14 8 12 10-2 18 4 20 12" fill="none" stroke="var(--a1)" stroke-width="9" stroke-linecap="round"/><path d="M22 86c20 2 18-18 8-24-12-8-2-24 12-22 12 2 14 14 6 20-7 6-2 14 8 12 10-2 18 4 20 12" fill="none" stroke="var(--a2)" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="M74 66l12 1-7 10z" fill="var(--a1)"/><circle cx="80" cy="67" r="2" fill="var(--a3)"/>',
      golem: '<path d="M28 40l8-14h28l8 14 10 8-5 30-12 10H35L23 78l-5-30z" fill="var(--a1)"/><path d="M38 42h24v12H38z" fill="var(--a2)" opacity=".7"/><path d="M41 64h6m6 0h6" stroke="var(--a3)" stroke-width="3" stroke-linecap="round"/><path d="M38 78h24" stroke="var(--a2)" stroke-width="2"/><path d="M22 54l-9 10M78 54l9 10" stroke="var(--a1)" stroke-width="8" stroke-linecap="round"/>',
      demon: '<path d="M31 36l-10-16 16 7 6-14 7 12 7-12 6 14 16-7-10 16 6 22-10 16-15 8-15-8-10-16z" fill="var(--a1)"/><path d="M39 48h7m8 0h7" stroke="var(--a3)" stroke-width="2.4" stroke-linecap="round"/><path d="M43 62l7 4 7-4" fill="none" stroke="var(--a2)" stroke-width="2"/><path d="M31 36l-10-16 16 7" fill="none" stroke="var(--a2)" stroke-width="1.6"/>',
      phoenix: '<path d="M50 26c4 8 10 10 18 6-6 8-6 14-2 22-8-2-12 2-16 10-4-8-8-12-16-10 4-8 4-14-2-22 8 4 14 2 18-6z" fill="var(--a1)"/><path d="M50 40c-10-14-28-16-38-6 12 0 18 6 22 14M50 40c10-14 28-16 38-6-12 0-18 6-22 14" fill="none" stroke="var(--a2)" stroke-width="4" stroke-linecap="round"/><path d="M50 56v26" stroke="var(--a2)" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="38" r="2.5" fill="var(--a3)"/>',
      knight: '<path d="M50 16l14 10v16l8 8-6 30-16 10-16-10-6-30 8-8V26z" fill="var(--a1)"/><path d="M40 44l10-6 10 6-3 12-7 5-7-5z" fill="var(--a2)" opacity=".75"/><path d="M34 24L18 8l4 18 12 6M66 24L82 8l-4 18-12 6" fill="none" stroke="var(--a2)" stroke-width="2"/><path d="M50 38v-22" stroke="var(--a3)" stroke-width="2"/><path d="M42 52h16" stroke="var(--a3)" stroke-width="2"/>',
      angel: '<path d="M50 28c8 0 12 6 12 14 0 8-4 12-6 16v14H44V58c-2-4-6-8-6-16 0-8 4-14 12-14z" fill="var(--a1)"/><path d="M42 36C26 20 10 26 14 44c4 14 16 18 26 14M58 36c16-16 32-10 28 8-4 14-16 18-26 14" fill="none" stroke="var(--a2)" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="18" r="9" fill="none" stroke="var(--a2)" stroke-width="2" opacity=".8"/><circle cx="46" cy="44" r="1.8" fill="var(--a3)"/><circle cx="54" cy="44" r="1.8" fill="var(--a3)"/>',
      wolf: '<path d="M22 34l4 30 12 16h24l12-16 4-30-14 8-12-12-12 12z" fill="var(--a1)"/><path d="M22 34l-6-16 18 6M78 34l6-16-18 6" fill="none" stroke="var(--a2)" stroke-width="3" stroke-linejoin="round"/><path d="M38 52l6-3 6 3-6 5zM56 52l6-3 6 3-6 5z" fill="var(--a3)"/><path d="M44 68l6 4 6-4" fill="none" stroke="var(--a2)" stroke-width="2"/>',
      mage: '<path d="M50 18c-12 0-18 10-18 20 0 8 4 14 8 18v14h20V56c4-4 8-10 8-18 0-10-6-20-18-20z" fill="var(--a1)"/><path d="M32 38c-2 18-6 24-14 30M68 38c2 18 6 24 14 30" fill="none" stroke="var(--a2)" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="44" r="9" fill="var(--a2)" opacity=".6"/><circle cx="50" cy="44" r="3" fill="var(--a3)"/><path d="M50 62v22" stroke="var(--a2)" stroke-width="2"/>',
      ninja: '<path d="M50 16c12 0 20 8 20 20 0 8-4 14-10 18l4 24H36l4-24c-6-4-10-10-10-18 0-12 8-20 20-20z" fill="var(--a1)"/><path d="M34 38h32v8H34z" fill="var(--a2)"/><path d="M40 42h5m10 0h5" stroke="var(--a3)" stroke-width="2.4" stroke-linecap="round"/><path d="M24 30l-10 8M76 30l10 8" stroke="var(--a2)" stroke-width="2"/>',
      siren: '<path d="M50 22c8 0 13 6 13 14 0 6-3 10-6 13v18H43V49c-3-3-6-7-6-13 0-8 5-14 13-14z" fill="var(--a1)"/><path d="M37 50c-10 6-16 16-18 28M63 50c10 6 16 16 18 28" fill="none" stroke="var(--a2)" stroke-width="4" stroke-linecap="round"/><path d="M30 60c8-4 14-4 20 0M70 60c-8-4-14-4-20 0" fill="none" stroke="var(--a3)" stroke-width="2" opacity=".7"/><circle cx="46" cy="40" r="1.8" fill="var(--a3)"/><circle cx="54" cy="40" r="1.8" fill="var(--a3)"/>',
      priestess: '<path d="M50 20c-10 0-16 8-16 18 0 8 4 13 8 16v18h16V54c4-3 8-8 8-16 0-10-6-18-16-18z" fill="var(--a1)"/><path d="M50 10v14M38 16l6 10M62 16l-6 10" stroke="var(--a2)" stroke-width="2" stroke-linecap="round"/><path d="M50 42l2.4 5 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z" fill="var(--a3)"/><path d="M34 78c4-8 10-10 16-10s12 2 16 10" fill="none" stroke="var(--a2)" stroke-width="3"/>',
      tome: '<path d="M20 28l30-8 30 8v44l-30-8-30 8z" fill="var(--a1)"/><path d="M50 20v44" stroke="var(--a2)" stroke-width="2"/><path d="M28 34l16-4M28 44l16-4M28 54l16-4M56 30l16 4M56 40l16 4M56 50l16 4" stroke="var(--a3)" stroke-width="2" opacity=".75"/><circle cx="50" cy="42" r="5" fill="var(--a2)"/>',
      sword: '<path d="M50 8l8 14v34l-8 10-8-10V22z" fill="var(--a1)"/><path d="M34 46h32M50 66v22" stroke="var(--a2)" stroke-width="4" stroke-linecap="round"/><path d="M40 88h20" stroke="var(--a3)" stroke-width="3" stroke-linecap="round"/><path d="M50 22v30" stroke="var(--a3)" stroke-width="2" opacity=".8"/>',
      bolt: '<path d="M58 6L26 54h20l-8 40 36-54H54z" fill="var(--a1)"/><path d="M58 6L26 54h20l-8 40 36-54H54z" fill="none" stroke="var(--a2)" stroke-width="1.6"/><circle cx="50" cy="50" r="40" fill="none" stroke="var(--a2)" stroke-width="1" opacity=".4"/>',
      spring: '<path d="M50 12c10 16 22 28 22 42 0 14-10 24-22 24S28 68 28 54c0-14 12-26 22-42z" fill="var(--a1)"/><path d="M38 56c0 8 5 14 12 14s12-6 12-14" fill="none" stroke="var(--a2)" stroke-width="3" stroke-linecap="round"/><circle cx="42" cy="42" r="3" fill="var(--a3)" opacity=".8"/>',
      wind: '<path d="M16 38h44c8 0 12-4 12-10s-6-10-12-8" fill="none" stroke="var(--a1)" stroke-width="5" stroke-linecap="round"/><path d="M24 54h48c8 0 12 4 12 10s-6 10-12 8" fill="none" stroke="var(--a2)" stroke-width="5" stroke-linecap="round"/><path d="M34 70h24" stroke="var(--a3)" stroke-width="4" stroke-linecap="round"/>',
      mirror: '<path d="M50 12l30 12v22c0 20-12 32-30 42-18-10-30-22-30-42V24z" fill="var(--a1)"/><path d="M50 22l20 8v16c0 14-8 23-20 31-12-8-20-17-20-31V30z" fill="var(--a2)" opacity=".45"/><path d="M50 26l-14 10v12c0 10 6 17 14 24 8-7 14-14 14-24V36z" fill="none" stroke="var(--a3)" stroke-width="2"/><path d="M38 48l24-10" stroke="var(--a3)" stroke-width="2" opacity=".8"/>',
      pitfall: '<ellipse cx="50" cy="66" rx="36" ry="14" fill="#0a0a14" stroke="var(--a1)" stroke-width="3"/><path d="M24 62l8-14 6 10 6-16 8 16 6-10 8 14" fill="var(--a2)" opacity=".9"/><path d="M20 66c10 8 50 8 60 0" fill="none" stroke="var(--a3)" stroke-width="2" opacity=".6"/>',
      mist: '<path d="M18 40c8-10 18-10 26 0 8-10 18-10 26 0 8-10 16-8 20-2" fill="none" stroke="var(--a1)" stroke-width="6" stroke-linecap="round"/><path d="M14 56c10-8 20-8 28 0 8-8 18-8 26 0 8-8 16-8 22-2" fill="none" stroke="var(--a2)" stroke-width="5" stroke-linecap="round" opacity=".8"/><path d="M22 72c8-6 18-6 26 0 8-6 18-6 26 0" fill="none" stroke="var(--a3)" stroke-width="4" stroke-linecap="round" opacity=".6"/>'
    }[kind] || '<circle cx="50" cy="50" r="30" fill="var(--a1)" opacity=".5"/>';
    return open + art + close;
  }

  function cardHTML(card, options = {}) {
    const palette = PALETTES[card.attribute] || PALETTES.spell;
    const isMonster = card.kind === 'monster';
    const isSet = Boolean(options.faceDown);
    const classes = ['card', `is-${card.kind}`];
    if (options.mini) classes.push('mini-card');
    if (isSet) classes.push('is-set');
    if (options.defense) classes.push('is-defense');
    if (options.tapped) classes.push('is-tapped');
    const style = `--a1:${palette.a1};--a2:${palette.a2};--a3:${palette.a3};--art-bg:${palette.bg};--art-glow:${palette.glow};`;
    const atk = (card.atk || 0) + (card.tempAtk || 0);
    const stars = isMonster ? '★'.repeat(clamp(card.level || 1, 1, 8)) : '';
    const badge = isMonster ? '' : `<span class="card-badge">${card.kind === 'spell' ? '魔法' : '罠'}</span>`;
    const typeLeft = isMonster ? `<span class="attr" style="--attr-color:${palette.a2}"><i></i>${ATTR_LABEL[card.attribute] || ''}</span>` : `<span>${card.kind === 'spell' ? 'SPELL' : 'TRAP'}</span>`;
    const typeRight = isMonster ? card.race : card.race;
    const stats = isMonster
      ? `<span class="atk">ATK ${atk}</span><span class="def">DEF ${card.def}</span>`
      : `<span>${card.rarity || ''}</span><span>${card.kind === 'spell' ? 'MAGIC' : 'TRAP'}</span>`;
    return `<div class="${classes.join(' ')}" style="${style}" data-uid="${card.uid}">
      <div class="card-frame">
        <div class="card-top">
          <span class="card-name">${esc(card.name)}</span>
          ${isMonster ? `<span class="card-level">${stars}</span>` : ''}
        </div>
        <div class="card-art">
          <div class="art-glow"></div>
          ${artSVG(card.art)}
          <span class="art-sigil">${esc(card.sigil || '')}</span>
        </div>
        <div class="card-type-row">${typeLeft}<span>${esc(typeRight)}</span></div>
        <div class="card-stats">${stats}</div>
      </div>
      ${badge}
    </div>`;
  }

  function makeCard(key) {
    return { ...CARD_POOL[key], uid: ++G.uid };
  }

  function shuffle(list) {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildDeck(key) {
    return DECKS[key].list.map(makeCard);
  }

  function createSide(deckKey) {
    return {
      lp: 4000,
      deck: shuffle(buildDeck(deckKey)),
      hand: [],
      monsters: [null, null, null],
      spells: [null, null, null],
      summoned: false
    };
  }

  function genRoomCode() {
    return `RM-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function randomOpponent() {
    return { ...pick(OPPONENTS) };
  }

  function ensureAudio() {
    if (!G.sound) return null;
    try {
      if (!audioCtx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        audioCtx = new AudioCtor();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch {
      return null;
    }
  }

  function play(name) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const tone = (freq, duration, type = 'sine', volume = 0.045, delay = 0, endFreq = null) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + delay + duration);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(volume, now + delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.03);
    };
    const noise = (duration, volume = 0.035, delay = 0, cutoff = 1200) => {
      const length = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = cutoff;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(now + delay);
    };
    try {
      switch (name) {
        case 'select':
          tone(620, 0.05, 'triangle', 0.035);
          break;
        case 'cancel':
          tone(260, 0.09, 'triangle', 0.03, 0, 190);
          break;
        case 'click':
          tone(440, 0.045, 'square', 0.022);
          break;
        case 'draw':
          tone(880, 0.06, 'triangle', 0.032);
          tone(1174, 0.08, 'triangle', 0.025, 0.04);
          break;
        case 'summon':
          tone(180, 0.28, 'sawtooth', 0.04, 0, 540);
          tone(720, 0.16, 'sine', 0.03, 0.12);
          noise(0.18, 0.02, 0, 700);
          break;
        case 'set':
          tone(320, 0.09, 'triangle', 0.035);
          tone(240, 0.12, 'sine', 0.03, 0.06);
          break;
        case 'attack':
          noise(0.16, 0.05, 0, 1800);
          tone(130, 0.18, 'sawtooth', 0.04, 0, 70);
          break;
        case 'hit':
          noise(0.22, 0.07, 0, 900);
          tone(70, 0.24, 'square', 0.035, 0, 45);
          break;
        case 'damage':
          tone(90, 0.25, 'sawtooth', 0.045, 0, 50);
          noise(0.18, 0.04, 0, 500);
          break;
        case 'heal':
          tone(523, 0.16, 'sine', 0.035);
          tone(659, 0.16, 'sine', 0.032, 0.1);
          tone(784, 0.22, 'sine', 0.03, 0.2);
          break;
        case 'trap':
          tone(330, 0.12, 'square', 0.035);
          tone(311, 0.18, 'square', 0.03, 0.1);
          noise(0.15, 0.03, 0.08, 1600);
          break;
        case 'destroy':
          noise(0.28, 0.06, 0, 800);
          tone(160, 0.3, 'sawtooth', 0.04, 0, 55);
          break;
        case 'turn':
          tone(660, 0.16, 'sine', 0.03);
          tone(990, 0.2, 'sine', 0.022, 0.1);
          break;
        case 'found':
          tone(660, 0.1, 'triangle', 0.035);
          tone(880, 0.12, 'triangle', 0.035, 0.1);
          tone(1320, 0.22, 'triangle', 0.03, 0.2);
          break;
        case 'search':
          tone(330, 0.18, 'sine', 0.022);
          tone(494, 0.18, 'sine', 0.018, 0.2);
          break;
        case 'win':
          [523, 659, 784, 1046].forEach((freq, index) => tone(freq, 0.5, 'triangle', 0.04, index * 0.12));
          break;
        case 'lose':
          [392, 330, 262, 196].forEach((freq, index) => tone(freq, 0.5, 'sine', 0.035, index * 0.14));
          break;
        case 'start':
          tone(220, 0.4, 'sawtooth', 0.035, 0, 660);
          tone(880, 0.35, 'sine', 0.03, 0.18);
          break;
        default:
          tone(440, 0.05, 'sine', 0.02);
      }
    } catch {}
  }

  function toast(message, duration = 1800) {
    const element = $('#global-toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(G.toastTimer);
    G.toastTimer = setTimeout(() => element.classList.remove('show'), duration);
  }

  function setScreen(name) {
    G.screen = name;
    const lobby = $('#lobby');
    const duel = $('#duel');
    const isLobby = name === 'lobby';
    lobby.classList.toggle('is-active', isLobby);
    duel.classList.toggle('is-active', !isLobby);
    lobby.setAttribute('aria-hidden', String(!isLobby));
    duel.setAttribute('aria-hidden', String(isLobby));
    $('#app').dataset.screen = name;
    if (isLobby) {
      document.documentElement.style.setProperty('--tilt-x', '0deg');
      document.documentElement.style.setProperty('--tilt-y', '0deg');
    }
  }

  function openOverlay(selector) {
    const element = $(selector);
    if (!element) return;
    element.classList.add('is-open');
    element.setAttribute('aria-hidden', 'false');
  }

  function closeOverlay(selector) {
    const element = $(selector);
    if (!element) return;
    element.classList.remove('is-open');
    element.setAttribute('aria-hidden', 'true');
  }

  function renderDeckList() {
    const container = $('#deck-list');
    container.innerHTML = Object.values(DECKS).map((deck) => `
      <button class="deck-choice${deck.key === G.deckKey ? ' is-selected' : ''}" data-deck="${deck.key}" aria-pressed="${deck.key === G.deckKey}">
        <span class="deck-thumb" style="--deck-gradient:${deck.gradient}"><span>${esc(deck.short)}</span></span>
        <span>
          <span class="deck-name">${esc(deck.name)}</span>
          <span class="deck-desc">${esc(deck.desc)}</span>
        </span>
        <span class="deck-tag">${esc(deck.tag)}</span>
      </button>
    `).join('');
  }

  function makeRooms() {
    const pool = shuffle(OPPONENTS).slice(0, 3);
    G.rooms = pool.map((opponent) => ({
      code: genRoomCode(),
      opponent,
      deckName: DECKS[opponent.deckKey].name
    }));
    renderRooms();
  }

  function renderRooms() {
    const container = $('#room-list');
    container.innerHTML = G.rooms.map((room, index) => `
      <button class="room-row" data-room="${index}">
        <span class="room-flag">${esc(room.opponent.glyph)}</span>
        <span class="room-info">
          <span class="room-name">${esc(room.opponent.name)}の部屋</span>
          <span class="room-sub">${esc(room.code)} · 4,000 LP · ${esc(room.deckName)}</span>
        </span>
        <span class="room-join">参加</span>
      </button>
    `).join('');
  }

  function updateTiltUI() {
    const lobbyToggle = $('#tilt-toggle');
    lobbyToggle.setAttribute('aria-pressed', String(G.tilt));
    $('.toggle-state', lobbyToggle).textContent = G.tilt ? 'ON' : 'OFF';
    $('#menu-tilt b').textContent = G.tilt ? 'ON' : 'OFF';
  }

  function updateSoundUI() {
    const toggle = $('#sound-toggle');
    toggle.setAttribute('aria-pressed', String(G.sound));
    $('.toggle-state', toggle).textContent = G.sound ? 'ON' : 'OFF';
    $('#menu-sound b').textContent = G.sound ? 'ON' : 'OFF';
  }

  function onDeviceOrientation(event) {
    if (!G.tilt) return;
    if (typeof event.beta !== 'number' && typeof event.gamma !== 'number') return;
    G.tiltSeen = true;
    if (!G.tiltZero) G.tiltZero = { beta: event.beta || 0, gamma: event.gamma || 0 };
    const beta = clamp((event.beta || 0) - G.tiltZero.beta, -28, 28);
    const gamma = clamp((event.gamma || 0) - G.tiltZero.gamma, -28, 28);
    document.documentElement.style.setProperty('--tilt-x', `${gamma * 0.11}deg`);
    document.documentElement.style.setProperty('--tilt-y', `${beta * 0.065}deg`);
  }

  async function setTilt(next) {
    if (next === G.tilt) {
      updateTiltUI();
      return;
    }
    if (!next) {
      G.tilt = false;
      G.tiltZero = null;
      if (tiltHandler) window.removeEventListener('deviceorientation', tiltHandler, true);
      tiltHandler = null;
      document.documentElement.style.setProperty('--tilt-x', '0deg');
      document.documentElement.style.setProperty('--tilt-y', '0deg');
      updateTiltUI();
      toast('傾き操作 OFF');
      play('cancel');
      return;
    }
    if (typeof window.DeviceOrientationEvent === 'undefined') {
      toast('この端末では傾きを検出できません');
      updateTiltUI();
      return;
    }
    try {
      if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        const permission = await window.DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          toast('モーションアクセスが許可されませんでした');
          updateTiltUI();
          return;
        }
      }
    } catch {
      toast('モーションアクセスを取得できません');
      updateTiltUI();
      return;
    }
    G.tilt = true;
    G.tiltSeen = false;
    G.tiltZero = null;
    tiltHandler = onDeviceOrientation;
    window.addEventListener('deviceorientation', tiltHandler, true);
    updateTiltUI();
    play('toggle');
    toast('傾き操作 ON — 端末を傾けて盤面を覗こう');
    setTimeout(() => {
      if (G.tilt && !G.tiltSeen) toast('傾きセンサーを待機中…（PCではマウス視差が有効）');
    }, 1600);
  }

  function updateHud() {
    const player = G.player;
    const ai = G.ai;
    if (!player || !ai) return;
    $('#ai-name').textContent = G.opponent ? G.opponent.name : 'DUELIST';
    $('#ai-rank').textContent = G.opponent ? G.opponent.rank : 'GOLD III';
    $('#ai-lp').textContent = String(ai.lp);
    $('#player-lp').textContent = String(player.lp);
    const aiPercent = clamp((ai.lp / 4000) * 100, 0, 100);
    const playerPercent = clamp((player.lp / 4000) * 100, 0, 100);
    const aiFill = $('#ai-lp-fill');
    const playerFill = $('#player-lp-fill');
    aiFill.style.width = `${aiPercent}%`;
    playerFill.style.width = `${playerPercent}%`;
    aiFill.classList.toggle('low', ai.lp <= 1200);
    playerFill.classList.toggle('low', player.lp <= 1200);
    $('#ai-hand-count').textContent = String(ai.hand.length);
    $('#ai-deck-count').textContent = String(ai.deck.length);
    $('#player-hand-count').textContent = String(player.hand.length);
    $('#player-deck-count').textContent = String(player.deck.length);
    const isAi = G.turn === 'ai';
    const pill = $('#turn-pill');
    pill.classList.toggle('ai', isAi);
    $('#turn-label').textContent = isAi ? 'ENEMY TURN' : 'YOUR TURN';
    $('#turn-sub').textContent = `TURN ${G.turnCount} · ${G.busy ? 'RESOLVING' : 'MAIN PHASE'}`;
    $('#center-turn').textContent = `T${G.turnCount}`;
    $('#room-tag').textContent = G.roomCode;
    const railCode = $('#rail-code');
    const railTurn = $('#rail-turn');
    if (railCode) railCode.textContent = G.roomCode;
    if (railTurn) railTurn.textContent = `T${G.turnCount}`;
    const hint = $('#hand-hint');
    if (G.over) hint.textContent = 'デュエル終了';
    else if (isAi || G.busy) hint.textContent = '相手のターン…';
    else if (G.pending?.type === 'summon') hint.textContent = '召喚先のモンスターゾーンをタップ';
    else if (G.pending?.type === 'setTrap') hint.textContent = 'セット先の魔法・罠ゾーンをタップ';
    else if (G.pending?.type === 'attack') hint.textContent = '攻撃対象をタップ';
    else if (G.pending?.type === 'effectTarget') hint.textContent = '効果の対象をタップ';
    else if (G.selected?.type === 'hand') hint.textContent = '召喚 / 発動 / セットを選択';
    else if (G.selected?.type === 'field') hint.textContent = '攻撃 / 表示変更を選択';
    else hint.textContent = 'カードをタップして選択';
  }

  function renderAIHand() {
    if (!G.ai) return;
    const container = $('#opponent-hand');
    const count = G.ai.hand.length;
    container.innerHTML = Array.from({ length: count }, (_, index) => {
      const offset = index - (count - 1) / 2;
      return `<div class="hand-back" style="--r:${offset * 3.2}deg;--ty:${Math.abs(offset) * 1.6}px"></div>`;
    }).join('');
  }

  function fieldCardHTML(card, side) {
    if (!card) return '';
    const faceDown = Boolean(card.faceDown);
    const defense = card.position === 'defense' && !faceDown;
    const tapped = side === 'ai' ? false : card.position === 'attack' && card.attacksLeft <= 0;
    return cardHTML(card, { faceDown, defense, tapped, mini: false });
  }

  function isZoneValid(side, row, index) {
    if (!canAct()) return false;
    if (G.pending?.type === 'summon') {
      return side === 'player' && row === 'monster' && !G.player.monsters[index];
    }
    if (G.pending?.type === 'setTrap') {
      return side === 'player' && row === 'spell' && !G.player.spells[index];
    }
    if (!G.pending && G.selected?.type === 'hand') {
      const card = G.selected.card;
      if (card.kind === 'monster' && !G.player.summoned) return side === 'player' && row === 'monster' && !G.player.monsters[index];
      if (card.kind === 'trap') return side === 'player' && row === 'spell' && !G.player.spells[index];
    }
    return false;
  }

  function isZoneTargetable(side, row, index) {
    if (!canAct()) return false;
    const card = G[side][row === 'monster' ? 'monsters' : 'spells'][index];
    if (!card) return false;
    if (G.pending?.type === 'attack') return side === 'ai' && row === 'monster';
    if (G.pending?.type === 'effectTarget') {
      if (G.pending.targetSide !== side || row !== 'monster') return false;
      return true;
    }
    if (!G.pending && G.selected?.type === 'field' && G.selected.side === 'player') {
      const attacker = G.selected.card;
      if (attacker.position === 'attack' && attacker.attacksLeft > 0) return side === 'ai' && row === 'monster';
    }
    return false;
  }

  function renderField(side) {
    const player = side === 'player';
    const sideState = player ? G.player : G.ai;
    const monsterRow = player ? $('#player-monster-row') : $('#ai-monster-row');
    const spellRow = player ? $('#player-spell-row') : $('#ai-spell-row');
    if (!sideState) return;
    const renderRow = (rowName, container) => {
      container.innerHTML = [0, 1, 2].map((index) => {
        const list = rowName === 'monster' ? sideState.monsters : sideState.spells;
        const card = list[index];
        const valid = isZoneValid(side, rowName, index);
        const targetable = isZoneTargetable(side, rowName, index);
        const selected = G.selected?.type === 'field' && G.selected.side === side && G.selected.row === rowName && G.selected.index === index;
        const classes = ['zone'];
        if (card) classes.push('has-card');
        if (valid) classes.push('valid');
        if (targetable) classes.push('targetable');
        if (selected) classes.push('selected');
        return `<div class="${classes.join(' ')}" data-side="${side}" data-row="${rowName}" data-index="${index}">
          ${card ? fieldCardHTML(card, side) : ''}
        </div>`;
      }).join('');
    };
    renderRow('monster', monsterRow);
    renderRow('spell', spellRow);
  }

  function handCardHTML(card, index, count) {
    const offset = index - (count - 1) / 2;
    const rotation = offset * (count > 6 ? 2.8 : 4.2);
    const translate = Math.abs(offset) * (count > 6 ? 1.4 : 2.2);
    const selected = G.selected?.type === 'hand' && G.selected.card.uid === card.uid;
    const dealt = Boolean(card.justDrawn);
    if (dealt) card.justDrawn = false;
    return `<button class="hand-card${selected ? ' is-selected' : ''}${dealt ? ' is-dealt' : ''}" data-uid="${card.uid}" style="--rot:${rotation}deg;--ty:${translate}px;z-index:${index + (selected ? 50 : 0)};${dealt ? `animation-delay:${index * 45}ms;` : ''}" aria-label="${esc(card.name)}">
      ${cardHTML(card)}
    </button>`;
  }

  function renderHand() {
    if (!G.player) return;
    const hand = G.player.hand;
    const count = hand.length;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const viewport = Math.min(viewportW, 900);
    const short = viewportH < 560 && viewportW > viewportH;
    const base = short ? Math.max(48, Math.min(78, viewportH * 0.174)) : viewport < 380 ? 74 : viewport < 640 ? 86 : viewport < 900 ? 104 : 116;
    const available = Math.min(viewport - 24, 720);
    const fit = available / (0.77 * Math.max(count, 1) + 0.23);
    const width = clamp(Math.min(base, fit), 42, base);
    document.documentElement.style.setProperty('--hand-w', `${width}px`);
    const container = $('#player-hand');
    container.innerHTML = hand.map((card, index) => handCardHTML(card, index, count)).join('');
  }

  function showInspect(card, label) {
    const empty = $('#inspect-empty');
    const inspect = $('#inspect-card');
    if (!card) {
      empty.hidden = false;
      inspect.hidden = true;
      return;
    }
    empty.hidden = true;
    inspect.hidden = false;
    $('#inspect-type').textContent = label;
    $('#inspect-name').textContent = card.name;
    if (card.kind === 'monster') {
      const atk = (card.atk || 0) + (card.tempAtk || 0);
      const position = card.position === 'defense' ? '守備' : card.position === 'attack' ? '攻撃' : '手札';
      $('#inspect-stats').textContent = `ATK ${atk} / DEF ${card.def} · ${position}`;
    } else {
      $('#inspect-stats').textContent = `${card.race} · ${card.rarity || ''}${card.effect ? ` · ${card.effect}` : ''}`;
    }
  }

  function dockButton(label, action, options = {}) {
    const classes = ['dock-btn'];
    if (options.primary) classes.push('primary');
    if (options.ghost) classes.push('ghost');
    if (options.danger) classes.push('danger');
    return `<button class="${classes.join(' ')}" data-action="${action}"${options.disabled ? ' disabled' : ''}>${esc(label)}</button>`;
  }

  function renderDock() {
    const actions = $('#dock-actions');
    let inspectCard = null;
    let inspectLabel = '';
    if (G.pending?.type === 'effectTarget') {
      inspectCard = G.pending.card;
      inspectLabel = 'TARGET SELECT';
    } else if (G.pending?.type === 'attack') {
      inspectCard = G.pending.card;
      inspectLabel = 'ATTACK';
    } else if (G.pending?.type === 'summon' || G.pending?.type === 'setTrap') {
      inspectCard = G.pending.card;
      inspectLabel = G.pending.type === 'summon' ? 'SUMMON' : 'SET';
    } else if (G.selected?.type === 'hand') {
      inspectCard = G.selected.card;
      inspectLabel = G.selected.card.kind === 'monster' ? 'MONSTER' : G.selected.card.kind === 'spell' ? 'SPELL' : 'TRAP';
    } else if (G.selected?.type === 'field') {
      inspectCard = G.selected.card;
      inspectLabel = 'FIELD';
    }
    showInspect(inspectCard, inspectLabel);

    if (G.over) {
      actions.innerHTML = dockButton('デュエル終了', 'none', { disabled: true });
      return;
    }
    if (G.turn === 'ai' || G.busy) {
      actions.innerHTML = dockButton(G.busy ? '処理中…' : '相手のターン', 'none', { disabled: true });
      return;
    }
    if (G.pending?.type === 'attack') {
      const hasMonsters = G.ai.monsters.some(Boolean);
      actions.innerHTML = `${hasMonsters ? '' : dockButton('直接攻撃', 'direct', { primary: true })}${dockButton('戻る', 'cancel', { ghost: true })}`;
      return;
    }
    if (G.pending?.type === 'summon' || G.pending?.type === 'setTrap' || G.pending?.type === 'effectTarget') {
      actions.innerHTML = dockButton('戻る', 'cancel', { ghost: true });
      return;
    }
    if (G.selected?.type === 'hand') {
      const card = G.selected.card;
      if (card.kind === 'monster') {
        if (G.player.summoned) {
          actions.innerHTML = `${dockButton('召喚済み', 'none', { disabled: true })}${dockButton('戻る', 'cancel', { ghost: true })}`;
        } else {
          actions.innerHTML = `${dockButton('召喚', 'summon', { primary: true })}${dockButton('守備', 'summon-defense')}${dockButton('戻る', 'cancel', { ghost: true })}`;
        }
      } else if (card.kind === 'spell') {
        actions.innerHTML = `${dockButton('発動', 'activate', { primary: true })}${dockButton('戻る', 'cancel', { ghost: true })}`;
      } else {
        actions.innerHTML = `${dockButton('セット', 'set-trap', { primary: true })}${dockButton('戻る', 'cancel', { ghost: true })}`;
      }
      return;
    }
    if (G.selected?.type === 'field') {
      const card = G.selected.card;
      if (card.position === 'attack') {
        const attackButton = card.attacksLeft > 0 ? dockButton('攻撃', 'attack', { primary: true }) : dockButton('攻撃済み', 'none', { disabled: true });
        const positionButton = card.positionChanged ? '' : dockButton('守備', 'to-defense');
        actions.innerHTML = `${attackButton}${positionButton}${dockButton('戻る', 'cancel', { ghost: true })}`;
      } else {
        const positionButton = card.positionChanged ? '' : dockButton('攻撃表示', 'to-attack', { primary: true });
        actions.innerHTML = `${positionButton}${dockButton('戻る', 'cancel', { ghost: true })}`;
      }
      return;
    }
    actions.innerHTML = dockButton('ターン終了', 'end-turn', { primary: true });
  }

  function renderAll() {
    if (!G.player || !G.ai) return;
    renderAIHand();
    renderField('ai');
    renderField('player');
    renderHand();
    updateHud();
    renderDock();
  }

  function canAct() {
    return G.screen === 'duel' && G.turn === 'player' && !G.busy && !G.over;
  }

  function getFieldElement(side, row, index) {
    const selector = side === 'player'
      ? (row === 'monster' ? '#player-monster-row' : '#player-spell-row')
      : (row === 'monster' ? '#ai-monster-row' : '#ai-spell-row');
    return $(`${selector} .zone[data-index="${index}"] .card`);
  }

  function getAvatarElement(side) {
    return side === 'player' ? $('#player-avatar') : $('#ai-avatar');
  }

  function rectCenter(element) {
    const arena = $('#arena');
    if (!element || !arena) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();
    return { x: rect.left - arenaRect.left + rect.width / 2, y: rect.top - arenaRect.top + rect.height / 2 };
  }

  function spawnSlash(element) {
    const point = rectCenter(element);
    const slash = document.createElement('div');
    slash.className = 'slash';
    slash.style.left = `${point.x}px`;
    slash.style.top = `${point.y}px`;
    $('#fx-layer').appendChild(slash);
    setTimeout(() => slash.remove(), 500);
    const impact = document.createElement('div');
    impact.className = 'impact';
    impact.style.left = `${point.x}px`;
    impact.style.top = `${point.y}px`;
    $('#fx-layer').appendChild(impact);
    setTimeout(() => impact.remove(), 600);
  }

  function spawnDamage(element, amount, heal = false) {
    const point = rectCenter(element);
    const value = document.createElement('div');
    value.className = `damage-float${heal ? ' heal' : ''}`;
    value.textContent = `${heal ? '+' : '-'}${amount}`;
    value.style.left = `${point.x}px`;
    value.style.top = `${point.y}px`;
    $('#fx-layer').appendChild(value);
    setTimeout(() => value.remove(), 1100);
  }

  function spawnSummonBurst(side, index) {
    const element = getFieldElement(side, 'monster', index);
    const point = rectCenter(element);
    const burst = document.createElement('div');
    burst.className = 'summon-burst';
    burst.style.left = `${point.x}px`;
    burst.style.top = `${point.y}px`;
    $('#fx-layer').appendChild(burst);
    setTimeout(() => burst.remove(), 800);
  }

  function spawnTrapFlip(element) {
    const point = rectCenter(element);
    const card = document.createElement('div');
    card.className = 'trap-flip';
    card.style.left = `${point.x}px`;
    card.style.top = `${point.y}px`;
    $('#fx-layer').appendChild(card);
    setTimeout(() => card.remove(), 800);
  }

  function shatterCard(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const ghost = element.cloneNode(true);
    ghost.classList.add('shatter-ghost');
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    document.body.appendChild(ghost);
    setTimeout(() => ghost.remove(), 650);
  }

  function shakeArena() {
    const arena = $('#arena');
    arena.classList.remove('shake');
    void arena.offsetWidth;
    arena.classList.add('shake');
    setTimeout(() => arena.classList.remove('shake'), 400);
  }

  function drawCards(side, amount, options = {}) {
    const state = G[side];
    if (!state) return false;
    for (let i = 0; i < amount; i += 1) {
      if (!state.deck.length) {
        endDuel(side === 'player' ? 'lose' : 'win', 'deckout');
        return false;
      }
      const card = state.deck.pop();
      card.justDrawn = !options.silent;
      state.hand.push(card);
    }
    if (!options.silent) play('draw');
    return true;
  }

  function heal(side, amount) {
    const state = G[side];
    if (!state) return 0;
    const before = state.lp;
    state.lp = Math.min(4000, state.lp + amount);
    const healed = state.lp - before;
    if (healed > 0) {
      spawnDamage(getAvatarElement(side), healed, true);
      play('heal');
    }
    return healed;
  }

  function dealDamage(side, amount) {
    const state = G[side];
    if (!state || amount <= 0) return;
    const actual = Math.min(amount, state.lp);
    state.lp = Math.max(0, state.lp - amount);
    if (side === 'ai') G.stats.damage += actual;
    spawnDamage(getAvatarElement(side), actual, false);
    play('damage');
    shakeArena();
    if (state.lp <= 0) endDuel(side === 'ai' ? 'win' : 'lose', 'lp');
  }

  function endDuel(result, reason) {
    if (G.over) return;
    G.over = true;
    G.busy = true;
    G.result = result;
    G.reason = reason;
    G.selected = null;
    G.pending = null;
    clearTimeout(G.matchTimer);
    clearTimeout(G.foundTimer);
    clearTimeout(G.vsTimer);
    renderAll();
    play(result === 'win' ? 'win' : 'lose');
    setTimeout(() => showResult(result, reason), 900);
  }

  function showResult(result, reason) {
    closeOverlay('#menu-overlay');
    const overlay = $('#result');
    overlay.classList.toggle('lose', result === 'lose');
    overlay.classList.toggle('win', result === 'win');
    $('#result-title').textContent = result === 'win' ? '勝利' : '敗北';
    const reasonText = reason === 'deckout'
      ? (result === 'win' ? '相手の山札が尽きた。' : 'あなたの山札が尽きた。')
      : reason === 'surrender'
        ? 'デュエルを降参した。'
        : result === 'win'
          ? '相手のLPを0にした。魂のデュエル、見事でした。'
          : 'あなたのLPが0になった。次はリベンジを。';
    $('#result-copy').textContent = reasonText;
    $('#result-turns').textContent = String(G.turnCount);
    $('#result-damage').textContent = String(G.stats.damage);
    $('#result-lp').textContent = String(G.player ? G.player.lp : 0);
    openOverlay('#result');
    if (result === 'win') spawnConfetti(overlay);
  }

  function spawnConfetti(container) {
    const colors = ['#f4cf7b', '#74e4ff', '#ff7a5c', '#9d7bff', '#68f0b5'];
    for (let i = 0; i < 26; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${rand(4, 96)}%`;
      piece.style.background = pick(colors);
      piece.style.animationDelay = `${rand(0, 0.8)}s`;
      piece.style.animationDuration = `${rand(2, 3.4)}s`;
      piece.style.transform = `rotate(${rand(0, 360)}deg)`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4200);
    }
  }

  function startMatchmaking(options = {}) {
    clearTimeout(G.matchTimer);
    clearTimeout(G.foundTimer);
    clearTimeout(G.vsTimer);
    G.opponent = options.opponent ? { ...options.opponent } : randomOpponent();
    G.roomCode = options.roomCode || genRoomCode();
    if (options.deckKey && DECKS[options.deckKey]) G.deckKey = options.deckKey;
    renderDeckList();
    $('#radar-code').textContent = G.roomCode;
    $('#match-title').textContent = '対戦相手を探しています';
    $('#match-sub').textContent = '最速マッチ · 4,000 LP · 3モンスターゾーン';
    openOverlay('#matchmaking');
    play('search');
    const wait = rand(1100, 1600);
    G.matchTimer = setTimeout(() => {
      $('#match-title').textContent = '対戦相手が見つかりました';
      $('#match-sub').textContent = `${G.opponent.name} · ${DECKS[G.opponent.deckKey].name}`;
      play('found');
      G.foundTimer = setTimeout(showVS, 520);
    }, wait);
  }

  function showVS() {
    closeOverlay('#matchmaking');
    $('#vs-enemy-name').textContent = G.opponent.name;
    $('#vs-enemy-deck').textContent = DECKS[G.opponent.deckKey].name;
    $('#vs-player-deck').textContent = DECKS[G.deckKey].name;
    $('#vs-room-code').textContent = G.roomCode;
    $('#vs-player-avatar').textContent = '魂';
    $('#vs-enemy-avatar').textContent = G.opponent.glyph;
    openOverlay('#vs-overlay');
    play('start');
    G.vsTimer = setTimeout(() => {
      closeOverlay('#vs-overlay');
      startDuel();
    }, 1250);
  }

  function startDuel() {
    clearTimeout(G.matchTimer);
    clearTimeout(G.foundTimer);
    clearTimeout(G.vsTimer);
    closeOverlay('#matchmaking');
    closeOverlay('#vs-overlay');
    closeOverlay('#result');
    closeOverlay('#menu-overlay');
    G.uid = 0;
    G.over = false;
    G.busy = false;
    G.result = null;
    G.reason = null;
    G.turn = 'player';
    G.turnCount = 1;
    G.selected = null;
    G.pending = null;
    G.stats = { damage: 0 };
    G.player = createSide(G.deckKey);
    G.ai = createSide(G.opponent.deckKey);
    drawCards('player', 5, { silent: true });
    drawCards('ai', 5, { silent: true });
    setScreen('duel');
    renderAll();
    play('start');
    setTimeout(() => beginPlayerTurn(true), 650);
  }

  function beginPlayerTurn(first) {
    if (G.over) return;
    G.turn = 'player';
    G.busy = false;
    G.selected = null;
    G.pending = null;
    if (!first) G.turnCount += 1;
    G.player.summoned = false;
    G.player.monsters.forEach((card) => {
      if (!card) return;
      card.tempAtk = 0;
      card.positionChanged = false;
      card.attacksLeft = card.position === 'attack' ? 1 : 0;
    });
    if (!first) {
      if (!drawCards('player', 1)) return;
    }
    renderAll();
    play('turn');
    toast(first ? '先攻 — あなたのターン' : `ターン ${G.turnCount} — あなたのターン`);
  }

  function endPlayerTurn() {
    if (!canAct()) return;
    G.selected = null;
    G.pending = null;
    G.turn = 'ai';
    G.busy = true;
    renderAll();
    play('turn');
    toast('相手のターン');
    setTimeout(aiTurn, 650);
  }

  function findHandIndex(state, predicate) {
    return state.hand.findIndex(predicate);
  }

  function removeHandCard(state, card) {
    const index = state.hand.findIndex((item) => item.uid === card.uid);
    if (index >= 0) state.hand.splice(index, 1);
  }

  function performSummon(card, index, position) {
    if (!canAct()) return;
    if (G.player.summoned) {
      toast('召喚は1ターンに1回まで');
      return;
    }
    if (G.player.monsters[index]) {
      toast('そのゾーンは埋まっています');
      return;
    }
    if (!G.player.hand.some((item) => item.uid === card.uid)) return;
    removeHandCard(G.player, card);
    G.player.monsters[index] = { ...card, position, attacksLeft: position === 'attack' ? 1 : 0, tempAtk: 0, positionChanged: false };
    G.player.summoned = true;
    G.selected = null;
    G.pending = null;
    play('summon');
    renderAll();
    spawnSummonBurst('player', index);
    toast(`${card.name} を${position === 'attack' ? '攻撃' : '守備'}表示で召喚`);
  }

  function performSetTrap(card, index) {
    if (!canAct()) return;
    if (G.player.spells[index]) {
      toast('そのゾーンは埋まっています');
      return;
    }
    if (!G.player.hand.some((item) => item.uid === card.uid)) return;
    removeHandCard(G.player, card);
    G.player.spells[index] = { ...card, faceDown: true };
    G.selected = null;
    G.pending = null;
    play('set');
    renderAll();
    toast(`${card.name} をセット`);
  }

  function activateSpell(card) {
    if (!canAct()) return;
    if (!G.player.hand.some((item) => item.uid === card.uid)) return;
    if (card.effect === 'destroy') {
      if (!G.ai.monsters.some(Boolean)) {
        toast('破壊できる相手モンスターがいません');
        return;
      }
      G.pending = { type: 'effectTarget', card, targetSide: 'ai', effect: 'destroy' };
      G.selected = null;
      play('select');
      renderAll();
      toast('破壊する相手モンスターを選択');
      return;
    }
    if (card.effect === 'buff1000' || card.effect === 'extraAttack') {
      if (!G.player.monsters.some(Boolean)) {
        toast('対象にできる自分のモンスターがいません');
        return;
      }
      G.pending = { type: 'effectTarget', card, targetSide: 'player', effect: card.effect };
      G.selected = null;
      play('select');
      renderAll();
      toast('対象の自分のモンスターを選択');
      return;
    }
    resolveSpellNow(card);
  }

  function resolveSpellNow(card, targetSide = null, targetIndex = null) {
    removeHandCard(G.player, card);
    G.selected = null;
    G.pending = null;
    if (card.effect === 'draw2') {
      toast('強欲の書物 — 2枚ドロー');
      if (!drawCards('player', 2)) return;
      play('draw');
    } else if (card.effect === 'heal1200') {
      const healed = heal('player', 1200);
      toast(`癒しの泉 — LPを${healed}回復`);
    } else if (card.effect === 'destroy' && targetSide === 'ai' && targetIndex !== null) {
      const target = G.ai.monsters[targetIndex];
      if (target) {
        shatterCard(getFieldElement('ai', 'monster', targetIndex));
        G.ai.monsters[targetIndex] = null;
        toast(`裁きの雷 — ${target.name} を破壊`);
        play('destroy');
      }
    } else if (card.effect === 'buff1000' && targetSide === 'player' && targetIndex !== null) {
      const target = G.player.monsters[targetIndex];
      if (target) {
        target.tempAtk += 1000;
        toast(`戦士の鼓舞 — ${target.name} のATK +1000`);
        play('heal');
      }
    } else if (card.effect === 'extraAttack' && targetSide === 'player' && targetIndex !== null) {
      const target = G.player.monsters[targetIndex];
      if (target) {
        target.attacksLeft += 1;
        toast(`疾風の加護 — ${target.name} は追加攻撃できる`);
        play('heal');
      }
    }
    renderAll();
  }

  function changePosition(position) {
    if (!canAct() || G.selected?.type !== 'field') return;
    const card = G.selected.card;
    if (card.positionChanged) {
      toast('表示形式の変更は1ターンに1回まで');
      return;
    }
    if (card.position === position) return;
    card.position = position;
    card.positionChanged = true;
    card.attacksLeft = 0;
    play('set');
    renderAll();
    toast(position === 'defense' ? '守備表示に変更' : '攻撃表示に変更');
  }

  function beginAttack() {
    if (!canAct() || G.selected?.type !== 'field') return;
    const card = G.selected.card;
    if (card.position !== 'attack') {
      toast('守備表示のモンスターは攻撃できません');
      return;
    }
    if (card.attacksLeft <= 0) {
      toast('このモンスターは攻撃済みです');
      return;
    }
    G.pending = { type: 'attack', card, attackerZone: G.selected.index };
    G.selected = null;
    play('select');
    renderAll();
    toast(G.ai.monsters.some(Boolean) ? '攻撃対象をタップ' : '直接攻撃できます');
  }

  function cancelAction() {
    if (G.busy || G.over) return;
    G.pending = null;
    G.selected = null;
    play('cancel');
    renderAll();
  }

  function handleDockAction(action) {
    if (!action || action === 'none') return;
    if (action === 'end-turn') {
      endPlayerTurn();
      return;
    }
    if (action === 'cancel') {
      cancelAction();
      return;
    }
    if (!canAct()) return;
    if (action === 'summon' || action === 'summon-defense') {
      if (G.selected?.type !== 'hand' || G.selected.card.kind !== 'monster') return;
      if (G.player.summoned) {
        toast('召喚は1ターンに1回まで');
        return;
      }
      G.pending = { type: 'summon', card: G.selected.card, position: action === 'summon-defense' ? 'defense' : 'attack' };
      G.selected = null;
      play('select');
      renderAll();
      toast('空きモンスターゾーンをタップ');
      return;
    }
    if (action === 'activate') {
      if (G.selected?.type === 'hand' && G.selected.card.kind === 'spell') activateSpell(G.selected.card);
      return;
    }
    if (action === 'set-trap') {
      if (G.selected?.type !== 'hand' || G.selected.card.kind !== 'trap') return;
      G.pending = { type: 'setTrap', card: G.selected.card };
      G.selected = null;
      play('select');
      renderAll();
      toast('空き魔法・罠ゾーンをタップ');
      return;
    }
    if (action === 'attack') {
      beginAttack();
      return;
    }
    if (action === 'to-defense') {
      changePosition('defense');
      return;
    }
    if (action === 'to-attack') {
      changePosition('attack');
      return;
    }
    if (action === 'direct') {
      if (G.pending?.type === 'attack') {
        const zone = G.pending.attackerZone;
        resolveAttack('player', zone, 'ai', null, true);
      }
    }
  }

  function triggerTrap(defenderSide, attackerSide, attackerZone) {
    const defender = G[defenderSide];
    const index = defender.spells.findIndex((card) => card && card.kind === 'trap' && card.faceDown);
    if (index < 0) return null;
    const trap = defender.spells[index];
    defender.spells[index] = null;
    spawnTrapFlip(getFieldElement(defenderSide, 'spell', index));
    play('trap');
    toast(`${trap.name} 発動！`);
    if (trap.effect === 'destroyAttacker') {
      const attacker = G[attackerSide].monsters[attackerZone];
      if (attacker) {
        shatterCard(getFieldElement(attackerSide, 'monster', attackerZone));
        G[attackerSide].monsters[attackerZone] = null;
        play('destroy');
      }
    } else if (trap.effect === 'negateDamage1000') {
      dealDamage(attackerSide, 1000);
    } else if (trap.effect === 'negateHeal500') {
      heal(defenderSide, 500);
    }
    return trap;
  }

  async function resolveAttack(attackerSide, attackerZone, defenderSide, defenderZone, direct = false) {
    if (G.over) return;
    const attackerState = G[attackerSide];
    const defenderState = G[defenderSide];
    const attacker = attackerState.monsters[attackerZone];
    if (!attacker || attacker.position !== 'attack' || attacker.attacksLeft <= 0) {
      renderAll();
      return;
    }
    G.busy = true;
    G.pending = null;
    G.selected = null;
    attacker.attacksLeft -= 1;
    renderAll();
    const attackerEl = getFieldElement(attackerSide, 'monster', attackerZone);
    if (attackerEl) {
      attackerEl.classList.add('attack-lunge');
      setTimeout(() => attackerEl.classList.remove('attack-lunge'), 300);
    }
    play('attack');
    await sleep(190);
    if (G.over) return;
    const trap = triggerTrap(defenderSide, attackerSide, attackerZone);
    if (trap) {
      renderAll();
      await sleep(650);
      G.busy = false;
      if (!G.over) renderAll();
      return;
    }
    if (direct || !defenderState.monsters[defenderZone]) {
      const targetEl = getAvatarElement(defenderSide);
      spawnSlash(targetEl);
      play('hit');
      dealDamage(defenderSide, attacker.atk);
      renderAll();
      await sleep(620);
    } else {
      const defender = defenderState.monsters[defenderZone];
      const defenderEl = getFieldElement(defenderSide, 'monster', defenderZone);
      spawnSlash(defenderEl);
      play('hit');
      shakeArena();
      await sleep(170);
      if (defender.position === 'defense') {
        if (attacker.atk > defender.def) {
          shatterCard(defenderEl);
          defenderState.monsters[defenderZone] = null;
          toast(`${defender.name} を破壊`);
          play('destroy');
        } else if (attacker.atk < defender.def) {
          dealDamage(attackerSide, defender.def - attacker.atk);
          toast('攻撃がはじかれた');
        } else {
          toast('守備力と互角 — 破壊ならず');
        }
      } else if (attacker.atk > defender.atk) {
        shatterCard(defenderEl);
        defenderState.monsters[defenderZone] = null;
        toast(`${defender.name} を破壊`);
        dealDamage(defenderSide, attacker.atk - defender.atk);
      } else if (attacker.atk < defender.atk) {
        shatterCard(attackerEl);
        attackerState.monsters[attackerZone] = null;
        toast(`${attacker.name} が返り討ちに`);
        dealDamage(attackerSide, defender.atk - attacker.atk);
      } else {
        shatterCard(defenderEl);
        shatterCard(attackerEl);
        defenderState.monsters[defenderZone] = null;
        attackerState.monsters[attackerZone] = null;
        toast('相打ち');
        play('destroy');
      }
      renderAll();
      await sleep(650);
    }
    G.busy = false;
    if (!G.over) renderAll();
  }

  function aiCardByEffect(effect) {
    const index = findHandIndex(G.ai, (card) => card.effect === effect);
    return index >= 0 ? G.ai.hand[index] : null;
  }

  async function aiUseSpells() {
    let used = 0;
    if (G.ai.lp <= 2200) {
      const healCard = aiCardByEffect('heal1200');
      if (healCard) {
        removeHandCard(G.ai, healCard);
        const healed = heal('ai', 1200);
        toast(`相手の癒しの泉 — LPを${healed}回復`);
        renderAll();
        used += 1;
        await sleep(450);
      }
    }
    if (used < 2) {
      const bolt = aiCardByEffect('destroy');
      const targets = G.player.monsters.map((card, index) => ({ card, index })).filter((item) => item.card);
      if (bolt && targets.length) {
        targets.sort((a, b) => (b.card.position === 'defense' ? b.card.def : b.card.atk) - (a.card.position === 'defense' ? a.card.def : a.card.atk));
        const target = targets[0];
        removeHandCard(G.ai, bolt);
        shatterCard(getFieldElement('player', 'monster', target.index));
        G.player.monsters[target.index] = null;
        toast(`相手の裁きの雷 — ${target.card.name} を破壊`);
        play('destroy');
        renderAll();
        used += 1;
        await sleep(500);
      }
    }
    if (used < 2) {
      const buff = aiCardByEffect('buff1000');
      const monsters = G.ai.monsters.map((card, index) => ({ card, index })).filter((item) => item.card);
      if (buff && monsters.length) {
        monsters.sort((a, b) => b.card.atk - a.card.atk);
        removeHandCard(G.ai, buff);
        monsters[0].card.tempAtk += 1000;
        toast(`相手の戦士の鼓舞 — ${monsters[0].card.name} のATK +1000`);
        play('heal');
        renderAll();
        used += 1;
        await sleep(400);
      }
    }
    if (used < 2) {
      const extra = aiCardByEffect('extraAttack');
      const monsters = G.ai.monsters.map((card, index) => ({ card, index })).filter((item) => item.card && item.card.position === 'attack');
      if (extra && monsters.length) {
        monsters.sort((a, b) => b.card.atk - a.card.atk);
        removeHandCard(G.ai, extra);
        monsters[0].card.attacksLeft += 1;
        toast(`相手の疾風の加護 — ${monsters[0].card.name} が追加攻撃`);
        play('heal');
        renderAll();
        used += 1;
        await sleep(400);
      }
    }
    if (used < 2 && G.ai.hand.length <= 4) {
      const tome = aiCardByEffect('draw2');
      if (tome) {
        removeHandCard(G.ai, tome);
        toast('相手の強欲の書物 — 2枚ドロー');
        if (!drawCards('ai', 2)) return;
        renderAll();
        await sleep(450);
      }
    }
  }

  async function aiSummon() {
    if (G.ai.summoned) return;
    const monsters = G.ai.hand.filter((card) => card.kind === 'monster');
    if (!monsters.length) return;
    const empty = [0, 1, 2].filter((index) => !G.ai.monsters[index]);
    if (!empty.length) return;
    monsters.sort((a, b) => b.atk - a.atk);
    const card = monsters[0];
    const zone = empty.includes(1) ? 1 : empty[0];
    const playerMax = Math.max(0, ...G.player.monsters.filter(Boolean).map((item) => (item.position === 'defense' ? item.def : item.atk)));
    const position = card.def > card.atk && card.atk < playerMax ? 'defense' : 'attack';
    removeHandCard(G.ai, card);
    G.ai.monsters[zone] = { ...card, position, attacksLeft: position === 'attack' ? 1 : 0, tempAtk: 0, positionChanged: false };
    G.ai.summoned = true;
    play('summon');
    renderAll();
    spawnSummonBurst('ai', zone);
    toast(`相手が ${card.name} を${position === 'attack' ? '攻撃' : '守備'}表示で召喚`);
    await sleep(600);
  }

  async function aiSetTrap() {
    const traps = G.ai.hand.filter((card) => card.kind === 'trap');
    if (!traps.length) return;
    const empty = [0, 1, 2].filter((index) => !G.ai.spells[index]);
    if (!empty.length) return;
    if (Math.random() > 0.72) return;
    const card = traps[0];
    const zone = empty.includes(1) ? 1 : empty[0];
    removeHandCard(G.ai, card);
    G.ai.spells[zone] = { ...card, faceDown: true };
    play('set');
    renderAll();
    toast('相手がカードを1枚セット');
    await sleep(450);
  }

  async function aiAttack() {
    const attackers = G.ai.monsters
      .map((card, index) => ({ card, index }))
      .filter((item) => item.card && item.card.position === 'attack' && item.card.attacksLeft > 0);
    for (const attacker of attackers) {
      if (G.over) return;
      const current = G.ai.monsters[attacker.index];
      if (!current || current.attacksLeft <= 0) continue;
      const targets = G.player.monsters
        .map((card, index) => ({ card, index }))
        .filter((item) => item.card);
      if (!targets.length) {
        await resolveAttack('ai', attacker.index, 'player', null, true);
        await sleep(420);
        continue;
      }
      const beatable = targets.filter((item) => current.atk > (item.card.position === 'defense' ? item.card.def : item.card.atk));
      if (!beatable.length) continue;
      beatable.sort((a, b) => (b.card.position === 'defense' ? b.card.def : b.card.atk) - (a.card.position === 'defense' ? a.card.def : a.card.atk));
      await resolveAttack('ai', attacker.index, 'player', beatable[0].index, false);
      await sleep(420);
    }
  }

  async function aiTurn() {
    if (G.over) return;
    G.turn = 'ai';
    G.busy = true;
    G.selected = null;
    G.pending = null;
    G.ai.summoned = false;
    G.ai.monsters.forEach((card) => {
      if (!card) return;
      card.tempAtk = 0;
      card.positionChanged = false;
      card.attacksLeft = card.position === 'attack' ? 1 : 0;
    });
    renderAll();
    if (!drawCards('ai', 1)) return;
    renderAll();
    await sleep(520);
    if (G.over) return;
    await aiUseSpells();
    if (G.over) return;
    await aiSummon();
    if (G.over) return;
    await aiSetTrap();
    if (G.over) return;
    await aiAttack();
    if (G.over) return;
    G.busy = false;
    renderAll();
    await sleep(420);
    beginPlayerTurn(false);
  }

  function onHandClick(event) {
    const button = event.target.closest('.hand-card');
    if (!button) return;
    if (!canAct()) {
      if (G.turn === 'ai') toast('相手のターンです');
      return;
    }
    const uid = Number(button.dataset.uid);
    const card = G.player.hand.find((item) => item.uid === uid);
    if (!card) return;
    if (G.selected?.type === 'hand' && G.selected.card.uid === uid) {
      G.selected = null;
      G.pending = null;
      play('cancel');
      renderAll();
      return;
    }
    G.pending = null;
    G.selected = { type: 'hand', card };
    play('select');
    renderAll();
  }

  function onFieldClick(event) {
    const zone = event.target.closest('.zone');
    if (!zone) return;
    const side = zone.dataset.side;
    const row = zone.dataset.row;
    const index = Number(zone.dataset.index);
    const list = side === 'player' ? G.player[row === 'monster' ? 'monsters' : 'spells'] : G.ai[row === 'monster' ? 'monsters' : 'spells'];
    const card = list[index];
    if (!canAct()) {
      if (G.turn === 'ai') toast('相手のターンです');
      return;
    }
    if (G.pending?.type === 'summon') {
      if (side === 'player' && row === 'monster' && !card) performSummon(G.pending.card, index, G.pending.position);
      else toast('空きモンスターゾーンを選択してください');
      return;
    }
    if (G.pending?.type === 'setTrap') {
      if (side === 'player' && row === 'spell' && !card) performSetTrap(G.pending.card, index);
      else toast('空き魔法・罠ゾーンを選択してください');
      return;
    }
    if (G.pending?.type === 'attack') {
      if (side === 'ai' && row === 'monster' && card) resolveAttack('player', G.pending.attackerZone, 'ai', index, false);
      else toast('相手モンスターを選択してください');
      return;
    }
    if (G.pending?.type === 'effectTarget') {
      if (side === G.pending.targetSide && row === 'monster' && card) {
        const effect = G.pending.effect;
        const spell = G.pending.card;
        G.pending = null;
        resolveSpellNow(spell, side, index);
      } else {
        toast('対象を選択してください');
      }
      return;
    }
    if (side === 'player') {
      if (row === 'monster' && card) {
        if (G.selected?.type === 'field' && G.selected.side === 'player' && G.selected.row === 'monster' && G.selected.index === index) {
          G.selected = null;
          play('cancel');
          renderAll();
          return;
        }
        G.selected = { type: 'field', side: 'player', row: 'monster', index, card };
        play('select');
        renderAll();
        return;
      }
      if (row === 'spell' && card) {
        toast('伏せた罠は相手の攻撃時に自動発動します');
        return;
      }
      if (row === 'monster' && !card && G.selected?.type === 'hand' && G.selected.card.kind === 'monster') {
        performSummon(G.selected.card, index, 'attack');
        return;
      }
      if (row === 'spell' && !card && G.selected?.type === 'hand' && G.selected.card.kind === 'trap') {
        performSetTrap(G.selected.card, index);
        return;
      }
      return;
    }
    if (row === 'monster' && card) {
      if (G.selected?.type === 'field' && G.selected.side === 'player' && G.selected.card.position === 'attack' && G.selected.card.attacksLeft > 0) {
        resolveAttack('player', G.selected.index, 'ai', index, false);
        return;
      }
      toast('自分の攻撃モンスターを選択してください');
      return;
    }
    if (row === 'spell' && card) toast('伏せカードです');
  }

  function initAmbient() {
    const canvas = $('#ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let time = 0;
    const colors = ['244,207,123', '116,228,255', '157,123,255', '255,122,92'];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(clamp((width * height) / 16000, 30, 110));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: rand(0.6, 2.2),
        speed: rand(0.08, 0.34),
        drift: rand(-0.12, 0.12),
        alpha: rand(0.16, 0.62),
        phase: rand(0, Math.PI * 2),
        color: pick(colors)
      }));
    };
    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(time * 0.006 + particle.phase) * 0.08;
        if (particle.y < -8) {
          particle.y = height + 8;
          particle.x = Math.random() * width;
        }
        if (particle.x < -8) particle.x = width + 8;
        if (particle.x > width + 8) particle.x = -8;
        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.018 + particle.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${particle.color},${particle.alpha * twinkle})`;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', () => {
      resize();
      if (reduced) draw();
      renderHand();
    });
    if (!reduced) {
      window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
    }
  }

  function initPointerParallax() {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    let frame = 0;
    window.addEventListener('pointermove', (event) => {
      if (G.tilt || G.screen !== 'duel') return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--tilt-x', `${x * 1.1}deg`);
        document.documentElement.style.setProperty('--tilt-y', `${-y * 0.7}deg`);
      });
    });
  }

  function setupEvents() {
    document.addEventListener('pointerdown', () => ensureAudio(), { once: true });

    $('#quick-match').addEventListener('click', () => {
      play('click');
      startMatchmaking();
    });

    $('#code-match').addEventListener('click', () => {
      play('click');
      const input = $('#code-input');
      input.value = '';
      openOverlay('#code-modal');
      setTimeout(() => input.focus(), 250);
    });

    $('#code-close').addEventListener('click', () => {
      play('cancel');
      closeOverlay('#code-modal');
    });

    $('#code-ok').addEventListener('click', () => {
      const input = $('#code-input');
      const code = input.value.trim().toUpperCase() || genRoomCode();
      closeOverlay('#code-modal');
      play('found');
      startMatchmaking({ roomCode: code, opponent: randomOpponent() });
    });

    $('#code-input').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') $('#code-ok').click();
    });

    $('#cancel-match').addEventListener('click', () => {
      clearTimeout(G.matchTimer);
      clearTimeout(G.foundTimer);
      closeOverlay('#matchmaking');
      play('cancel');
    });

    $('#refresh-rooms').addEventListener('click', () => {
      play('click');
      makeRooms();
      toast('ルームを更新しました');
    });

    $('#room-list').addEventListener('click', (event) => {
      const row = event.target.closest('.room-row');
      if (!row) return;
      const room = G.rooms[Number(row.dataset.room)];
      if (!room) return;
      play('click');
      startMatchmaking({ opponent: room.opponent, roomCode: room.code });
    });

    $('#deck-list').addEventListener('click', (event) => {
      const choice = event.target.closest('.deck-choice');
      if (!choice) return;
      const key = choice.dataset.deck;
      if (!DECKS[key]) return;
      G.deckKey = key;
      play('select');
      renderDeckList();
    });

    $('#tilt-toggle').addEventListener('click', () => setTilt(!G.tilt));
    $('#sound-toggle').addEventListener('click', () => {
      G.sound = !G.sound;
      updateSoundUI();
      if (G.sound) play('click');
    });

    $('#howto-btn').addEventListener('click', () => {
      play('click');
      openOverlay('#howto');
    });
    $('#howto-close').addEventListener('click', () => {
      play('cancel');
      closeOverlay('#howto');
    });
    $('#howto-ok').addEventListener('click', () => {
      play('click');
      closeOverlay('#howto');
    });

    $('#menu-btn').addEventListener('click', () => {
      play('click');
      openOverlay('#menu-overlay');
    });
    $('#menu-close').addEventListener('click', () => {
      play('cancel');
      closeOverlay('#menu-overlay');
    });
    $('#menu-tilt').addEventListener('click', () => setTilt(!G.tilt));
    $('#menu-sound').addEventListener('click', () => {
      G.sound = !G.sound;
      updateSoundUI();
      if (G.sound) play('click');
    });
    $('#menu-howto').addEventListener('click', () => {
      closeOverlay('#menu-overlay');
      openOverlay('#howto');
    });
    $('#menu-surrender').addEventListener('click', () => {
      closeOverlay('#menu-overlay');
      endDuel('lose', 'surrender');
    });

    $('#player-hand').addEventListener('click', onHandClick);
    $('#player-monster-row').addEventListener('click', onFieldClick);
    $('#player-spell-row').addEventListener('click', onFieldClick);
    $('#ai-monster-row').addEventListener('click', onFieldClick);
    $('#ai-spell-row').addEventListener('click', onFieldClick);

    $('#dock-actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      handleDockAction(button.dataset.action);
    });

    $('#rematch').addEventListener('click', () => {
      play('click');
      closeOverlay('#result');
      startMatchmaking({ opponent: G.opponent || randomOpponent(), roomCode: genRoomCode(), deckKey: G.deckKey });
    });

    $('#back-lobby').addEventListener('click', () => {
      play('cancel');
      closeOverlay('#result');
      setScreen('lobby');
      makeRooms();
      renderDeckList();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = $('.overlay.is-open');
      if (!open) return;
      if (open.id === 'menu-overlay' || open.id === 'howto' || open.id === 'code-modal') {
        closeOverlay(`#${open.id}`);
        play('cancel');
      }
    });
  }

  function boot() {
    initAmbient();
    initPointerParallax();
    renderDeckList();
    makeRooms();
    updateTiltUI();
    updateSoundUI();
    setupEvents();
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      $('#code-input').value = room.toUpperCase();
    }
    document.body.dataset.ready = 'true';
    window.duelRoom = {
      state: G,
      start: () => startMatchmaking(),
      startNow: () => {
        G.opponent = G.opponent || randomOpponent();
        G.roomCode = G.roomCode || genRoomCode();
        startDuel();
      },
      render: renderAll
    };
  }

  boot();
})();
