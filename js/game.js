import { CARD_LIBRARY, DECK_RECIPE, artSvg, cardBackMarkup, levelStars, themeFor } from './cards.js'
import { AudioEngine } from './audio.js'

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const audio = new AudioEngine()

const el = {
  title: $('#titleScreen'),
  game: $('#gameScreen'),
  play: $('#playBtn'),
  exit: $('#exitBtn'),
  again: $('#againBtn'),
  backTitle: $('#backTitleBtn'),
  roomCode: $('#roomCode'),
  roomMini: $('#roomMini'),
  cosmos: $('#cosmos'),
  board: $('#board'),
  arena: $('#arena'),
  hand: $('#hand'),
  handWrap: $('.hand-wrap'),
  aiHand: $('#aiHand'),
  aiPanel: $('#aiPanel'),
  playerPanel: $('#playerPanel'),
  aiLp: $('#aiLp'),
  playerLp: $('#playerLp'),
  aiLpFill: $('#aiLpFill'),
  playerLpFill: $('#playerLpFill'),
  aiLpTrack: $('#aiLpTrack'),
  playerLpTrack: $('#playerLpTrack'),
  aiHandCount: $('#aiHandCount'),
  playerHandCount: $('#playerHandCount'),
  aiDeckCount: $('#aiDeckCount'),
  playerDeckCount: $('#playerDeckCount'),
  aiGraveCount: $('#aiGraveCount'),
  playerGraveCount: $('#playerGraveCount'),
  turnLabel: $('#turnLabel'),
  turnNum: $('#turnNum'),
  turnPill: $('#turnPill'),
  phaseLabel: $('#phaseLabel'),
  phaseSub: $('#phaseSub'),
  hint: $('#hintPill'),
  endTurn: $('#endTurnBtn'),
  cancel: $('#cancelBtn'),
  battleFeed: $('#battleFeed'),
  ticker: $('#ticker'),
  directHint: $('#directHint'),
  cardInfo: $('#cardInfo'),
  ciArt: $('#ciArt'),
  ciMeta: $('#ciMeta'),
  ciName: $('#ciName'),
  ciText: $('#ciText'),
  ciStats: $('#ciStats'),
  turnBanner: $('#turnBanner'),
  tbTitle: $('#tbTitle'),
  tbSub: $('#tbSub'),
  toast: $('#toast'),
  result: $('#resultOverlay'),
  resultTitle: $('#resultTitle'),
  resultKicker: $('#resultKicker'),
  resultSub: $('#resultSub'),
  resultTurns: $('#resultTurns'),
  resultDamage: $('#resultDamage'),
  resultSummons: $('#resultSummons'),
  titleTilt: $('#titleTilt'),
  titleSound: $('#titleSound'),
  gameTilt: $('#gameTilt'),
  gameSound: $('#gameSound'),
  fieldSpell: $('#fieldSpell')
}

const S = {
  screen: 'title',
  turn: 0,
  active: 'player',
  over: false,
  busy: true,
  selectedUid: null,
  attacker: null,
  room: '',
  tilt: false,
  player: null,
  ai: null,
  stats: { damage: 0, summons: 0 },
  feed: [],
  gameId: 0
}

S.player = makeSide()
S.ai = makeSide()

let uidSeq = 0
let toastTimer = 0
let bannerTimer = 0
let tickerTimer = 0
let playStart = 0

function makeSide() {
  return {
    lp: 4000,
    deck: [],
    hand: [],
    monsters: Array(5).fill(null),
    spells: Array(5).fill(null),
    grave: [],
    normalSummoned: false,
    spellUsed: false
  }
}

function makeInstance(key) {
  return { uid: ++uidSeq, def: CARD_LIBRARY[key], atkBoost: 0, spent: false, faceDown: false, setTurn: 0 }
}

function otherSide(side) {
  return side === 'player' ? 'ai' : 'player'
}

function atkOf(inst) {
  if (!inst) return 0
  return inst.def.atk + (inst.atkBoost || 0)
}

function randomRoom() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let raw = ''
  for (let i = 0; i < 5; i++) raw += chars[Math.floor(Math.random() * chars.length)]
  return `${raw.slice(0, 3)} ${raw.slice(3)}`
}

function setRoom() {
  S.room = randomRoom()
  el.roomCode.textContent = S.room
  el.roomMini.textContent = S.room
}

/* ---------------------------------- cards --------------------------------- */

function cardStyle(def) {
  const t = themeFor(def)
  return `--c-main:${t.main};--c-mid:${t.mid};--c-deep:${t.deep};--c-glow:${t.glow}`
}

function cardMarkup(def, uid, opts = {}) {
  if (opts.faceDown) {
    return `<div class="card cardback ${opts.extra || ''}" data-uid="${uid}"><div class="card-inner"></div></div>`
  }
  const atk = opts.atk != null ? opts.atk : def.atk
  if (opts.field) {
    const isMonster = def.kind === 'monster'
    return `<div class="card field-tile ${def.kind} rarity-${String(def.rarity || 'r').toLowerCase()} ${opts.extra || ''}" data-uid="${uid}" style="${cardStyle(def)}">
      <div class="field-art">${artSvg(def, uid)}</div>
      <span class="field-attr">${def.attr}</span>
      <span class="field-level">${isMonster ? levelStars(def.level) : (def.kind === 'spell' ? 'SPELL' : 'TRAP')}</span>
      <span class="field-name">${escapeHtml(def.name)}</span>
      <span class="field-stats">${isMonster ? `<b class="atk">ATK ${atk}</b><b class="def">DEF ${def.def}</b>` : `<b>${def.kind.toUpperCase()} CARD</b>`}</span>
    </div>`
  }
  const stats = def.kind === 'monster'
    ? `<div class="card-stats"><span class="atk">ATK ${atk}</span><span class="def">DEF ${def.def}</span></div>`
    : `<div class="card-stats"><span class="kind-label">${def.kind === 'spell' ? 'SPELL' : 'TRAP'} CARD</span></div>`
  return `<div class="card ${def.kind} rarity-${String(def.rarity || 'r').toLowerCase()} ${opts.extra || ''}" data-uid="${uid}" style="${cardStyle(def)}">
    <div class="card-inner">
      <div class="card-top">
        <span class="card-name">${escapeHtml(def.name)}</span>
        <span class="card-attr">${def.attr}</span>
      </div>
      <div class="card-art">${artSvg(def, uid)}</div>
      <div class="card-sub">
        <span class="stars">${def.kind === 'monster' ? levelStars(def.level) : (def.kind === 'spell' ? '◇ SPELL' : '◆ TRAP')}</span>
        <span class="kind">${def.kind === 'monster' ? 'MONSTER' : def.attr}</span>
      </div>
      ${stats}
      <div class="card-text">${escapeHtml(def.text)}</div>
    </div>
  </div>`
}

