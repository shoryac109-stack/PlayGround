import {
  ATTR, OPPONENTS, cardFaceHTML, boardCardHTML, number, effAtk, effDef, escapeHtml
} from './cards.js';
import * as engine from './engine.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const els = {
  app: $('#app'),
  board: $('#board'),
  boardStage: $('#boardStage'),
  roomChipCode: $('#roomChipCode'),
  roomChip: $('#roomChip'),
  oppAvatar: $('#oppAvatar'),
  oppName: $('#oppName'),
  oppTag: $('#oppTag'),
  oppLpFill: $('#oppLpFill'),
  oppLpGhost: $('#oppLpGhost'),
  oppLpValue: $('#oppLpValue'),
  oppHandCount: $('#oppHandCount'),
  playerTag: $('#playerTag'),
  playerLpFill: $('#playerLpFill'),
  playerLpGhost: $('#playerLpGhost'),
  playerLpValue: $('#playerLpValue'),
  playerHandCount: $('#playerHandCount'),
  aiDeck: $('#aiDeck'),
  aiGrave: $('#aiGrave'),
  playerDeck: $('#playerDeck'),
  playerGrave: $('#playerGrave'),
  boardHint: $('#boardHint'),
  selection: $('#selection'),
  selectionText: $('#selectionText'),
  hand: $('#hand'),
  actions: $('#actions'),
  lobby: $('#lobby'),
  lobbyCode: $('#lobbyCode'),
  lobbyAvatar: $('#lobbyAvatar'),
  lobbyOpponent: $('#lobbyOpponent'),
  lobbyOpponentTag: $('#lobbyOpponentTag'),
  copyCode: $('#copyCode'),
  rerollRoom: $('#rerollRoom'),
  startBtn: $('#startBtn'),
  joinToggle: $('#joinToggle'),
  joinForm: $('#joinForm'),
  joinCode: $('#joinCode'),
  lobbyTilt: $('#lobbyTilt'),
  lobbySound: $('#lobbySound'),
  settings: $('#settings'),
  settingsClose: $('#settingsClose'),
  setSound: $('#setSound'),
  setTilt: $('#setTilt'),
  setHaptics: $('#setHaptics'),
  motionStatus: $('#motionStatus'),
  recalibrate: $('#recalibrate'),
  surrenderBtn: $('#surrenderBtn'),
  backToLobbyBtn: $('#backToLobbyBtn'),
  result: $('#result'),
  resultCard: $('.result-card'),
  resultKicker: $('#resultKicker'),
  resultTitle: $('#resultTitle'),
  resultSub: $('#resultSub'),
  resultTurns: $('#resultTurns'),
  resultLp: $('#resultLp'),
  resultRoom: $('#resultRoom'),
  rematchBtn: $('#rematchBtn'),
  resultLobbyBtn: $('#resultLobbyBtn'),
  banner: $('#banner'),
  toast: $('#toast'),
  damageLayer: $('#damageLayer'),
  tiltQuick: $('#tiltQuick'),
  soundBtn: $('#soundBtn'),
  menuBtn: $('#menuBtn'),
  playerHud: $('#playerHud'),
  oppHud: $('#oppHud')
};

const tilt = {
  enabled: false,
  base: null,
  beta: 0,
  gamma: 0,
  px: 0,
  py: 0,
  x: 0,
  y: 0,
  sensorSeen: false,
  raf: 0
};

const SETTINGS_KEY = 'rumuma.settings.v1';
let soundOn = true;
let hapticsOn = true;
let audioCtx = null;
let toastTimer = 0;
let bannerTimer = 0;
let drag = null;
let currentOpponent = OPPONENTS[0];
let currentRoomCode = '';

function randomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

function randomOpponent() {
  return OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
}

function paintAvatar(element, hue) {
  element.style.background = `radial-gradient(circle at 30% 20%, rgba(255,255,255,.22), transparent 45%), linear-gradient(145deg, hsl(${hue} 62% 30%), hsl(${hue} 58% 9%) 72%)`;
  element.style.borderColor = `hsla(${hue} 85% 70% / .45)`;
  element.style.color = `hsl(${hue} 85% 87%)`;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function showBanner(en, jp, className = '') {
  els.banner.className = `banner ${className}`;
  els.banner.innerHTML = `<span class="banner-en">${escapeHtml(en)}</span><span class="banner-jp">${escapeHtml(jp)}</span>`;
  els.banner.classList.add('show');
  window.clearTimeout(bannerTimer);
  bannerTimer = window.setTimeout(() => els.banner.classList.remove('show'), 1180);
}

function haptic(pattern) {
  if (!hapticsOn) return;
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (error) { /* ignore */ }
  }
}

