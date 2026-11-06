// Règles du jeu (spec §2), sans DOM ni stockage ni hasard (ADR-0003) : elles rendent des noms de signe, de résultat ou de version

// D1 : les signes dans l'ordre du nom du jeu ; les victoires dans l'ordre du README (le texte des règles suit cet ordre)
export const SIGNS = {
  original: ['rock', 'paper', 'scissors'],
  bonus: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
}

export const RULES = {
  original: [['paper', 'rock'], ['rock', 'scissors'], ['scissors', 'paper']],
  bonus: [
    ['scissors', 'paper'], ['paper', 'rock'], ['rock', 'lizard'], ['lizard', 'spock'], ['spock', 'scissors'],
    ['scissors', 'lizard'], ['paper', 'spock'], ['rock', 'scissors'], ['lizard', 'paper'], ['spock', 'rock'],
  ],
}

// Les victoires de l'original sont aussi celles de Lizard-Spock : une seule table suffit
export const beats = (winner, loser) => RULES.bonus.some(([w, l]) => w === winner && l === loser)

// D2
export function outcome(mine, house) {
  if (mine === house) return 'draw'
  return beats(mine, house) ? 'win' : 'lose'
}

export function nextScore(score, result) {
  if (result === 'win') return score + 1
  if (result === 'lose') return score - 1
  return score
}

// D3 : le n-ième signe, n = ⌊ tirage × nombre de signes ⌋ ; le tirage (entre 0 et 1) vient de l'appelant
export function housePick(version, draw) {
  const signs = SIGNS[version]
  return signs[Math.min(signs.length - 1, Math.floor(draw * signs.length))]
}

// D5 : un entier sûr écrit en base 10, sinon 0 ; « bonus », sinon « original »
export function readScore(raw) {
  if (typeof raw !== 'string' || !/^-?\d+$/.test(raw)) return 0
  const value = Number(raw)
  return Number.isSafeInteger(value) ? value : 0
}

export const readVersion = (raw) => (raw === 'bonus' ? 'bonus' : 'original')