function zoneMarkup(side, kind, index) {
  const sideState = S[side]
  const arr = kind === 'monster' ? sideState.monsters : sideState.spells
  const card = arr[index]
  const isPlayer = side === 'player'
  const classes = ['zone', isPlayer ? 'player' : 'ai', kind === 'monster' ? 'monster-zone' : 'spell-zone']

  const selected = S.selectedUid ? S.player.hand.find((c) => c.uid === S.selectedUid) : null
  let valid = false
  if (isPlayer && selected && !card) {
    if (selected.def.kind === 'monster' && kind === 'monster') valid = true
    if (selected.def.kind !== 'monster' && kind === 'spell') valid = true
  }
  if (valid) classes.push('valid')
  if (S.attacker && side === 'ai' && kind === 'monster' && card) classes.push('attack-target')

  let inner = ''
  if (card) {
    inner = cardMarkup(card.def, card.uid, {
      faceDown: !!card.faceDown,
      field: !card.faceDown,
      atk: kind === 'monster' ? atkOf(card) : undefined,
      extra: card.spent && kind === 'monster' ? 'spent' : ''
    })
  } else {
    inner = `<span class="zone-mark">${kind === 'monster' ? 'MONSTER' : 'SPELL'}</span>`
  }

  return `<div class="${classes.join(' ')}" data-side="${side}" data-kind="${kind}" data-index="${index}" data-zone="${side}-${kind}-${index}">${inner}</div>`
}

function renderBoard() {
  $$('.field-row').forEach((row) => {
    const side = row.dataset.side
    const kind = row.dataset.kind
    let html = ''
    for (let i = 0; i < 5; i++) html += zoneMarkup(side, kind, i)
    row.innerHTML = html
  })
  el.fieldSpell.textContent = 'FIELD'
}

function handCardMarkup(inst, i, n) {
  const angle = n > 1 ? (i - (n - 1) / 2) * 0.9 : 0
  const selected = S.selectedUid === inst.uid
  return cardMarkup(inst.def, inst.uid, { extra: selected ? 'selected' : '' })
    .replace('<div class="card ', `<div style="--r:${angle.toFixed(2)}deg" class="card `)
}

function renderHand() {
  const hand = S.player.hand
  if (!hand.length) {
    el.hand.innerHTML = '<div class="hand-empty">NO CARDS IN HAND</div>'
    return
  }
  el.hand.innerHTML = hand.map((c, i) => handCardMarkup(c, i, hand.length)).join('')
  requestAnimationFrame(layoutHand)
}

function layoutHand() {
  const cards = $$('.card', el.hand)
  if (!cards.length) return
  const n = cards.length
  const wrapW = el.hand.clientWidth - 10
  const cardW = cards[0].offsetWidth || 80
  const needed = n * cardW
  if (needed <= wrapW) {
    el.hand.style.setProperty('--overlap', '0px')
    el.hand.style.setProperty('--hand-gap', n > 1 ? `${Math.min(7, (wrapW - needed) / (n * 4))}px` : '0px')
  } else {
    const overlap = Math.ceil((needed - wrapW) / (n - 1))
    el.hand.style.setProperty('--overlap', `${Math.max(0, overlap)}px`)
    el.hand.style.setProperty('--hand-gap', '0px')
  }
}

function aiHandMarkup() {
  const count = Math.min(8, S.ai.hand.length)
  el.aiHand.innerHTML = Array.from({ length: count }, () => '<span class="mini-back"></span>').join('')
}

/* ----------------------------------- HUD ---------------------------------- */

function renderHud() {
  const p = S.player
  const a = S.ai
  el.aiLp.textContent = String(a.lp)
  el.playerLp.textContent = String(p.lp)
  el.aiLpFill.style.width = `${clamp(a.lp / 40, 0, 100)}%`
  el.playerLpFill.style.width = `${clamp(p.lp / 40, 0, 100)}%`
  el.aiLpFill.classList.toggle('low', a.lp <= 1200)
  el.playerLpFill.classList.toggle('low', p.lp <= 1200)
  el.aiHandCount.textContent = `HAND ${a.hand.length}`
  el.playerHandCount.textContent = `HAND ${p.hand.length}`
  el.aiDeckCount.textContent = String(a.deck.length)
  el.playerDeckCount.textContent = String(p.deck.length)
  el.aiGraveCount.textContent = String(a.grave.length)
  el.playerGraveCount.textContent = String(p.grave.length)
  aiHandMarkup()

  el.turnNum.textContent = `TURN ${S.turn}`
  el.turnLabel.textContent = S.over ? 'DUEL OVER' : (S.active === 'player' ? 'YOUR TURN' : "AKIRA'S TURN")
  el.turnPill.classList.toggle('ai-active', S.active === 'ai' && !S.over)
  el.turnPill.classList.toggle('player-active', S.active === 'player' && !S.over)

  const selected = currentSelected()
  if (S.over) {
    el.phaseLabel.textContent = 'DUEL OVER'
    el.phaseSub.textContent = 'CHECK RESULT'
  } else if (S.active === 'ai') {
    el.phaseLabel.textContent = 'OPPONENT'
    el.phaseSub.textContent = 'PLEASE WAIT'
  } else if (S.attacker) {
    el.phaseLabel.textContent = 'BATTLE PHASE'
    el.phaseSub.textContent = 'CHOOSE A TARGET'
  } else if (selected) {
    el.phaseLabel.textContent = 'MAIN PHASE'
    el.phaseSub.textContent = selected.def.kind === 'monster' ? 'CHOOSE A ZONE' : 'CHOOSE A ZONE'
  } else {
    el.phaseLabel.textContent = 'MAIN PHASE'
    el.phaseSub.textContent = 'SELECT A CARD'
  }

  el.endTurn.disabled = S.over || S.busy || S.active !== 'player'
  el.cancel.classList.toggle('is-hidden', !(selected || S.attacker))
  el.directHint.classList.toggle('show', !!(S.attacker && S.active === 'player' && S.ai.monsters.every((m) => !m)))

  if (S.over) el.hint.textContent = 'The duel is complete.'
  else if (S.busy && S.active === 'ai') el.hint.textContent = 'AKIRA is plotting their next move...'
  else if (S.busy) el.hint.textContent = 'Resolving card effect...'
  else if (S.attacker) el.hint.textContent = 'Tap an enemy monster or AKIRA\'s life points to attack.'
  else if (selected) {
    el.hint.textContent = selected.def.kind === 'monster'
      ? 'Tap a glowing monster zone to summon.'
      : selected.def.kind === 'spell'
        ? 'Tap a glowing spell zone to activate.'
        : 'Tap a glowing spell zone to set this trap.'
  } else if (S.active === 'player') el.hint.textContent = 'Tap a card to summon, cast, or set it.'
  else el.hint.textContent = 'Waiting for AKIRA...'
}

