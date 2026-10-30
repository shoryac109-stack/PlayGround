'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const randInt = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[randInt(arr.length)];
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ------------------------------------------------------------------ */
/* card data                                                           */
/* ------------------------------------------------------------------ */
const LIBRARY = {
  shiro:   { name: '星穹の白竜',     kind: 'monster', atk: 3000, def: 2500, level: 8, glyph: '龍', hue: 'ice',    text: '天空を裂く白き星竜。その咆哮は時空を凍らせる。' },
  kuro:    { name: '深淵の黒魔道士', kind: 'monster', atk: 2500, def: 2100, level: 7, glyph: '魔', hue: 'violet', text: '深淵より召喚されし魔術師。闇の波動を操る。' },
  guren:   { name: '紅蓮の機神',     kind: 'monster', atk: 2400, def: 1200, level: 6, glyph: '機', hue: 'ember',  text: '紅蓮の炎を纏う機械神。戦場を焼き尽くす。' },
  soukai:  { name: '蒼海の精霊',     kind: 'monster', atk: 1800, def: 1500, level: 4, glyph: '海', hue: 'aqua',   text: '蒼き海の守護精霊。清流の力で味方を癒す。' },
  shinra:  { name: '森羅の守護獣',   kind: 'monster', atk: 1600, def: 2000, level: 4, glyph: '森', hue: 'jade',   text: '古き森に棲む守護獣。その毛皮は鉄をも弾く。' },
  raimei:  { name: '雷鳴の戦士',     kind: 'monster', atk: 1900, def: 800,  level: 4, glyph: '雷', hue: 'gold',   text: '雷を刃に変える戦士。疾風の如く敵を斬る。' },
  gekkou:  { name: '月光の狐',       kind: 'monster', atk: 1400, def: 1200, level: 3, glyph: '狐', hue: 'rose',   text: '月光に導かれ現れる妖狐。幻影で敵を惑わす。' },
  kikou:   { name: '機巧の小竜',     kind: 'monster', atk: 1200, def: 1000, level: 3, glyph: '竜', hue: 'cyan',   text: '歯車仕掛けの小さな竜。発明家の相棒。' },
  hoshi:   { name: '星詠みの書',     kind: 'spell',   glyph: '書', hue: 'aqua',   text: '山札からカードを1枚ドローする。' },
  haja:    { name: '破邪の閃光',     kind: 'spell',   glyph: '光', hue: 'gold',   text: '相手モンスター1体を破壊する。' },
  kagami:  { name: '鏡像の罠',       kind: 'trap',    glyph: '鏡', hue: 'violet', text: '相手の攻撃を反射し、そのモンスターを破壊する。' },
  suna:    { name: '時の砂時計',     kind: 'trap',    glyph: '時', hue: 'rose',   text: '相手モンスター1体の攻撃力を500下げる。' },
};

const DECK_RECIPE = [
  ['shiro', 2], ['kuro', 2], ['guren', 2], ['soukai', 2], ['shinra', 2], ['raimei', 2], ['gekkou', 2], ['kikou', 2],
  ['hoshi', 1], ['haja', 1], ['kagami', 1], ['suna', 1],
];

const PHASES = [
  { label: 'ドロー', short: 'ドロー' },
  { label: 'スタンバイ', short: 'スタンバイ' },
  { label: 'メイン', short: 'メイン' },
  { label: 'バトル', short: 'バトル' },
  { label: 'エンド', short: 'エンド' },
];

const SWORD_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 20.5 6.5 15l9-9 4.5-1.5L18.5 9l-9 9-5 2.5Z"/><path d="M14.5 6.5 18 10"/></svg>';
const SPELL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><circle cx="12" cy="12" r="2"/></svg>';
const FIELD_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 21 8v8l-9 5-9-5V8Z"/><path d="M12 8v8M7.5 10.5 12 13l4.5-2.5"/></svg>';

/* ------------------------------------------------------------------ */
/* state                                                               */
/* ------------------------------------------------------------------ */
let uidCounter = 0;

function makeCard(key) {
  const base = LIBRARY[key];
  return {
    uid: ++uidCounter,
    key,
    name: base.name,
    kind: base.kind,
    atk: base.atk || 0,
    def: base.def || 0,
    level: base.level || 0,
    glyph: base.glyph,
    hue: base.hue,
    text: base.text,
    faceDown: false,
    atkMod: 0,
  };
}

function emptyField() {
  return {
    monsters: Array(5).fill(null),
    spells: Array(5).fill(null),
    field: null,
  };
}

const state = {
  turn: 3,
  owner: 'player',
  phase: 2,
  hasDrawn: false,
  lp: { player: 8000, ai: 8000 },
  field: { player: emptyField(), ai: emptyField() },
  hand: [],
  aiHand: [],
  decks: { player: [], ai: [] },
  grave: { player: [], ai: [] },
  banished: { player: [], ai: [] },
  selectedHand: null,
  selectedAttacker: null,
  busy: false,
  over: false,
  log: [],
  attacked: new Set(),
  focusUid: null,
  seenHand: new Set(),
  tilt: false,
};

const zoneEls = { player: { monster: [], spell: [] }, ai: { monster: [], spell: [] } };

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const effAtk = (card) => Math.max(0, (card.atk || 0) + (card.atkMod || 0));
const hueClass = (card) => `hue-${card.hue}`;
const isMonster = (card) => card && card.kind === 'monster';

function other(side) { return side === 'player' ? 'ai' : 'player'; }
function sideLabel(side) { return side === 'player' ? 'あなた' : 'AI'; }

function locateCard(uid) {
  for (const side of ['player', 'ai']) {
    for (const row of ['monster', 'spell']) {
      const arr = state.field[side][`${row}s`] || state.field[side][row];
      const index = arr.findIndex((c) => c && c.uid === uid);
      if (index >= 0) return { side, row, index, card: arr[index] };
    }
  }
  return null;
}

function getMonsters(side) {
  return state.field[side].monsters.filter(Boolean);
}

function emptyIndices(side, row) {
  const arr = row === 'monster' ? state.field[side].monsters : state.field[side].spells;
  const out = [];
  arr.forEach((c, i) => { if (!c) out.push(i); });
  return out;
}

function getFaceDownTrap(side) {
  const list = [];
  state.field[side].spells.forEach((card, index) => {
    if (card && card.faceDown) list.push({ card, index, row: 'spell', side });
  });
  if (!list.length) return null;
  return pick(list);
}

function cardEl(uid) {
  return document.querySelector(`.zone-card[data-uid="${uid}"]`);
}

function drawFor(side, cap = 8) {
  if (side === 'player' && state.hand.length >= cap) return null;
  let deck = state.decks[side];
  if (!deck.length) {
    const grave = state.grave[side];
    if (grave.length) {
      deck.push(...shuffle(grave.splice(0, grave.length)));
      addLog(`${sideLabel(side)}の山札を墓地から再構築した。`, side);
    }
  }
  const card = deck.pop();
  if (!card) return null;
  card.faceDown = false;
  card.atkMod = 0;
  if (side === 'player') state.hand.push(card);
  else state.aiHand.push(card);
  return card;
}