function shake(className) {
  els.app.classList.remove('shake-light', 'shake-heavy');
  void els.app.offsetWidth;
  els.app.classList.add(className);
  window.setTimeout(() => els.app.classList.remove(className), 460);
}

function popDamage(owner, amount, type) {
  const target = owner === 'player' ? els.playerHud : els.oppHud;
  const rect = target.getBoundingClientRect();
  const element = document.createElement('div');
  element.className = `damage damage--${type === 'heal' ? 'heal' : 'hit'}`;
  element.textContent = type === 'heal' ? `+${number(amount)}` : `-${number(amount)}`;
  element.style.left = `${rect.left + rect.width * 0.58}px`;
  element.style.top = `${rect.top + rect.height * 0.08}px`;
  els.damageLayer.append(element);
  window.setTimeout(() => element.remove(), 980);
}

function initAudio() {
  if (!soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (error) { /* ignore */ }
}

function tone(freq, duration, type = 'sine', volume = 0.03, slide = 0, delay = 0) {
  if (!audioCtx || !soundOn) return;
  const start = audioCtx.currentTime + delay;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, start);
  if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function sfx(name) {
  if (!soundOn) return;
  initAudio();
  if (!audioCtx) return;
  switch (name) {
    case 'click':
      tone(620, 0.05, 'triangle', 0.018);
      break;
    case 'draw':
      tone(520, 0.12, 'sine', 0.022, 300);
      break;
    case 'summon':
      tone(110, 0.36, 'sawtooth', 0.028, -40);
      tone(660, 0.26, 'sine', 0.018, 400, 0.05);
      break;
    case 'set':
      tone(240, 0.1, 'triangle', 0.022);
      break;
    case 'attack':
      tone(300, 0.22, 'sawtooth', 0.032, -220);
      break;
    case 'damage':
      tone(90, 0.28, 'square', 0.038, -40);
      break;
    case 'heal':
      tone(520, 0.18, 'sine', 0.024, 260);
      tone(780, 0.22, 'sine', 0.018, 200, 0.08);
      break;
    case 'trap':
      tone(180, 0.3, 'sawtooth', 0.028, 90);
      tone(420, 0.2, 'square', 0.018, -200, 0.06);
      break;
    case 'spell':
      tone(440, 0.2, 'triangle', 0.028, 500);
      break;
    case 'turn':
      tone(330, 0.12, 'sine', 0.018, 100);
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((freq, index) => tone(freq, 0.28, 'triangle', 0.028, 0, index * 0.1));
      break;
    case 'lose':
      [392, 330, 262, 196].forEach((freq, index) => tone(freq, 0.32, 'sine', 0.028, 0, index * 0.12));
      break;
    case 'destroy':
      tone(140, 0.25, 'square', 0.028, -80);
      break;
    default:
      break;
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.sound === 'boolean') soundOn = parsed.sound;
    if (typeof parsed.haptics === 'boolean') hapticsOn = parsed.haptics;
  } catch (error) { /* ignore */ }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ sound: soundOn, haptics: hapticsOn }));
  } catch (error) { /* ignore */ }
}

function updateSoundUI() {
  els.soundBtn.classList.toggle('is-off', !soundOn);
  els.soundBtn.setAttribute('aria-pressed', String(soundOn));
  els.lobbySound.classList.toggle('is-on', soundOn);
  els.lobbySound.setAttribute('aria-pressed', String(soundOn));
  els.lobbySound.querySelector('span').textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
  els.setSound.setAttribute('aria-checked', String(soundOn));
}

function toggleSound() {
  soundOn = !soundOn;
  if (soundOn) {
    initAudio();
    sfx('click');
  }
  saveSettings();
  updateSoundUI();
  toast(soundOn ? 'サウンド ON' : 'サウンド OFF');
}

function updateHapticsUI() {
  els.setHaptics.setAttribute('aria-checked', String(hapticsOn));
}