function renderCardInfo() {
  const inst = currentSelected()
  if (!inst) {
    el.cardInfo.classList.add('is-hidden')
    return
  }
  const d = inst.def
  el.cardInfo.classList.remove('is-hidden')
  el.ciArt.innerHTML = artSvg(d, 'info' + inst.uid)
  el.ciMeta.textContent = d.kind === 'monster'
    ? `MONSTER · ${d.attr} · LV ${d.level} · ${d.rarity}`
    : `${d.kind.toUpperCase()} · ${d.rarity}`
  el.ciName.textContent = d.name
  el.ciText.textContent = `${d.jp} — ${d.text}`
  el.ciStats.innerHTML = d.kind === 'monster'
    ? `<span class="atk">ATK ${atkOf(inst)}</span><span class="def">DEF ${d.def}</span>`
    : `<span class="effect">${d.text}</span>`
}

function renderAll() {
  renderBoard()
  renderHand()
  renderHud()
  renderCardInfo()
}

/* --------------------------------- feedback -------------------------------- */

function log(text, danger = false) {
  S.feed.unshift({ text, danger })
  S.feed = S.feed.slice(0, 5)
  el.battleFeed.innerHTML = S.feed.slice(0, 4).map((item) =>
    `<div class="feed-item ${item.danger ? 'danger' : ''}">${escapeHtml(item.text)}</div>`
  ).join('')
  el.ticker.textContent = text
  el.ticker.classList.add('show')
  clearTimeout(tickerTimer)
  tickerTimer = setTimeout(() => el.ticker.classList.remove('show'), 3400)
}

function toast(text) {
  el.toast.textContent = text
  el.toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200)
}

function banner(title, sub, danger = false, duration = 1300) {
  el.tbTitle.textContent = title
  el.tbSub.textContent = sub
  el.turnBanner.classList.toggle('danger', danger)
  el.turnBanner.classList.add('show')
  clearTimeout(bannerTimer)
  bannerTimer = setTimeout(() => el.turnBanner.classList.remove('show'), duration)
}

function screenShake() {
  const app = $('#app')
  app.classList.remove('screen-shake')
  void app.offsetWidth
  app.classList.add('screen-shake')
  setTimeout(() => app.classList.remove('screen-shake'), 400)
}

function damageFloat(side, amount, heal = false) {
  const target = side === 'ai' ? el.aiPanel : el.playerPanel
  const r = target.getBoundingClientRect()
  const node = document.createElement('div')
  node.className = `damage-float ${heal ? 'heal' : ''}`
  node.textContent = `${heal ? '+' : '-'}${amount}`
  node.style.left = `${r.left + r.width * 0.56}px`
  node.style.top = `${r.top + r.height * 0.45}px`
  document.body.appendChild(node)
  setTimeout(() => node.remove(), 1100)
}

function fxLayer() {
  let layer = $('.fx-layer')
  if (!layer) {
    layer = document.createElement('div')
    layer.className = 'fx-layer'
    document.body.appendChild(layer)
  }
  return layer
}

function centerOf(node) {
  const r = node.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

function animateStreak(fromEl, toEl, theme) {
  const from = fromEl ? centerOf(fromEl) : { x: innerWidth / 2, y: innerHeight * 0.6 }
  const to = toEl ? centerOf(toEl) : { x: innerWidth / 2, y: innerHeight * 0.35 }
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  const layer = fxLayer()
  const streak = document.createElement('div')
  streak.className = 'streak fire'
  const t = theme || { main: '#f6cf74' }
  streak.style.setProperty('--c-main', t.main)
  streak.style.left = `${from.x}px`
  streak.style.top = `${from.y}px`
  streak.style.width = `${Math.max(40, dist)}px`
  streak.style.transform = `rotate(${angle}deg)`
  layer.appendChild(streak)
  setTimeout(() => streak.remove(), 700)

  for (let i = 0; i < 14; i++) {
    const spark = document.createElement('div')
    spark.className = 'spark'
    spark.style.setProperty('--c-main', t.main)
    spark.style.left = `${to.x}px`
    spark.style.top = `${to.y}px`
    spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`)
    spark.style.setProperty('--dy', `${(Math.random() - 0.5) * 90}px`)
    layer.appendChild(spark)
    setTimeout(() => spark.remove(), 800)
  }
}

function burstAt(node, theme) {
  if (!node) return
  const c = centerOf(node)
  const layer = fxLayer()
  const t = theme || { main: '#f6cf74' }
  for (let i = 0; i < 20; i++) {
    const spark = document.createElement('div')
    spark.className = 'spark'
    spark.style.setProperty('--c-main', t.main)
    spark.style.left = `${c.x}px`
    spark.style.top = `${c.y}px`
    spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 130}px`)
    spark.style.setProperty('--dy', `${(Math.random() - 0.5) * 130}px`)
    layer.appendChild(spark)
    setTimeout(() => spark.remove(), 800)
  }
}

/* --------------------------------- game flow -------------------------------- */

function currentSelected() {
  return S.player.hand.find((c) => c.uid === S.selectedUid) || null
}

