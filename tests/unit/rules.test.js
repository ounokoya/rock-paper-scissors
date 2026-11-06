import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { SIGNS, RULES, beats, outcome, housePick, nextScore, readScore, readVersion } from '../../src/lib/rules.js'

// Spec §8 — U1 à U5 : règles du jeu (§2) sans navigateur ; signes, résultats et versions sont des noms

const README = {
  original: [['paper', 'rock'], ['rock', 'scissors'], ['scissors', 'paper']],
  bonus: [['scissors', 'paper'], ['paper', 'rock'], ['rock', 'lizard'], ['lizard', 'spock'], ['spock', 'scissors'], ['scissors', 'lizard'], ['paper', 'spock'], ['rock', 'scissors'], ['lizard', 'paper'], ['spock', 'rock']],
}
const VERSIONS = ['original', 'bonus']
const RESULTS = ['win', 'lose', 'draw']

test('U1 — D1 : les signes dans l\'ordre du nom du jeu, les victoires dans l\'ordre du README', () => {
  assert.deepEqual(SIGNS, { original: ['rock', 'paper', 'scissors'], bonus: ['rock', 'paper', 'scissors', 'lizard', 'spock'] })
  assert.deepEqual(RULES, README)
})

test('U1 — D1, D2 : résultat de chaque paire (9 et 25) ; chaque signe en bat 1 (Original) ou 2 (Lizard-Spock) ; jamais les deux sens', () => {
  for (const version of VERSIONS) {
    for (const a of SIGNS[version]) {
      const wins = SIGNS[version].filter((b) => beats(a, b))
      assert.equal(wins.length, version === 'original' ? 1 : 2, `${a} bat ${wins.join(', ')}`)
      for (const b of SIGNS[version]) {
        const expected = a === b ? 'draw' : README[version].some(([w, l]) => w === a && l === b) ? 'win' : 'lose'
        assert.equal(outcome(a, b), expected, `${a} contre ${b}`)
        assert.ok(!(beats(a, b) && beats(b, a)), `${a} et ${b}`)
      }
    }
  }
})

test('U2 — D3 : la maison prend le n-ième signe, n = ⌊ tirage × nombre de signes ⌋', () => {
  for (const version of VERSIONS) {
    const n = SIGNS[version].length
    SIGNS[version].forEach((sign, k) => {
      assert.equal(housePick(version, k / n), sign, `${version} ${k} / ${n}`)
      assert.equal(housePick(version, (k + 0.5) / n), sign)
      assert.equal(housePick(version, (k + 1) / n - 1e-9), sign)
    })
    assert.equal(housePick(version, 0), SIGNS[version][0])
    assert.equal(housePick(version, 0.999999), SIGNS[version].at(-1))
  }
})

test('U2 — D3 : sur 30 000 tirages, chaque signe sort avec la même chance', () => {
  for (const [version, [min, max]] of [['original', [0.30, 0.37]], ['bonus', [0.18, 0.22]]]) {
    const counts = Object.fromEntries(SIGNS[version].map((s) => [s, 0]))
    for (let i = 0; i < 30_000; i++) counts[housePick(version, Math.random())]++
    for (const [s, c] of Object.entries(counts)) assert.ok(c / 30_000 >= min && c / 30_000 <= max, `${version} ${s} : ${(c / 300).toFixed(1)} %`)
  }
})

test('U3 — D2 : +1 pour une victoire, −1 pour une défaite, inchangé à l\'égalité, y compris sous 0', () => {
  assert.equal(nextScore(12, 'win'), 13)
  assert.equal(nextScore(12, 'lose'), 11)
  assert.equal(nextScore(12, 'draw'), 12)
  assert.equal(nextScore(0, 'lose'), -1)
  assert.equal(nextScore(-1, 'lose'), -2)
  assert.equal(nextScore(-1, 'win'), 0)
})

test('U4 — D5 : lecture des valeurs gardées', () => {
  for (const [raw, value] of [['12', 12], ['0', 0], ['-3', -3], ['', 0], ['abc', 0], ['1.5', 0], ['12abc', 0], [' 4', 0], [null, 0], [undefined, 0], ['99999999999999999999', 0]]) {
    assert.equal(readScore(raw), value, JSON.stringify(raw))
  }
  for (const [raw, value] of [['bonus', 'bonus'], ['original', 'original'], ['spock', 'original'], ['', 'original'], [null, 'original'], ['BONUS', 'original']]) {
    assert.equal(readVersion(raw), value, JSON.stringify(raw))
  }
})

test('U5 — les règles rendent des noms (signe, résultat, version), jamais une couleur ni une taille', () => {
  const names = new Set([...SIGNS.bonus, ...RESULTS, ...VERSIONS])
  for (const version of VERSIONS) {
    for (const a of SIGNS[version]) for (const b of SIGNS[version]) assert.ok(names.has(outcome(a, b)))
    for (let k = 0; k < 10; k++) assert.ok(names.has(housePick(version, k / 10)))
  }
  for (const raw of ['bonus', 'x', null]) assert.ok(names.has(readVersion(raw)))
  const source = readFileSync(new URL('../../src/lib/rules.js', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '')
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch)\(|\b\d+(\.\d+)?(px|rem|em|%)\b/i)
})