function takeFromDeck(side, key) {
  const deck = state.decks[side];
  const index = deck.findIndex((c) => c.key === key);
  if (index >= 0) return deck.splice(index, 1)[0];
  return makeCard(key);
}

function buildDeck() {
  const deck = [];
  for (const [key, count] of DECK_RECIPE) {
    for (let i = 0; i < count; i++) deck.push(makeCard(key));
  }
  return shuffle(deck);
}

/* ------------------------------------------------------------------ */
/* audio                                                               */
/* ------------------------------------------------------------------ */
let audioCtx = null;
let soundOn = true;

function ensureAudio() {
  if (!soundOn) return null;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch { return null; }
}

function tone(freq, dur, type = 'sine', gain = 0.05, slideTo = null, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function sfx(name) {
  if (!soundOn) return;
  switch (name) {
    case 'tap': tone(1240, 0.06, 'sine', 0.03); break;
    case 'draw': tone(520, 0.09, 'triangle', 0.035, 780); break;
    case 'summon':
      tone(240, 0.32, 'sine', 0.05, 620);
      tone(480, 0.26, 'triangle', 0.03, 960, 0.03);
      break;
    case 'set': tone(320, 0.1, 'square', 0.025); tone(180, 0.16, 'sine', 0.03, 140, 0.05); break;
    case 'attack': tone(420, 0.14, 'sawtooth', 0.035, 120); break;
    case 'hit': tone(90, 0.22, 'square', 0.05, 52); break;
    case 'destroy': tone(260, 0.4, 'sawtooth', 0.04, 60); break;
    case 'flip': tone(700, 0.08, 'triangle', 0.03, 1100); break;
    case 'win':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, 'triangle', 0.045, null, i * 0.12));
      break;
    case 'lose': [392, 330, 262, 196].forEach((f, i) => tone(f, 0.32, 'sawtooth', 0.035, null, i * 0.14)); break;
  }
}

function vibrate(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* noop */ }
}

/* ------------------------------------------------------------------ */
/* markup                                                              */
/* ------------------------------------------------------------------ */
function cardInner(card) {
  if (card.faceDown) {
    return `<div class="card-face"><span class="back-ring"></span><span class="back-diamond"><b>闘</b></span><span class="back-mark">SET</span></div>`;
  }
  const typeLabel = card.kind === 'monster' ? 'M' : card.kind === 'spell' ? '魔' : '罠';
  const stars = card.kind === 'monster'
    ? `<span class="c-stars">${'★'.repeat(clamp(card.level, 1, 5))}</span>` : '';
  const bottom = card.kind === 'monster'
    ? `<span class="atk">ATK <b>${effAtk(card)}</b></span><span class="def">DEF <b>${card.def}</b></span>`
    : `<span class="kind">${card.kind === 'spell' ? 'MAGIC' : 'TRAP'}</span>`;
  return `<div class="card-face">
    <div class="c-top"><span class="c-type type-${card.kind}">${typeLabel}</span><span class="c-name">${card.name}</span></div>
    <div class="c-art"><span class="c-glyph">${card.glyph}</span>${stars}</div>
    <div class="c-bot">${bottom}</div>
  </div>`;
}

function cardClasses(card) {
  return `card ${hueClass(card)}${card.faceDown ? ' card-back' : ''}`;
}

/* ------------------------------------------------------------------ */
/* board construction                                                  */
/* ------------------------------------------------------------------ */
function buildBoard() {
  const grid = $('#boardGrid');
  grid.innerHTML = '';
  grid.appendChild(buildRow('ai', 'spell'));
  grid.appendChild(buildRow('ai', 'monster'));
  grid.appendChild(buildMidRow());
  grid.appendChild(buildRow('player', 'monster'));
  grid.appendChild(buildRow('player', 'spell'));
}

function buildRow(side, row) {
  const el = document.createElement('div');
  el.className = 'zone-row';
  el.dataset.side = side;
  el.dataset.row = row;
  for (let i = 0; i < 5; i++) {
    const zone = document.createElement('div');
    zone.className = `zone zone-${row}`;
    zone.dataset.side = side;
    zone.dataset.row = row;
    zone.dataset.index = String(i);
    const svg = row === 'monster' ? SWORD_SVG : SPELL_SVG;
    zone.innerHTML = `<span class="zone-ghost">${svg}<span class="z-label">${row === 'monster' ? 'M' : 'S/T'}</span></span>`;
    zoneEls[side][row][i] = zone;
    el.appendChild(zone);
  }
  return el;
}

function buildMidRow() {
  const el = document.createElement('div');
  el.className = 'mid-row';

  const aiField = document.createElement('div');
  aiField.className = 'field-zone';
  aiField.dataset.side = 'ai';
  aiField.dataset.row = 'field';
  aiField.innerHTML = `<span class="z-label">FIELD</span>`;

  const core = document.createElement('div');
  core.className = 'duel-core';
  core.id = 'duelCore';
  core.innerHTML = `<span class="orb"><b>DUEL</b></span>`;

  const playerField = document.createElement('div');
  playerField.className = 'field-zone';
  playerField.dataset.side = 'player';
  playerField.dataset.row = 'field';
  playerField.innerHTML = `<span class="z-label">FIELD</span>`;

  el.append(aiField, core, playerField);
  return el;
}

/* ------------------------------------------------------------------ */
/* rendering                                                           */
/* ------------------------------------------------------------------ */
function renderHUD() {
  $('#aiLp').textContent = state.lp.ai.toLocaleString('en-US');
  $('#playerLp').textContent = state.lp.player.toLocaleString('en-US');
  $('#aiLpBar').style.width = `${clamp(state.lp.ai / 8000, 0, 1) * 100}%`;
  $('#playerLpBar').style.width = `${clamp(state.lp.player / 8000, 0, 1) * 100}%`;
  $('#aiHand').textContent = state.aiHand.length;
  $('#playerHand').textContent = state.hand.length;
  $('#aiDeck').textContent = state.decks.ai.length;
  $('#playerDeck').textContent = state.decks.player.length;
  $('#aiGrave').textContent = state.grave.ai.length;
  $('#playerGrave').textContent = state.grave.player.length;
  $('#turnNum').textContent = state.turn;
  $('#boardClock').textContent = `T${state.turn}`;
  $('#hudAi').classList.toggle('active', state.owner === 'ai');
  $('#hudPlayer').classList.toggle('active', state.owner === 'player');

  const core = $('#duelCore');
  if (core) core.classList.toggle('owner-ai', state.owner === 'ai');
}

function renderPhase() {
  const phase = PHASES[state.phase];
  const chip = $('#phaseChip');
  chip.textContent = state.owner === 'ai' ? 'AI TURN' : phase.short;
  chip.classList.toggle('battle', state.owner === 'player' && state.phase === 3);
  chip.classList.toggle('end', state.owner === 'player' && state.phase === 4);
  chip.classList.toggle('enemy', state.owner === 'ai');

  $('#phaseBtnLabel').textContent = phase.short;

  $$('#phaseList li').forEach((li, i) => {
    li.classList.toggle('active', state.owner === 'player' && i === state.phase);
    li.classList.toggle('done', state.owner === 'player' && i < state.phase);
  });

  const ownerLabel = $('#turnOwnerLabel');
  ownerLabel.textContent = state.owner === 'player' ? 'YOUR TURN' : 'ENEMY TURN';
  $('#turnOwnerLabel').style.color = state.owner === 'player' ? '' : 'var(--pink)';
}

