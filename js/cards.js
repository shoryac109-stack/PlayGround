const THEMES = {
  LIGHT: { main: '#ffe6a6', mid: '#e0aa45', deep: '#6b4108', deep2: '#2a1a05', glow: '#fff2c4' },
  DARK: { main: '#d6a6ff', mid: '#8c4ee0', deep: '#32105f', deep2: '#150725', glow: '#eed6ff' },
  FIRE: { main: '#ffb066', mid: '#f0642c', deep: '#5c1606', deep2: '#240704', glow: '#ffd2a0' },
  WATER: { main: '#8be9ff', mid: '#2aa8dc', deep: '#063c5c', deep2: '#041722', glow: '#c8f6ff' },
  WIND: { main: '#9affc9', mid: '#35c98a', deep: '#064a32', deep2: '#041c15', glow: '#d2ffe8' },
  EARTH: { main: '#f0c58a', mid: '#c0823c', deep: '#4c2c0b', deep2: '#1d1105', glow: '#ffe4bc' },
  SPELL: { main: '#8ef0c4', mid: '#2fbf8c', deep: '#064634', deep2: '#041a15', glow: '#d0ffe9' },
  TRAP: { main: '#ff9cc0', mid: '#d93c79', deep: '#540726', deep2: '#1e040d', glow: '#ffd0e1' }
}

