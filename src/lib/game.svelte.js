// État du jeu (ADR-0006) et valeurs gardées (ADR-0007)
import { outcome, housePick, nextScore, readScore, readVersion } from './rules.js'
import { NAMES, VERSIONS, SAID } from './signs.js'
import { announce } from './announce.svelte.js'

const KEYS = { version: 'rps/version', original: 'rps/score/original', bonus: 'rps/score/bonus' }

// stockage indisponible (navigation privée stricte) : le jeu marche sans garder
function read(key) {
  try { return localStorage.getItem(key) } catch { return null }
}
function write(key, value) {
  try { localStorage.setItem(key, String(value)) } catch { /* rien à garder */ }
}

export const game = $state({
  version: readVersion(read(KEYS.version)),
  scores: { original: readScore(read(KEYS.original)), bonus: readScore(read(KEYS.bonus)) },
  // étapes de D4 : 1 choisir, 2 mon signe, 3 le signe de la maison, 4 le résultat
  step: 1,
  mine: null,
  house: null,
  result: null,
  // après « Play Again », le jeton choisi reprend le focus
  refocus: false,
})

const PICKED = 1000
const REVEALED = 500
let timer

// D3, D4 : la maison tire tout de suite, un tirage par partie ; le résultat vient 1,5 s plus tard
export function pick(sign) {
  if (game.step !== 1) return
  game.mine = sign
  game.house = housePick(game.version, Math.random())
  game.result = null
  game.refocus = false
  game.step = 2
  timer = setTimeout(() => {
    game.step = 3
    timer = setTimeout(finish, REVEALED)
  }, PICKED)
}

function finish() {
  const result = outcome(game.mine, game.house)
  const score = nextScore(game.scores[game.version], result)
  game.scores[game.version] = score
  write(KEYS[game.version], score)
  game.result = result
  game.step = 4
  announce(`You picked ${NAMES[game.mine]}, the house picked ${NAMES[game.house]}: ${SAID[result]}. Score ${score}`)
}

export function playAgain() {
  clearTimeout(timer)
  game.step = 1
  game.house = null
  game.result = null
  game.refocus = true
}

// D6 : seulement à l'étape 1
export function switchVersion() {
  if (game.step !== 1) return
  game.version = game.version === 'original' ? 'bonus' : 'original'
  game.refocus = false
  write(KEYS.version, game.version)
  announce(`${VERSIONS[game.version].name}. Score ${game.scores[game.version]}`)
}