function createDeck() {
  return shuffle(DECK_RECIPE)
}

function drawCard(side, quiet = false) {
  const s = S[side]
  if (!s.deck.length) {
    log(`${side === 'player' ? 'You have' : 'AKIRA has'} no cards left to draw!`, true)
    endGame(otherSide(side), 'DECK OUT')
    return false
  }
  const key = s.deck.pop()
  const inst = makeInstance(key)
  s.hand.push(inst)
  if (!quiet) {
    log(side === 'player' ? `You drew ${inst.def.name}.` : 'AKIRA draws a card.')
    audio.draw()
  }
  renderAll()
  return true
}

function startGame() {
  S.gameId++
  S.turn = 0
  S.active = 'player'
  S.over = false
  S.busy = true
  S.selectedUid = null
  S.attacker = null
  S.stats = { damage: 0, summons: 0 }
  S.feed = []
  S.player = makeSide()
  S.ai = makeSide()
  S.player.deck = createDeck()
  S.ai.deck = createDeck()
  el.battleFeed.innerHTML = ''
  el.result.classList.add('is-hidden')
  el.cardInfo.classList.add('is-hidden')
  el.hand.style.setProperty('--overlap', '0px')
  setRoom()

  for (let i = 0; i < 5; i++) {
    S.player.hand.push(makeInstance(S.player.deck.pop()))
    S.ai.hand.push(makeInstance(S.ai.deck.pop()))
  }

  playStart = performance.now()
  renderAll()
  banner('YOUR TURN', 'MAIN PHASE', false, 850)
  audio.turn()
  log('DUEL START — 4000 LP each. Your move.')
  S.turn = 0
  beginTurn('player', false, 450)
}

function beginTurn(side, draw = true, noBanner = 0) {
  if (S.over) return
  S.active = side
  S.turn++
  const s = S[side]
  s.normalSummoned = false
  s.spellUsed = false
  s.monsters.forEach((m) => { if (m) m.spent = false })
  S.selectedUid = null
  S.attacker = null
  if (draw) {
    if (!drawCard(side)) return
  }
  renderAll()

  if (side === 'player') {
    S.busy = false
    if (!noBanner) {
      banner('YOUR TURN', 'MAIN PHASE', false, 1050)
      audio.turn()
    }
    log('Your turn begins.')
    renderAll()
  } else {
    S.busy = true
    if (!noBanner) {
      banner("AKIRA'S TURN", 'MAIN PHASE', true, 1050)
      audio.turn()
    }
    log('AKIRA begins their turn.')
    renderAll()
    const id = S.gameId
    setTimeout(() => aiActions(id), noBanner || 900)
  }
}

function endPlayerTurn() {
  if (S.over || S.busy || S.active !== 'player') return
  audio.click()
  S.selectedUid = null
  S.attacker = null
  S.busy = true
  log('You end your turn.')
  renderAll()
  const id = S.gameId
  setTimeout(() => {
    if (id !== S.gameId || S.over) return
    beginTurn('ai', true)
  }, 520)
}

function endGame(winner, reason = '') {
  if (S.over) return
  S.over = true
  S.busy = true
  S.selectedUid = null
  S.attacker = null
  renderAll()
  const won = winner === 'player'
  log(won ? 'VICTORY — AKIRA has fallen.' : 'DEFEAT — your life points reached zero.', !won)
  setTimeout(() => {
    el.result.classList.remove('is-hidden')
    el.result.classList.toggle('defeat', !won)
    el.resultTitle.textContent = won ? 'VICTORY' : 'DEFEAT'
    el.resultKicker.textContent = won ? 'DUEL COMPLETE' : 'DUEL COMPLETE'
    el.resultSub.textContent = reason === 'DECK OUT'
      ? `${won ? 'AKIRA' : 'YOU'} COULD NOT DRAW`
      : `${won ? "AKIRA'S" : 'YOUR'} LIFE POINTS REACHED ZERO`
    el.resultTurns.textContent = String(S.turn)
    el.resultDamage.textContent = String(S.stats.damage)
    el.resultSummons.textContent = String(S.stats.summons)
    if (won) audio.win()
    else audio.lose()
  }, 700)
}

/* ---------------------------------- actions --------------------------------- */

function markSpent(side, idx) {
  const m = S[side].monsters[idx]
  if (m) m.spent = true
}

function destroyMonster(side, idx) {
  const s = S[side]
  const m = s.monsters[idx]
  if (!m) return null
  s.monsters[idx] = null
  s.grave.push(m.def)
  return m
}

function damage(side, amount, options = {}) {
  if (amount <= 0 || S.over) return
  const s = S[side]
  s.lp = Math.max(0, s.lp - amount)
  if (side === 'ai') S.stats.damage += amount
  damageFloat(side, amount, false)
  const track = side === 'ai' ? el.aiLpTrack : el.playerLpTrack
  track.classList.remove('damaged')
  void track.offsetWidth
  track.classList.add('damaged')
  setTimeout(() => track.classList.remove('damaged'), 500)
  audio.hit()
  if (!options.silentShake) screenShake()
  renderHud()
  if (s.lp <= 0) endGame(otherSide(side))
}

function heal(side, amount) {
  if (amount <= 0 || S.over) return
  const s = S[side]
  const before = s.lp
  s.lp = Math.min(4000, s.lp + amount)
  const gained = s.lp - before
  if (gained > 0) damageFloat(side, gained, true)
  audio.heal()
  renderHud()
}

function applyEffect(card, side, mode = 'normal') {
  if (!card || !card.effect) return
  let raw = card.effect
  if (raw.startsWith('summon:')) raw = raw.slice(7)
  const parts = raw.split(',')
  for (const part of parts) {
    const [kind, value] = part.split(':')
    const n = Number(value || 0)
    if (kind === 'burn') {
      damage(otherSide(side), n)
      log(`${card.name} burns ${n} LP from ${otherSide(side) === 'player' ? 'you' : 'AKIRA'}.`, otherSide(side) === 'player')
    } else if (kind === 'heal') {
      heal(side, n)
      log(`${card.name} restores ${n} LP.`)
    } else if (kind === 'draw') {
      for (let i = 0; i < n; i++) {
        if (S.over) break
        drawCard(side, i > 0)
      }
      log(`${side === 'player' ? 'You draw' : 'AKIRA draws'} ${n} card${n > 1 ? 's' : ''}.`)
    } else if (kind === 'buff') {
      S[side].monsters.forEach((m) => { if (m) m.atkBoost += n })
      log(`${side === 'player' ? 'Your monsters gain' : "AKIRA's monsters gain"} ${n} ATK.`)
    } else if (kind === 'destroyAll') {
      let count = 0
      for (const who of ['player', 'ai']) {
        S[who].monsters.forEach((m, i) => {
          if (m) {
            destroyMonster(who, i)
            count++
          }
        })
      }
      log(`DIMENSION RIFT destroys ${count} monster${count === 1 ? '' : 's'}!`, true)
      screenShake()
    }
  }
  renderAll()
}