function toggleHaptics() {
  hapticsOn = !hapticsOn;
  saveSettings();
  updateHapticsUI();
  if (hapticsOn) haptic([8]);
  toast(hapticsOn ? '振動 ON' : '振動 OFF');
}

function updateTiltUI() {
  const on = tilt.enabled;
  els.tiltQuick.classList.toggle('is-on', on);
  els.tiltQuick.setAttribute('aria-pressed', String(on));
  els.lobbyTilt.classList.toggle('is-on', on);
  els.lobbyTilt.setAttribute('aria-pressed', String(on));
  els.lobbyTilt.querySelector('span').textContent = on ? '傾き操作 ON' : '傾き操作 OFF';
  els.setTilt.setAttribute('aria-checked', String(on));
  if (!on) {
    els.motionStatus.textContent = '傾き操作はオフです';
  } else if (tilt.sensorSeen) {
    els.motionStatus.textContent = '傾き操作 ON — 端末を傾けて視点移動';
  } else {
    els.motionStatus.textContent = '傾き操作 ON — センサー待機中 / ドラッグでも操作可';
  }
}

function onOrientation(event) {
  if (!tilt.enabled) return;
  const beta = Number.isFinite(event.beta) ? event.beta : 0;
  const gamma = Number.isFinite(event.gamma) ? event.gamma : 0;
  if (!tilt.base) tilt.base = { beta, gamma };
  tilt.beta = beta;
  tilt.gamma = gamma;
  tilt.sensorSeen = true;
  updateTiltUI();
}

function startTiltLoop() {
  if (tilt.raf) return;
  const loop = () => {
    const betaDelta = tilt.base ? tilt.beta - tilt.base.beta : 0;
    const gammaDelta = tilt.base ? tilt.gamma - tilt.base.gamma : 0;
    const targetX = clamp(betaDelta * 0.26 + tilt.py, -9, 9);
    const targetY = clamp(gammaDelta * 0.3 + tilt.px, -9, 9);
    tilt.x += (targetX - tilt.x) * 0.12;
    tilt.y += (targetY - tilt.y) * 0.12;
    document.documentElement.style.setProperty('--tilt-x', `${tilt.x.toFixed(2)}deg`);
    document.documentElement.style.setProperty('--tilt-y', `${tilt.y.toFixed(2)}deg`);
    tilt.raf = requestAnimationFrame(loop);
  };
  tilt.raf = requestAnimationFrame(loop);
}

function stopTiltLoop() {
  if (tilt.raf) cancelAnimationFrame(tilt.raf);
  tilt.raf = 0;
}

async function toggleTilt() {
  if (tilt.enabled) {
    window.removeEventListener('deviceorientation', onOrientation);
    tilt.enabled = false;
    tilt.base = null;
    tilt.px = 0;
    tilt.py = 0;
    tilt.x = 0;
    tilt.y = 0;
    stopTiltLoop();
    document.documentElement.style.setProperty('--tilt-x', '0deg');
    document.documentElement.style.setProperty('--tilt-y', '0deg');
    updateTiltUI();
    sfx('click');
    toast('傾き操作 OFF');
    return;
  }
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== 'granted') {
        toast('モーションアクセスが許可されませんでした');
        updateTiltUI();
        return;
      }
    } catch (error) {
      toast('モーションアクセスを利用できません');
      return;
    }
  }
  window.addEventListener('deviceorientation', onOrientation, { passive: true });
  tilt.enabled = true;
  tilt.base = null;
  tilt.sensorSeen = false;
  startTiltLoop();
  updateTiltUI();
  sfx('click');
  haptic(10);
  toast('傾き操作 ON — 端末を傾けて視点を動かせます');
  window.setTimeout(() => {
    if (tilt.enabled && !tilt.sensorSeen) {
      toast('傾きセンサー未検出 — ドラッグで視点移動できます');
      updateTiltUI();
    }
  }, 1600);
}

