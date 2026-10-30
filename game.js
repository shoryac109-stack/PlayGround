(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const CARD_DB = {
    vega: {
      key: 'vega', name: '星海竜ヴェガ', en: 'VEGA DRAGON', type: 'monster', attribute: 'LIGHT',
      level: 6, atk: 2400, def: 2000, art: 'dragon', hue: 196,
      effect: '召喚時、相手に300ダメージを与える。星の海を渡る古龍。', summonBurn: 300
    },
    crimson: {
      key: 'crimson', name: '紅蓮騎士カイ', en: 'CRIMSON KNIGHT KAI', type: 'monster', attribute: 'FIRE',
      level: 4, atk: 1800, def: 1200, art: 'knight', hue: 12,
      effect: '灼熱の剣を掲げる騎士。攻め込むほどに力を増す。'
    },
    azure: {
      key: 'azure', name: '蒼月の魔術師', en: 'AZURE MOON MAGE', type: 'monster', attribute: 'WATER',
      level: 4, atk: 1500, def: 1500, art: 'mage', hue: 212,
      effect: '召喚時、デッキからカードを1枚ドローする。', summonDraw: 1
    },
    guardian: {
      key: 'guardian', name: '鉄壁のガーディアン', en: 'IRONWALL GUARDIAN', type: 'monster', attribute: 'EARTH',
      level: 4, atk: 800, def: 2200, art: 'guardian', hue: 45,
      effect: '守備表示の要。高い守備力で攻撃を跳ね返す。'
    },
    wolf: {
      key: 'wolf', name: '影走りの狼', en: 'SHADOWFANG WOLF', type: 'monster', attribute: 'DARK',
      level: 3, atk: 1600, def: 900, art: 'wolf', hue: 274,
      effect: '影から影へと駆ける狼。すばやい牙が獲物を捉える。'
    },
    seraph: {
      key: 'seraph', name: '天空のセラフ', en: 'SKY SERAPH', type: 'monster', attribute: 'LIGHT',
      level: 5, atk: 2100, def: 1800, art: 'seraph', hue: 51,
      effect: '召喚時、自分のLPを500回復する。', summonHeal: 500
    },
    leviathan: {
      key: 'leviathan', name: '深淵のリヴァイアサン', en: 'ABYSS LEVIATHAN', type: 'monster', attribute: 'WATER',
      level: 7, atk: 2800, def: 2400, art: 'leviathan', hue: 232,
      effect: '守備表示モンスターを攻撃した場合、貫通ダメージを与える。', pierce: true
    },
    omega: {
      key: 'omega', name: '機械兵オメガ', en: 'MECH SOLDIER OMEGA', type: 'monster', attribute: 'EARTH',
      level: 4, atk: 1900, def: 1000, art: 'mech', hue: 178,
      effect: '自己修復機構を備えた戦闘機械。正確な一撃を放つ。'
    },
    spirit: {
      key: 'spirit', name: '森の精霊', en: 'FOREST SPIRIT', type: 'monster', attribute: 'EARTH',
      level: 3, atk: 1200, def: 1400, art: 'spirit', hue: 121,
      effect: '召喚時、自分のLPを300回復する。', summonHeal: 300
    },
    hound: {
      key: 'hound', name: '冥府の番犬', en: 'UNDERWORLD HOUND', type: 'monster', attribute: 'DARK',
      level: 4, atk: 1700, def: 1200, art: 'hound', hue: 326,
      effect: '破壊された時、相手に300ダメージを与える。', destroyBurn: 300
    },
    torrent: {
      key: 'torrent', name: '魔力の奔流', en: 'MANA TORRENT', type: 'spell', attribute: 'SPELL',
      art: 'spell', hue: 191, spell: 'burn', value: 700,
      effect: '相手に700ダメージを与える。'
    },
    blessing: {
      key: 'blessing', name: '星の加護', en: 'STELLAR BLESSING', type: 'spell', attribute: 'SPELL',
      art: 'spell', hue: 49, spell: 'heal', value: 800,
      effect: '自分のLPを800回復する。'
    },
    flash: {
      key: 'flash', name: '破壊の閃光', en: 'DESTRUCTION FLASH', type: 'spell', attribute: 'SPELL',
      art: 'spell', hue: 282, spell: 'destroy',
      effect: '相手モンスター1体を破壊する。'
    },
    double: {
      key: 'double', name: '二重召喚', en: 'DOUBLE SUMMON', type: 'spell', attribute: 'SPELL',
      art: 'spell', hue: 119, spell: 'extraSummon',
      effect: 'このターン、もう1度モンスターを召喚できる。'
    },
    alchemy: {
      key: 'alchemy', name: '手札の錬金術', en: 'HAND ALCHEMY', type: 'spell', attribute: 'SPELL',
      art: 'spell', hue: 326, spell: 'draw', value: 2, cost: 500,
      effect: 'カードを2枚ドローし、自分のLPを500失う。'
    },
    barrier: {
      key: 'barrier', name: '聖なる防壁', en: 'SACRED BARRIER', type: 'trap', attribute: 'TRAP',
      art: 'trap', hue: 48, trap: 'negateAttack', value: 500,
      effect: '相手の攻撃を無効にし、自分のLPを500回復する。'
    },
    pitfall: {
      key: 'pitfall', name: '落とし穴', en: 'PITFALL', type: 'trap', attribute: 'TRAP',
      art: 'trap', hue: 202, trap: 'destroyAttacker',
      effect: '相手の攻撃モンスターを破壊する。'
    },
    backfire: {
      key: 'backfire', name: '反撃の業火', en: 'BACKFIRE', type: 'trap', attribute: 'TRAP',
      art: 'trap', hue: 9, trap: 'burn', value: 600,
      effect: '相手に600ダメージを与える。'
    }
  };

  const DECK_LIST = [
    'vega', 'crimson', 'azure', 'guardian', 'wolf', 'seraph', 'leviathan', 'omega', 'spirit', 'hound',
    'crimson', 'azure', 'guardian', 'wolf', 'omega',
    'torrent', 'blessing', 'flash', 'double', 'alchemy',
    'barrier', 'pitfall', 'backfire', 'barrier', 'pitfall'
  ];

  const ART = {
    dragon: `
      <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 111c8-23 8-38 20-55 9-13 24-20 37-13 12 6 14 23 4 30-8 6-21 3-22-7-1-8 6-13 12-10"/>
        <path d="M58 55 45 44l10-3 7-15 4 17 18-6-11 17Z" fill="currentColor" fill-opacity=".2"/>
        <path d="M78 76c8 4 13 10 15 18M83 89c6 2 10 6 13 12"/>
        <circle cx="79" cy="57" r="2" fill="currentColor" stroke="none"/>
        <path d="M31 106c-5 2-8 6-9 11" stroke-opacity=".5"/>
      </g>`,
    knight: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M60 23 86 37v27c0 18-11 32-26 40-15-8-26-22-26-40V37l26-14Z" fill="currentColor" fill-opacity=".12"/>
        <path d="M60 35 77 44v19c0 12-7 22-17 28-10-6-17-16-17-28V44l17-9Z"/>
        <path d="M60 49v27M50 61h20"/>
        <path d="M87 26 96 17M91 22l5 5M24 101l-7 8M20 105l5 5" stroke-opacity=".65"/>
      </g>`,
    mage: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M43 26c-14 7-22 21-22 36 0 17 13 31 30 31 9 0 18-4 24-11-16 1-28-10-28-26 0-13 8-23 20-27-7-4-16-5-24-3Z" fill="currentColor" fill-opacity=".15"/>
        <path d="M86 20v66M76 20h20M80 92h13"/>
        <circle cx="86" cy="20" r="4" fill="currentColor" stroke="none"/>
        <path d="m34 31 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5ZM101 48l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5L101 48Z" fill="currentColor" stroke="none" opacity=".7"/>
      </g>`,
    guardian: `
      <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M60 24 88 38v27c0 19-12 33-28 40-16-7-28-21-28-40V38l28-14Z" fill="currentColor" fill-opacity=".13"/>
        <path d="M60 38 78 47v17c0 12-7 22-18 28-11-6-18-16-18-28V47l18-9Z"/>
        <path d="M60 51 66 62 60 76 54 62Z" fill="currentColor" fill-opacity=".45"/>
        <path d="M28 28 18 18M24 22l-6 1M31 101l-9 9M27 106l-6 1" stroke-opacity=".55"/>
      </g>`,
    wolf: `
      <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m28 99 8-57 18 13 6-20 7 20 17-13 8 57-32 26-32-26Z" fill="currentColor" fill-opacity=".12"/>
        <path d="m41 65 17 11-5 8-14-7M79 65 62 76l5 8 14-7"/>
        <path d="M51 91c5 4 13 4 18 0M53 99l7 6 7-6"/>
        <circle cx="51" cy="70" r="2" fill="currentColor" stroke="none"/>
        <circle cx="69" cy="70" r="2" fill="currentColor" stroke="none"/>
      </g>`,
    seraph: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="43" r="15" fill="currentColor" fill-opacity=".14"/>
        <path d="M60 28v30M53 35c1 7 4 11 7 14 3-3 6-7 7-14"/>
        <path d="M45 49C32 46 23 51 19 64c13-2 23 2 30 10M75 49c13-3 22 2 26 15-13-2-23 2-30 10"/>
        <path d="M35 57c-5 2-9 6-11 11M85 57c5 2 9 6 11 11M42 75c-2 7 0 13 5 18M78 75c2 7 0 13-5 18"/>
        <path d="M60 73v31M54 104h12" stroke-opacity=".65"/>
      </g>`,
    leviathan: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 74c11-9 21-9 32 0 11 9 21 9 32 0 7-6 13-7 18-4M19 91c11-9 21-9 32 0 11 9 21 9 32 0 7-6 13-7 18-4M19 108c11-9 21-9 32 0 11 9 21 9 32 0 7-6 13-7 18-4"/>
        <path d="M60 22c-20 0-34 14-34 30 0 13 8 24 20 28 5-10 9-16 14-21 5 5 9 11 14 21 12-4 20-15 20-28 0-16-14-30-34-30Z" fill="currentColor" fill-opacity=".12"/>
        <path d="M60 36c-8 0-14 5-14 12s6 12 14 12 14-5 14-12-6-12-14-12Z"/>
        <path d="M60 40v16M52 48h16" stroke-opacity=".7"/>
      </g>`,
    mech: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="m60 20 31 18v36L60 92 29 74V38l31-18Z" fill="currentColor" fill-opacity=".1"/>
        <circle cx="60" cy="56" r="18"/>
        <circle cx="60" cy="56" r="8" fill="currentColor" fill-opacity=".28"/>
        <path d="M60 26v12M60 74v12M34 42l10 6M76 64l10 6M34 70l10-6M76 48l10-6"/>
        <path d="M44 101h32M52 108h16M60 96v16" stroke-opacity=".55"/>
      </g>`,
    spirit: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M60 101V49M60 66 42 51M60 72l18-17M60 82 48 72M60 84l13-10" />
        <circle cx="60" cy="43" r="20" fill="currentColor" fill-opacity=".14"/>
        <circle cx="42" cy="48" r="13" fill="currentColor" fill-opacity=".09"/>
        <circle cx="78" cy="48" r="13" fill="currentColor" fill-opacity=".09"/>
        <circle cx="49" cy="69" r="12" fill="currentColor" fill-opacity=".08"/>
        <circle cx="72" cy="68" r="12" fill="currentColor" fill-opacity=".08"/>
        <path d="M44 101h32M52 108h16" stroke-opacity=".55"/>
      </g>`,
    hound: `
      <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M36 59 31 28l20 15M84 59l5-31-20 15"/>
        <path d="M42 46c-7 8-9 20-5 32 5 15 12 23 23 24 11-1 18-9 23-24 4-12 2-24-5-32-8-8-28-8-36 0Z" fill="currentColor" fill-opacity=".11"/>
        <path d="M48 65 44 77l9-4M72 65l4 12-9-4"/>
        <circle cx="50" cy="63" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="70" cy="63" r="2.5" fill="currentColor" stroke="none"/>
        <path d="M55 84h10M57 84v8l3 5 3-5v-8M44 92l6 8M76 92l-6 8" stroke-opacity=".8"/>
      </g>`,
    spell: `
      <g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="61" r="34" stroke-dasharray="3 6"/>
        <circle cx="60" cy="61" r="25"/>
        <path d="m60 26 7 25 22 10-22 10-7 25-7-25-22-10 22-10 7-25Z" fill="currentColor" fill-opacity=".14"/>
        <path d="m69 43-14 20h10l-6 18 14-21H63l6-17Z" fill="currentColor" fill-opacity=".8"/>
        <path d="M26 103h68M34 110h52" stroke-opacity=".55"/>
      </g>`,
    trap: `
      <g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M60 21 96 92H24l36-71Z" fill="currentColor" fill-opacity=".1"/>
        <path d="M60 38 84 84H36l24-46Z"/>
        <path d="M60 49c-10 0-17 7-19 15 9 0 16 4 19 11 3-7 10-11 19-11-2-8-9-15-19-15Z" fill="currentColor" fill-opacity=".16"/>
        <circle cx="60" cy="64" r="5" fill="currentColor" fill-opacity=".75" stroke="none"/>
        <path d="M29 101h62M38 108h44" stroke-opacity=".55"/>
      </g>`
  };

  const els = {
    menu: $('#menuScreen'),
    game: $('#gameScreen'),
    playBtn: $('#playBtn'),
    roomCode: $('#roomCode'),
    gameRoomCode: $('#gameRoomCode'),
    heroFan: $('#heroFan'),
    soundBtn: $('#soundBtn'),
    gameSoundBtn: $('#gameSoundBtn'),
    helpBtn: $('#helpBtn'),
    tiltBtn: $('#tiltBtn'),
    gameTiltBtn: $('#gameTiltBtn'),
    tiltState: $('#tiltState'),
    fullscreenBtn: $('#fullscreenBtn'),
    exitBtn: $('#exitBtn'),
    turnChip: $('#turnChip'),
    turnLabel: $('#turnLabel'),
    phaseLabel: $('#phaseLabel'),
    aiLp: $('#aiLp'),
    playerLp: $('#playerLp'),
    aiLpBar: $('#aiLpBar'),
    playerLpBar: $('#playerLpBar'),
    aiHandCount: $('#aiHandCount'),
    aiDeckCount: $('#aiDeckCount'),
    aiGraveCount: $('#aiGraveCount'),
    aiDeckCountSide: $('#aiDeckCountSide'),
    playerDeckCount: $('#playerDeckCount'),
    playerGraveCount: $('#playerGraveCount'),
    playerDeckCountSide: $('#playerDeckCountSide'),
    handCount: $('#handCount'),
    handHint: $('#handHint'),
    handCards: $('#handCards'),
    promptBox: $('#promptBox'),
    promptText: $('#promptText'),
    targetCancel: $('#targetCancel'),
    endTurnBtn: $('#endTurnBtn'),
    field: $('#field'),
    arena: $('#arena'),
    fxLayer: $('#fxLayer'),
    aiSpellRow: $('#aiSpellRow'),
    aiMonsterRow: $('#aiMonsterRow'),
    playerMonsterRow: $('#playerMonsterRow'),
    playerSpellRow: $('#playerSpellRow'),
    sheetBackdrop: $('#sheetBackdrop'),
    cardSheet: $('#cardSheet'),
    sheetClose: $('#sheetClose'),
    sheetPreview: $('#sheetPreview'),
    sheetType: $('#sheetType'),
    sheetAttr: $('#sheetAttr'),
    sheetName: $('#sheetName'),
    sheetEn: $('#sheetEn'),
    sheetStats: $('#sheetStats'),
    sheetEffect: $('#sheetEffect'),
    sheetActions: $('#sheetActions'),
    modalBackdrop: $('#modalBackdrop'),
    helpModal: $('#helpModal'),
    resultModal: $('#resultModal'),
    exitModal: $('#exitModal'),
    resultSigil: $('#resultSigil'),
    resultKicker: $('#resultKicker'),
    resultTitle: $('#resultTitle'),
    resultSub: $('#resultSub'),
    resultRoom: $('#resultRoom'),
    resultTurns: $('#resultTurns'),
    resultLp: $('#resultLp'),
    replayBtn: $('#replayBtn'),
    menuBtn: $('#menuBtn'),
    exitConfirm: $('#exitConfirm'),
    exitCancel: $('#exitCancel'),
    toastHost: $('#toastHost'),
    bgCanvas: $('#bgCanvas')
  };

  const state = {
    started: false,
    over: false,
    turn: 'player',
    turnCount: 1,
    roomCode: 'A7K-219',
    lp: { player: 4000, ai: 4000 },
    deck: { player: [], ai: [] },
    hand: { player: [], ai: [] },
    grave: { player: [], ai: [] },
    field: {
      player: { monsters: Array(5).fill(null), spells: Array(5).fill(null) },
      ai: { monsters: Array(5).fill(null), spells: Array(5).fill(null) }
    },
    gameToken: 0,
    summonsLeft: { player: 1, ai: 1 },
    attacksUsed: { player: new Set(), ai: new Set() },
    positionChanged: new Set(),
    target: null,
    selectedHandUid: null,
    sheetContext: null,
    promptOverride: null,
    promptTimer: 0,
    resolving: false,
    aiBusy: false
  };

  const tilt = {
    enabled: false,
    orientationSeen: false,
    motionSeen: false,
    probe: 0,
    raf: 0,
    x: 0,
    y: 0
  };

  let uidCounter = 0;
  let artCounter = 0;
  let audioContext = null;
  let soundOn = true;
  let bgWidth = 0;
  let bgHeight = 0;
  let bgDpr = 1;
  let bgParticles = [];
  let bgStars = [];

  function newCard(key) {
    return { ...CARD_DB[key], uid: ++uidCounter };
  }

  function shuffle(list) {
    const result = [...list];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function makeRoomCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part = (length) => Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    return `${part(3)}-${part(3)}`;
  }

  function otherSide(side) {
    return side === 'player' ? 'ai' : 'player';
  }

  function findCardInHand(side, uid) {
    return state.hand[side].find((card) => card.uid === uid) || null;
  }

  function findSlotByUid(side, uid) {
    for (const row of ['monsters', 'spells']) {
      const index = state.field[side][row].findIndex((slot) => slot && slot.card.uid === uid);
      if (index >= 0) return { side, row, index, slot: state.field[side][row][index] };
    }
    return null;
  }

  function firstEmpty(side, row) {
    return state.field[side][row].findIndex((slot) => !slot);
  }

  function getTrap(side) {
    return state.field[side].spells.find((slot) => slot && slot.faceDown && slot.card.type === 'trap') || null;
  }

  function slotValue(slot) {
    if (!slot) return 0;
    if (slot.faceDown || slot.position === 'def') return slot.card.def;
    return slot.card.atk;
  }

  function hasMonsters(side) {
    return state.field[side].monsters.some(Boolean);
  }

  function cardAccent(card) {
    return `hsl(${card.hue} 92% 66%)`;
  }

  function cardArt(card) {
    const id = `art${++artCounter}`;
    const hue = card.hue;
    return `<svg viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="${id}a" cx="50%" cy="42%" r="68%">
          <stop offset="0" stop-color="hsl(${hue} 96% 73%)" stop-opacity=".6"/>
          <stop offset=".46" stop-color="hsl(${hue + 36} 82% 28%)" stop-opacity=".38"/>
          <stop offset="1" stop-color="#030812"/>
        </radialGradient>
        <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 100% 84%)"/>
          <stop offset="1" stop-color="hsl(${hue + 68} 100% 58%)"/>
        </linearGradient>
        <pattern id="${id}p" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0v12" fill="none" stroke="hsl(${hue} 100% 76%)" stroke-opacity=".085"/>
        </pattern>
      </defs>
      <rect width="120" height="140" fill="url(#${id}a)"/>
      <rect width="120" height="140" fill="url(#${id}p)"/>
      <circle cx="60" cy="62" r="48" fill="none" stroke="url(#${id}b)" stroke-opacity=".23" stroke-width=".8" stroke-dasharray="2 5"/>
      <circle cx="60" cy="62" r="55" fill="none" stroke="url(#${id}b)" stroke-opacity=".11" stroke-width=".7"/>
      <g color="url(#${id}b)">${ART[card.art] || ART.spell}</g>
      <path d="M8 130h104" stroke="url(#${id}b)" stroke-opacity=".22" stroke-width=".8"/>
    </svg>`;
  }

  function cardMarkup(card, options = {}) {
    if (options.back) {
      return '<div class="card__frame"><div class="card__inner"></div></div>';
    }
    const stats = card.type === 'monster'
      ? `<span>ATK <b>${card.atk}</b></span><span>DEF <b>${card.def}</b></span>`
      : `<span>${card.type === 'spell' ? 'SPELL' : 'TRAP'}</span><span>${card.spell === 'destroy' || card.trap === 'destroyAttacker' ? 'TARGET' : 'QUICK'}</span>`;
    const level = card.type === 'monster'
      ? `<span class="card__level">${'★'.repeat(Math.min(card.level, 7))}</span>`
      : '';
    const badge = card.type === 'monster'
      ? `L${card.level}`
      : card.type === 'spell' ? 'SP' : 'TR';
    return `<div class="card__frame">
      <div class="card__inner">
        <div class="card__top"><span class="card__name">${card.name}</span>${level}</div>
        <div class="card__art">${cardArt(card)}<span class="card__badge">${badge}</span></div>
        <div class="card__stats">${stats}</div>
      </div>
    </div>`;
  }

  function makeCardEl(card, options = {}) {
    const element = document.createElement('div');
    element.className = `card${options.mini ? ' card--mini' : ''}${options.back ? ' card--back' : ''}`;
    if (!options.back) element.style.setProperty('--accent', cardAccent(card));
    element.innerHTML = cardMarkup(card, options);
    return element;
  }

  function makeBackEl() {
    return makeCardEl(null, { back: true });
  }

  function renderHeroFan() {
    const keys = ['vega', 'crimson', 'azure', 'seraph', 'leviathan'];
    els.heroFan.innerHTML = '';
    keys.forEach((key) => els.heroFan.appendChild(makeCardEl(CARD_DB[key])));
  }

  function setRoomCode(code) {
    state.roomCode = code;
    els.roomCode.textContent = code;
    els.gameRoomCode.textContent = code;
    els.resultRoom.textContent = code;
  }

  function updateLpUi(side) {
    const value = Math.max(0, state.lp[side]);
    const percent = clamp((value / 4000) * 100, 0, 100);
    const number = side === 'player' ? els.playerLp : els.aiLp;
    const bar = side === 'player' ? els.playerLpBar : els.aiLpBar;
    number.textContent = String(value);
    bar.style.width = `${percent}%`;
    bar.classList.toggle('is-low', value <= 1200);
  }

  function renderHud() {
    updateLpUi('player');
    updateLpUi('ai');
    els.aiHandCount.textContent = String(state.hand.ai.length);
    els.aiDeckCount.textContent = String(state.deck.ai.length);
    els.aiGraveCount.textContent = String(state.grave.ai.length);
    els.aiDeckCountSide.textContent = String(state.deck.ai.length);
    els.playerDeckCount.textContent = String(state.deck.player.length);
    els.playerGraveCount.textContent = String(state.grave.player.length);
    els.playerDeckCountSide.textContent = String(state.deck.player.length);
    els.handCount.textContent = String(state.hand.player.length);
    els.turnChip.classList.toggle('is-ai', state.turn === 'ai');
    els.turnLabel.textContent = state.over ? 'DUEL OVER' : state.turn === 'player' ? 'YOUR TURN' : "ASTRA'S TURN";
    els.phaseLabel.textContent = state.aiBusy ? 'THINKING' : 'MAIN PHASE';
    els.endTurnBtn.disabled = state.over || state.turn !== 'player' || state.resolving || state.aiBusy;
    els.game.classList.toggle('is-ai-turn', state.turn === 'ai' || state.aiBusy || state.resolving);
    els.handHint.textContent = state.turn === 'player' && !state.resolving
      ? 'カードをタップして選択'
      : state.over ? 'デュエル終了' : '相手のターン…';
  }

  function isTargetZone(side, row, index) {
    const target = state.target;
    if (!target) return false;
    if (target.mode === 'summon' || target.mode === 'setMonster') {
      return side === 'player' && row === 'monsters' && !state.field.player.monsters[index];
    }
    if (target.mode === 'setTrap') {
      return side === 'player' && row === 'spells' && !state.field.player.spells[index];
    }
    if (target.mode === 'spellDestroy' || target.mode === 'attack') {
      return side === 'ai' && row === 'monsters' && Boolean(state.field.ai.monsters[index]);
    }
    return false;
  }

  function renderRow(side, row, container) {
    container.innerHTML = '';
    state.field[side][row].forEach((slot, index) => {
      const zone = document.createElement('button');
      zone.type = 'button';
      zone.className = 'zone';
      zone.dataset.side = side;
      zone.dataset.row = row;
      zone.dataset.index = String(index);
      zone.setAttribute('aria-label', slot ? slot.card.name : 'Empty zone');
      if (isTargetZone(side, row, index)) zone.classList.add('is-target');
      if (slot) {
        zone.classList.add('has-card');
        const cardElement = slot.faceDown ? makeBackEl() : makeCardEl(slot.card, { mini: true });
        if (!slot.faceDown && slot.position === 'def') cardElement.classList.add('card--def');
        cardElement.dataset.uid = String(slot.card.uid);
        zone.appendChild(cardElement);
      } else {
        const rune = document.createElement('span');
        rune.className = 'zone__rune';
        zone.appendChild(rune);
      }
      container.appendChild(zone);
    });
  }

  function renderField() {
    renderRow('ai', 'spells', els.aiSpellRow);
    renderRow('ai', 'monsters', els.aiMonsterRow);
    renderRow('player', 'monsters', els.playerMonsterRow);
    renderRow('player', 'spells', els.playerSpellRow);
  }

  function renderHand() {
    els.handCards.innerHTML = '';
    state.hand.player.forEach((card) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'hand-card';
      button.dataset.uid = String(card.uid);
      button.setAttribute('aria-label', card.name);
      if (state.selectedHandUid === card.uid) button.classList.add('is-selected');
      if (state.turn !== 'player' || state.resolving || state.aiBusy) button.classList.add('is-disabled');
      button.appendChild(makeCardEl(card));
      els.handCards.appendChild(button);
    });
    els.handCards.classList.toggle('is-centered', els.handCards.scrollWidth <= els.handCards.clientWidth + 2);
  }

  function targetPrompt(target) {
    if (!target) return '';
    if (target.mode === 'summon') return 'モンスターゾーンを選択して召喚';
    if (target.mode === 'setMonster') return 'モンスターゾーンを選択してセット';
    if (target.mode === 'setTrap') return '魔法・罠ゾーンを選択してセット';
    if (target.mode === 'spellDestroy') return '破壊する相手モンスターを選択';
    if (target.mode === 'attack') return '攻撃対象を選択';
    return '';
  }

  function renderPrompt(tone = '') {
    let text = 'カードをタップして選択';
    let activeTone = tone;
    if (state.over) text = 'デュエル終了';
    else if (state.target) text = targetPrompt(state.target);
    else if (state.promptOverride && Date.now() < state.promptOverride.until) { text = state.promptOverride.text; activeTone = state.promptOverride.tone; }
    else if (state.aiBusy || state.turn === 'ai') text = 'ASTRAが思考中…';
    else if (state.selectedHandUid) text = 'カードを選択中';
    els.promptText.textContent = text;
    els.promptBox.classList.toggle('is-warn', activeTone === 'warn');
    els.promptBox.classList.toggle('is-danger', activeTone === 'danger');
    els.targetCancel.hidden = !state.target || state.over;
  }

  function render() {
    if (!state.started) return;
    renderHud();
    renderField();
    renderHand();
    renderPrompt();
  }

  function toast(message, tone = '') {
    if (state.started && !state.over && els.game.classList.contains('is-active')) {
      state.promptOverride = { text: message, tone, until: Date.now() + 2200 };
      clearTimeout(state.promptTimer);
      state.promptTimer = setTimeout(() => { state.promptOverride = null; renderPrompt(); }, 2200);
      renderPrompt();
      return;
    }
    const element = document.createElement('div');
    element.className = `toast${tone ? ` toast--${tone}` : ''}`;
    element.textContent = message;
    els.toastHost.appendChild(element);
    while (els.toastHost.children.length > 3) els.toastHost.firstElementChild.remove();
    setTimeout(() => {
      element.classList.add('is-out');
      setTimeout(() => element.remove(), 260);
    }, 2300);
  }

  function initAudio() {
    if (audioContext) {
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return;
    }
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try { audioContext = new AudioCtor(); } catch { audioContext = null; }
  }

  function tone(freq, duration, type = 'sine', volume = 0.04, delay = 0, endFreq = null) {
    if (!soundOn || !audioContext) return;
    const now = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, now);
    if (endFreq) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  function playSound(name) {
    if (!soundOn) return;
    if (!audioContext) initAudio();
    if (!audioContext) return;
    if (name === 'click') tone(420, 0.05, 'sine', 0.018, 0, 280);
    else if (name === 'select') { tone(520, 0.07, 'triangle', 0.022); tone(780, 0.09, 'sine', 0.015, 0.04); }
    else if (name === 'summon') { tone(180, 0.32, 'sawtooth', 0.018, 0, 520); tone(760, 0.28, 'sine', 0.018, 0.05); }
    else if (name === 'draw') { tone(660, 0.08, 'triangle', 0.018); tone(880, 0.12, 'sine', 0.015, 0.05); }
    else if (name === 'attack') { tone(120, 0.16, 'sawtooth', 0.032, 0, 55); tone(620, 0.12, 'triangle', 0.02, 0.02, 180); }
    else if (name === 'hit') tone(70, 0.28, 'square', 0.025, 0, 36);
    else if (name === 'heal') { tone(520, 0.16, 'sine', 0.022, 0, 760); tone(780, 0.2, 'triangle', 0.015, 0.06, 1040); }
    else if (name === 'trap') { tone(300, 0.14, 'square', 0.02, 0, 130); tone(880, 0.18, 'sine', 0.015, 0.06); }
    else if (name === 'turn') { tone(330, 0.12, 'sine', 0.018); tone(440, 0.16, 'sine', 0.018, 0.06); }
    else if (name === 'win') { [523, 659, 784, 1046].forEach((freq, index) => tone(freq, 0.3, 'triangle', 0.03, index * 0.11)); }
    else if (name === 'lose') { [392, 330, 262, 196].forEach((freq, index) => tone(freq, 0.34, 'sine', 0.03, index * 0.12)); }
  }

  function setSoundUi() {
    const svg = `<svg><use href="#${soundOn ? 'i-sound' : 'i-mute'}"></use></svg>`;
    [els.soundBtn, els.gameSoundBtn].forEach((button) => {
      button.innerHTML = svg;
      button.setAttribute('aria-pressed', String(soundOn));
      button.setAttribute('aria-label', soundOn ? 'Mute sound' : 'Enable sound');
    });
  }

  function toggleSound() {
    soundOn = !soundOn;
    setSoundUi();
    if (soundOn) {
      initAudio();
      playSound('click');
    }
    toast(soundOn ? 'サウンド ON' : 'サウンド OFF');
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch { /* ignore */ }
    }
  }

  function fxPoint(element, fallbackSide = 'center') {
    const arena = els.arena.getBoundingClientRect();
    if (element) {
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - arena.left, y: rect.top + rect.height / 2 - arena.top };
    }
    if (fallbackSide === 'ai') return { x: arena.width / 2, y: arena.height * 0.27 };
    if (fallbackSide === 'player') return { x: arena.width / 2, y: arena.height * 0.74 };
    return { x: arena.width / 2, y: arena.height / 2 };
  }

  function addFx(element) {
    if (element) els.fxLayer.appendChild(element);
    return element;
  }

  function spawnDamage(side, amount, isHeal = false, element = null) {
    if (!amount) return;
    const point = fxPoint(element, side);
    const node = document.createElement('div');
    node.className = `damage-number${isHeal ? ' is-heal' : ''}`;
    node.textContent = `${isHeal ? '+' : '-'}${amount}`;
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
    addFx(node);
    setTimeout(() => node.remove(), 1200);
  }

  function spawnBurst(x, y) {
    const node = document.createElement('div');
    node.className = 'hit-burst';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    addFx(node);
    setTimeout(() => node.remove(), 600);
  }

  function spawnSummonRing(element) {
    if (!element) return;
    const point = fxPoint(element);
    const node = document.createElement('div');
    node.className = 'summon-flash';
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
    addFx(node);
    setTimeout(() => node.remove(), 700);
  }

  function spawnBeam(fromElement, toElement, toSide = 'ai') {
    const from = fxPoint(fromElement, 'player');
    const to = fxPoint(toElement, toSide);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const node = document.createElement('div');
    node.className = 'attack-beam';
    node.style.left = `${from.x}px`;
    node.style.top = `${from.y}px`;
    node.style.width = `${length}px`;
    node.style.setProperty('--beam-angle', `${angle}deg`);
    addFx(node);
    setTimeout(() => node.remove(), 450);
  }

  function shakeArena() {
    els.arena.classList.remove('shake');
    void els.arena.offsetWidth;
    els.arena.classList.add('shake');
    setTimeout(() => els.arena.classList.remove('shake'), 380);
  }

  function flashScreen() {
    els.game.classList.remove('flash');
    void els.game.offsetWidth;
    els.game.classList.add('flash');
    setTimeout(() => els.game.classList.remove('flash'), 300);
  }

  function damage(side, amount, sourceElement = null) {
    if (amount <= 0 || state.over) return;
    state.lp[side] = Math.max(0, state.lp[side] - amount);
    updateLpUi(side);
    spawnDamage(side, amount, false, sourceElement);
    shakeArena();
    flashScreen();
    playSound('hit');
    vibrate(side === 'player' ? [30, 25, 30] : 20);
    if (state.lp[side] <= 0) endGame(otherSide(side), side === 'player' ? 'あなたのLPが0になりました。' : '相手のLPを0にしました。');
  }

  function heal(side, amount, sourceElement = null) {
    if (amount <= 0 || state.over) return;
    state.lp[side] = Math.min(4000, state.lp[side] + amount);
    updateLpUi(side);
    spawnDamage(side, amount, true, sourceElement);
    playSound('heal');
  }

  function drawCard(side) {
    if (!state.deck[side].length) return false;
    const card = state.deck[side].pop();
    state.hand[side].push(card);
    return true;
  }

  function moveToGrave(side, row, index) {
    const slot = state.field[side][row][index];
    if (!slot) return null;
    state.field[side][row][index] = null;
    state.grave[side].push(slot.card);
    const effect = slot.card.destroyBurn;
    if (effect) {
      setTimeout(() => {
        if (!state.over) {
          toast(`${slot.card.name} の効果 — ${effect}ダメージ`, 'gold');
          damage(otherSide(side), effect);
        }
      }, 260);
    }
    return slot;
  }

  function resolveSummonEffect(side, slot) {
    if (!slot) return;
    const card = slot.card;
    if (card.summonBurn) {
      setTimeout(() => {
        if (!state.over) {
          toast(`${card.name} の効果 — ${card.summonBurn}ダメージ`, 'gold');
          damage(otherSide(side), card.summonBurn);
        }
      }, 220);
    }
    if (card.summonHeal) {
      setTimeout(() => {
        if (!state.over) {
          toast(`${card.name} の効果 — LP回復`, 'gold');
          heal(side, card.summonHeal);
        }
      }, 180);
    }
    if (card.summonDraw) {
      setTimeout(() => {
        if (state.over) return;
        for (let index = 0; index < card.summonDraw; index += 1) drawCard(side);
        toast(`${card.name} の効果 — カードをドロー`, 'gold');
        render();
      }, 170);
    }
  }

  function summonCard(side, card, index, faceDown = false) {
    const fieldSide = state.field[side];
    if (!fieldSide.monsters[index]) {
      fieldSide.monsters[index] = {
        card,
        position: faceDown ? 'set' : 'atk',
        faceDown,
        setTurn: state.turnCount
      };
      const element = $$('.zone', side === 'player' ? els.playerMonsterRow : els.aiMonsterRow)[index];
      spawnSummonRing(element);
      playSound('summon');
      vibrate(18);
      return true;
    }
    return false;
  }

  function setTrapCard(side, card, index) {
    if (state.field[side].spells[index]) return false;
    state.field[side].spells[index] = {
      card,
      position: 'set',
      faceDown: true,
      setTurn: state.turnCount
    };
    playSound('click');
    return true;
  }

  function removeFromHand(side, uid) {
    const index = state.hand[side].findIndex((card) => card.uid === uid);
    if (index < 0) return null;
    return state.hand[side].splice(index, 1)[0];
  }

  function beginTarget(mode, payload = {}) {
    state.promptOverride = null;
    clearTimeout(state.promptTimer);
    state.target = { mode, ...payload };
    state.selectedHandUid = null;
    closeSheet();
    render();
    playSound('select');
  }

  function clearTarget() {
    state.target = null;
    state.selectedHandUid = null;
    render();
  }

  function availableMonsterZones(side) {
    return state.field[side].monsters.reduce((count, slot) => count + (slot ? 0 : 1), 0);
  }

  function sheetButton(label, english, action, disabled = false, extraClass = 'btn--primary') {
    return `<button class="btn ${extraClass}" type="button" data-action="${action}"${disabled ? ' disabled' : ''}>${label}<small>${english}</small></button>`;
  }

  function openSheet(card, context) {
    state.sheetContext = context;
    els.sheetPreview.innerHTML = '';
    els.sheetPreview.appendChild(makeCardEl(card));
    els.sheetType.textContent = card.type === 'monster' ? 'MONSTER' : card.type === 'spell' ? 'SPELL' : 'TRAP';
    els.sheetAttr.textContent = card.attribute;
    els.sheetName.textContent = card.name;
    els.sheetEn.textContent = card.en;
    els.sheetEffect.textContent = card.effect;
    els.sheetStats.innerHTML = card.type === 'monster'
      ? `<span>LEVEL <b>${card.level}</b></span><span>ATK <b>${card.atk}</b></span><span>DEF <b>${card.def}</b></span>`
      : `<span>TYPE <b>${card.type.toUpperCase()}</b></span><span>CLASS <b>${card.spell === 'destroy' || card.trap === 'destroyAttacker' ? 'TARGET' : 'QUICK'}</b></span>`;

    const actions = [];
    if (context.source === 'hand') {
      const playable = state.turn === 'player' && !state.resolving && !state.aiBusy && !state.over;
      if (!playable) {
        actions.push('<span class="sheet-wait">相手のターンが終わるまで待機中です。</span>');
      } else if (card.type === 'monster') {
        const canPlace = availableMonsterZones('player') > 0;
        const canSummon = canPlace && state.summonsLeft.player > 0;
        actions.push(sheetButton('召喚', 'SUMMON', 'summon', !canSummon));
        actions.push(sheetButton('セット', 'SET', 'set-monster', !canSummon, 'btn--ghost'));
      } else if (card.type === 'spell') {
        const needsTarget = card.spell === 'destroy';
        const hasTarget = hasMonsters('ai');
        const lowLp = card.spell === 'draw' && state.lp.player <= card.cost;
        actions.push(sheetButton('発動', 'ACTIVATE', 'activate-spell', (needsTarget && !hasTarget) || lowLp));
      } else {
        const canSet = state.field.player.spells.some((slot) => !slot);
        actions.push(sheetButton('セット', 'SET', 'set-trap', !canSet));
      }
      actions.push(sheetButton('キャンセル', 'CANCEL', 'close-sheet', false, 'btn--ghost'));
    } else if (context.source === 'field') {
      const slot = context.slot;
      const side = context.side;
      if (side === 'player' && slot && slot.card.type === 'monster' && !slot.faceDown) {
        const canAttack = state.turn === 'player' && !state.resolving && !state.aiBusy && !state.over && slot.position === 'atk' && !state.attacksUsed.player.has(slot.card.uid);
        const direct = !hasMonsters('ai');
        actions.push(sheetButton(direct ? 'ダイレクトアタック' : '攻撃', direct ? 'DIRECT ATTACK' : 'ATTACK', direct ? 'attack-direct' : 'attack', !canAttack));
        const canChange = state.turn === 'player' && !state.resolving && !state.aiBusy && !state.over && slot.position === 'atk' && !state.positionChanged.has(slot.card.uid);
        if (canChange) actions.push(sheetButton('守備表示', 'DEFENSE', 'defense', false, 'btn--ghost'));
      } else if (side === 'player' && slot && slot.faceDown) {
        actions.push('<span class="sheet-wait">セットカードは相手の攻撃時に自動発動します。</span>');
      } else if (side === 'ai' && slot && slot.faceDown) {
        actions.push('<span class="sheet-wait">相手のセットカードです。</span>');
      } else if (side === 'ai') {
        actions.push('<span class="sheet-wait">相手のカードを確認しています。</span>');
      }
      actions.push(sheetButton('閉じる', 'CLOSE', 'close-sheet', false, 'btn--ghost'));
    } else {
      actions.push(sheetButton('閉じる', 'CLOSE', 'close-sheet', false, 'btn--ghost'));
    }

    els.sheetActions.innerHTML = actions.join('');
    state.selectedHandUid = context.source === 'hand' ? card.uid : null;
    renderHand();
    els.sheetBackdrop.hidden = false;
    els.cardSheet.setAttribute('aria-hidden', 'false');
    els.cardSheet.classList.add('is-open');
    playSound('select');
  }

  function closeSheet() {
    els.cardSheet.classList.remove('is-open');
    els.cardSheet.setAttribute('aria-hidden', 'true');
    els.sheetBackdrop.hidden = true;
    state.sheetContext = null;
    state.selectedHandUid = null;
    renderHand();
  }

  function openHandCard(uid) {
    const card = findCardInHand('player', uid);
    if (!card) return;
    openSheet(card, { source: 'hand' });
  }

  function onZoneClick(side, row, index) {
    if (state.over || state.resolving) return;
    const slot = state.field[side][row][index];
    if (state.target) {
      handleTargetClick(side, row, index, slot);
      return;
    }
    if (!slot) return;
    if (side === 'ai' && slot.faceDown) {
      toast('相手のセットカードです。');
      return;
    }
    openSheet(slot.card, { source: 'field', side, row, index, slot });
  }

  function handleTargetClick(side, row, index, slot) {
    const target = state.target;
    if (!target) return;
    if (target.mode === 'summon' || target.mode === 'setMonster') {
      if (side !== 'player' || row !== 'monsters' || slot) return;
      const card = findCardInHand('player', target.cardUid);
      if (!card) { clearTarget(); return; }
      removeFromHand('player', card.uid);
      state.summonsLeft.player -= 1;
      const faceDown = target.mode === 'setMonster';
      summonCard('player', card, index, faceDown);
      state.target = null;
      render();
      if (!faceDown) resolveSummonEffect('player', state.field.player.monsters[index]);
      toast(faceDown ? `${card.name} をセット` : `${card.name} を召喚`, faceDown ? '' : 'gold');
      return;
    }
    if (target.mode === 'setTrap') {
      if (side !== 'player' || row !== 'spells' || slot) return;
      const card = findCardInHand('player', target.cardUid);
      if (!card) { clearTarget(); return; }
      removeFromHand('player', card.uid);
      setTrapCard('player', card, index);
      state.target = null;
      render();
      toast(`${card.name} をセット`, 'gold');
      return;
    }
    if (target.mode === 'spellDestroy') {
      if (side !== 'ai' || row !== 'monsters' || !slot) return;
      const card = findCardInHand('player', target.cardUid);
      if (!card) { clearTarget(); return; }
      removeFromHand('player', card.uid);
      state.grave.player.push(card);
      state.target = null;
      playSound('trap');
      toast(`${card.name} 発動`, 'gold');
      const zone = $$('.zone', els.aiMonsterRow)[index];
      const point = fxPoint(zone);
      spawnBurst(point.x, point.y);
      moveToGrave('ai', 'monsters', index);
      render();
      if (!state.over) toast('相手モンスターを破壊しました', 'gold');
      return;
    }
    if (target.mode === 'attack') {
      if (side !== 'ai' || row !== 'monsters' || !slot) return;
      const attacker = findSlotByUid('player', target.attackerUid);
      if (!attacker) { clearTarget(); return; }
      state.target = null;
      performAttack('player', attacker, { side, row, index, slot });
    }
  }

  function activateSpell(card) {
    if (!card) return;
    if (card.spell === 'destroy') {
      if (!hasMonsters('ai')) { toast('対象となる相手モンスターがいません', 'danger'); return; }
      beginTarget('spellDestroy', { cardUid: card.uid });
      return;
    }
    removeFromHand('player', card.uid);
    state.grave.player.push(card);
    toast(`${card.name} 発動`, 'gold');
    playSound('trap');
    if (card.spell === 'burn') damage('ai', card.value);
    if (card.spell === 'heal') heal('player', card.value);
    if (card.spell === 'extraSummon') {
      state.summonsLeft.player += 1;
      toast('このターン、もう1度召喚できる', 'gold');
    }
    if (card.spell === 'draw') {
      for (let index = 0; index < card.value; index += 1) drawCard('player');
      state.lp.player = Math.max(0, state.lp.player - card.cost);
      updateLpUi('player');
      toast(`${card.value}枚ドロー — LPを${card.cost}失った`, 'warn');
      if (state.lp.player <= 0) endGame('ai', 'LPコストでLPが0になりました。');
    }
    render();
  }

  function activateAiSpell(card) {
    if (!card) return false;
    if (card.spell === 'destroy') {
      const targets = state.field.player.monsters.map((slot, index) => slot ? { slot, index } : null).filter(Boolean);
      if (!targets.length) return false;
      targets.sort((a, b) => slotValue(b.slot) - slotValue(a.slot));
      const target = targets[0];
      removeFromHand('ai', card.uid);
      state.grave.ai.push(card);
      toast(`${card.name} 発動`, 'gold');
      playSound('trap');
      const zone = $$('.zone', els.playerMonsterRow)[target.index];
      const point = fxPoint(zone);
      spawnBurst(point.x, point.y);
      moveToGrave('player', 'monsters', target.index);
      render();
      return true;
    }
    if (card.spell === 'draw' && state.lp.ai <= card.cost) return false;
    removeFromHand('ai', card.uid);
    state.grave.ai.push(card);
    toast(`${card.name} 発動`, 'gold');
    playSound('trap');
    if (card.spell === 'burn') damage('player', card.value);
    if (card.spell === 'heal') heal('ai', card.value);
    if (card.spell === 'extraSummon') state.summonsLeft.ai += 1;
    if (card.spell === 'draw') {
      for (let index = 0; index < card.value; index += 1) drawCard('ai');
      state.lp.ai = Math.max(0, state.lp.ai - card.cost);
      updateLpUi('ai');
      if (state.lp.ai <= 0) endGame('player', '相手のLPが0になりました。');
    }
    render();
    return true;
  }

  function triggerTrap(defenderSide, attackerSide, attackerSlot, attackerElement) {
    const trapSlot = getTrap(defenderSide);
    if (!trapSlot) return false;
    const index = state.field[defenderSide].spells.indexOf(trapSlot);
    state.field[defenderSide].spells[index] = null;
    state.grave[defenderSide].push(trapSlot.card);
    toast(`${trapSlot.card.name} 発動`, 'gold');
    playSound('trap');
    const trapElement = $$('.zone', defenderSide === 'ai' ? els.aiSpellRow : els.playerSpellRow)[index];
    const point = fxPoint(trapElement);
    spawnBurst(point.x, point.y);
    render();
    if (trapSlot.card.trap === 'negateAttack') {
      heal(defenderSide, trapSlot.card.value, trapElement);
      toast('攻撃を無効にした', 'gold');
      return 'negated';
    }
    if (trapSlot.card.trap === 'destroyAttacker') {
      const attackerSlotData = findSlotByUid(attackerSide, attackerSlot.card.uid);
      if (attackerSlotData) {
        moveToGrave(attackerSide, 'monsters', attackerSlotData.index);
        const point = fxPoint(attackerElement);
        spawnBurst(point.x, point.y);
        toast('攻撃モンスターを破壊した', 'gold');
        render();
      }
      return 'destroyed';
    }
    if (trapSlot.card.trap === 'burn') {
      damage(attackerSide, trapSlot.card.value, attackerElement);
    }
    return 'burn';
  }

  async function performAttack(attackerSide, attacker, defender) {
    if (!attacker || state.over || state.resolving) return;
    state.resolving = true;
    render();
    const attackerElement = $$('.zone', attackerSide === 'player' ? els.playerMonsterRow : els.aiMonsterRow)[attacker.index];
    const defenderSide = otherSide(attackerSide);
    const defenderSlot = defender ? defender.slot : null;
    const defenderElement = defender ? $$('.zone', defenderSide === 'player' ? els.playerMonsterRow : els.aiMonsterRow)[defender.index] : null;

    const trapResult = triggerTrap(defenderSide, attackerSide, attacker.slot, attackerElement);
    if (trapResult === 'negated' || trapResult === 'destroyed' || state.over) {
      await sleep(650);
      state.resolving = false;
      render();
      return;
    }

    playSound('attack');
    spawnBeam(attackerElement, defenderElement, defenderSide);
    await sleep(380);

    const attackValue = attacker.slot.card.atk;
    if (!defenderSlot) {
      const point = fxPoint(defenderElement, defenderSide);
      spawnBurst(point.x, point.y);
      damage(defenderSide, attackValue, defenderElement);
      state.attacksUsed[attackerSide].add(attacker.slot.card.uid);
      await sleep(600);
      state.resolving = false;
      render();
      return;
    }

    const defenseValue = slotValue(defenderSlot);
    const defenderZone = $$('.zone', defenderSide === 'player' ? els.playerMonsterRow : els.aiMonsterRow)[defender.index];
    const point = fxPoint(defenderZone);
    spawnBurst(point.x, point.y);
    const attackerCard = attacker.slot.card;
    const defenderCard = defenderSlot.card;
    let damageToAttacker = 0;
    let damageToDefender = 0;

    if (attackValue > defenseValue) {
      moveToGrave(defenderSide, 'monsters', defender.index);
      if (!defenderSlot.faceDown && defenderSlot.position === 'atk') damageToDefender = attackValue - defenseValue;
      if ((defenderSlot.faceDown || defenderSlot.position === 'def') && attackerCard.pierce) damageToDefender = attackValue - defenseValue;
      toast(`${defenderCard.name} を破壊`, 'gold');
    } else if (attackValue < defenseValue) {
      moveToGrave(attackerSide, 'monsters', attacker.index);
      if (!defenderSlot.faceDown && defenderSlot.position === 'atk') damageToAttacker = defenseValue - attackValue;
      toast(`${attackerCard.name} が破壊された`, 'danger');
    } else {
      moveToGrave(attackerSide, 'monsters', attacker.index);
      moveToGrave(defenderSide, 'monsters', defender.index);
      toast('相打ち — 両モンスターが破壊された', 'warn');
    }

    if (defenderSlot.faceDown && state.field[defenderSide].monsters[defender.index]) {
      const surviving = state.field[defenderSide].monsters[defender.index];
      surviving.faceDown = false;
      surviving.position = 'def';
    }
    state.attacksUsed[attackerSide].add(attackerCard.uid);
    if (damageToDefender) damage(defenderSide, damageToDefender, defenderZone);
    if (damageToAttacker) damage(attackerSide, damageToAttacker, attackerElement);
    render();
    await sleep(700);
    state.resolving = false;
    render();
  }

  function setDefense(uid) {
    const found = findSlotByUid('player', uid);
    if (!found || found.row !== 'monsters' || found.slot.faceDown || found.slot.position !== 'atk') return;
    found.slot.position = 'def';
    state.positionChanged.add(uid);
    closeSheet();
    render();
    toast('守備表示に変更', 'gold');
    playSound('click');
  }

  function startPlayerTurn() {
    if (state.over) return;
    state.turn = 'player';
    state.aiBusy = false;
    state.turnCount += 1;
    state.summonsLeft.player = 1;
    state.attacksUsed.player.clear();
    state.positionChanged.clear();
    if (!drawCard('player')) {
      endGame('ai', 'デッキ切れにより敗北しました。');
      return;
    }
    render();
    toast(`TURN ${state.turnCount} — あなたのターン`, 'gold');
    playSound('draw');
    vibrate(12);
  }

  async function endPlayerTurn() {
    if (state.turn !== 'player' || state.resolving || state.aiBusy || state.over) return;
    const token = state.gameToken;
    state.turn = 'ai';
    state.aiBusy = true;
    state.target = null;
    closeSheet();
    render();
    toast("ASTRA'S TURN", 'danger');
    playSound('turn');
    await sleep(620);
    if (token !== state.gameToken || !state.started) return;
    await runAiTurn(token);
  }

  function aiSummon() {
    const emptyIndex = firstEmpty('ai', 'monsters');
    if (emptyIndex < 0 || state.summonsLeft.ai <= 0) return false;
    const monsters = state.hand.ai.filter((card) => card.type === 'monster');
    if (!monsters.length) return false;
    monsters.sort((a, b) => (b.atk + b.def * 0.35) - (a.atk + a.def * 0.35));
    const card = monsters[0];
    removeFromHand('ai', card.uid);
    state.summonsLeft.ai -= 1;
    summonCard('ai', card, emptyIndex, false);
    render();
    resolveSummonEffect('ai', state.field.ai.monsters[emptyIndex]);
    return true;
  }

  function aiSetTrap() {
    const index = firstEmpty('ai', 'spells');
    if (index < 0) return false;
    const traps = state.hand.ai.filter((card) => card.type === 'trap');
    if (!traps.length) return false;
    const card = traps[Math.floor(Math.random() * traps.length)];
    removeFromHand('ai', card.uid);
    setTrapCard('ai', card, index);
    render();
    return true;
  }

  function aiChooseSpell() {
    const spells = state.hand.ai.filter((card) => card.type === 'spell');
    if (!spells.length) return null;
    const priority = ['destroy', 'burn', 'heal', 'extraSummon', 'draw'];
    spells.sort((a, b) => priority.indexOf(a.spell) - priority.indexOf(b.spell));
    return spells[0];
  }

  function chooseAiTarget(attacker) {
    const targets = state.field.player.monsters.map((slot, index) => slot ? { slot, index } : null).filter(Boolean);
    if (!targets.length) return null;
    targets.sort((a, b) => slotValue(a.slot) - slotValue(b.slot));
    const lowest = targets[0];
    if (attacker.slot.card.atk >= slotValue(lowest.slot)) return lowest;
    return Math.random() < 0.16 ? targets[Math.floor(Math.random() * targets.length)] : null;
  }

  async function runAiTurn(token = state.gameToken) {
    const alive = () => token === state.gameToken && state.started && !state.over;
    if (!alive()) return;
    state.aiBusy = true;
    state.summonsLeft.ai = 1;
    state.attacksUsed.ai.clear();
    state.positionChanged.clear();
    render();
    if (!drawCard('ai')) {
      endGame('player', '相手がデッキ切れになりました。');
      return;
    }
    render();
    await sleep(700);
    if (!alive()) return;

    if (aiSummon()) await sleep(760);
    if (!alive()) return;

    const spell = aiChooseSpell();
    if (spell) {
      const used = activateAiSpell(spell);
      if (used) await sleep(760);
    }
    if (!alive()) return;

    if (aiSetTrap()) await sleep(560);
    if (!alive()) return;

    const attackers = state.field.ai.monsters
      .map((slot, index) => slot ? { slot, index } : null)
      .filter((entry) => entry && entry.slot.position === 'atk' && !entry.slot.faceDown && !state.attacksUsed.ai.has(entry.slot.card.uid));

    for (const attacker of attackers) {
      if (!alive()) return;
      if (!state.field.ai.monsters[attacker.index]) continue;
      const target = chooseAiTarget(attacker);
      if (!target && hasMonsters('player')) continue;
      await performAttack('ai', attacker, target);
      if (!alive()) return;
      await sleep(700);
    }

    await sleep(480);
    if (!alive()) return;
    startPlayerTurn();
  }

  function endGame(winner, reason) {
    if (state.over) return;
    state.over = true;
    state.aiBusy = false;
    state.resolving = false;
    state.target = null;
    render();
    const win = winner === 'player';
    els.resultModal.classList.toggle('is-loss', !win);
    els.resultKicker.textContent = win ? 'DUEL COMPLETE' : 'DUEL OVER';
    els.resultTitle.textContent = win ? 'VICTORY' : 'DEFEAT';
    els.resultSub.textContent = reason;
    els.resultTurns.textContent = String(state.turnCount);
    els.resultLp.textContent = String(state.lp.player);
    els.resultRoom.textContent = state.roomCode;
    els.resultSigil.innerHTML = `<svg><use href="#${win ? 'i-spark' : 'i-shield'}"></use></svg>`;
    playSound(win ? 'win' : 'lose');
    vibrate(win ? [35, 35, 35, 35, 80] : [80, 40, 80]);
    setTimeout(() => {
      els.modalBackdrop.hidden = false;
      els.helpModal.hidden = true;
      els.exitModal.hidden = true;
      els.resultModal.hidden = false;
    }, 700);
  }

  function startGame() {
    initAudio();
    closeSheet();
    hideModals();
    state.gameToken += 1;
    state.started = true;
    state.over = false;
    state.resolving = false;
    state.aiBusy = false;
    state.turn = 'player';
    state.turnCount = 0;
    state.lp.player = 4000;
    state.lp.ai = 4000;
    state.deck.player = shuffle(DECK_LIST.map(newCard));
    state.deck.ai = shuffle(DECK_LIST.map(newCard));
    state.hand.player = [];
    state.hand.ai = [];
    state.grave.player = [];
    state.grave.ai = [];
    state.field = {
      player: { monsters: Array(5).fill(null), spells: Array(5).fill(null) },
      ai: { monsters: Array(5).fill(null), spells: Array(5).fill(null) }
    };
    state.summonsLeft = { player: 1, ai: 1 };
    state.attacksUsed = { player: new Set(), ai: new Set() };
    state.positionChanged = new Set();
    state.target = null;
    state.selectedHandUid = null;
    state.sheetContext = null;
    state.promptOverride = null;
    clearTimeout(state.promptTimer);
    for (let index = 0; index < 5; index += 1) {
      drawCard('player');
      drawCard('ai');
    }
    els.menu.classList.remove('is-active');
    els.menu.hidden = true;
    els.game.hidden = false;
    els.game.classList.add('is-active');
    render();
    startPlayerTurn();
    toast(`ROOM ${state.roomCode} — DUEL START`, 'gold');
    playSound('turn');
    vibrate(20);
  }

  function returnToMenu() {
    hideModals();
    closeSheet();
    state.gameToken += 1;
    state.over = false;
    state.started = false;
    state.aiBusy = false;
    state.resolving = false;
    state.target = null;
    state.promptOverride = null;
    clearTimeout(state.promptTimer);
    setRoomCode(makeRoomCode());
    els.game.classList.remove('is-active', 'is-ai-turn');
    els.game.hidden = true;
    els.menu.hidden = false;
    els.menu.classList.add('is-active');
    playSound('click');
  }

  function hideModals() {
    els.modalBackdrop.hidden = true;
    els.helpModal.hidden = true;
    els.resultModal.hidden = true;
    els.exitModal.hidden = true;
  }

  function showHelp() {
    els.helpModal.hidden = false;
    els.resultModal.hidden = true;
    els.exitModal.hidden = true;
    els.modalBackdrop.hidden = false;
    playSound('click');
  }

  function requestExit() {
    els.exitModal.hidden = false;
    els.helpModal.hidden = true;
    els.resultModal.hidden = true;
    els.modalBackdrop.hidden = false;
    playSound('click');
  }

  function updateTiltUi() {
    els.tiltState.textContent = tilt.enabled ? 'ON' : 'OFF';
    [els.tiltBtn, els.gameTiltBtn].forEach((button) => {
      button.classList.toggle('is-on', tilt.enabled);
      button.setAttribute('aria-pressed', String(tilt.enabled));
    });
  }

  function applyTilt(x, y) {
    tilt.x = x;
    tilt.y = y;
    if (tilt.raf) return;
    tilt.raf = requestAnimationFrame(() => {
      tilt.raf = 0;
      const root = document.documentElement;
      root.style.setProperty('--tilt-x', `${(-tilt.y * 3.4).toFixed(2)}deg`);
      root.style.setProperty('--tilt-y', `${(tilt.x * 4.2).toFixed(2)}deg`);
      root.style.setProperty('--parallax-x', `${(tilt.x * 16).toFixed(1)}px`);
      root.style.setProperty('--parallax-y', `${(-tilt.y * 10).toFixed(1)}px`);
    });
  }

  function onOrientation(event) {
    if (event.beta == null && event.gamma == null) return;
    tilt.orientationSeen = true;
    const x = clamp((event.gamma || 0) / 32, -1, 1);
    const y = clamp(((event.beta || 45) - 45) / 36, -1, 1);
    applyTilt(x, y);
  }

  function onMotion(event) {
    if (tilt.orientationSeen || !event.accelerationIncludingGravity) return;
    const acceleration = event.accelerationIncludingGravity;
    tilt.motionSeen = true;
    const x = clamp((acceleration.x || 0) / 9.8, -1, 1);
    const y = clamp((acceleration.y || 0) / 9.8, -1, 1);
    applyTilt(x, y);
  }

  async function requestMotionPermission() {
    const orientationApi = window.DeviceOrientationEvent;
    const motionApi = window.DeviceMotionEvent;
    if (!orientationApi && !motionApi) return false;
    if (orientationApi && typeof orientationApi.requestPermission === 'function') {
      const result = await orientationApi.requestPermission();
      if (result !== 'granted') return false;
    }
    if (motionApi && typeof motionApi.requestPermission === 'function' && motionApi.requestPermission !== orientationApi?.requestPermission) {
      try {
        const result = await motionApi.requestPermission();
        if (result !== 'granted') return false;
      } catch { /* orientation permission is enough */ }
    }
    return true;
  }

  async function toggleTilt() {
    initAudio();
    playSound('click');
    if (tilt.enabled) {
      tilt.enabled = false;
      clearTimeout(tilt.probe);
      window.removeEventListener('deviceorientation', onOrientation, true);
      window.removeEventListener('devicemotion', onMotion, true);
      document.documentElement.style.setProperty('--tilt-x', '0deg');
      document.documentElement.style.setProperty('--tilt-y', '0deg');
      document.documentElement.style.setProperty('--parallax-x', '0px');
      document.documentElement.style.setProperty('--parallax-y', '0px');
      updateTiltUi();
      toast('傾き操作をオフにしました');
      return;
    }
    try {
      const granted = await requestMotionPermission();
      if (!granted) {
        toast('モーション許可が必要です。iOSの設定でSafariのモーションを許可してください。', 'danger');
        return;
      }
      tilt.orientationSeen = false;
      tilt.motionSeen = false;
      window.addEventListener('deviceorientation', onOrientation, true);
      window.addEventListener('devicemotion', onMotion, true);
      tilt.enabled = true;
      updateTiltUi();
      toast('傾き操作 ON — 端末を傾けてみてください', 'gold');
      clearTimeout(tilt.probe);
      tilt.probe = setTimeout(() => {
        if (!tilt.enabled) return;
        if (!tilt.orientationSeen && !tilt.motionSeen) {
          tilt.enabled = false;
          window.removeEventListener('deviceorientation', onOrientation, true);
          window.removeEventListener('devicemotion', onMotion, true);
          updateTiltUi();
          toast('この端末では傾きを検出できませんでした。タッチ操作はそのまま使えます。', 'danger');
        }
      }, 1800);
    } catch {
      toast('モーション許可を取得できませんでした。', 'danger');
    }
  }

  function toggleFullscreen() {
    initAudio();
    playSound('click');
    if (!document.fullscreenElement) {
      const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
      if (request) request.call(document.documentElement).catch(() => toast('全画面表示に対応していません', 'danger'));
      else toast('このブラウザでは全画面表示を利用できません', 'danger');
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }

  function handleSheetAction(action) {
    const context = state.sheetContext;
    if (!context) return;
    const card = context.source === 'hand' ? findCardInHand('player', state.selectedHandUid) : context.slot?.card;
    if (!card) { closeSheet(); return; }
    if (action === 'close-sheet') { closeSheet(); return; }
    if (action === 'summon') {
      if (state.summonsLeft.player <= 0) { toast('このターンはもう召喚できません', 'danger'); return; }
      if (availableMonsterZones('player') <= 0) { toast('モンスターゾーンが空いていません', 'danger'); return; }
      beginTarget('summon', { cardUid: card.uid });
      return;
    }
    if (action === 'set-monster') {
      if (state.summonsLeft.player <= 0) { toast('このターンはもう召喚できません', 'danger'); return; }
      beginTarget('setMonster', { cardUid: card.uid });
      return;
    }
    if (action === 'set-trap') {
      if (!state.field.player.spells.some((slot) => !slot)) { toast('魔法・罠ゾーンが空いていません', 'danger'); return; }
      beginTarget('setTrap', { cardUid: card.uid });
      return;
    }
    if (action === 'activate-spell') {
      closeSheet();
      activateSpell(card);
      return;
    }
    if (action === 'attack') {
      const found = findSlotByUid('player', card.uid);
      if (!found) { closeSheet(); return; }
      state.target = { mode: 'attack', attackerUid: card.uid };
      closeSheet();
      render();
      toast('攻撃対象を選択', 'warn');
      return;
    }
    if (action === 'attack-direct') {
      const found = findSlotByUid('player', card.uid);
      if (!found) { closeSheet(); return; }
      closeSheet();
      state.target = null;
      performAttack('player', found, null);
      return;
    }
    if (action === 'defense') {
      setDefense(card.uid);
    }
  }

  function initBackground() {
    if (!els.bgCanvas) return;
    const context = els.bgCanvas.getContext('2d');
    if (!context) return;
    const resize = () => {
      bgDpr = Math.min(window.devicePixelRatio || 1, 1.25);
      bgWidth = window.innerWidth;
      bgHeight = window.innerHeight;
      els.bgCanvas.width = Math.round(bgWidth * bgDpr);
      els.bgCanvas.height = Math.round(bgHeight * bgDpr);
      context.setTransform(bgDpr, 0, 0, bgDpr, 0, 0);
      const count = Math.round(clamp((bgWidth * bgHeight) / 22000, 34, 84));
      bgParticles = Array.from({ length: count }, () => ({
        x: Math.random() * bgWidth,
        y: Math.random() * bgHeight,
        size: Math.random() * 1.8 + 0.35,
        speed: Math.random() * 0.22 + 0.04,
        drift: Math.random() * 0.18 - 0.09,
        alpha: Math.random() * 0.42 + 0.1,
        color: Math.random() < 0.22 ? 'rgb(255, 216, 126)' : Math.random() < 0.5 ? 'rgb(132, 228, 255)' : 'rgb(190, 156, 255)'
      }));
      bgStars = Array.from({ length: Math.round(count * 0.6) }, () => ({
        x: Math.random() * bgWidth,
        y: Math.random() * bgHeight,
        size: Math.random() * 1.1 + 0.2,
        alpha: Math.random() * 0.28 + 0.04,
        phase: Math.random() * Math.PI * 2,
        color: 'rgb(160, 213, 255)'
      }));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    let previous = performance.now();
    let lastDraw = 0;
    const draw = (now) => {
      requestAnimationFrame(draw);
      if (now - lastDraw < 32) return;
      const delta = Math.min(48, now - previous);
      previous = now;
      lastDraw = now;
      const time = now / 1000;
      context.clearRect(0, 0, bgWidth, bgHeight);
      context.globalCompositeOperation = 'lighter';
      const px = tilt.x * 14;
      const py = tilt.y * 9;
      bgStars.forEach((star) => {
        const twinkle = 0.55 + Math.sin(time * 0.7 + star.phase) * 0.45;
        context.globalAlpha = star.alpha * twinkle;
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(star.x + px * 0.3, star.y + py * 0.3, star.size, 0, Math.PI * 2);
        context.fill();
      });
      bgParticles.forEach((particle) => {
        particle.y -= particle.speed * (delta / 16.67);
        particle.x += particle.drift * (delta / 16.67);
        if (particle.y < -12) { particle.y = bgHeight + 12; particle.x = Math.random() * bgWidth; }
        if (particle.x < -12) particle.x = bgWidth + 12;
        if (particle.x > bgWidth + 12) particle.x = -12;
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x + px, particle.y + py, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    };
    requestAnimationFrame(draw);
  }

  function bindEvents() {
    els.playBtn.addEventListener('click', () => { playSound('click'); startGame(); });
    [els.soundBtn, els.gameSoundBtn].forEach((button) => button.addEventListener('click', toggleSound));
    [els.tiltBtn, els.gameTiltBtn].forEach((button) => button.addEventListener('click', toggleTilt));
    els.helpBtn.addEventListener('click', showHelp);
    els.fullscreenBtn.addEventListener('click', toggleFullscreen);
    els.exitBtn.addEventListener('click', requestExit);
    els.endTurnBtn.addEventListener('click', endPlayerTurn);
    els.targetCancel.addEventListener('click', () => { clearTarget(); playSound('click'); });
    els.sheetBackdrop.addEventListener('click', closeSheet);
    els.sheetClose.addEventListener('click', closeSheet);
    els.sheetActions.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action) handleSheetAction(action);
    });
    els.handCards.addEventListener('click', (event) => {
      const handCard = event.target.closest('.hand-card');
      if (handCard) openHandCard(Number(handCard.dataset.uid));
    });
    els.field.addEventListener('click', (event) => {
      const zone = event.target.closest('.zone');
      if (!zone) return;
      onZoneClick(zone.dataset.side, zone.dataset.row, Number(zone.dataset.index));
    });
    els.replayBtn.addEventListener('click', startGame);
    els.menuBtn.addEventListener('click', returnToMenu);
    els.exitConfirm.addEventListener('click', returnToMenu);
    els.exitCancel.addEventListener('click', hideModals);
    $$('[data-close-modal]').forEach((button) => button.addEventListener('click', hideModals));
    els.modalBackdrop.addEventListener('click', (event) => {
      if (event.target !== els.modalBackdrop) return;
      if (els.resultModal.hidden) hideModals();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (els.cardSheet.classList.contains('is-open')) closeSheet();
      else if (els.modalBackdrop.hidden === false && els.resultModal.hidden) hideModals();
    });
    document.addEventListener('gesturestart', (event) => event.preventDefault());
    window.addEventListener('pointerdown', initAudio, { once: true });
  }

  function init() {
    setRoomCode(makeRoomCode());
    renderHeroFan();
    setSoundUi();
    updateTiltUi();
    initBackground();
    bindEvents();
    window.__DUEL_DEBUG__ = {
      state,
      startGame,
      endTurn: endPlayerTurn,
      attack: performAttack,
      render,
      getState: () => ({
        started: state.started,
        over: state.over,
        turn: state.turn,
        turnCount: state.turnCount,
        lp: { ...state.lp },
        hand: { player: state.hand.player.map((card) => card.key), ai: state.hand.ai.map((card) => card.key) },
        deck: { player: state.deck.player.length, ai: state.deck.ai.length },
        field: {
          player: { monsters: state.field.player.monsters.map((slot) => slot ? slot.card.key : null), spells: state.field.player.spells.map((slot) => slot ? slot.card.key : null) },
          ai: { monsters: state.field.ai.monsters.map((slot) => slot ? slot.card.key : null), spells: state.field.ai.spells.map((slot) => slot ? slot.card.key : null) }
        },
        tilt: tilt.enabled
      })
    };
  }

  init();
})();