function summonMonster(side, inst, zoneIdx) {
  const s = S[side]
  inst.spent = false
  inst.faceDown = false
  inst.atkBoost = inst.atkBoost || 0
  s.monsters[zoneIdx] = inst
  s.normalSummoned = true
  if (side === 'player') S.stats.summons++
  const node = $(`[data-zone="${side}-monster-${zoneIdx}"]`)
  burstAt(node, themeFor(inst.def))
  audio.summon()
  log(`${side === 'player' ? 'You summon' : 'AKIRA summons'} ${inst.def.name} (${atkOf(inst)} ATK).`)
  renderAll()
  applyEffect(inst.def, side, 'summon')
  renderAll()
}

function activateSpell(side, inst, zoneIdx) {
  const s = S[side]
  s.spellUsed = true
  s.spells[zoneIdx] = { ...inst, faceDown: false }
  const node = $(`[data-zone="${side}-spell-${zoneIdx}"]`)
  burstAt(node, themeFor(inst.def))
  audio.cast()
  log(`${side === 'player' ? 'You activate' : 'AKIRA activates'} ${inst.def.name}.`)
  renderAll()
  applyEffect(inst.def, side, 'spell')
  setTimeout(() => {
    if (S.over) return
    const current = s.spells[zoneIdx]
    if (current && current.uid === inst.uid) {
      s.spells[zoneIdx] = null
      s.grave.push(inst.def)
      renderAll()
    }
  }, 420)
}

function setTrap(side, inst, zoneIdx) {
  const s = S[side]
  s.spellUsed = true
  s.spells[zoneIdx] = { ...inst, faceDown: true, setTurn: S.turn }
  audio.select()
  log(side === 'player' ? 'You set a card face-down.' : 'AKIRA sets a card face-down.')
  renderAll()
}

async function playerPlaySelected(zoneIdx) {
  const inst = currentSelected()
  if (!inst || S.busy || S.over || S.active !== 'player') return
  const s = S.player
  const kind = inst.def.kind
  if (kind === 'monster' && s.monsters[zoneIdx]) return
  if (kind !== 'monster' && s.spells[zoneIdx]) return
  if (kind === 'monster' && s.normalSummoned) {
    toast('You can only Normal Summon once per turn.')
    audio.error()
    return
  }
  if (kind !== 'monster' && s.spellUsed) {
    toast('You can only use one Spell / Trap per turn.')
    audio.error()
    return
  }

  S.busy = true
  s.hand = s.hand.filter((c) => c.uid !== inst.uid)
  S.selectedUid = null
  if (kind === 'monster') {
    summonMonster('player', inst, zoneIdx)
  } else if (kind === 'spell') {
    activateSpell('player', inst, zoneIdx)
  } else {
    setTrap('player', inst, zoneIdx)
  }
  renderAll()
  await delay(kind === 'spell' ? 520 : 260)
  if (!S.over) {
    S.busy = false
    renderAll()
  }
}

function playerSelectCard(uid) {
  if (S.over || S.busy || S.active !== 'player') return
  audio.unlock()
  if (S.selectedUid === uid) {
    S.selectedUid = null
    audio.click()
  } else {
    S.selectedUid = uid
    S.attacker = null
    audio.select()
  }
  renderAll()
}

function selectAttacker(index) {
  if (S.over || S.busy || S.active !== 'player') return
  const m = S.player.monsters[index]
  if (!m) return
  if (m.spent) {
    toast('That monster has already attacked this turn.')
    audio.error()
    return
  }
  if (S.selectedUid) S.selectedUid = null
  if (S.attacker && S.attacker.index === index) {
    S.attacker = null
    audio.click()
  } else {
    S.attacker = { side: 'player', index }
    audio.select()
  }
  renderAll()
}

function revealTrap(side, index) {
  const card = S[side].spells[index]
  if (!card) return null
  card.faceDown = false
  renderBoard()
  return card
}

async function performAttack(side, index, targetIndex, id) {
  if (S.over || id !== S.gameId) return
  const other = otherSide(side)
  const attacker = S[side].monsters[index]
  if (!attacker) return
  markSpent(side, index)
  renderBoard()

  const fromNode = $(`[data-zone="${side}-monster-${index}"]`)
  const targetNode = targetIndex != null ? $(`[data-zone="${other}-monster-${targetIndex}"]`) : (other === 'ai' ? el.aiPanel : el.playerPanel)
  animateStreak(fromNode, targetNode, themeFor(attacker.def))
  audio.attack()
  await delay(340)
  if (S.over || id !== S.gameId) return

  const trapIndex = S[other].spells.findIndex((c) => c && c.def.kind === 'trap' && c.faceDown)
  if (trapIndex >= 0) {
    const trap = revealTrap(other, trapIndex)
    audio.trap()
    log(`${other === 'player' ? 'Your' : "AKIRA's"} ${trap.def.name} activates!`, true)
    burstAt($(`[data-zone="${other}-spell-${trapIndex}"]`), themeFor(trap.def))
    await delay(420)
    if (S.over || id !== S.gameId) return
    const pieces = trap.def.effect.split(':')
    const mode = pieces[0]
    const action = pieces[1]
    const value = Number(pieces[2] || 0)
    if (mode === 'negate' && action === 'destroyAttacker') {
      destroyMonster(side, index)
      log(`${trap.def.name} destroys ${attacker.def.name}!`, true)
    } else if (mode === 'negate' && action === 'burnAttacker') {
      damage(side, value)
      log(`${trap.def.name} negates the attack and burns ${value} LP!`, true)
    } else if (mode === 'negate' && action === 'drain') {
      damage(side, value)
      heal(other, Math.round(value / 2))
      log(`${trap.def.name} drains ${value} LP from the attacker!`, true)
    } else {
      log(`${trap.def.name} negates the attack.`, true)
    }
    S[other].grave.push(trap.def)
    S[other].spells[trapIndex] = null
    renderAll()
    return
  }

  if (targetIndex != null) {
    const target = S[other].monsters[targetIndex]
    if (!target) {
      renderBoard()
      return
    }
    const a = atkOf(attacker)
    const d = atkOf(target)
    if (a > d) {
      destroyMonster(other, targetIndex)
      const diff = a - d
      log(`${attacker.def.name} destroys ${target.def.name} and deals ${diff} damage.`, other === 'player')
      if (diff > 0) damage(other, diff)
    } else if (a < d) {
      destroyMonster(side, index)
      const diff = d - a
      log(`${target.def.name} destroys ${attacker.def.name}. ${side === 'player' ? 'You take' : 'AKIRA takes'} ${diff} damage.`, side === 'player')
      if (diff > 0) damage(side, diff)
    } else {
      destroyMonster(other, targetIndex)
      destroyMonster(side, index)
      log(`${attacker.def.name} and ${target.def.name} destroy each other!`, true)
      screenShake()
    }
  } else {
    const a = atkOf(attacker)
    log(`${attacker.def.name} attacks directly for ${a} damage!`, other === 'player')
    damage(other, a)
  }
  renderAll()
}