function updateHudSide(id) {
  const state = engine.state;
  const side = id === 'player' ? state.player : state.ai;
  if (!side) return;
  const prefix = id === 'player' ? 'player' : 'opp';
  const fill = els[`${prefix}LpFill`];
  const ghost = els[`${prefix}LpGhost`];
  const value = els[`${prefix}LpValue`];
  const hand = els[`${prefix}HandCount`];
  const percent = clamp((side.lp / side.maxLp) * 100, 0, 100);
  fill.style.width = `${percent}%`;
  ghost.style.width = `${percent}%`;
  fill.classList.toggle('is-warning', percent <= 50 && percent > 25);
  fill.classList.toggle('is-critical', percent <= 25);
  value.textContent = number(side.lp);
  hand.textContent = side.hand.length;
}

function renderPiles() {
  const state = engine.state;
  els.playerDeck.querySelector('b').textContent = state.player.deck.length;
  els.playerGrave.querySelector('b').textContent = state.player.grave.length;
  els.aiDeck.querySelector('b').textContent = state.ai.deck.length;
  els.aiGrave.querySelector('b').textContent = state.ai.grave.length;
}

function renderBoard() {
  const state = engine.state;
  $$('.zone-grid').forEach((grid) => {
    const owner = grid.dataset.owner;
    const row = grid.dataset.row;
    const rowKey = row === 'monster' ? 'monsters' : 'spells';
    const side = owner === 'player' ? state.player : state.ai;
    grid.innerHTML = '';
    for (let index = 0; index < 3; index += 1) {
      const card = side[rowKey][index];
      const zone = document.createElement('button');
      zone.type = 'button';
      zone.className = 'zone';
      zone.dataset.owner = owner;
      zone.dataset.row = row;
      zone.dataset.index = String(index);
      const target = engine.zoneTargetState(owner, row, index, card);
      if (target === 'normal') zone.classList.add('is-target');
      if (target === 'attack') zone.classList.add('is-attack-target');
      if (card) {
        zone.dataset.uid = card.uid;
        zone.innerHTML = boardCardHTML(card);
        if (state.selected?.uid === card.uid) zone.classList.add('is-selected');
        zone.setAttribute('aria-label', `${owner === 'player' ? '自分' : '相手'}の${row === 'monster' ? 'モンスター' : '魔法・罠'}ゾーン${index + 1}、${card.faceDown ? 'セットカード' : card.name}`);
      } else {
        zone.classList.add('is-empty');
        zone.innerHTML = `<span class="zone-mark">${row === 'monster' ? '◇' : '✧'}</span>`;
        zone.setAttribute('aria-label', `${owner === 'player' ? '自分' : '相手'}の空き${row === 'monster' ? 'モンスター' : '魔法・罠'}ゾーン${index + 1}`);
      }
      grid.append(zone);
    }
  });
}

function renderHand() {
  const state = engine.state;
  els.hand.innerHTML = '';
  const hand = state.player?.hand || [];
  const middle = (hand.length - 1) / 2;
  hand.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `card hand-card ${card.attr} ${card.kind}`;
    button.dataset.uid = card.uid;
    const offset = index - middle;
    button.style.setProperty('--i', String(index));
    button.style.setProperty('--rot', `${(offset * 2.2).toFixed(2)}deg`);
    button.style.setProperty('--lift', `${(Math.abs(offset) * 2.2).toFixed(2)}px`);
    if (state.selected?.uid === card.uid) button.classList.add('is-selected');
    if (state.anim.has(card.uid)) button.classList.add('is-drawn');
    button.innerHTML = `<div class="card-face">${cardFaceHTML(card)}</div><div class="card-shine"></div>`;
    button.setAttribute('aria-label', `${card.name}${card.kind === 'monster' ? ` ATK ${effAtk(card)} DEF ${effDef(card)}` : ''}`);
    els.hand.append(button);
  });
}

function actionButton(label, action, options = {}) {
  const classes = ['action-btn'];
  if (options.ghost) classes.push('action-btn--ghost');
  if (options.attack) classes.push('action-btn--attack');
  const attributes = [`data-action="${action}"`];
  if (options.mode) attributes.push(`data-mode="${options.mode}"`);
  if (options.disabled) attributes.push('disabled');
  const sub = options.sub ? `<small>${escapeHtml(options.sub)}</small>` : '';
  return `<button type="button" class="${classes.join(' ')}" ${attributes.join(' ')}>${escapeHtml(label)}${sub}</button>`;
}