export const CARD_LIBRARY = {
  astraDragon: {
    key: 'astraDragon', name: 'ASTRA DRAGON', jp: '星界竜アストラ', kind: 'monster', attr: 'LIGHT',
    level: 8, atk: 3000, def: 2500, rarity: 'UR', art: 'dragon', effect: 'summon:burn:300',
    text: 'A dragon woven from dying stars. When summoned, it scorches the opponent for 300 damage.'
  },
  voidSorcerer: {
    key: 'voidSorcerer', name: 'VOID SORCERER', jp: '虚空の魔術師', kind: 'monster', attr: 'DARK',
    level: 7, atk: 2600, def: 2100, rarity: 'UR', art: 'mage', effect: 'summon:draw:1',
    text: 'He reads the space between dimensions. When summoned, draw 1 card.'
  },
  phoenixEmperor: {
    key: 'phoenixEmperor', name: 'PHOENIX EMPEROR', jp: '不死鳥皇帝', kind: 'monster', attr: 'FIRE',
    level: 8, atk: 2800, def: 2000, rarity: 'UR', art: 'phoenix', effect: 'summon:burn:500',
    text: 'Reborn from its own ashes. When summoned, deal 500 damage to the opponent.'
  },
  ironColossus: {
    key: 'ironColossus', name: 'IRON COLOSSUS', jp: '鋼鉄巨神', kind: 'monster', attr: 'EARTH',
    level: 6, atk: 2400, def: 2800, rarity: 'SR', art: 'golem', effect: '',
    text: 'A walking fortress forged in the core of a dead world. Its walls never fall.'
  },
  lunarPriestess: {
    key: 'lunarPriestess', name: 'LUNAR PRIESTESS', jp: '月の巫女', kind: 'monster', attr: 'LIGHT',
    level: 6, atk: 2200, def: 2000, rarity: 'SR', art: 'sorceress', effect: 'summon:heal:500',
    text: 'She bottles moonlight into blessings. When summoned, restore 500 LP.'
  },
  emberWyrm: {
    key: 'emberWyrm', name: 'EMBER WYRM', jp: '燼火の竜', kind: 'monster', attr: 'FIRE',
    level: 7, atk: 2700, def: 1800, rarity: 'SR', art: 'dragon', effect: 'summon:burn:400',
    text: 'A serpent of cinders that nests inside volcanoes. When summoned, deal 400 damage.'
  },
  stormValkyrie: {
    key: 'stormValkyrie', name: 'STORM VALKYRIE', jp: '嵐の戦乙女', kind: 'monster', attr: 'WIND',
    level: 5, atk: 2300, def: 1600, rarity: 'R', art: 'valkyrie', effect: 'summon:burn:200',
    text: 'Her spear splits the sky. When summoned, deal 200 damage to the opponent.'
  },
  abyssLeviathan: {
    key: 'abyssLeviathan', name: 'ABYSS LEVIATHAN', jp: '深淵の海竜', kind: 'monster', attr: 'WATER',
    level: 7, atk: 2500, def: 2200, rarity: 'SR', art: 'leviathan', effect: '',
    text: 'It circles the sunken city, older than the tide. Nothing escapes its current.'
  },
  radiantGuardian: {
    key: 'radiantGuardian', name: 'RADIANT GUARDIAN', jp: '光の守護騎士', kind: 'monster', attr: 'LIGHT',
    level: 5, atk: 2000, def: 2400, rarity: 'R', art: 'guardian', effect: 'summon:heal:300',
    text: 'A sentinel of the dawn gate. When summoned, restore 300 LP.'
  },
  shadowAssassin: {
    key: 'shadowAssassin', name: 'SHADOW ASSASSIN', jp: '影の暗殺者', kind: 'monster', attr: 'DARK',
    level: 5, atk: 2100, def: 1200, rarity: 'R', art: 'assassin', effect: '',
    text: 'A blade with no face and no echo. It strikes before the duel disk can hum.'
  },
  terraGolem: {
    key: 'terraGolem', name: 'TERRA GOLEM', jp: '大地のゴーレム', kind: 'monster', attr: 'EARTH',
    level: 4, atk: 1900, def: 2100, rarity: 'R', art: 'golem', effect: '',
    text: 'Carved from a mountain that refused to bow. Its footsteps reshape the field.'
  },
  mistSerpent: {
    key: 'mistSerpent', name: 'MIST SERPENT', jp: '霧の海蛇', kind: 'monster', attr: 'WATER',
    level: 4, atk: 1800, def: 1400, rarity: 'R', art: 'leviathan', effect: '',
    text: 'It swims through fog as if the air were water. Its scales hold the morning dew.'
  },
  galeHarpy: {
    key: 'galeHarpy', name: 'GALE HARPY', jp: '疾風のハーピー', kind: 'monster', attr: 'WIND',
    level: 4, atk: 1700, def: 1300, rarity: 'R', art: 'valkyrie', effect: '',
    text: 'A razor-winged hunter that rides the edge of every storm. Her song is a warning.'
  },
  sunPriestess: {
    key: 'sunPriestess', name: 'SUN PRIESTESS', jp: '太陽の巫女', kind: 'monster', attr: 'LIGHT',
    level: 4, atk: 1600, def: 1800, rarity: 'R', art: 'sorceress', effect: '',
    text: 'She tends the first flame of morning. Her prayers leave gold in the air.'
  },
  novaBurst: {
    key: 'novaBurst', name: 'NOVA BURST', jp: '超新星爆発', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'SR', art: 'spell', effect: 'burn:1000',
    text: 'Detonate a collapsing star. Deal 1000 damage to your opponent.'
  },
  healingLight: {
    key: 'healingLight', name: 'HEALING LIGHT', jp: '癒しの光', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'R', art: 'spell', effect: 'heal:1500',
    text: 'A warm radiance closes every wound. Restore 1500 LP.'
  },
  powerSurge: {
    key: 'powerSurge', name: 'POWER SURGE', jp: '力の奔流', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'SR', art: 'spell', effect: 'buff:500',
    text: 'Overload every monster you control. They gain 500 ATK permanently.'
  },
  soulHarvest: {
    key: 'soulHarvest', name: 'SOUL HARVEST', jp: '魂の収穫', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'R', art: 'spell', effect: 'draw:2',
    text: 'Reap the memories of fallen duelists. Draw 2 cards.'
  },
  dimensionRift: {
    key: 'dimensionRift', name: 'DIMENSION RIFT', jp: '次元の裂け目', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'UR', art: 'spell', effect: 'destroyAll',
    text: 'Tear open the boundary between worlds. Destroy all monsters on the field.'
  },
  aegisBlessing: {
    key: 'aegisBlessing', name: 'AEGIS BLESSING', jp: 'イージスの祝福', kind: 'spell', attr: 'SPELL',
    level: 0, atk: 0, def: 0, rarity: 'R', art: 'spell', effect: 'heal:800,draw:1',
    text: 'A shield of prayer. Restore 800 LP and draw 1 card.'
  },
  shadowBarrier: {
    key: 'shadowBarrier', name: 'SHADOW BARRIER', jp: '影の障壁', kind: 'trap', attr: 'TRAP',
    level: 0, atk: 0, def: 0, rarity: 'SR', art: 'trap', effect: 'negate:burnAttacker:500',
    text: 'Negate an attack and deal 500 damage to the attacking duelist.'
  },
  soulDrain: {
    key: 'soulDrain', name: 'SOUL DRAIN', jp: '魂の吸収', kind: 'trap', attr: 'TRAP',
    level: 0, atk: 0, def: 0, rarity: 'SR', art: 'trap', effect: 'negate:drain:800',
    text: 'Negate an attack and drain 800 LP from the attacking duelist.'
  },
  novaMirror: {
    key: 'novaMirror', name: 'NOVA MIRROR', jp: '超新星の鏡', kind: 'trap', attr: 'TRAP',
    level: 0, atk: 0, def: 0, rarity: 'UR', art: 'trap', effect: 'negate:destroyAttacker',
    text: 'Negate an attack and destroy the attacking monster with reflected light.'
  },
  gravityVeil: {
    key: 'gravityVeil', name: 'GRAVITY VEIL', jp: '重力の帳', kind: 'trap', attr: 'TRAP',
    level: 0, atk: 0, def: 0, rarity: 'R', art: 'trap', effect: 'negate:burnAttacker:300',
    text: 'Negate an attack and crush the attacker for 300 damage.'
  }
}