async function playerAttack(index, targetIndex = null) {
  if (S.over || S.busy || S.active !== 'player') return
  const attacker = S.player.monsters[index]
  if (!attacker) return
  if (targetIndex != null && !S.ai.monsters[targetIndex]) return
  S.attacker = null
  S.busy = true
  renderAll()
  const id = S.gameId
  await performAttack('player', index, targetIndex, id)
  if (id !== S.gameId || S.over) return
  S.busy = false
  renderAll()
}

function handleZoneClick(zone) {
  if (!zone || S.over || S.busy) return
  const side = zone.dataset.side
  const kind = zone.dataset.kind
  const index = Number(zone.dataset.index)
  const arr = kind === 'monster' ? S[side].monsters : S[side].spells
  const card = arr[index]

  if (S.active !== 'player') {
    if (card) toast(`${card.def.name} — ${kind === 'monster' ? `${atkOf(card)} ATK` : card.def.kind.toUpperCase()}`)
    return
  }

  if (S.attacker) {
    if (side === 'ai' && kind === 'monster' && card && !card.faceDown) {
      playerAttack(S.attacker.index, index)
    } else if (side === 'player' && kind === 'monster' && card) {
      selectAttacker(index)
    } else {
      toast('Choose an enemy monster to attack.')
      audio.error()
    }
    return
  }

  if (S.selectedUid) {
    if (side === 'player' && ((kind === 'monster' && currentSelected()?.def.kind === 'monster') || (kind === 'spell' && currentSelected()?.def.kind !== 'monster'))) {
      if (!card) playerPlaySelected(index)
      else toast('That zone is already occupied.')
    } else {
      toast(kind === 'monster' ? 'Select a monster zone.' : 'Select a Spell / Trap zone.')
    }
    return
  }

  if (side === 'player' && kind === 'monster' && card) {
    selectAttacker(index)
  } else if (card) {
    if (card.faceDown) toast('A face-down card. Its identity is hidden.')
    else toast(`${card.def.name} — ${card.def.kind === 'monster' ? `${atkOf(card)} ATK / ${card.def.def} DEF` : card.def.text}`)
  }
}

/* ----------------------------------- AI ------------------------------------ */

async function aiActions(id) {
  if (S.over || id !== S.gameId) return
  S.busy = true
  await delay(720)
  if (S.over || id !== S.gameId) return

  if (!S.ai.spellUsed) {
    const spell = chooseAiSpell()
    if (spell) {
      const zone = emptyZone(S.ai.spells)
      if (zone >= 0) {
        S.ai.hand = S.ai.hand.filter((c) => c.uid !== spell.uid)
        S.ai.spellUsed = true
        activateSpell('ai', spell, zone)
        renderAll()
        await delay(680)
      }
    }
  }
  if (S.over || id !== S.gameId) return

  if (!S.ai.normalSummoned) {
    const monster = chooseAiMonster()
    if (monster) {
      const zone = emptyZone(S.ai.monsters)
      if (zone >= 0) {
        S.ai.hand = S.ai.hand.filter((c) => c.uid !== monster.uid)
        S.busy = true
        summonMonster('ai', monster, zone)
        renderAll()
        await delay(700)
      }
    }
  }
  if (S.over || id !== S.gameId) return

  if (!S.ai.spellUsed) {
    const trap = S.ai.hand.find((c) => c.def.kind === 'trap')
    if (trap && Math.random() < 0.72) {
      const zone = emptyZone(S.ai.spells)
      if (zone >= 0) {
        S.ai.hand = S.ai.hand.filter((c) => c.uid !== trap.uid)
        S.ai.spellUsed = true
        setTrap('ai', trap, zone)
        renderAll()
        await delay(520)
      }
    }
  }
  if (S.over || id !== S.gameId) return

  const indices = S.ai.monsters.map((m, i) => (m ? i : -1)).filter((i) => i >= 0)
  for (const i of indices) {
    if (S.over || id !== S.gameId) return
    const attacker = S.ai.monsters[i]
    if (!attacker || attacker.spent) continue
    const playerMonsters = S.player.monsters
    const beatable = playerMonsters
      .map((m, idx) => (m && atkOf(m) < atkOf(attacker) ? idx : -1))
      .filter((idx) => idx >= 0)
      .sort((a, b) => atkOf(playerMonsters[b]) - atkOf(playerMonsters[a]))
    const anyPlayerMonster = playerMonsters.some((m) => m)
    let target = null
    if (beatable.length) target = beatable[0]
    else if (!anyPlayerMonster) target = null
    else continue

    await delay(680)
    if (S.over || id !== S.gameId) return
    await performAttack('ai', i, target, id)
    await delay(520)
  }

  if (S.over || id !== S.gameId) return
  log('AKIRA ends their turn.')
  renderAll()
  await delay(450)
  if (S.over || id !== S.gameId) return
  beginTurn('player', true)
}