function renderActions() {
  const state = engine.state;
  if (!state.player || state.screen !== 'duel') {
    els.actions.innerHTML = '';
    return;
  }
  if (state.winner) {
    els.actions.innerHTML = '<span class="action-status">DUEL COMPLETE</span>';
    return;
  }
  if (state.busy || state.aiThinking) {
    els.actions.innerHTML = `<span class="action-status">${state.aiThinking ? '相手が考え中…' : '処理中…'}</span>`;
    return;
  }
  if (state.turn !== 'player') {
    els.actions.innerHTML = '<span class="action-status">相手のターン</span>';
    return;
  }
  const actions = [];
  if (state.targetMode === 'roar') {
    actions.push('<span class="action-status">強化するモンスターをタップ</span>');
    actions.push(actionButton('キャンセル', 'cancel', { ghost: true }));
  } else if (state.selected) {
    const located = engine.locateCard(state.selected.uid);
    if (!located) {
      actions.push(actionButton('キャンセル', 'cancel', { ghost: true }));
    } else {
      const card = located.card;
      if (located.zone === 'hand') {
        if (card.kind === 'monster') {
          if (state.player.hasSummoned) {
            actions.push(actionButton('召喚済み', 'noop', { disabled: true }));
          } else if (engine.firstEmpty(state.player.monsters) < 0) {
            actions.push(actionButton('ゾーンなし', 'noop', { disabled: true }));
          } else {
            actions.push(actionButton('攻撃表示で召喚', 'place-mode', { mode: 'attack', sub: 'SUMMON' }));
            actions.push(actionButton('守備表示でセット', 'place-mode', { mode: 'set', ghost: true, sub: 'SET' }));
          }
        } else if (card.kind === 'spell') {
          const check = engine.canActivateSpell(card, 'player');
          actions.push(actionButton('発動', 'activate-spell', { disabled: !check.ok, sub: check.ok ? 'ACTIVATE' : check.reason }));
        } else if (card.kind === 'trap') {
          if (engine.firstEmpty(state.player.spells) < 0) {
            actions.push(actionButton('ゾーンなし', 'noop', { disabled: true }));
          } else {
            actions.push(actionButton('セット', 'place-mode', { mode: 'trap', sub: 'SET' }));
          }
        }
        actions.push(actionButton('キャンセル', 'cancel', { ghost: true }));
      } else if (card.owner === 'player' && card.kind === 'monster') {
        if (state.phase === 'battle' && card.position === 'attack' && !card.hasAttacked) {
          if (!state.ai.monsters.some(Boolean)) {
            actions.push(actionButton('直接攻撃', 'direct-attack', { attack: true, sub: 'DIRECT' }));
          } else {
            actions.push('<span class="action-status">相手モンスターをタップして攻撃</span>');
          }
        } else if (state.phase === 'main') {
          actions.push(actionButton('BATTLEへ', 'to-battle', { sub: 'BATTLE PHASE' }));
        } else if (card.position === 'defense') {
          actions.push('<span class="action-status">守備表示 — 攻撃できません</span>');
        } else if (card.hasAttacked) {
          actions.push('<span class="action-status">攻撃済み</span>');
        }
        actions.push(actionButton('キャンセル', 'cancel', { ghost: true }));
      } else {
        actions.push(actionButton('キャンセル', 'cancel', { ghost: true }));
      }
    }
  } else if (state.phase === 'main') {
    actions.push(actionButton('BATTLE', 'to-battle', { sub: 'バトルフェイズ' }));
    actions.push(actionButton('END TURN', 'end-turn', { ghost: true, sub: 'ターン終了' }));
  } else {
    actions.push(actionButton('END TURN', 'end-turn', { sub: 'ターン終了' }));
  }
  els.actions.innerHTML = actions.join('');
}

