import { CARD_DEFS, DECK_LIST, number, effAtk, effDef } from './cards.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const otherId = (id) => (id === 'player' ? 'ai' : 'player');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const state = {
  screen: 'lobby',
  room: null,
  player: null,
  ai: null,
  turn: 'player',
  phase: 'main',
  turnCount: 0,
  selected: null,
  placementMode: null,
  targetMode: null,
  pendingSpell: null,
  busy: false,
  aiThinking: false,
  winner: null,
  log: [],
  anim: new Set()
};

const hooks = {
  render: () => {},
  sfx: () => {},
  toast: () => {},
  banner: () => {},
  damagePopup: () => {},
  shake: () => {},
  haptic: () => {},
  finish: () => {}
};

export function setHooks(next) {
  Object.assign(hooks, next);
}

export function log(message) {
  state.log.push(message);
  if (state.log.length > 40) state.log.shift();
}

export function getSide(id) {
  return id === 'player' ? state.player : state.ai;
}

export function locateCard(uid) {
  for (const side of [state.player, state.ai]) {
    if (!side) continue;
    for (const zone of ['hand', 'monsters', 'spells', 'grave']) {
      const list = side[zone];
      const index = list.findIndex((card) => card && card.uid === uid);
      if (index >= 0) return { side, zone, index, card: list[index] };
    }
  }
  return null;
}

export function firstEmpty(list) {
  return list.findIndex((item) => !item);
}

function isReadyAttacker(card) {
  return Boolean(card) && card.position === 'attack' && !card.hasAttacked;
}

export function strongestMonster(side) {
  return side.monsters.filter(Boolean).sort((a, b) => effAtk(b) - effAtk(a))[0] || null;
}

export function findMonsterInSide(side, uid) {
  return side.monsters.find((card) => card && card.uid === uid) || null;
}

function makeCard(key, owner) {
  const def = CARD_DEFS[key];
  return {
    ...def,
    key,
    uid: `c${Math.random().toString(36).slice(2, 9)}`,
    owner,
    atkBoost: 0,
    tempAtk: 0,
    battleAtkOverride: null,
    hasAttacked: false,
    faceDown: false,
    position: 'attack',
    setTurn: 0
  };
}