export const DECK_RECIPE = [
  'astraDragon', 'voidSorcerer', 'phoenixEmperor', 'ironColossus', 'lunarPriestess',
  'emberWyrm', 'stormValkyrie', 'abyssLeviathan', 'radiantGuardian', 'shadowAssassin',
  'terraGolem', 'mistSerpent', 'galeHarpy', 'sunPriestess', 'terraGolem', 'mistSerpent',
  'novaBurst', 'healingLight', 'powerSurge', 'soulHarvest', 'dimensionRift',
  'aegisBlessing', 'shadowBarrier', 'soulDrain', 'novaMirror', 'gravityVeil'
]

export function themeFor(card) {
  return THEMES[card.attr] || THEMES.LIGHT
}

function artDefs(uid, t) {
  return `<defs>
    <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.deep2}"/>
      <stop offset=".55" stop-color="#0a0618"/>
      <stop offset="1" stop-color="#04020c"/>
    </linearGradient>
    <radialGradient id="halo${uid}" cx=".5" cy=".46" r=".56">
      <stop offset="0" stop-color="${t.glow}" stop-opacity=".55"/>
      <stop offset=".45" stop-color="${t.mid}" stop-opacity=".18"/>
      <stop offset="1" stop-color="${t.deep}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.glow}"/>
      <stop offset=".32" stop-color="${t.main}"/>
      <stop offset=".68" stop-color="${t.mid}"/>
      <stop offset="1" stop-color="${t.deep}"/>
    </linearGradient>
    <linearGradient id="wing${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.main}" stop-opacity=".92"/>
      <stop offset=".7" stop-color="${t.mid}" stop-opacity=".55"/>
      <stop offset="1" stop-color="${t.deep}" stop-opacity=".12"/>
    </linearGradient>
    <radialGradient id="core${uid}">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".35" stop-color="${t.glow}"/>
      <stop offset="1" stop-color="${t.mid}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow${uid}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft${uid}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4.2"/>
    </filter>
  </defs>`
}

function stars(seedUid) {
  let out = ''
  const pts = [
    [18, 24, 1.1], [42, 16, .7], [67, 31, .9], [92, 13, .6], [121, 25, .8],
    [149, 17, .55], [177, 29, .95], [30, 54, .55], [58, 66, .75], [150, 60, .6],
    [183, 73, .7], [11, 92, .8], [73, 103, .55], [127, 108, .7], [166, 99, 1],
    [101, 38, .5], [47, 88, .6], [194, 50, .6], [22, 74, .5], [139, 86, .55]
  ]
  for (let i = 0; i < pts.length; i++) {
    const [x, y, r] = pts[i]
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${.22 + (i % 5) * .09}"/>`
  }
  return out
}

function dragonArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M94 64 C74 46 48 33 24 38 C41 50 43 65 33 80 C55 71 72 76 87 91 Z" fill="url(#wing${uid})" opacity=".88"/>
    <path d="M116 61 C129 40 148 25 174 25 C159 42 161 57 173 70 C151 63 135 67 125 80 Z" fill="url(#wing${uid})" opacity=".88"/>
    <path d="M18 112 C39 108 52 96 62 80 C73 62 87 52 102 55 C112 57 118 64 128 65 C145 66 158 55 174 42 C165 62 169 74 188 85 C164 82 149 88 138 100 C126 114 106 121 88 116 C70 111 54 116 40 128 C32 134 25 136 17 135 Z" fill="url(#body${uid})"/>
    <path d="M135 64 l18 -8 -6 13 12 3 -17 8 -9 10 -5 -13 Z" fill="${t.deep}"/>
    <path d="M151 58 l7 -13 1 14 9 2 -8 7 Z" fill="${t.main}" opacity=".85"/>
    <path d="M112 62 l-6 -14 12 8 8 -5 -2 12 Z" fill="${t.main}" opacity=".7"/>
    <circle cx="146" cy="63" r="2.1" fill="#fff"/>
    <path d="M63 82 C48 92 37 96 24 94 C38 100 50 100 61 95" fill="none" stroke="${t.glow}" stroke-width="1.3" opacity=".7"/>
    <path d="M96 109 C107 103 116 94 122 84" fill="none" stroke="${t.glow}" stroke-width="1" opacity=".5"/>
  </g>`
}

function mageArt(uid, t) {
  return `<g>
    <g opacity=".55" stroke="${t.main}" fill="none">
      <circle cx="100" cy="68" r="46" stroke-width=".8" stroke-dasharray="2 6"/>
      <circle cx="100" cy="68" r="37" stroke-width="1.1" opacity=".7"/>
      <path d="M100 23 L133 45 L133 91 L100 113 L67 91 L67 45 Z" stroke-width=".8" opacity=".8"/>
      <path d="M100 31 L126 68 L100 105 L74 68 Z" stroke-width=".6" opacity=".5"/>
    </g>
    <g filter="url(#glow${uid})">
      <path d="M100 42 C88 42 80 51 80 62 C80 74 86 82 92 88 L86 113 L114 113 L108 88 C115 81 120 73 120 62 C120 51 112 42 100 42 Z" fill="url(#body${uid})"/>
      <path d="M85 92 L115 92 L120 113 L80 113 Z" fill="${t.deep}" opacity=".85"/>
      <circle cx="100" cy="58" r="13" fill="${t.deep2}" stroke="${t.main}" stroke-width="1.2"/>
      <path d="M100 50 a8 8 0 0 1 0 16 a5 5 0 0 0 0 -10" fill="${t.glow}" opacity=".9"/>
      <path d="M120 70 L134 42" stroke="${t.main}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="136" cy="38" r="7" fill="url(#core${uid})"/>
      <circle cx="136" cy="38" r="3" fill="#fff"/>
      <path d="M80 72 C68 78 62 86 64 96" stroke="${t.main}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M73 96 l-8 14 M73 96 l6 15 M73 96 l0 16" stroke="${t.glow}" stroke-width="1" opacity=".8"/>
    </g>
    <g fill="${t.glow}" opacity=".9">
      <circle cx="51" cy="38" r="1.5"/><circle cx="151" cy="89" r="1.2"/><circle cx="143" cy="26" r="1"/><circle cx="60" cy="101" r="1.4"/>
    </g>
  </g>`
}

function golemArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M64 112 L58 74 L70 52 L88 46 L112 46 L130 52 L142 74 L136 112 Z" fill="url(#body${uid})"/>
    <path d="M47 60 L57 57 L64 88 L50 93 Z" fill="${t.mid}" opacity=".85"/>
    <path d="M153 60 L143 57 L136 88 L150 93 Z" fill="${t.mid}" opacity=".85"/>
    <path d="M50 93 L64 88 L66 105 L54 110 Z" fill="${t.deep}"/>
    <path d="M150 93 L136 88 L134 105 L146 110 Z" fill="${t.deep}"/>
    <path d="M76 45 L82 28 L118 28 L124 45 Z" fill="${t.mid}"/>
    <rect x="83" y="33" width="34" height="8" rx="2" fill="${t.deep2}" stroke="${t.main}" stroke-width=".8"/>
    <circle cx="92" cy="37" r="1.8" fill="${t.glow}"/><circle cx="108" cy="37" r="1.8" fill="${t.glow}"/>
    <path d="M100 66 L118 82 L109 102 L91 102 L82 82 Z" fill="${t.deep2}" stroke="${t.main}" stroke-width="1.3"/>
    <circle cx="100" cy="84" r="8" fill="url(#core${uid})"/>
    <circle cx="100" cy="84" r="3.2" fill="#fff"/>
    <path d="M72 62 L88 68 M128 62 L112 68 M100 104 L100 112" stroke="${t.glow}" stroke-width=".9" opacity=".6"/>
    <path d="M68 78 L78 82 M132 78 L122 82" stroke="${t.deep}" stroke-width="1.4"/>
  </g>`
}

function phoenixArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M98 72 C80 52 55 35 24 38 C46 52 52 72 44 94 C62 82 84 84 98 98 Z" fill="url(#wing${uid})"/>
    <path d="M102 72 C120 50 147 32 178 36 C156 51 152 72 160 95 C140 82 120 84 102 98 Z" fill="url(#wing${uid})"/>
    <path d="M100 50 C90 58 86 70 89 83 C82 95 78 107 80 120 L92 108 L100 122 L108 107 L121 120 C123 106 118 94 111 83 C114 70 110 58 100 50 Z" fill="url(#body${uid})"/>
    <path d="M100 48 C94 44 91 38 92 32 L99 39 L100 28 L103 39 L110 31 C111 39 106 45 100 48 Z" fill="${t.glow}"/>
    <circle cx="97" cy="48" r="1.5" fill="#fff"/>
    <path d="M82 112 C86 101 91 94 100 88 C109 94 114 101 118 112" stroke="${t.glow}" stroke-width="1.2" fill="none" opacity=".7"/>
    <g stroke="${t.main}" stroke-width="1.4" fill="none" opacity=".8">
      <path d="M42 96 C52 92 58 82 56 72"/><path d="M158 97 C148 92 142 82 144 72"/>
      <path d="M62 108 C72 102 76 92 74 84"/><path d="M138 108 C128 102 124 92 126 84"/>
    </g>
  </g>`
}

function sorceressArt(uid, t) {
  return `<g>
    <path d="M128 26 A40 40 0 1 0 145 96 A32 32 0 1 1 128 26 Z" fill="${t.main}" opacity=".22" filter="url(#soft${uid})"/>
    <path d="M128 32 A38 38 0 1 0 142 96 A30 30 0 1 1 128 32 Z" fill="${t.glow}" opacity=".55"/>
    <g filter="url(#glow${uid})">
      <path d="M100 44 C92 44 86 52 86 62 C86 72 90 78 94 84 L84 113 L116 113 L106 84 C111 78 114 71 114 62 C114 52 108 44 100 44 Z" fill="url(#body${uid})"/>
      <path d="M86 60 C76 66 70 78 72 92 L84 113 L92 86 Z" fill="${t.deep}" opacity=".7"/>
      <path d="M114 60 C124 66 130 78 128 92 L116 113 L108 86 Z" fill="${t.deep}" opacity=".7"/>
      <circle cx="100" cy="56" r="11" fill="${t.deep2}" stroke="${t.main}" stroke-width="1.1"/>
      <path d="M100 48 a8 8 0 0 1 0 16 a5 5 0 0 0 0 -10" fill="${t.glow}"/>
      <path d="M76 82 C70 74 70 64 74 56" stroke="${t.main}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="74" cy="53" r="5" fill="url(#core${uid})"/>
      <path d="M76 112 L100 104 L124 112" stroke="${t.main}" stroke-width="1" fill="none" opacity=".55"/>
    </g>
    <g fill="${t.glow}"><circle cx="55" cy="42" r="1.3"/><circle cx="150" cy="60" r="1"/><circle cx="63" cy="96" r="1.1"/><circle cx="144" cy="104" r="1.4"/></g>
  </g>`
}

function valkyrieArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M100 66 C86 50 66 36 42 38 C58 52 60 68 54 84 C70 75 86 80 98 94 Z" fill="url(#wing${uid})"/>
    <path d="M100 66 C114 50 134 36 158 38 C142 52 140 68 146 84 C130 75 114 80 102 94 Z" fill="url(#wing${uid})"/>
    <path d="M100 42 C93 42 88 48 88 56 L88 64 L112 64 L112 56 C112 48 107 42 100 42 Z" fill="${t.main}"/>
    <path d="M94 45 L86 34 L91 50 L100 31 L109 50 L114 34 L106 45 Z" fill="${t.glow}"/>
    <path d="M100 63 C90 63 84 72 84 84 L78 114 L122 114 L116 84 C116 72 110 63 100 63 Z" fill="url(#body${uid})"/>
    <path d="M84 82 C72 86 66 96 68 108 L84 114 L91 88 Z" fill="${t.deep}" opacity=".75"/>
    <path d="M116 82 C128 86 134 96 132 108 L116 114 L109 88 Z" fill="${t.deep}" opacity=".75"/>
    <rect x="54" y="38" width="3" height="76" rx="1.5" fill="${t.main}" opacity=".9"/>
    <path d="M55.5 32 L48 48 L63 48 Z" fill="${t.glow}"/>
    <path d="M88 70 L112 70 L108 80 L92 80 Z" fill="${t.deep2}" stroke="${t.main}" stroke-width=".8"/>
    <circle cx="97" cy="56" r="1.3" fill="#fff"/><circle cx="103" cy="56" r="1.3" fill="#fff"/>
  </g>`
}

function leviathanArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M16 110 C38 110 48 92 40 76 C33 61 47 45 67 50 C88 56 92 80 112 80 C132 80 138 58 156 50 C174 42 190 54 184 70" fill="none" stroke="url(#body${uid})" stroke-width="13" stroke-linecap="round"/>
    <path d="M16 110 C38 110 48 92 40 76 C33 61 47 45 67 50 C88 56 92 80 112 80 C132 80 138 58 156 50 C174 42 190 54 184 70" fill="none" stroke="${t.glow}" stroke-width="2.4" stroke-linecap="round" opacity=".45"/>
    <path d="M58 48 L48 34 L66 40 L72 28 L78 44 Z" fill="${t.main}" opacity=".85"/>
    <path d="M118 82 L124 100 L134 82 Z" fill="${t.main}" opacity=".8"/>
    <path d="M37 70 L24 58 L36 56 L30 43 L47 54 Z" fill="${t.mid}" opacity=".85"/>
    <path d="M184 70 C190 64 195 64 196 70 C191 76 186 76 182 73 Z" fill="${t.glow}"/>
    <circle cx="184" cy="67" r="1.7" fill="#fff"/>
    <g fill="none" stroke="${t.main}" stroke-width="1" opacity=".55">
      <path d="M54 84 C62 90 62 98 56 104"/><path d="M100 87 C108 94 108 103 102 109"/><path d="M150 59 C158 66 158 75 152 81"/>
    </g>
  </g>`
}

function guardianArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M100 30 C91 30 85 37 85 46 L85 55 L115 55 L115 46 C115 37 109 30 100 30 Z" fill="${t.mid}"/>
    <path d="M92 33 L88 22 L96 30 L100 19 L104 30 L112 22 L108 33 Z" fill="${t.glow}"/>
    <path d="M100 58 C88 58 80 68 80 82 L74 115 L126 115 L120 82 C120 68 112 58 100 58 Z" fill="url(#body${uid})"/>
    <path d="M100 70 L121 78 L118 101 L100 114 L82 101 L79 78 Z" fill="${t.deep2}" stroke="${t.main}" stroke-width="1.4"/>
    <path d="M100 78 L108 88 L100 100 L92 88 Z" fill="${t.glow}" opacity=".9"/>
    <path d="M73 68 L64 88 L73 100 L82 84 Z" fill="${t.mid}" opacity=".8"/>
    <path d="M127 68 L136 88 L127 100 L118 84 Z" fill="${t.mid}" opacity=".8"/>
    <circle cx="96" cy="44" r="1.4" fill="#fff"/><circle cx="104" cy="44" r="1.4" fill="#fff"/>
  </g>`
}

function assassinArt(uid, t) {
  return `<g filter="url(#glow${uid})">
    <path d="M100 36 C88 36 82 46 82 58 L80 82 L90 115 L100 96 L110 115 L120 82 L118 58 C118 46 112 36 100 36 Z" fill="url(#body${uid})" opacity=".92"/>
    <path d="M86 46 C80 39 78 30 82 22 C90 30 94 36 96 44 Z" fill="${t.main}"/>
    <path d="M114 46 C120 39 122 30 118 22 C110 30 106 36 104 44 Z" fill="${t.main}"/>
    <path d="M92 54 L100 50 L108 54 L104 60 L96 60 Z" fill="${t.deep2}"/>
    <circle cx="96" cy="55" r="1.4" fill="${t.glow}"/><circle cx="104" cy="55" r="1.4" fill="${t.glow}"/>
    <path d="M70 112 C78 92 76 74 66 60" stroke="${t.main}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M60 58 L66 44 L72 58 L66 54 Z" fill="${t.glow}"/>
    <path d="M130 112 C122 92 124 74 134 60" stroke="${t.main}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M128 58 L134 44 L140 58 L134 54 Z" fill="${t.glow}"/>
    <path d="M100 88 L100 112" stroke="${t.glow}" stroke-width="1" opacity=".5"/>
  </g>`
}

function spellArt(uid, t) {
  return `<g>
    <circle cx="100" cy="70" r="48" fill="url(#halo${uid})" opacity=".8"/>
    <g stroke="${t.main}" fill="none" filter="url(#glow${uid})">
      <circle cx="100" cy="70" r="40" stroke-width="1" stroke-dasharray="3 7"/>
      <circle cx="100" cy="70" r="30" stroke-width="1.2" opacity=".8"/>
      <path d="M100 40 L112 58 L130 70 L112 82 L100 100 L88 82 L70 70 L88 58 Z" stroke-width="1.1" opacity=".9"/>
      <path d="M100 52 L108 64 L120 70 L108 76 L100 88 L92 76 L80 70 L92 64 Z" stroke-width=".8" opacity=".7"/>
    </g>
    <path d="M70 96 C62 80 70 56 88 48 C78 66 80 86 94 100 C84 106 76 104 70 96 Z" fill="${t.main}" opacity=".7" filter="url(#soft${uid})"/>
    <path d="M132 44 C140 60 132 84 114 92 C124 74 122 54 108 40 C118 34 126 36 132 44 Z" fill="${t.glow}" opacity=".55" filter="url(#soft${uid})"/>
    <circle cx="100" cy="70" r="9" fill="url(#core${uid})"/>
    <circle cx="100" cy="70" r="3" fill="#fff"/>
    <g fill="${t.glow}"><circle cx="40" cy="48" r="1.5"/><circle cx="156" cy="42" r="1.2"/><circle cx="164" cy="98" r="1.4"/><circle cx="44" cy="104" r="1"/></g>
  </g>`
}

function trapArt(uid, t) {
  return `<g>
    <circle cx="100" cy="70" r="48" fill="url(#halo${uid})" opacity=".8"/>
    <g filter="url(#glow${uid})">
      <path d="M100 28 L136 49 L136 91 L100 112 L64 91 L64 49 Z" fill="${t.deep2}" stroke="${t.main}" stroke-width="1.3"/>
      <path d="M100 40 L126 55 L126 85 L100 100 L74 85 L74 55 Z" fill="none" stroke="${t.main}" stroke-width=".8" stroke-dasharray="2 4" opacity=".7"/>
      <path d="M72 70 C84 54 116 54 128 70 C116 86 84 86 72 70 Z" fill="${t.deep}" stroke="${t.main}" stroke-width="1.2"/>
      <circle cx="100" cy="70" r="9" fill="${t.glow}" opacity=".85"/>
      <circle cx="100" cy="70" r="4" fill="${t.deep2}"/>
      <circle cx="100" cy="70" r="1.5" fill="#fff"/>
      <path d="M64 49 L52 34 M136 49 L148 34 M64 91 L52 106 M136 91 L148 106" stroke="${t.main}" stroke-width="1.1" opacity=".7"/>
    </g>
    <g fill="${t.glow}" opacity=".8"><circle cx="42" cy="60" r="1.2"/><circle cx="158" cy="62" r="1.2"/><circle cx="52" cy="116" r="1"/><circle cx="150" cy="118" r="1"/></g>
  </g>`
}

const ART_FNS = {
  dragon: dragonArt, mage: mageArt, golem: golemArt, phoenix: phoenixArt,
  sorceress: sorceressArt, valkyrie: valkyrieArt, leviathan: leviathanArt,
  guardian: guardianArt, assassin: assassinArt, spell: spellArt, trap: trapArt
}

export function artSvg(card, uid = 'x') {
  const t = themeFor(card)
  const fn = ART_FNS[card.art] || spellArt
  return `<svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${card.name} artwork">
    ${artDefs(uid, t)}
    <rect width="200" height="140" fill="url(#bg${uid})"/>
    <ellipse cx="100" cy="72" rx="92" ry="62" fill="url(#halo${uid})"/>
    ${stars(uid)}
    ${fn(uid, t)}
    <rect width="200" height="140" fill="none" stroke="${t.main}" stroke-opacity=".22" stroke-width="1.2"/>
  </svg>`
}

export function cardBackMarkup() {
  return '<div class="card cardback"><div class="card-inner"></div></div>'
}

export function levelStars(level) {
  return '★'.repeat(Math.max(0, level || 0))
}