function renderBoard() {
  for (const side of ['player', 'ai']) {
    for (const row of ['monster', 'spell']) {
      for (let i = 0; i < 5; i++) {
        const zone = zoneEls[side][row][i];
        if (!zone) continue;
        const card = state.field[side][`${row}s`][i];
        const sig = card ? `${card.uid}:${card.faceDown ? 1 : 0}:${card.atkMod || 0}` : '';
        if (zone._sig !== sig) {
          zone.querySelectorAll('.zone-card').forEach((n) => n.remove());
          if (card) {
            const el = document.createElement('div');
            el.className = `zone-card ${cardClasses(card)}`;
            el.dataset.uid = String(card.uid);
            el.innerHTML = cardInner(card);
            zone.appendChild(el);
          }
          zone._sig = sig;
        }
        const ghost = zone.querySelector('.zone-ghost');
        if (ghost) ghost.style.opacity = card ? '0' : '';
        const el = zone.querySelector('.zone-card');
        if (el && card) {
          el.classList.toggle('spent', state.attacked.has(card.uid));
          el.classList.toggle('attacker', state.selectedAttacker === card.uid);
        }
      }
    }
  }
}

function renderHand() {
  const handEl = $('#hand');
  if (!handEl) return;
  const cards = state.hand;
  const n = cards.length;
  const width = handEl.clientWidth || 360;
  const styles = getComputedStyle(handEl);
  const cardW = parseFloat(styles.getPropertyValue('--card-w')) || 84;
  const spread = Math.min(width - cardW - 24, Math.max(0, n - 1) * 68);
  const spacing = n > 1 ? spread / (n - 1) : 0;
  const center = (n - 1) / 2;
  const anglePer = n > 1 ? Math.min(4.6, 24 / (n - 1)) : 0;

  const seen = state.seenHand;
  handEl.innerHTML = '';
  cards.forEach((card, i) => {
    const el = document.createElement('div');
    const picked = state.selectedHand === card.uid;
    const rel = i - center;
    const x = picked ? rel * spacing * 0.55 : rel * spacing;
    const angle = picked ? 0 : rel * anglePer;
    const y = picked ? 0 : Math.pow(Math.abs(rel), 1.6) * 1.9;
    const lift = picked ? -maxLift() : 0;
    el.className = `hand-card ${cardClasses(card)}${picked ? ' picked selected' : ''}${seen.has(card.uid) ? '' : ' enter'}`;
    el.dataset.uid = String(card.uid);
    el.style.setProperty('--x', `${x.toFixed(1)}px`);
    el.style.setProperty('--y', `${y.toFixed(1)}px`);
    el.style.setProperty('--a', `${angle.toFixed(2)}deg`);
    el.style.setProperty('--z', String(10 + i));
    el.style.setProperty('--lift', `${lift}px`);
    el.style.setProperty('--s', picked ? '1.07' : '1');
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${card.name}${card.kind === 'monster' ? ` ATK ${effAtk(card)} DEF ${card.def}` : ''}`);
    el.innerHTML = cardInner(card);
    handEl.appendChild(el);
    seen.add(card.uid);
  });
}

function maxLift() {
  return window.innerWidth <= 720 ? 20 : 26;
}

function fitBoard() {
  const stage = $('.stage');
  const arena = $('.arena');
  const tilt = $('#boardTilt');
  if (!stage || !arena || !tilt) return;
  const sr = stage.getBoundingClientRect();
  const ar = arena.getBoundingClientRect();
  if (sr.width < 80 || ar.height < 80) return;
  const widthLimit = Math.min(sr.width * 0.98, 640);
  const heightLimit = (ar.height - 10) * 0.96 / 1.12;
  const width = clamp(Math.min(widthLimit, heightLimit), 210, 640);
  tilt.style.width = `${Math.round(width)}px`;
}

function renderDetail() {
  const tag = $('.ds-tag');
  const text = $('.ds-text');
  if (!tag || !text) return;

  tag.className = 'ds-tag';
  const selected = state.hand.find((c) => c.uid === state.selectedHand);
  if (state.busy && !state.over) {
    tag.textContent = 'WAIT';
    text.textContent = 'AI・カイザーが行動中…';
    return;
  }
  if (state.over) {
    tag.textContent = 'END';
    text.textContent = 'デュエルは終了しました。';
    return;
  }
  if (selected) {
    tag.textContent = 'SELECT';
    if (selected.kind === 'monster') {
      text.innerHTML = `<b>${selected.name}</b> <span class="atk">ATK ${effAtk(selected)}</span> ・ DEF ${selected.def} — 光るゾーンに召喚`;
    } else if (selected.kind === 'spell') {
      text.innerHTML = `<b>${selected.name}</b>（魔法）— 光るゾーンで発動`;
    } else {
      text.innerHTML = `<b>${selected.name}</b>（罠）— 光るゾーンにセット`;
    }
    return;
  }
  if (state.selectedAttacker) {
    const atk = locateCard(state.selectedAttacker)?.card;
    tag.textContent = 'BATTLE';
    tag.classList.add('battle');
    const enemies = getMonsters('ai');
    text.innerHTML = enemies.length
      ? `<b>${atk ? atk.name : 'モンスター'}</b> の攻撃 — 赤く光る相手モンスターをタップ`
      : `<b>${atk ? atk.name : 'モンスター'}</b> の攻撃 — 相手モンスターがいない。相手ゾーンをタップで直接攻撃`;
    return;
  }
  if (state.owner === 'player' && state.phase === 3) {
    tag.textContent = 'BATTLE';
    tag.classList.add('battle');
    const ready = getMonsters('player').filter((c) => !state.attacked.has(c.uid));
    text.textContent = ready.length
      ? '自分のモンスターをタップして攻撃対象を選択'
      : 'このターン攻撃できるモンスターがいません';
    return;
  }
  if (state.owner === 'ai') {
    tag.textContent = 'ENEMY';
    tag.classList.add('warn');
    text.textContent = 'AI・カイザーのターンです…';
    return;
  }
  tag.textContent = 'READY';
  const tip = state.phase === 4
    ? 'エンドフェイズ — 「ターン終了」で手番を渡します'
    : '手札をタップしてカードを選択。盤面をドラッグすると視点が動きます';
  text.textContent = tip;
}

function renderPreview() {
  const slot = $('#previewSlot');
  const info = $('#previewText');
  if (!slot || !info) return;
  const card = state.focusUid ? locateCard(state.focusUid)?.card || state.hand.find((c) => c.uid === state.focusUid) : null;
  if (!card) {
    if (!slot.querySelector('.preview-empty')) {
      slot.innerHTML = `<div class="preview-empty"><span></span><p>カードを選択すると<br>ここに詳細が表示されます</p></div>`;
    }
    info.innerHTML = '';
    return;
  }
  slot.innerHTML = `<div class="${cardClasses(card)}">${cardInner(card)}</div>`;
  const stats = card.kind === 'monster'
    ? `<div class="pv-stats">ATK <b>${effAtk(card)}</b> ／ DEF <b>${card.def}</b> ／ LEVEL ${card.level}</div>`
    : `<div class="pv-stats">${card.kind === 'spell' ? '魔法カード' : '罠カード'}</div>`;
  info.innerHTML = `<div class="pv-name">${card.name}</div>${stats}<div class="pv-effect">${card.text}</div>`;
}

function renderLog() {
  const list = $('#logList');
  if (!list) return;
  if (!state.log.length) {
    list.innerHTML = '<li class="log-empty">まだ記録はありません</li>';
    return;
  }
  list.innerHTML = state.log.slice(0, 6).map((entry) => (
    `<li class="${entry.side === 'ai' ? 'enemy' : 'player'}${entry.highlight ? ' highlight' : ''}">${entry.text}</li>`
  )).join('');
}

function updateHighlights() {
  $$('.zone').forEach((zone) => {
    zone.classList.remove('valid', 'targetable', 'drop-hover');
  });
  const selected = state.hand.find((c) => c.uid === state.selectedHand);
  if (selected && state.owner === 'player' && !state.busy && !state.over) {
    for (const side of ['player']) {
      for (const row of ['monster', 'spell']) {
        zoneEls[side][row].forEach((zone, i) => {
          if (!state.field[side][`${row}s`][i] && canPlaceCard(selected, side, row)) zone.classList.add('valid');
        });
      }
    }
  }
  if (state.selectedAttacker) {
    const playerHasAttacker = !!locateCard(state.selectedAttacker);
    if (!playerHasAttacker) return;
    const enemies = getMonsters('ai');
    if (enemies.length) {
      zoneEls.ai.monster.forEach((zone, i) => {
        if (state.field.ai.monsters[i]) zone.classList.add('targetable');
      });
    } else {
      zoneEls.ai.monster.forEach((zone) => zone.classList.add('targetable'));
    }
  }
}

function updateButtons() {
  const drawBtn = $('#btnDraw');
  drawBtn.disabled = !(state.owner === 'player' && !state.busy && !state.over && !state.hasDrawn)
    || (state.decks.player.length === 0 && state.grave.player.length === 0);
  drawBtn.classList.toggle('has', state.owner === 'player' && !state.hasDrawn && !state.busy && !state.over);
  $('#btnEnd').disabled = state.owner !== 'player' || state.busy || state.over;
  $('#btnPhase').disabled = state.owner !== 'player' || state.busy || state.over;
}

function renderAll() {
  renderHUD();
  renderBoard();
  renderHand();
  renderPhase();
  renderDetail();
  renderPreview();
  renderLog();
  updateHighlights();
  updateButtons();
}

/* ------------------------------------------------------------------ */
/* logging / feedback                                                  */
/* ------------------------------------------------------------------ */
function addLog(text, side = 'player', highlight = false) {
  state.log.unshift({ text, side, highlight });
  if (state.log.length > 30) state.log.length = 30;
  renderLog();
}

let toastTimer = null;
function toast(message, duration = 2600) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

let bannerTimer = null;
function showBanner(text, variant = '') {
  const el = $('#banner');
  el.textContent = text;
  el.className = `banner ${variant}`;
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.classList.remove('show'), 2100);
}

function floatNumber(x, y, text, heal = false) {
  const el = document.createElement('div');
  el.className = `float-num${heal ? ' heal' : ''}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  $('#floatLayer').appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function spawnImpact(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const impact = document.createElement('div');
  impact.className = 'impact';
  impact.style.left = `${r.left + r.width / 2}px`;
  impact.style.top = `${r.top + r.height / 2}px`;
  $('#floatLayer').appendChild(impact);
  setTimeout(() => impact.remove(), 650);
}

function floatDamage(side, amount) {
  const lpEl = $(side === 'player' ? '#playerLp' : '#aiLp');
  if (!lpEl) return;
  const r = lpEl.getBoundingClientRect();
  floatNumber(r.left + r.width / 2, r.top + r.height / 2, `-${amount}`);
}

function applyDamage(side, amount) {
  const dmg = Math.max(0, Math.round(amount));
  if (!dmg) return;
  state.lp[side] = Math.max(0, state.lp[side] - dmg);
  floatDamage(side, dmg);
  renderHUD();
  vibrate(20);
}

/* ------------------------------------------------------------------ */
/* animations                                                          */
/* ------------------------------------------------------------------ */
async function lunge(el) {
  if (!el) return;
  try {
    await el.animate([
      { transform: 'translateX(-50%) translateY(0) scale(1)' },
      { transform: 'translateX(-50%) translateY(-22px) scale(1.08)' },
      { transform: 'translateX(-50%) translateY(0) scale(1)' },
    ], { duration: 420, easing: 'cubic-bezier(.3,.7,.3,1)' }).finished;
  } catch { /* noop */ }
}

async function destroyCard(card) {
  const loc = locateCard(card.uid);
  if (!loc) return;
  const el = cardEl(card.uid);
  if (el) {
    el.classList.add('destroying');
    spawnImpact(el);
  }
  sfx('destroy');
  vibrate(28);
  await sleep(560);
  const now = locateCard(card.uid);
  if (now) {
    state.field[now.side][`${now.row}s`][now.index] = null;
    card.faceDown = false;
    card.atkMod = 0;
    state.grave[now.side].push(card);
    addLog(`${card.name} は墓地へ送られた。`, now.side, true);
  }
  renderAll();
}

async function moveToGrave(loc) {
  if (!loc) return;
  const { side, row, index, card } = loc;
  state.field[side][`${row}s`][index] = null;
  card.faceDown = false;
  card.atkMod = 0;
  state.grave[side].push(card);
  renderAll();
}

/* ------------------------------------------------------------------ */
/* phases, draw, selection                                             */
/* ------------------------------------------------------------------ */
function advancePhase() {
  if (state.owner !== 'player' || state.busy || state.over) return;
  state.phase = (state.phase + 1) % PHASES.length;
  if (state.phase !== 3) state.selectedAttacker = null;
  sfx('tap');
  if (state.phase === 3) toast('バトルフェイズ — 自分のモンスターをタップして攻撃');
  else if (state.phase === 4) toast('エンドフェイズ — 「ターン終了」でAIに手番を渡します');
  else if (state.phase === 0) toast('ドローフェイズ — 「ドロー」で1枚引けます');
  renderAll();
}

function drawCard() {
  if (state.owner !== 'player' || state.busy || state.over || state.hasDrawn) return;
  if (state.hand.length >= 8) {
    toast('手札がいっぱいです。カードを場に出してください');
    return;
  }
  const card = drawFor('player');
  if (!card) {
    toast('山札が空です');
    return;
  }
  state.hasDrawn = true;
  state.focusUid = null;
  addLog(`あなたは ${card.name} をドローした。`, 'player');
  sfx('draw');
  vibrate(8);
  renderAll();
}

function toggleHandSelection(uid) {
  if (state.busy || state.over || state.owner !== 'player') return;
  if (state.selectedHand === uid) {
    state.selectedHand = null;
  } else {
    state.selectedHand = uid;
    state.selectedAttacker = null;
    state.focusUid = uid;
    sfx('tap');
    vibrate(8);
    const card = state.hand.find((c) => c.uid === uid);
    if (card && card.kind === 'trap') toast('罠カードはセットされます。攻撃時に発動します');
  }
  renderAll();
}

function canPlaceCard(card, side, row) {
  if (side !== 'player') return false;
  if (row === 'monster') return card.kind === 'monster';
  if (row === 'spell') return card.kind === 'spell' || card.kind === 'trap';
  return false;
}

function canPlaceInZone(zone) {
  if (!zone || state.busy || state.over || state.owner !== 'player') return false;
  const selected = state.hand.find((c) => c.uid === state.selectedHand);
  if (!selected) return false;
  const side = zone.dataset.side;
  const row = zone.dataset.row;
  const index = Number(zone.dataset.index);
  if (!canPlaceCard(selected, side, row)) return false;
  if (!zoneEls[side] || !zoneEls[side][row]) return false;
  if (state.field[side][`${row}s`][index]) return false;
  return true;
}

async function resolvePlayerSpell(card) {
  await sleep(420);
  if (card.key === 'hoshi') {
    addLog('星詠みの書 — 山札から1枚ドロー。', 'player');
    sfx('draw');
    const drawn = drawFor('player');
    if (!drawn) addLog('山札が空だった。', 'player');
    renderAll();
  } else if (card.key === 'haja') {
    const targets = getMonsters('ai');
    if (targets.length) {
      const target = targets.slice().sort((a, b) => effAtk(b) - effAtk(a))[0];
      addLog(`破邪の閃光 — ${target.name} を破壊！`, 'player', true);
      await destroyCard(target);
    } else {
      addLog('破邪の閃光 — 対象となるモンスターがいない。', 'player');
      toast('相手モンスターがいません');
    }
  }
  const loc = locateCard(card.uid);
  if (loc) {
    state.field[loc.side][`${loc.row}s`][loc.index] = null;
    addLog(`${card.name} は墓地へ送られた。`, 'player');
    state.grave.player.push(card);
  }
  renderAll();
}

async function placeInZone(zone) {
  if (!canPlaceInZone(zone)) return;
  const card = state.hand.find((c) => c.uid === state.selectedHand);
  if (!card) return;
  const side = zone.dataset.side;
  const row = zone.dataset.row;
  const index = Number(zone.dataset.index);

  state.hand = state.hand.filter((c) => c.uid !== card.uid);
  state.selectedHand = null;
  state.selectedAttacker = null;
  state.focusUid = card.uid;

  if (card.kind === 'monster') {
    state.field[side].monsters[index] = card;
    addLog(`${card.name} を召喚した。`, 'player');
    sfx('summon');
    vibrate(14);
  } else if (card.kind === 'trap') {
    card.faceDown = true;
    state.field[side].spells[index] = card;
    addLog(`${card.name} をセットした。`, 'player');
    sfx('set');
    vibrate(10);
  } else {
    state.field[side].spells[index] = card;
    addLog(`${card.name} を発動した。`, 'player', true);
    sfx('summon');
    vibrate(14);
  }
  renderAll();
  if (card.kind === 'spell') {
    state.busy = true;
    renderDetail();
    updateButtons();
    await resolvePlayerSpell(card);
    state.busy = false;
    renderAll();
    checkEnd();
  }
}

function selectAttacker(card) {
  if (state.attacked.has(card.uid)) {
    toast('このモンスターはこのターン攻撃済みです');
    return;
  }
  state.selectedAttacker = card.uid;
  state.selectedHand = null;
  state.focusUid = card.uid;
  sfx('tap');
  vibrate(8);
  renderAll();
}

/* ------------------------------------------------------------------ */
/* combat                                                              */
/* ------------------------------------------------------------------ */
async function revealTrap(trap) {
  const { card, side } = trap;
  card.faceDown = false;
  renderBoard();
  const el = cardEl(card.uid);
  if (el) el.classList.add('flipping');
  sfx('flip');
  addLog(`${sideLabel(side)}の伏せカードが発動！`, side, true);
  await sleep(620);
}

async function resolveAttack(attackerSide, attackerUid, defenderSide, targetUid) {
  const attackerLoc = locateCard(attackerUid);
  if (!attackerLoc) return;
  const attacker = attackerLoc.card;
  const attackerEl = cardEl(attackerUid);
  const defender = targetUid ? locateCard(targetUid) : null;
  const defenderEl = defender ? cardEl(targetUid) : null;

  sfx('attack');
  await lunge(attackerEl);

  const trap = getFaceDownTrap(defenderSide);
  if (trap) {
    await revealTrap(trap);
    if (trap.card.key === 'kagami') {
      addLog(`鏡像の罠 — 攻撃を反射！ ${attacker.name} を破壊。`, defenderSide, true);
      await destroyCard(attacker);
      await moveToGrave(locateCard(trap.card.uid));
      return;
    }
    if (trap.card.key === 'suna') {
      attacker.atkMod = (attacker.atkMod || 0) - 500;
      addLog(`時の砂時計 — ${attacker.name} の攻撃力が500ダウン。`, defenderSide, true);
      renderAll();
      await sleep(420);
      await moveToGrave(locateCard(trap.card.uid));
    } else {
      addLog('伏せカードは不発に終わった。', defenderSide);
      await moveToGrave(locateCard(trap.card.uid));
    }
    if (!locateCard(attackerUid)) return;
  }

  const atk = effAtk(attacker);
  if (!defender) {
    addLog(`${sideLabel(attackerSide)}の ${attacker.name} が直接攻撃！ ${atk} ダメージ。`, attackerSide, true);
    const lpEl = $(defenderSide === 'player' ? '#playerLp' : '#aiLp');
    spawnImpact(lpEl);
    applyDamage(defenderSide, atk);
    sfx('hit');
  } else {
    const def = effAtk(defender.card);
    const attackerName = attacker.name;
    const defenderName = defender.card.name;
    if (atk > def) {
      const dmg = atk - def;
      addLog(`${attackerName} が ${defenderName} を撃破！ ${dmg} ダメージ。`, attackerSide, true);
      if (defenderEl) defenderEl.classList.add('defender-hit');
      spawnImpact(defenderEl);
      sfx('hit');
      await sleep(240);
      applyDamage(defenderSide, dmg);
      await destroyCard(defender.card);
    } else if (atk < def) {
      const dmg = def - atk;
      addLog(`${attackerName} は ${defenderName} に敗北… ${dmg} ダメージ。`, defenderSide, true);
      if (attackerEl) attackerEl.classList.add('defender-hit');
      spawnImpact(attackerEl);
      sfx('hit');
      await sleep(240);
      applyDamage(attackerSide, dmg);
      await destroyCard(attacker);
    } else {
      addLog(`${attackerName} と ${defenderName} は相打ちになった。`, attackerSide, true);
      spawnImpact(attackerEl);
      sfx('hit');
      await sleep(220);
      await destroyCard(defender.card);
      await destroyCard(attacker);
    }
  }

  if (locateCard(attackerUid)) state.attacked.add(attackerUid);
  renderAll();
  checkEnd();
}

function checkEnd() {
  if (state.over) return;
  if (state.lp.player <= 0 || state.lp.ai <= 0) {
    endDuel(state.lp.ai <= 0 ? 'player' : 'ai');
  }
}

async function playerAttack(targetUid) {
  if (state.busy || state.over || !state.selectedAttacker) return;
  const attackerUid = state.selectedAttacker;
  if (!locateCard(attackerUid)) return;
  state.busy = true;
  state.selectedAttacker = null;
  state.selectedHand = null;
  updateHighlights();
  renderDetail();
  updateButtons();
  await resolveAttack('player', attackerUid, 'ai', targetUid);
  state.busy = false;
  renderAll();
  checkEnd();
}

function handleZoneTap(zone) {
  if (state.busy || state.over) return;
  const side = zone.dataset.side;
  const row = zone.dataset.row;
  if (row === 'field') {
    toast('フィールド魔法はこのデュエルでは使用しません');
    return;
  }
  const index = Number(zone.dataset.index);
  const card = state.field[side][`${row}s`][index];

  if (state.selectedHand) {
    if (canPlaceInZone(zone)) placeInZone(zone);
    else if (card) {
      state.focusUid = card.uid;
      renderAll();
    } else {
      toast('このカードはここに置けません');
    }
    return;
  }

  if (state.selectedAttacker) {
    if (side === 'player' && card && isMonster(card)) {
      if (card.uid === state.selectedAttacker) {
        state.selectedAttacker = null;
        sfx('tap');
        renderAll();
      } else {
        selectAttacker(card);
      }
      return;
    }
    if (side === 'ai' && row === 'monster') {
      if (getMonsters('ai').length === 0) playerAttack(null);
      else if (card) playerAttack(card.uid);
      else toast('攻撃対象のモンスターをタップしてください');
    } else {
      toast('赤く光る相手モンスターをタップしてください');
    }
    return;
  }

  if (!card) {
    if (state.owner === 'player' && state.phase === 3) {
      toast('自分のモンスターをタップして攻撃を開始');
    } else {
      toast('手札をタップしてカードを選択');
    }
    return;
  }

  state.focusUid = card.uid;
  if (side === 'player' && isMonster(card) && state.owner === 'player') {
    if (state.phase === 3) {
      selectAttacker(card);
      return;
    }
    if (state.attacked.has(card.uid)) toast('このモンスターはこのターン攻撃済みです');
    else toast('バトルフェイズになると攻撃できます');
  }
  if (side === 'ai' && isMonster(card) && state.owner === 'player') {
    toast('攻撃するには、まず自分のモンスターを選択します');
  }
  sfx('tap');
  renderAll();
}

/* ------------------------------------------------------------------ */
/* AI turn                                                             */
/* ------------------------------------------------------------------ */
async function aiTurn() {
  if (state.over) return;
  state.owner = 'ai';
  state.busy = true;
  state.selectedHand = null;
  state.selectedAttacker = null;
  state.phase = 2;
  state.attacked.clear();
  renderAll();
  showBanner('AI のターン', 'enemy');
  sfx('tap');
  await sleep(950);

  drawFor('ai');
  renderAll();
  await sleep(420);

  const monsters = state.aiHand.filter((c) => c.kind === 'monster');
  const others = state.aiHand.filter((c) => c.kind !== 'monster');
  const emptyMon = emptyIndices('ai', 'monster');
  const emptySpell = emptyIndices('ai', 'spell');
  let placed = false;

  if (monsters.length && emptyMon.length && (Math.random() < 0.78 || !others.length)) {
    const card = pick(monsters);
    const index = pick(emptyMon);
    state.aiHand = state.aiHand.filter((c) => c.uid !== card.uid);
    state.field.ai.monsters[index] = card;
    addLog(`AI は ${card.name} を召喚した。`, 'ai');
    sfx('summon');
    renderAll();
    placed = true;
  } else if (others.length && emptySpell.length) {
    const card = pick(others);
    const index = pick(emptySpell);
    state.aiHand = state.aiHand.filter((c) => c.uid !== card.uid);
    card.faceDown = true;
    state.field.ai.spells[index] = card;
    addLog('AI は伏せカードを1枚セットした。', 'ai');
    sfx('set');
    renderAll();
    placed = true;
  }
  if (placed) await sleep(760);

  const aiMonsters = getMonsters('ai').filter((c) => !state.attacked.has(c.uid));
  if (aiMonsters.length) {
    const attacker = aiMonsters.slice().sort((a, b) => effAtk(b) - effAtk(a))[0];
    const playerMonsters = getMonsters('player');
    let target = null;
    if (playerMonsters.length) {
      target = playerMonsters.slice().sort((a, b) => effAtk(a) - effAtk(b))[0];
    }
    await resolveAttack('ai', attacker.uid, 'player', target ? target.uid : null);
    await sleep(500);
  } else {
    addLog('AI は攻撃しなかった。', 'ai');
    await sleep(600);
  }

  if (state.over) { state.busy = false; return; }

  state.owner = 'player';
  state.turn += 1;
  state.phase = 2;
  state.hasDrawn = false;
  state.attacked.clear();
  state.busy = false;
  renderAll();
  showBanner('あなたのターン');
  sfx('tap');
}

async function endTurn() {
  if (state.busy || state.over || state.owner !== 'player') return;
  state.selectedHand = null;
  state.selectedAttacker = null;
  state.busy = true;
  renderAll();
  await aiTurn();
}

/* ------------------------------------------------------------------ */
/* tilt + drag look                                                    */
/* ------------------------------------------------------------------ */
let targetRx = 22;
let targetRy = 0;
let curRx = 22;
let curRy = 0;
let loopStarted = false;
let tiltEnabled = false;
let tiltSeen = false;
let baseBeta = null;
let baseGamma = null;
let tiltTimer = null;

function startLoop() {
  if (loopStarted) return;
  loopStarted = true;
  const tick = () => {
    curRx += (targetRx - curRx) * 0.12;
    curRy += (targetRy - curRy) * 0.12;
    const tilt = $('#boardTilt');
    const board = $('#board');
    if (tilt) tilt.style.transform = `rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg)`;
    if (board) board.style.setProperty('--rx', `${curRx.toFixed(2)}deg`);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function onOrientation(event) {
  if (event.beta == null && event.gamma == null) return;
  tiltSeen = true;
  if (baseBeta == null) {
    baseBeta = event.beta || 0;
    baseGamma = event.gamma || 0;
  }
  const db = (event.beta || 0) - baseBeta;
  const dg = (event.gamma || 0) - baseGamma;
  const portrait = window.innerHeight >= window.innerWidth;
  const pitch = portrait ? db : -dg;
  const yaw = portrait ? dg : db;
  targetRx = clamp(22 + pitch * 0.3, 8, 40);
  targetRy = clamp(yaw * 0.5, -24, 24);
}

function setTiltButton(on) {
  const btn = $('#btnTilt');
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.querySelector('span').textContent = on ? '傾きON' : '傾き';
  tiltEnabled = on;
}

function disableTilt(notify = false) {
  window.removeEventListener('deviceorientation', onOrientation);
  clearTimeout(tiltTimer);
  setTiltButton(false);
  targetRx = 22;
  targetRy = 0;
  if (notify) toast('傾き操作をオフにしました');
}

async function toggleTilt() {
  if (tiltEnabled) {
    disableTilt(true);
    sfx('tap');
    return;
  }
  if (!window.DeviceOrientationEvent) {
    toast('この端末は傾きセンサーに対応していません。盤面をドラッグすると視点を動かせます');
    return;
  }
  const DOE = window.DeviceOrientationEvent;
  if (typeof DOE.requestPermission === 'function') {
    try {
      const result = await DOE.requestPermission();
      if (result !== 'granted') {
        toast('モーション権限が許可されませんでした。設定から許可できます');
        return;
      }
    } catch {
      toast('モーション権限を取得できませんでした');
      return;
    }
  }
  baseBeta = null;
  baseGamma = null;
  tiltSeen = false;
  window.addEventListener('deviceorientation', onOrientation, { passive: true });
  setTiltButton(true);
  sfx('tap');
  vibrate(12);
  toast('傾き操作をオンにしました。端末を傾けてみてください');
  clearTimeout(tiltTimer);
  tiltTimer = setTimeout(() => {
    if (tiltEnabled && !tiltSeen) {
      disableTilt(false);
      toast('傾きデータを受信できません。盤面をドラッグすると視点を動かせます');
    }
  }, 2500);
}

let look = null;
function onLookStart(e) {
  if (e.target.closest('.zone, .field-zone, .card, .board-head, .board-foot, .duel-core')) return;
  look = { x: e.clientX, y: e.clientY, rx: targetRx, ry: targetRy };
  $('#stage').classList.add('dragging');
}
function onLookMove(e) {
  if (!look) return;
  targetRy = clamp(look.ry + (e.clientX - look.x) * 0.18, -28, 28);
  targetRx = clamp(look.rx - (e.clientY - look.y) * 0.14, 6, 44);
}
function onLookEnd() {
  look = null;
  $('#stage').classList.remove('dragging');
}

/* ------------------------------------------------------------------ */
/* hand drag                                                           */
/* ------------------------------------------------------------------ */
let drag = null;
let ghost = null;

function handPointerDown(e) {
  if (state.busy || state.over || state.owner !== 'player') return;
  const el = e.target.closest('.hand-card');
  if (!el) return;
  const card = state.hand.find((c) => c.uid === Number(el.dataset.uid));
  if (!card) return;
  e.preventDefault();
  drag = { uid: card.uid, card, el, startX: e.clientX, startY: e.clientY, active: false };
  try { el.setPointerCapture(e.pointerId); } catch { /* noop */ }
  window.addEventListener('pointermove', handPointerMove, { passive: false });
  window.addEventListener('pointerup', handPointerUp);
  window.addEventListener('pointercancel', handPointerUp);
}

function handPointerMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;
  if (!drag.active && Math.hypot(dx, dy) > 8) {
    drag.active = true;
    state.selectedHand = drag.uid;
    state.selectedAttacker = null;
    state.focusUid = drag.uid;
    drag.el.classList.add('dragging');
    updateHighlights();
    renderDetail();
    renderPreview();
    sfx('tap');

    const rect = drag.el.getBoundingClientRect();
    ghost = drag.el.cloneNode(true);
    ghost.classList.remove('dragging', 'picked', 'selected', 'enter');
    ghost.classList.add('drag-ghost');
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    document.body.appendChild(ghost);
  }
  if (drag.active && ghost) {
    e.preventDefault();
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.zone');
    $$('.zone.drop-hover').forEach((z) => z.classList.remove('drop-hover'));
    if (target && canPlaceInZone(target)) target.classList.add('drop-hover');
  }
}

function handPointerUp(e) {
  if (!drag) return;
  window.removeEventListener('pointermove', handPointerMove);
  window.removeEventListener('pointerup', handPointerUp);
  window.removeEventListener('pointercancel', handPointerUp);
  const current = drag;
  drag = null;
  ghost?.remove();
  ghost = null;
  $$('.zone.drop-hover').forEach((z) => z.classList.remove('drop-hover'));
  current.el.classList.remove('dragging');

  if (!current.active) {
    toggleHandSelection(current.uid);
    return;
  }

  const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.zone');
  if (target && canPlaceInZone(target)) {
    placeInZone(target);
  } else {
    sfx('tap');
    renderAll();
  }
}

/* ------------------------------------------------------------------ */
/* modals                                                              */
/* ------------------------------------------------------------------ */
function openModal(title, bodyHtml) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHtml;
  $('#modal').hidden = false;
}

function closeModal() {
  $('#modal').hidden = true;
}

function openHelp() {
  const motionSupported = !!window.DeviceOrientationEvent;
  const iosNeedsPermission = typeof window.DeviceOrientationEvent?.requestPermission === 'function';
  openModal('遊び方 / HELP', `
    <h3>TOUCH</h3>
    <ul>
      <li>手札カードを<b>タップ</b>して選択 → 光るゾーンをタップで配置。</li>
      <li>手札カードを<b>ドラッグ</b>してゾーンに直接ドロップすることもできます。</li>
      <li>モンスターはモンスターゾーン、魔法・罠は魔法・罠ゾーンへ。</li>
    </ul>
    <h3>BATTLE</h3>
    <ul>
      <li>「フェイズ」で<b>バトル</b>に進み、自分のモンスターをタップ。</li>
      <li>赤く光る相手モンスターをタップすると攻撃。相手がいなければ直接攻撃。</li>
      <li>ATKが高い方が生き残り、差額がLPダメージ。伏せ罠に注意。</li>
      <li>攻撃済みモンスターは暗くなり、そのターンは攻撃できません。</li>
    </ul>
    <h3>TILT / 傾き</h3>
    <ul>
      <li>「傾き」ボタンで端末のモーションセンサーを有効化。</li>
      <li>${iosNeedsPermission ? 'iOS では許可ダイアログが表示されます。<b>許可</b>を選んでください。' : (motionSupported ? '対応端末では端末を傾けると盤面が追従します。' : 'このブラウザは傾きセンサー非対応です。ドラッグで視点を動かせます。')}</li>
      <li>傾きが使えない環境でも、盤面の余白を<b>ドラッグ</b>して視点を回転できます。</li>
    </ul>
    <h3>RULE</h3>
    <ul>
      <li>初期LPは8000。相手のLPを0にすれば勝利。</li>
      <li>「ドロー」は1ターンに1枚。「ターン終了」でAIに手番が移ります。</li>
      <li>魔法は発動後に墓地へ。罠はセットされ、相手の攻撃時に発動します。</li>
    </ul>
    <h3>SOUND</h3>
    <p>効果音は「音」ボタンでオン・オフできます。</p>
    ${iosNeedsPermission ? '<button class="btn primary" id="helpTilt" type="button" style="margin-top:12px">傾きを有効にする</button>' : ''}
  `);
  const tiltBtn = $('#helpTilt');
  if (tiltBtn) tiltBtn.addEventListener('click', () => { closeModal(); toggleTilt(); });
}

function openGrave() {
  const column = (side) => {
    const cards = state.grave[side];
    const label = side === 'player' ? 'あなたの墓地' : 'AIの墓地';
    if (!cards.length) return `<div class="gy-col"><h3>${label}</h3><div class="gy-empty">まだカードはありません</div></div>`;
    const rows = cards.slice().reverse().map((c) => {
      const cls = c.kind === 'spell' ? 'spell' : c.kind === 'trap' ? 'trap' : '';
      const atk = c.kind === 'monster' ? `<span class="gy-atk">ATK ${c.atk}</span>` : '';
      return `<div class="gy-item"><i class="${cls}"></i><span>${c.name}</span>${atk}</div>`;
    }).join('');
    return `<div class="gy-col"><h3>${label} (${cards.length})</h3>${rows}</div>`;
  };
  openModal('墓地 / GRAVEYARD', `<div class="gy-grid">${column('player')}${column('ai')}</div>`);
}

/* ------------------------------------------------------------------ */
/* game over / setup                                                   */
/* ------------------------------------------------------------------ */
function endDuel(winner) {
  if (state.over) return;
  state.over = true;
  state.busy = true;
  state.selectedHand = null;
  state.selectedAttacker = null;
  renderAll();
  const card = $('#gameover .go-card');
  card.classList.toggle('lose', winner !== 'player');
  $('#goTitle').textContent = winner === 'player' ? '勝利' : '敗北';
  $('#goText').textContent = winner === 'player'
    ? 'AI・カイザーを打ち破った。ホログラムが勝者の色に染まる。'
    : 'LPが尽きた。デッキを組み直して再挑戦しよう。';
  $('#gameover').hidden = false;
  sfx(winner === 'player' ? 'win' : 'lose');
}

function resetDuel() {
  uidCounter = 0;
  state.turn = 3;
  state.owner = 'player';
  state.phase = 2;
  state.hasDrawn = false;
  state.lp = { player: 8000, ai: 8000 };
  state.field = { player: emptyField(), ai: emptyField() };
  state.hand = [];
  state.aiHand = [];
  state.decks = { player: [], ai: [] };
  state.grave = { player: [], ai: [] };
  state.banished = { player: [], ai: [] };
  state.selectedHand = null;
  state.selectedAttacker = null;
  state.busy = false;
  state.over = false;
  state.log = [];
  state.attacked = new Set();
  state.focusUid = null;
  state.seenHand = new Set();
  $('#gameover').hidden = true;
  closeModal();
  setup();
}

function setup() {
  state.decks.player = buildDeck();
  state.decks.ai = buildDeck();
  for (let i = 0; i < 5; i++) {
    const p = state.decks.player.pop();
    const a = state.decks.ai.pop();
    if (p) state.hand.push(p);
    if (a) state.aiHand.push(a);
  }

  const playerMonster = takeFromDeck('player', 'kikou');
  state.field.player.monsters[1] = playerMonster;
  const playerTrap = takeFromDeck('player', 'kagami');
  playerTrap.faceDown = true;
  state.field.player.spells[3] = playerTrap;

  const aiMonster = takeFromDeck('ai', 'gekkou');
  state.field.ai.monsters[2] = aiMonster;
  const aiTrap = takeFromDeck('ai', 'suna');
  aiTrap.faceDown = true;
  state.field.ai.spells[2] = aiTrap;

  addLog('デュエル開始。あなたのターンです。', 'player', true);
  renderAll();
  startLoop();
  requestAnimationFrame(() => renderHand());
}

/* ------------------------------------------------------------------ */
/* events                                                              */
/* ------------------------------------------------------------------ */
function bindEvents() {
  $('#hand').addEventListener('pointerdown', handPointerDown);

  $('#hand').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest('.hand-card');
    if (!el) return;
    e.preventDefault();
    toggleHandSelection(Number(el.dataset.uid));
    $('.hand-card.picked')?.focus();
  });

  $('#board').addEventListener('click', (e) => {
    const zone = e.target.closest('.zone');
    if (!zone) return;
    handleZoneTap(zone);
  });

  $('#stage').addEventListener('pointerdown', onLookStart);
  window.addEventListener('pointermove', onLookMove);
  window.addEventListener('pointerup', onLookEnd);
  window.addEventListener('pointercancel', onLookEnd);

  $('#btnDraw').addEventListener('click', drawCard);
  $('#btnPhase').addEventListener('click', advancePhase);
  $('#btnEnd').addEventListener('click', endTurn);
  $('#btnTilt').addEventListener('click', toggleTilt);
  $('#btnGrave').addEventListener('click', openGrave);
  $('#btnHelp').addEventListener('click', openHelp);
  $('#btnSound').addEventListener('click', () => {
    soundOn = !soundOn;
    $('#btnSound').setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    $('#btnSound').classList.toggle('muted', !soundOn);
    if (soundOn) { ensureAudio(); sfx('tap'); }
    toast(soundOn ? '効果音 ON' : '効果音 OFF', 1400);
  });
  $('#btnRestart').addEventListener('click', resetDuel);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key.toLowerCase() === 'm') $('#btnSound').click();
  });

  window.addEventListener('resize', () => {
    fitBoard();
    renderHand();
    updateHighlights();
  });

  if (window.ResizeObserver) {
    const arena = $('.arena');
    if (arena) new ResizeObserver(() => fitBoard()).observe(arena);
  }

  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.card, .zone, .stage')) e.preventDefault();
  });

  window.addEventListener('pointerdown', ensureAudio, { once: true });

  const phaseItemClick = (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const target = Number(li.dataset.phase);
    if (state.owner !== 'player' || state.busy || state.over) return;
    state.phase = target;
    renderAll();
    sfx('tap');
  };
  $$('#phaseList li').forEach((li) => li.addEventListener('click', phaseItemClick));
}

/* ------------------------------------------------------------------ */
/* boot                                                                */
/* ------------------------------------------------------------------ */
function spawnParticles() {
  const wrap = $('#particles');
  if (!wrap) return;
  const colors = ['#5be7ff', '#a47bff', '#ff63cf', '#ffd27a'];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    const size = 1 + Math.random() * 2.4;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${55 + Math.random() * 45}%`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.background = colors[i % colors.length];
    s.style.boxShadow = `0 0 ${4 + size * 2}px currentColor`;
    s.style.color = colors[i % colors.length];
    s.style.animationDuration = `${9 + Math.random() * 14}s`;
    s.style.animationDelay = `${-Math.random() * 18}s`;
    s.style.opacity = String(0.15 + Math.random() * 0.4);
    wrap.appendChild(s);
  }
}

buildBoard();
bindEvents();
spawnParticles();
fitBoard();
setup();
fitBoard();
renderAll();
requestAnimationFrame(() => { fitBoard(); renderHand(); });

window.__duel = { state, getMonsters, locateCard, makeCard, renderAll, placeInZone, selectAttacker, advancePhase, endTurn, checkEnd };