function buildDeck(owner) {
  const cards = DECK_LIST.map((key) => makeCard(key, owner));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function createSide(id, name) {
  return {
    id,
    name,
    lp: 8000,
    maxLp: 8000,
    deck: [],
    hand: [],
    monsters: [null, null, null],
    spells: [null, null, null],
    grave: [],
    hasSummoned: false
  };
}

function flash(uid, className, duration = 650) {
  const zone = document.querySelector(`.zone[data-uid="${uid}"]`);
  if (!zone) return;
  zone.classList.add(className);
  window.setTimeout(() => zone.classList.remove(className), duration);
}

export function drawCards(side, count, animate = false) {
  for (let i = 0; i < count; i += 1) {
    if (!side.deck.length) {
      log('デッキが尽きた');
      finishDuel(otherId(side.id));
      return false;
    }
    const card = side.deck.pop();
    side.hand.push(card);
    if (animate) {
      state.anim.add(card.uid);
      window.setTimeout(() => state.anim.delete(card.uid), 750);
      hooks.sfx('draw');
    }
    log(`${side.id === 'player' ? 'あなた' : '相手'}はカードを1枚ドロー`);
  }
  hooks.render();
  return true;
}

export function startDuel(room) {
  state.room = room;
  state.player = createSide('player', 'DUELIST');
  state.ai = createSide('ai', room.opponent.name);
  state.player.deck = buildDeck('player');
  state.ai.deck = buildDeck('ai');
  state.turn = 'player';
  state.phase = 'main';
  state.turnCount = 0;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  state.busy = true;
  state.aiThinking = false;
  state.winner = null;
  state.log = [];
  state.anim.clear();
  state.screen = 'duel';
  drawCards(state.player, 5, false);
  drawCards(state.ai, 5, false);
  state.log = [];
  log('デュエル開始');
  hooks.render();
  hooks.banner('DUEL START', 'デュエル開始', '');
  hooks.sfx('turn');
  hooks.render();
  window.setTimeout(() => startTurn('player', false), 620);
}

export async function startTurn(side, draw = true) {
  if (state.winner || state.screen !== 'duel') return;
  state.turn = side;
  state.phase = 'main';
  state.turnCount += 1;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  const current = getSide(side);
  current.hasSummoned = false;
  for (const owner of [state.player, state.ai]) {
    [...owner.monsters, ...owner.spells].forEach((card) => {
      if (!card) return;
      card.hasAttacked = false;
      card.tempAtk = 0;
      card.battleAtkOverride = null;
    });
  }
  state.busy = false;
  hooks.render();
  hooks.banner(
    side === 'player' ? 'YOUR TURN' : 'OPPONENT TURN',
    side === 'player' ? 'あなたのターン' : '相手のターン',
    side === 'ai' ? 'banner--ai' : ''
  );
  hooks.sfx('turn');
  if (draw) {
    await wait(420);
    if (!drawCards(current, 1, true)) return;
  }
  hooks.render();
  if (side === 'ai') {
    state.aiThinking = true;
    hooks.render();
    await wait(720);
    runAiTurn();
  }
}

export async function endTurn(side) {
  if (state.winner || state.screen !== 'duel') return;
  state.busy = true;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  hooks.render();
  await wait(240);
  const next = otherId(side);
  state.busy = false;
  startTurn(next, true);
}

export function endPlayerTurn() {
  if (state.turn === 'player' && !state.busy && !state.winner) endTurn('player');
}

export function enterBattle() {
  if (state.turn !== 'player' || state.busy || state.winner) return;
  state.phase = 'battle';
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  log('バトルフェイズ');
  hooks.banner('BATTLE PHASE', 'バトルフェイズ', '');
  hooks.sfx('turn');
  hooks.render();
  hooks.toast('攻撃するモンスターをタップ');
}

export function deselect() {
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  hooks.sfx('click');
  hooks.render();
}

export function selectHand(uid) {
  if (state.turn !== 'player' || state.busy || state.winner) return;
  if (state.selected?.uid === uid) {
    deselect();
    return;
  }
  const located = locateCard(uid);
  if (!located || located.zone !== 'hand' || located.side.id !== 'player') return;
  state.selected = { uid, source: 'hand' };
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  hooks.sfx('click');
  hooks.render();
}

export function selectBoard(uid) {
  if (state.busy || state.winner) return;
  const located = locateCard(uid);
  if (!located || (located.zone !== 'monsters' && located.zone !== 'spells')) return;
  if (state.selected?.uid === uid) {
    deselect();
    return;
  }
  state.selected = { uid, source: 'board' };
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  hooks.sfx('click');
  hooks.render();
}

export function setPlacementMode(mode) {
  if (state.turn !== 'player' || state.busy || state.winner) return;
  const located = state.selected ? locateCard(state.selected.uid) : null;
  if (!located || located.zone !== 'hand') return;
  const card = located.card;
  if (card.kind === 'monster') {
    if (state.player.hasSummoned) {
      hooks.toast('このターンはもう召喚しています');
      return;
    }
    if (firstEmpty(state.player.monsters) < 0) {
      hooks.toast('モンスターゾーンが空いていません');
      return;
    }
    state.placementMode = mode === 'set' ? 'set' : 'attack';
    hooks.toast(mode === 'set' ? '空きモンスターゾーンをタップしてセット' : '空きモンスターゾーンをタップして召喚');
  } else if (card.kind === 'trap') {
    if (firstEmpty(state.player.spells) < 0) {
      hooks.toast('魔法・罠ゾーンが空いていません');
      return;
    }
    state.placementMode = 'trap';
    hooks.toast('空き魔法・罠ゾーンをタップしてセット');
  }
  hooks.sfx('click');
  hooks.render();
}

export function canActivateSpell(card, sideId) {
  const side = getSide(sideId);
  const foe = getSide(otherId(sideId));
  if (card.effect === 'spellDestroy' && !foe.monsters.some(Boolean)) {
    return { ok: false, reason: '相手モンスターがいません' };
  }
  if (card.effect === 'spellBuff' && !side.monsters.some(Boolean)) {
    return { ok: false, reason: '自分モンスターがいません' };
  }
  return { ok: true };
}

export function activateSelectedSpell() {
  if (state.turn !== 'player' || state.busy || state.winner) return;
  const located = state.selected ? locateCard(state.selected.uid) : null;
  if (!located || located.zone !== 'hand' || located.card.kind !== 'spell') return;
  activateSpellFromHand(located.card);
}

function activateSpellFromHand(card) {
  const check = canActivateSpell(card, 'player');
  if (!check.ok) {
    hooks.toast(check.reason);
    return;
  }
  if (card.effect === 'spellBuff') {
    state.pendingSpell = card.uid;
    state.targetMode = 'roar';
    state.selected = null;
    state.placementMode = null;
    hooks.toast('強化する自分モンスターをタップ');
    hooks.render();
    return;
  }
  resolveSpell('player', card, null);
}

function resolveRoarTarget(card) {
  const spell = state.pendingSpell ? state.player.hand.find((item) => item.uid === state.pendingSpell) : null;
  if (!spell) {
    state.targetMode = null;
    state.pendingSpell = null;
    hooks.render();
    return;
  }
  resolveSpell('player', spell, card.uid);
}

export function directAttack() {
  if (state.turn !== 'player' || state.busy || state.phase !== 'battle') return;
  const located = state.selected ? locateCard(state.selected.uid) : null;
  if (!located || located.zone !== 'monsters' || located.side.id !== 'player') return;
  if (state.ai.monsters.some(Boolean)) {
    hooks.toast('相手モンスターがいます');
    return;
  }
  if (!isReadyAttacker(located.card)) {
    hooks.toast('攻撃できるモンスターを選択してください');
    return;
  }
  declareAttack(located.card, null);
}

export function onZone(owner, row, index) {
  if (state.busy || state.winner) return;
  const side = getSide(owner);
  const rowKey = row === 'monster' ? 'monsters' : 'spells';
  if (!side || !side[rowKey]) return;
  const card = side[rowKey][index];
  if (state.targetMode === 'roar') {
    if (owner === 'player' && row === 'monster' && card) {
      resolveRoarTarget(card);
    } else {
      hooks.toast('自分のモンスターを選択してください');
    }
    return;
  }
  const selection = state.selected ? locateCard(state.selected.uid) : null;
  if (selection && selection.zone === 'hand' && selection.side.id === 'player') {
    if (state.turn !== 'player') {
      hooks.toast('自分のターンではありません');
      return;
    }
    const handCard = selection.card;
    if (handCard.kind === 'monster') {
      if (owner !== 'player' || row !== 'monster') {
        hooks.toast('自分のモンスターゾーンを選択してください');
        return;
      }
      if (card) {
        hooks.toast('そのゾーンは使用中です');
        return;
      }
      if (state.player.hasSummoned) {
        hooks.toast('このターンはもう召喚しています');
        return;
      }
      placeMonsterForSide('player', handCard, index, state.placementMode === 'set' ? 'set' : 'attack');
      return;
    }
    if (handCard.kind === 'trap') {
      if (owner !== 'player' || row !== 'spell') {
        hooks.toast('自分の魔法・罠ゾーンを選択してください');
        return;
      }
      if (card) {
        hooks.toast('そのゾーンは使用中です');
        return;
      }
      setTrap('player', handCard, index);
      return;
    }
    if (handCard.kind === 'spell') {
      if (owner === 'player' && row === 'spell') {
        activateSpellFromHand(handCard);
      } else {
        hooks.toast('発動ボタンをタップしてください');
      }
      return;
    }
  }
  if (selection && selection.zone === 'monsters' && selection.side.id === 'player') {
    if (state.turn !== 'player' || state.phase !== 'battle') {
      hooks.toast('バトルフェイズに攻撃できます');
      return;
    }
    if (owner === 'ai' && row === 'monster' && card) {
      if (!isReadyAttacker(selection.card)) {
        hooks.toast('攻撃できるモンスターを選択してください');
        return;
      }
      declareAttack(selection.card, card);
      return;
    }
    if (owner === 'player' && row === 'monster' && card) {
      selectBoard(card.uid);
      return;
    }
    hooks.toast('相手モンスターを選択してください');
    return;
  }
  if (card) {
    selectBoard(card.uid);
    return;
  }
  deselect();
}

async function placeMonsterForSide(sideId, card, index, position) {
  if (state.busy) return;
  const side = getSide(sideId);
  if (side.hasSummoned) return;
  state.busy = true;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  side.hand = side.hand.filter((item) => item.uid !== card.uid);
  card.faceDown = position === 'set';
  card.position = position;
  card.setTurn = state.turnCount;
  side.monsters[index] = card;
  side.hasSummoned = true;
  log(`${sideId === 'player' ? 'あなた' : '相手'}は${card.name}を${position === 'set' ? '守備表示でセット' : '攻撃表示で召喚'}`);
  hooks.sfx(position === 'set' ? 'set' : 'summon');
  hooks.render();
  flash(card.uid, 'is-summoning', 720);
  await wait(480);
  if (position === 'attack') await applySummonEffect(sideId, card);
  if (!state.winner) state.busy = false;
  hooks.render();
  checkWin();
}

async function setTrap(sideId, card, index) {
  if (state.busy) return;
  const side = getSide(sideId);
  state.busy = true;
  side.hand = side.hand.filter((item) => item.uid !== card.uid);
  card.faceDown = true;
  card.position = 'set';
  card.setTurn = state.turnCount;
  side.spells[index] = card;
  log(`${sideId === 'player' ? 'あなた' : '相手'}はカードを1枚セットした`);
  hooks.sfx('set');
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  hooks.render();
  await wait(360);
  if (!state.winner) state.busy = false;
  hooks.render();
}

async function applySummonEffect(sideId, card) {
  const side = getSide(sideId);
  switch (card.effect) {
    case 'summonBurn':
      damage(otherId(sideId), card.value || 500);
      break;
    case 'summonHeal':
      heal(sideId, card.value || 500);
      break;
    case 'summonDraw':
      drawCards(side, 1, true);
      break;
    case 'summonBuffAll':
      side.monsters.filter(Boolean).forEach((monster) => {
        monster.atkBoost = (monster.atkBoost || 0) + (card.value || 200);
      });
      log(`自分モンスター全体のATKが${card.value || 200}アップ`);
      break;
    default:
      break;
  }
  if (card.effect && card.effect !== 'none' && card.effect !== 'piercing') {
    hooks.banner('CARD EFFECT', card.name, 'banner--trap');
    hooks.sfx('spell');
    await wait(430);
  }
  hooks.render();
}

async function resolveSpell(sideId, card, targetUid) {
  if (state.busy || state.winner) return;
  state.busy = true;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  const side = getSide(sideId);
  const foe = getSide(otherId(sideId));
  side.hand = side.hand.filter((item) => item.uid !== card.uid);
  side.grave.push(card);
  log(`魔法カード「${card.name}」を発動`);
  hooks.banner('SPELL ACTIVATED', card.name, '');
  hooks.sfx('spell');
  hooks.render();
  await wait(520);
  switch (card.effect) {
    case 'spellDraw2':
      drawCards(side, 2, true);
      break;
    case 'spellHeal':
      heal(sideId, card.value || 1200);
      break;
    case 'spellDestroy': {
      const target = strongestMonster(foe);
      if (target) await destroyMonster(target);
      break;
    }
    case 'spellBurn':
      damage(otherId(sideId), card.value || 800);
      break;
    case 'spellBuff': {
      const target = (targetUid && findMonsterInSide(side, targetUid)) || strongestMonster(side);
      if (target) {
        target.tempAtk = (target.tempAtk || 0) + (card.value || 700);
        log(`${target.name}のATKが${card.value || 700}アップ`);
        flash(target.uid, 'is-summoning', 650);
      }
      break;
    }
    default:
      break;
  }
  if (!state.winner) state.busy = false;
  checkWin();
  hooks.render();
}

async function destroyMonster(card) {
  const located = locateCard(card.uid);
  if (!located || located.zone !== 'monsters') return;
  const zone = document.querySelector(`.zone[data-uid="${card.uid}"]`);
  if (zone) zone.classList.add('is-destroying');
  hooks.sfx('destroy');
  await wait(430);
  if (located.side.monsters[located.index] === card) located.side.monsters[located.index] = null;
  located.side.grave.push(card);
  log(`${card.name}は破壊された`);
  hooks.render();
}

export function damage(sideId, amount) {
  const value = Math.max(0, Math.round(amount));
  if (!value || state.winner) return;
  const side = getSide(sideId);
  side.lp = Math.max(0, side.lp - value);
  log(`${sideId === 'player' ? 'あなた' : '相手'}に${value}ダメージ`);
  hooks.damagePopup(sideId, value, 'damage');
  hooks.sfx('damage');
  hooks.haptic(sideId === 'player' ? [20, 30, 20] : [10]);
  hooks.shake(sideId === 'player' ? 'shake-heavy' : 'shake-light');
  hooks.render();
  if (side.lp <= 0) finishDuel(otherId(sideId));
}

export function heal(sideId, amount) {
  const value = Math.max(0, Math.round(amount));
  if (!value || state.winner) return;
  const side = getSide(sideId);
  const actual = Math.min(side.maxLp, side.lp + value) - side.lp;
  if (actual <= 0) return;
  side.lp += actual;
  log(`${sideId === 'player' ? 'あなた' : '相手'}のライフが${actual}回復`);
  hooks.damagePopup(sideId, actual, 'heal');
  hooks.sfx('heal');
  hooks.haptic([8]);
  hooks.render();
}

export function checkWin() {
  if (state.winner) return true;
  if (state.player.lp <= 0) {
    finishDuel('ai');
    return true;
  }
  if (state.ai.lp <= 0) {
    finishDuel('player');
    return true;
  }
  return false;
}

export function finishDuel(winnerId) {
  if (state.winner) return;
  state.winner = winnerId;
  state.busy = true;
  state.aiThinking = false;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  log(winnerId === 'player' ? 'デュエルに勝利した' : 'デュエルに敗北した');
  hooks.sfx(winnerId === 'player' ? 'win' : 'lose');
  hooks.haptic(winnerId === 'player' ? [30, 40, 30] : [60]);
  hooks.render();
  window.setTimeout(() => {
    state.screen = 'result';
    hooks.finish(winnerId);
  }, 950);
}

function resetBattleOverrides() {
  for (const side of [state.player, state.ai]) {
    side.monsters.forEach((card) => {
      if (card) card.battleAtkOverride = null;
    });
  }
}

async function tryTriggerTrap(defSideId, attacker) {
  const def = getSide(defSideId);
  const trap = def.spells.find((card) => card && card.kind === 'trap' && card.faceDown && card.setTurn < state.turnCount);
  if (!trap) return { negate: false };
  const index = def.spells.indexOf(trap);
  trap.faceDown = false;
  log(`罠カード「${trap.name}」を発動`);
  hooks.banner('TRAP ACTIVATED', trap.name, 'banner--trap');
  hooks.sfx('trap');
  hooks.render();
  flash(trap.uid, 'is-trap', 760);
  await wait(720);
  def.spells[index] = null;
  def.grave.push(trap);
  hooks.render();
  let negate = false;
  if (trap.effect === 'trapMirror') {
    negate = true;
    await destroyMonster(attacker);
  } else if (trap.effect === 'trapGravity') {
    attacker.battleAtkOverride = Math.max(0, Math.floor(effAtk(attacker) / 2));
    log(`${attacker.name}のATKが半分になった`);
  } else if (trap.effect === 'trapCounter') {
    negate = true;
    damage(otherId(defSideId), trap.value || 600);
  }
  return { negate, gameOver: !!state.winner };
}

async function declareAttack(attacker, target) {
  if (state.busy || state.winner) return;
  if (!isReadyAttacker(attacker) || !locateCard(attacker.uid)) return;
  state.busy = true;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
  const atkSide = attacker.owner;
  const defSide = otherId(atkSide);
  log(`${attacker.name}で攻撃！`);
  hooks.sfx('attack');
  hooks.render();
  flash(attacker.uid, 'is-attacking', 540);
  if (target) flash(target.uid, 'is-hit', 540);
  await wait(540);
  const trapResult = await tryTriggerTrap(defSide, attacker);
  if (trapResult.gameOver) {
    hooks.render();
    return;
  }
  if (trapResult.negate) {
    log('攻撃は無効化された');
    resetBattleOverrides();
    state.busy = false;
    hooks.render();
    return;
  }
  if (target && !locateCard(target.uid)) {
    resetBattleOverrides();
    state.busy = false;
    hooks.render();
    return;
  }
  if (target) {
    if (target.faceDown) {
      target.faceDown = false;
      target.position = 'defense';
      log(`${target.name}をリバース`);
      hooks.render();
      flash(target.uid, 'is-trap', 600);
      await wait(480);
    }
    const atk = effAtk(attacker);
    const targetDefense = target.position === 'defense';
    const targetValue = targetDefense ? effDef(target) : effAtk(target);
    if (targetDefense) {
      if (atk > targetValue) {
        await destroyMonster(target);
        if (attacker.effect === 'piercing' && !state.winner) damage(defSide, atk - targetValue);
      } else if (atk < targetValue) {
        damage(atkSide, targetValue - atk);
      } else {
        log('攻撃は防がれた');
      }
    } else if (atk > targetValue) {
      damage(defSide, atk - targetValue);
      if (!state.winner) await destroyMonster(target);
    } else if (atk < targetValue) {
      damage(atkSide, targetValue - atk);
      if (!state.winner) await destroyMonster(attacker);
    } else {
      await destroyMonster(target);
      if (!state.winner) await destroyMonster(attacker);
    }
  } else {
    damage(defSide, effAtk(attacker));
  }
  if (!state.winner && locateCard(attacker.uid)) attacker.hasAttacked = true;
  resetBattleOverrides();
  if (!state.winner) state.busy = false;
  checkWin();
  hooks.render();
}

async function aiCast(card, targetUid = null) {
  const check = canActivateSpell(card, 'ai');
  if (!check.ok) return;
  await resolveSpell('ai', card, targetUid);
}

function chooseAiTarget(attacker, targets) {
  const atk = effAtk(attacker);
  const options = targets.map((target) => {
    const value = target.position === 'defense' ? effDef(target) : effAtk(target);
    const lethal = atk > value;
    return {
      target,
      value,
      lethal,
      score: (lethal ? 1000 : 0) + (target.position === 'defense' ? 40 : 0) + value
    };
  }).sort((a, b) => b.score - a.score);
  const best = options[0];
  if (!best) return null;
  if (best.lethal) return best.target;
  if (state.ai.lp > 2600) return best.target;
  return null;
}

async function runAiTurn() {
  if (state.screen !== 'duel' || state.winner) return;
  state.aiThinking = true;
  hooks.render();
  await wait(820);
  if (state.winner) {
    state.aiThinking = false;
    return;
  }
  const ai = state.ai;
  const player = state.player;
  if (ai.lp < 3600) {
    const healCard = ai.hand.find((card) => card.effect === 'spellHeal');
    if (healCard) await aiCast(healCard);
  }
  if (!ai.hasSummoned) {
    const monsters = ai.hand.filter((card) => card.kind === 'monster').sort((a, b) => b.atk - a.atk);
    if (monsters.length) {
      const zone = firstEmpty(ai.monsters);
      if (zone >= 0) await placeMonsterForSide('ai', monsters[0], zone, 'attack');
    }
  }
  if (state.winner) {
    state.aiThinking = false;
    return;
  }
  const storm = ai.hand.find((card) => card.effect === 'spellBurn');
  if (storm && player.lp <= 800) await aiCast(storm);
  const meteor = ai.hand.find((card) => card.effect === 'spellDestroy');
  if (meteor && player.monsters.some(Boolean)) await aiCast(meteor);
  const guidance = ai.hand.find((card) => card.effect === 'spellDraw2');
  if (guidance && ai.hand.length <= 4) await aiCast(guidance);
  const roar = ai.hand.find((card) => card.effect === 'spellBuff');
  if (roar) {
    const target = strongestMonster(ai);
    if (target) await aiCast(roar, target.uid);
  }
  const trap = ai.hand.find((card) => card.kind === 'trap');
  if (trap) {
    const zone = firstEmpty(ai.spells);
    if (zone >= 0) await setTrap('ai', trap, zone);
  }
  if (state.winner) {
    state.aiThinking = false;
    return;
  }
  state.phase = 'battle';
  hooks.render();
  await wait(480);
  const attackers = ai.monsters
    .filter((card) => card && card.position === 'attack' && !card.hasAttacked)
    .sort((a, b) => effAtk(b) - effAtk(a));
  for (const attacker of attackers) {
    if (state.winner) break;
    if (!ai.monsters.includes(attacker)) continue;
    const targets = player.monsters.filter(Boolean);
    if (!targets.length) {
      await declareAttack(attacker, null);
    } else {
      const target = chooseAiTarget(attacker, targets);
      if (target) await declareAttack(attacker, target);
    }
    await wait(240);
  }
  if (state.winner) {
    state.aiThinking = false;
    hooks.render();
    return;
  }
  state.aiThinking = false;
  hooks.render();
  await wait(420);
  endTurn('ai');
}

export function zoneTargetState(owner, row, index, card) {
  if (state.turn !== 'player' || state.busy || state.winner) return null;
  if (state.targetMode === 'roar') {
    return owner === 'player' && row === 'monster' && card ? 'normal' : null;
  }
  const selection = state.selected ? locateCard(state.selected.uid) : null;
  if (selection && selection.zone === 'hand' && selection.side.id === 'player') {
    const handCard = selection.card;
    if (handCard.kind === 'monster' && owner === 'player' && row === 'monster' && !card && !state.player.hasSummoned) return 'normal';
    if (handCard.kind === 'trap' && owner === 'player' && row === 'spell' && !card) return 'normal';
    return null;
  }
  if (selection && selection.zone === 'monsters' && selection.card.owner === 'player' && state.phase === 'battle' && isReadyAttacker(selection.card)) {
    if (owner === 'ai' && row === 'monster' && card) return 'attack';
  }
  return null;
}

export function returnToLobby() {
  state.screen = 'lobby';
  state.winner = null;
  state.busy = false;
  state.aiThinking = false;
  state.selected = null;
  state.placementMode = null;
  state.targetMode = null;
  state.pendingSpell = null;
}

export function surrender() {
  if (state.screen === 'duel' && !state.winner) finishDuel('ai');
}