function renderSelection() {
  const state = engine.state;
  if (state.targetMode === 'roar') {
    els.selection.classList.add('is-card');
    els.selectionText.innerHTML = '<b>勇気の咆哮</b> <em>TARGET</em> — 強化する自分モンスターをタップ';
    return;
  }
  const located = state.selected ? engine.locateCard(state.selected.uid) : null;
  if (located) {
    const card = located.card;
    els.selection.classList.add('is-card');
    if (card.faceDown) {
      els.selectionText.innerHTML = '<b>セットカード</b> <em>???</em> — 相手の攻撃時に発動';
    } else if (card.kind === 'monster') {
      els.selectionText.innerHTML = `<b>${escapeHtml(card.name)}</b> <em>ATK ${number(effAtk(card))} / DEF ${number(effDef(card))}</em> — ${escapeHtml(card.text)}`;
    } else {
      els.selectionText.innerHTML = `<b>${escapeHtml(card.name)}</b> <em>${card.kind === 'spell' ? 'SPELL' : 'TRAP'}</em> — ${escapeHtml(card.text)}`;
    }
    return;
  }
  els.selection.classList.remove('is-card');
  let hint = '';
  if (state.aiThinking) hint = '相手が考え中…';
  else if (state.busy) hint = '処理中…';
  else if (state.turn === 'ai') hint = '相手のターン — 手札を確認できます';
  else if (state.phase === 'battle') hint = '攻撃するモンスターをタップ';
  else hint = state.log.length ? state.log[state.log.length - 1] : '手札をタップしてカードを選択';
  els.selectionText.textContent = hint;
}

function renderAll() {
  const state = engine.state;
  if (!state.player || !state.ai || state.screen === 'lobby') return;
  els.board.dataset.turn = state.turn;
  els.roomChipCode.textContent = state.room?.code || '----';
  els.playerTag.textContent = `TURN ${state.turnCount} · ${state.phase === 'battle' ? 'BATTLE' : 'MAIN'}`;
  els.oppTag.textContent = state.turn === 'ai' ? 'THINKING' : (state.room?.opponent.tag || 'ROOM MATCH');
  if (state.room) {
    els.oppName.textContent = state.room.opponent.name;
    els.oppAvatar.textContent = state.room.opponent.initials;
    paintAvatar(els.oppAvatar, state.room.opponent.hue);
  }
  updateHudSide('player');
  updateHudSide('ai');
  renderBoard();
  renderHand();
  renderActions();
  renderSelection();
  renderPiles();
}

function updateLobby() {
  els.lobbyCode.textContent = currentRoomCode;
  els.lobbyOpponent.textContent = currentOpponent.name;
  els.lobbyOpponentTag.textContent = `READY · ${currentOpponent.tag}`;
  els.lobbyAvatar.textContent = currentOpponent.initials;
  paintAvatar(els.lobbyAvatar, currentOpponent.hue);
  if (engine.state.screen === 'lobby') els.roomChipCode.textContent = '----';
}

function newRoom() {
  currentRoomCode = randomCode();
  currentOpponent = randomOpponent();
}

function startGame(room) {
  initAudio();
  els.lobby.hidden = true;
  els.result.hidden = true;
  els.settings.hidden = true;
  els.resultCard.classList.remove('is-loss');
  engine.startDuel(room);
}

function showResult(winnerId) {
  const state = engine.state;
  const won = winnerId === 'player';
  els.resultCard.classList.toggle('is-loss', !won);
  els.resultKicker.textContent = won ? 'DUEL WON' : 'DUEL LOST';
  els.resultTitle.textContent = won ? 'VICTORY' : 'DEFEAT';
  if (state.player.lp <= 0) {
    els.resultSub.textContent = 'あなたのライフポイントが0になりました。';
  } else if (state.ai.lp <= 0) {
    els.resultSub.textContent = '相手のライフポイントを0にしました。';
  } else {
    els.resultSub.textContent = 'デュエルが終了しました。';
  }
  els.resultTurns.textContent = state.turnCount;
  els.resultLp.textContent = number(state.player.lp);
  els.resultRoom.textContent = state.room?.code || '----';
  els.result.hidden = false;
}

function returnToLobby() {
  engine.returnToLobby();
  els.result.hidden = true;
  els.settings.hidden = true;
  els.lobby.hidden = false;
  newRoom();
  updateLobby();
}

function openSettings() {
  els.settings.hidden = false;
  updateSoundUI();
  updateHapticsUI();
  updateTiltUI();
}

function handleAction(button) {
  switch (button.dataset.action) {
    case 'place-mode':
      engine.setPlacementMode(button.dataset.mode);
      break;
    case 'activate-spell':
      engine.activateSelectedSpell();
      break;
    case 'direct-attack':
      engine.directAttack();
      break;
    case 'to-battle':
      engine.enterBattle();
      break;
    case 'end-turn':
      engine.endPlayerTurn();
      break;
    case 'cancel':
      engine.deselect();
      break;
    default:
      break;
  }
}