function emptyZone(arr) {
  return arr.findIndex((v) => !v)
}

function chooseAiMonster() {
  const monsters = S.ai.hand.filter((c) => c.def.kind === 'monster')
  if (!monsters.length) return null
  monsters.sort((a, b) => b.def.atk - a.def.atk)
  return monsters[0]
}

function chooseAiSpell() {
  const spells = S.ai.hand.filter((c) => c.def.kind === 'spell')
  if (!spells.length) return null
  const hasMonster = S.ai.monsters.some((m) => m)
  const playerMonsters = S.player.monsters.filter((m) => m).length
  const aiMonsters = S.ai.monsters.filter((m) => m).length
  const pick = (name) => spells.find((c) => c.def.key === name) || null

  if (S.player.lp <= 1000 && pick('novaBurst')) return pick('novaBurst')
  if (S.ai.lp <= 1600 && pick('healingLight')) return pick('healingLight')
  if (S.ai.lp <= 2600 && pick('aegisBlessing')) return pick('aegisBlessing')
  if (playerMonsters >= 2 && aiMonsters + 1 < playerMonsters && pick('dimensionRift')) return pick('dimensionRift')
  if (hasMonster && pick('powerSurge') && Math.random() < 0.8) return pick('powerSurge')
  if (pick('soulHarvest') && S.ai.hand.length <= 4) return pick('soulHarvest')
  if (pick('novaBurst') && Math.random() < 0.5) return pick('novaBurst')
  if (pick('healingLight') && S.ai.lp < 3500) return pick('healingLight')
  return Math.random() < 0.35 ? spells[Math.floor(Math.random() * spells.length)] : null
}

/* ---------------------------------- tilt ----------------------------------- */

const tilt = { x: 0, y: 0, targetX: 0, targetY: 0, raf: 0 }

function applyTilt(x, y) {
  tilt.targetX = clamp(x, -16, 16)
  tilt.targetY = clamp(y, -12, 12)
  if (!tilt.raf) tilt.raf = requestAnimationFrame(stepTilt)
}

function stepTilt() {
  tilt.x += (tilt.targetX - tilt.x) * 0.12
  tilt.y += (tilt.targetY - tilt.y) * 0.12
  const root = document.documentElement.style
  const baseRx = window.innerWidth <= 700 ? 5 : 9
  root.setProperty('--tilt-x', `${tilt.x.toFixed(2)}px`)
  root.setProperty('--tilt-y', `${tilt.y.toFixed(2)}px`)
  root.setProperty('--board-rx', `${(baseRx - tilt.y * 0.16).toFixed(2)}deg`)
  root.setProperty('--board-rz', `${(tilt.x * 0.08).toFixed(2)}deg`)
  root.setProperty('--rot-x', `${(tilt.x * 0.1).toFixed(2)}deg`)
  root.setProperty('--rot-y', `${(tilt.y * 0.1).toFixed(2)}deg`)
  if (Math.abs(tilt.targetX - tilt.x) > 0.02 || Math.abs(tilt.targetY - tilt.y) > 0.02) {
    tilt.raf = requestAnimationFrame(stepTilt)
  } else {
    tilt.raf = 0
  }
}

function onOrientation(e) {
  let gx = 0
  let gy = 0
  if (typeof e.gamma === 'number') gx = e.gamma
  if (typeof e.beta === 'number') gy = e.beta - 40
  applyTilt(gx * 0.45, gy * 0.32)
}

async function toggleTilt() {
  if (S.tilt) {
    S.tilt = false
    applyTilt(0, 0)
    setTiltUi(false)
    toast('Tilt disabled')
    return
  }
  try {
    let granted = true
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      granted = (await DeviceOrientationEvent.requestPermission()) === 'granted'
    } else if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      granted = (await DeviceMotionEvent.requestPermission()) === 'granted'
    }
    if (!granted) {
      toast('Motion access was denied.')
      return
    }
    S.tilt = true
    setTiltUi(true)
    toast('Tilt enabled — move your device.')
    audio.click()
  } catch {
    toast('Motion sensors are not available here.')
  }
}

function setTiltUi(on) {
  for (const btn of [el.titleTilt, el.gameTilt]) {
    if (!btn) continue
    btn.setAttribute('aria-pressed', String(on))
    if (btn === el.titleTilt) btn.textContent = on ? 'TILT ON' : 'TILT OFF'
    else btn.setAttribute('aria-label', on ? 'Disable tilt' : 'Enable tilt')
  }
  document.body.classList.toggle('tilt-on', on)
}

/* ---------------------------------- sound ---------------------------------- */

function toggleSound() {
  const next = !audio.enabled
  audio.setEnabled(next)
  for (const btn of [el.titleSound, el.gameSound]) {
    if (!btn) continue
    btn.setAttribute('aria-pressed', String(next))
    if (btn === el.titleSound) btn.textContent = next ? 'SOUND ON' : 'SOUND OFF'
    btn.setAttribute('aria-label', next ? 'Disable sound' : 'Enable sound')
  }
  if (next) audio.click()
}

/* -------------------------------- cosmos fx -------------------------------- */

const canvas = el.cosmos
const ctx = canvas.getContext('2d')
let W = 0
let H = 0
let DPR = 1
let stars = []
let wisps = []
let shoots = []
let lastShoot = 0

function sizeCanvas() {
  DPR = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = Math.floor(W * DPR)
  canvas.height = Math.floor(H * DPR)
  canvas.style.width = `${W}px`
  canvas.style.height = `${H}px`
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  const count = Math.round(clamp((W * H) / 9000, 90, 220))
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    z: 0.25 + Math.random() * 0.9,
    r: 0.4 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 1.1,
    hue: Math.random() < 0.7 ? 250 + Math.random() * 40 : 36 + Math.random() * 22
  }))
  wisps = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.max(W, H) * (0.16 + Math.random() * 0.2),
    hue: [265, 300, 190, 340, 45][i],
    speed: 0.02 + Math.random() * 0.03,
    phase: Math.random() * Math.PI * 2
  }))
}

