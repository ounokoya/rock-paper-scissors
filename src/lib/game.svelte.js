// État du jeu et déroulé d'une partie (ADR-0006) ; les valeurs gardées passent par storage.js (ADR-0007)
import { outcome, housePick, nextScore } from './rules.js'
import { loadVersion, loadScores, saveScore, saveVersion } from './storage.js'
import { NAMES, VERSIONS, SAID } from './signs.js'
import { announce } from './announce.svelte.js'

export const game = $state({
  version: loadVersion(),
  scores: loadScores(),
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
  saveScore(game.version, score)
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
  saveVersion(game.version)
  announce(`${VERSIONS[game.version].name}. Score ${game.scores[game.version]}`)
}