function bindEvents() {
  els.hand.addEventListener('click', (event) => {
    const card = event.target.closest('.hand-card');
    if (!card) return;
    engine.selectHand(card.dataset.uid);
  });

  els.board.addEventListener('click', (event) => {
    const zone = event.target.closest('.zone');
    if (!zone) return;
    engine.onZone(zone.dataset.owner, zone.dataset.row, Number(zone.dataset.index));
  });

  els.actions.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    sfx('click');
    handleAction(button);
  });

  els.startBtn.addEventListener('click', () => {
    initAudio();
    sfx('click');
    startGame({ code: currentRoomCode, opponent: currentOpponent, mode: 'ROOM MATCH' });
  });

  els.copyCode.addEventListener('click', async () => {
    sfx('click');
    try {
      await navigator.clipboard.writeText(currentRoomCode);
      toast('ルームコードをコピーしました');
    } catch (error) {
      toast(`ROOM CODE: ${currentRoomCode}`);
    }
  });

  els.roomChip.addEventListener('click', async () => {
    if (engine.state.screen === 'lobby') return;
    sfx('click');
    try {
      await navigator.clipboard.writeText(engine.state.room?.code || currentRoomCode);
      toast('ルームコードをコピーしました');
    } catch (error) {
      toast(`ROOM CODE: ${engine.state.room?.code || currentRoomCode}`);
    }
  });

  els.rerollRoom.addEventListener('click', () => {
    sfx('click');
    newRoom();
    updateLobby();
    toast('新しいルームを作成しました');
  });

  els.joinToggle.addEventListener('click', () => {
    sfx('click');
    els.joinForm.hidden = !els.joinForm.hidden;
    if (!els.joinForm.hidden) {
      window.setTimeout(() => els.joinCode.focus(), 30);
    }
  });

  els.joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = els.joinCode.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (code.length < 4) {
      els.joinCode.classList.remove('is-invalid');
      void els.joinCode.offsetWidth;
      els.joinCode.classList.add('is-invalid');
      return;
    }
    currentRoomCode = code;
    currentOpponent = randomOpponent();
    updateLobby();
    els.joinForm.hidden = true;
    els.joinCode.value = '';
    sfx('click');
    toast(`ルーム ${code} に接続中…`);
    window.setTimeout(() => {
      startGame({ code, opponent: currentOpponent, mode: 'ROOM MATCH' });
    }, 460);
  });

  els.lobbyTilt.addEventListener('click', toggleTilt);
  els.tiltQuick.addEventListener('click', toggleTilt);
  els.lobbySound.addEventListener('click', toggleSound);
  els.soundBtn.addEventListener('click', toggleSound);
  els.menuBtn.addEventListener('click', openSettings);
  els.settingsClose.addEventListener('click', () => { els.settings.hidden = true; });
  els.setSound.addEventListener('click', toggleSound);
  els.setHaptics.addEventListener('click', toggleHaptics);
  els.setTilt.addEventListener('click', toggleTilt);

  els.recalibrate.addEventListener('click', () => {
    if (!tilt.enabled) {
      toast('先に傾き操作をオンにしてください');
      return;
    }
    tilt.base = null;
    tilt.sensorSeen = false;
    updateTiltUI();
    sfx('click');
    toast('傾きの基準をリセットしました');
  });

  els.surrenderBtn.addEventListener('click', () => {
    if (engine.state.screen !== 'duel') {
      toast('デュエル中ではありません');
      return;
    }
    els.settings.hidden = true;
    engine.surrender();
  });

  els.backToLobbyBtn.addEventListener('click', () => {
    if (engine.state.screen === 'duel') {
      toast('デュエルを終えるには SURRENDER を使用してください');
      return;
    }
    els.settings.hidden = true;
  });

  els.settings.addEventListener('click', (event) => {
    if (event.target === els.settings) els.settings.hidden = true;
  });

  els.rematchBtn.addEventListener('click', () => {
    sfx('click');
    els.result.hidden = true;
    startGame(engine.state.room);
  });

  els.resultLobbyBtn.addEventListener('click', () => {
    sfx('click');
    returnToLobby();
  });

  els.boardStage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    els.boardHint.classList.add('is-hidden');
    startTiltLoop();
    if (els.boardStage.setPointerCapture) els.boardStage.setPointerCapture(event.pointerId);
  });

  els.boardStage.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    tilt.px = clamp((event.clientX - drag.x) * 0.035, -7, 7);
    tilt.py = clamp((event.clientY - drag.y) * 0.025, -5, 5);
  });

  const endDrag = (event) => {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    drag = null;
    tilt.px = 0;
    tilt.py = 0;
    if (!tilt.enabled) {
      window.setTimeout(() => {
        if (drag || tilt.enabled) return;
        tilt.x = 0;
        tilt.y = 0;
        document.documentElement.style.setProperty('--tilt-x', '0deg');
        document.documentElement.style.setProperty('--tilt-y', '0deg');
        stopTiltLoop();
      }, 320);
    }
  };

  els.boardStage.addEventListener('pointerup', endDrag);
  els.boardStage.addEventListener('pointercancel', endDrag);
  els.boardStage.addEventListener('pointerleave', endDrag);

  window.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea')) return;
    const state = engine.state;
    if (event.key === 'Escape') engine.deselect();
    if (event.key.toLowerCase() === 'b' && state.screen === 'duel' && state.turn === 'player' && state.phase === 'main' && !state.busy) engine.enterBattle();
    if (event.key.toLowerCase() === 'e' && state.screen === 'duel' && state.turn === 'player' && !state.busy) engine.endPlayerTurn();
  });

  document.addEventListener('gesturestart', (event) => event.preventDefault());
}