function drawCosmos(now) {
  ctx.clearRect(0, 0, W, H)
  const t = now * 0.001
  ctx.globalCompositeOperation = 'lighter'
  for (const w of wisps) {
    const x = w.x + Math.sin(t * w.speed + w.phase) * W * 0.12 + tilt.x * 0.7
    const y = w.y + Math.cos(t * w.speed * 0.8 + w.phase) * H * 0.08 + tilt.y * 0.7
    const g = ctx.createRadialGradient(x, y, 0, x, y, w.r)
    g.addColorStop(0, `hsla(${w.hue}, 80%, 62%, .045)`)
    g.addColorStop(0.6, `hsla(${w.hue}, 80%, 52%, .018)`)
    g.addColorStop(1, 'hsla(0,0%,0%,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - w.r, y - w.r, w.r * 2, w.r * 2)
  }
  for (const s of stars) {
    const a = 0.28 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
    const x = s.x + tilt.x * 1.5 * s.z
    const y = s.y + tilt.y * 1.5 * s.z
    ctx.beginPath()
    ctx.fillStyle = `hsla(${s.hue}, 90%, 82%, ${a})`
    ctx.arc(x, y, s.r, 0, Math.PI * 2)
    ctx.fill()
    if (s.r > 1.1 && a > 0.55) {
      ctx.strokeStyle = `hsla(${s.hue}, 90%, 80%, ${a * 0.32})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x - s.r * 3, y)
      ctx.lineTo(x + s.r * 3, y)
      ctx.moveTo(x, y - s.r * 3)
      ctx.lineTo(x, y + s.r * 3)
      ctx.stroke()
    }
  }
  if (now - lastShoot > 5200 && Math.random() < 0.02) {
    lastShoot = now
    shoots.push({
      x: Math.random() * W * 0.8,
      y: Math.random() * H * 0.4,
      vx: 220 + Math.random() * 260,
      vy: 90 + Math.random() * 130,
      life: 1
    })
  }
  for (const sh of shoots) {
    sh.x += sh.vx * 0.016
    sh.y += sh.vy * 0.016
    sh.life -= 0.012
    const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 0.14, sh.y - sh.vy * 0.14)
    g.addColorStop(0, `rgba(255, 240, 200, ${sh.life * 0.9})`)
    g.addColorStop(1, 'rgba(255, 240, 200, 0)')
    ctx.strokeStyle = g
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(sh.x, sh.y)
    ctx.lineTo(sh.x - sh.vx * 0.14, sh.y - sh.vy * 0.14)
    ctx.stroke()
  }
  shoots = shoots.filter((s) => s.life > 0)
  ctx.globalCompositeOperation = 'source-over'
  requestAnimationFrame(drawCosmos)
}

/* ---------------------------------- wiring --------------------------------- */

function goTitle() {
  S.gameId++
  S.over = true
  S.busy = true
  el.result.classList.add('is-hidden')
  el.game.classList.add('is-hidden')
  el.title.classList.remove('is-hidden')
  S.screen = 'title'
  setRoom()
}

function startFromTitle() {
  audio.unlock()
  audio.click()
  el.title.classList.add('is-hidden')
  el.game.classList.remove('is-hidden')
  S.screen = 'game'
  requestAnimationFrame(() => {
    sizeCanvas()
    startGame()
  })
}

el.play.addEventListener('click', startFromTitle)
el.again.addEventListener('click', () => {
  audio.click()
  startGame()
})
el.backTitle.addEventListener('click', () => {
  audio.click()
  goTitle()
})
el.exit.addEventListener('click', () => {
  if (S.over) {
    goTitle()
    return
  }
  toast('Returning to the title...')
  audio.click()
  setTimeout(goTitle, 400)
})
el.endTurn.addEventListener('click', endPlayerTurn)
el.cancel.addEventListener('click', () => {
  if (S.over || S.busy) return
  S.selectedUid = null
  S.attacker = null
  audio.click()
  renderAll()
})
el.titleTilt.addEventListener('click', toggleTilt)
el.gameTilt.addEventListener('click', toggleTilt)
el.titleSound.addEventListener('click', toggleSound)
el.gameSound.addEventListener('click', toggleSound)

el.hand.addEventListener('click', (e) => {
  const card = e.target.closest('.card')
  if (!card) return
  playerSelectCard(Number(card.dataset.uid))
})

el.board.addEventListener('click', (e) => {
  const zone = e.target.closest('.zone')
  if (!zone) return
  handleZoneClick(zone)
})

el.aiPanel.addEventListener('click', (e) => {
  if (!S.attacker || S.over || S.busy || S.active !== 'player') return
  if (S.ai.monsters.some((m) => m)) {
    toast('Destroy AKIRA\'s monsters before attacking directly.')
    audio.error()
    return
  }
  e.preventDefault()
  playerAttack(S.attacker.index)
})

el.board.addEventListener('pointerdown', (e) => {
  const zone = e.target.closest('.zone')
  if (!zone) return
  zone.classList.add('pressed')
  setTimeout(() => zone.classList.remove('pressed'), 180)
})

window.addEventListener('pointermove', (e) => {
  if (S.tilt) return
  if (e.pointerType === 'touch') return
  const nx = (e.clientX / window.innerWidth - 0.5) * 2
  const ny = (e.clientY / window.innerHeight - 0.5) * 2
  applyTilt(nx * 6, ny * 5)
}, { passive: true })

window.addEventListener('resize', () => {
  sizeCanvas()
  layoutHand()
})
window.addEventListener('deviceorientation', (e) => {
  if (!S.tilt) return
  onOrientation(e)
}, true)

document.addEventListener('keydown', (e) => {
  if (S.screen !== 'game') return
  if (e.key === 'Escape') {
    S.selectedUid = null
    S.attacker = null
    if (!S.over) renderAll()
  }
  if (e.key === 'e' || e.key === 'E') {
    if (S.active === 'player' && !S.busy && !S.over) endPlayerTurn()
  }
})

document.addEventListener('pointerdown', () => audio.unlock(), { once: true })

if (new URLSearchParams(location.search).has('debug')) {
  window.__duel = {
    state: S,
    startGame,
    endGame,
    beginTurn,
    applyEffect,
    performAttack,
    renderAll,
    audio
  }
}

setRoom()
sizeCanvas()
requestAnimationFrame(drawCosmos)
renderAll()