const fx = $('#fx');
const ctx = fx.getContext('2d');
let stars = [];
let fxW = 0;
let fxH = 0;
let dpr = 1;
let shooting = null;
let lastFrame = 0;

function makeStars() {
  const count = clamp(Math.floor((fxW * fxH) / 12000), 70, 170);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * fxW,
    y: Math.random() * fxH,
    z: 0.3 + Math.random() * 0.7,
    r: Math.random() * 1.1 + 0.2,
    tw: Math.random() * Math.PI * 2,
    sp: 0.1 + Math.random() * 0.3
  }));
}

function resizeFx() {
  fxW = window.innerWidth;
  fxH = window.innerHeight;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  fx.width = Math.round(fxW * dpr);
  fx.height = Math.round(fxH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  makeStars();
}

function drawFx(time) {
  const delta = Math.min(32, time - lastFrame || 16);
  lastFrame = time;
  ctx.clearRect(0, 0, fxW, fxH);
  const offsetX = tilt.y * 2.2;
  const offsetY = -tilt.x * 2.2;
  for (const star of stars) {
    star.tw += delta * 0.001 * star.sp;
    star.y += delta * 0.003 * star.z;
    if (star.y > fxH + 4) {
      star.y = -4;
      star.x = Math.random() * fxW;
    }
    const alpha = 0.18 + star.z * 0.45 + Math.sin(star.tw) * 0.12;
    ctx.beginPath();
    ctx.arc(star.x + offsetX * star.z, star.y + offsetY * star.z, star.r * star.z, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(190,220,255,${alpha.toFixed(3)})`;
    ctx.fill();
  }
  if (!shooting && Math.random() < 0.0035) {
    shooting = { x: Math.random() * fxW * 0.7, y: Math.random() * fxH * 0.4, life: 0, max: 900 };
  }
  if (shooting) {
    shooting.life += delta;
    const progress = shooting.life / shooting.max;
    if (progress >= 1) {
      shooting = null;
    } else {
      const x = shooting.x + progress * 180;
      const y = shooting.y + progress * 90;
      ctx.strokeStyle = `rgba(255,240,200,${((1 - progress) * 0.5).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 28, y - 14);
      ctx.stroke();
    }
  }
  requestAnimationFrame(drawFx);
}

function init() {
  loadSettings();
  newRoom();
  updateLobby();
  updateSoundUI();
  updateHapticsUI();
  updateTiltUI();
  engine.setHooks({
    render: renderAll,
    sfx,
    toast,
    banner: showBanner,
    damagePopup: popDamage,
    shake,
    haptic,
    finish: showResult
  });
  bindEvents();
  resizeFx();
  requestAnimationFrame(drawFx);
}

init();
