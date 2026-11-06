import { expect } from '@playwright/test'
import { PNG } from 'pngjs'

// Les tests ne s'appuient que sur la spec (specs/specifications/rock-paper-scissors.md) : rôles et noms accessibles (§7),
// règles (§2 : D1 à D7), clés gardées (D5), positions (§5), états (§6) ; jamais sur des classes.

// D1 : signes dans l'ordre du nom du jeu, victoires du README (dans son ordre)
export const SIGNS = { original: ['Rock', 'Paper', 'Scissors'], bonus: ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'] }
export const RULES = {
  original: [['Paper', 'Rock'], ['Rock', 'Scissors'], ['Scissors', 'Paper']],
  bonus: [['Scissors', 'Paper'], ['Paper', 'Rock'], ['Rock', 'Lizard'], ['Lizard', 'Spock'], ['Spock', 'Scissors'], ['Scissors', 'Lizard'], ['Paper', 'Spock'], ['Rock', 'Scissors'], ['Lizard', 'Paper'], ['Spock', 'Rock']],
}
// A3 : ordre de lecture des jetons de l'étape 1
export const ORDER = { original: ['Paper', 'Scissors', 'Rock'], bonus: ['Scissors', 'Paper', 'Rock', 'Lizard', 'Spock'] }
// D2
export const outcome = (version, mine, theirs) => mine === theirs ? 'draw' : RULES[version].some(([w, l]) => w === mine && l === theirs) ? 'win' : 'lose'
export const HEADING = { win: 'You Win', lose: 'You Lose', draw: 'Draw' }
export const SAID = { win: 'you win', lose: 'you lose', draw: 'draw' }
export const announce = (mine, theirs, result, score) => `You picked ${mine}, the house picked ${theirs}: ${SAID[result]}. Score ${score}`
// étape 2 : le choix annoncé pendant que la maison choisit (v1.0.4)
export const announcePick = (mine) => `You picked ${mine}. The house is picking.`
// D5, §3, §7
export const KEYS = { version: 'rps/version', original: 'rps/score/original', bonus: 'rps/score/bonus' }
export const LOGO = { original: 'Rock Paper Scissors', bonus: 'Rock Paper Scissors Lizard Spock' }
export const TITLE = { original: 'Rock, Paper, Scissors', bonus: 'Rock, Paper, Scissors, Lizard, Spock' }
export const SWITCH = { original: 'Switch to Lizard-Spock', bonus: 'Switch to Original' }
export const VERSION_NAME = { original: 'Original', bonus: 'Lizard-Spock' }

// D3 : la maison prend le n-ième signe de D1, n = ⌊ Math.random() × nombre de signes ⌋.
// Le test remplace Math.random dans la page (avant tout script de l'app) : les tirages mis en file passent d'abord.
function fakeRandom() {
  const real = Math.random.bind(Math)
  Math.random = () => (globalThis.__draws?.length ? globalThis.__draws.shift() : real())
}
export const drawFor = (version, sign) => (SIGNS[version].indexOf(sign) + 0.5) / SIGNS[version].length
export async function houseWill(page, version, ...signs) {
  for (const s of signs) if (!SIGNS[version].includes(s)) throw new Error(`${s} n'est pas un signe de ${version}`)
  await page.evaluate((v) => { globalThis.__draws = (globalThis.__draws ?? []).concat(v) }, signs.map((s) => drawFor(version, s)))
}

// Ouvre le jeu ; values : valeurs gardées (D5) écrites telles quelles ; clock : horloge de la page arrêtée, avancée par le test
export async function open(page, width, height = 900, { version, original, bonus, raw, clock = false, motion } = {}) {
  await page.setViewportSize({ width, height })
  if (motion) await page.emulateMedia({ reducedMotion: motion })
  await page.addInitScript(fakeRandom)
  if (clock) await page.clock.install({ time: new Date('2026-11-06T10:00:00') })
  await page.goto('./')
  const values = raw ?? { [KEYS.version]: version, [KEYS.original]: original, [KEYS.bonus]: bonus }
  await page.evaluate((v) => { localStorage.clear(); for (const [k, x] of Object.entries(v)) if (x !== undefined && x !== null) localStorage.setItem(k, String(x)) }, values)
  await page.reload()
  await page.evaluate(() => document.fonts.ready)
  if (clock) await page.clock.pauseAt(new Date('2026-11-06T11:00:00'))
}
export const stored = (page) => page.evaluate((k) => Object.fromEntries(Object.entries(k).map(([n, key]) => [n, localStorage.getItem(key)])), KEYS)

export const banner = (page) => page.getByRole('banner')
export const main = (page) => page.getByRole('main')
export const logo = (page) => banner(page).getByRole('heading', { level: 1 }).getByRole('img')
export const token = (page, sign) => main(page).getByRole('button', { name: sign, exact: true })
export const picked = (page) => main(page).getByRole('figure', { name: 'You Picked', exact: true })
export const housePicked = (page) => main(page).getByRole('figure', { name: 'The House Picked', exact: true })
export const result = (page) => main(page).getByRole('heading', { level: 2, name: /^(You Win|You Lose|Draw)$/ })
export const button = (scope, name) => scope.getByRole('button', { name, exact: true })
export const playAgain = (page) => button(page, 'Play Again')
export const rulesButton = (page) => button(page, 'Rules')
export const switchButton = (page, version) => button(page, SWITCH[version])
export const rules = (page) => page.getByRole('dialog', { name: 'Rules', exact: true })
export const closeRules = (page) => button(rules(page), 'Close rules')
export const status = (page) => page.getByRole('status')

// Le score affiché : « Score » suivi du nombre (le signe moins peut être « - » ou « − »)
export const expectScore = (page, n) => expect(banner(page)).toHaveText(new RegExp(`Score\\s*${n < 0 ? '[-−]' : ''}${Math.abs(n)}\\s*$`))

// Étapes (D4), reconnues à leur contenu (§3)
export async function expectStep(page, step, { version = 'original', mine, theirs } = {}) {
  if (step === 1) {
    for (const s of ORDER[version]) await expect(token(page, s)).toBeVisible()
    await expect(picked(page)).toHaveCount(0)
    return
  }
  await expect(picked(page).getByRole('img', { name: mine, exact: true })).toBeVisible()
  for (const s of SIGNS[version]) await expect(token(page, s)).toHaveCount(0)
  if (step === 2) await expect(housePicked(page).getByRole('img')).toHaveCount(0)
  else await expect(housePicked(page).getByRole('img', { name: theirs, exact: true })).toBeVisible()
  if (step === 4) await expect(result(page)).toHaveText(HEADING[outcome(version, mine, theirs)])
  else await expect(result(page)).toHaveCount(0)
}

// Une partie à la souris, menée jusqu'à l'étape 4 (horloge arrêtée : clock ; sinon le rythme réel)
export async function play(page, version, mine, theirs, { clock = false } = {}) {
  await houseWill(page, version, theirs)
  await token(page, mine).click()
  if (clock) await page.clock.runFor(1500)
  await expect(result(page)).toHaveText(HEADING[outcome(version, mine, theirs)])
}

// Le focus est-il dans cet élément ?
export const focusWithin = (locator) => locator.evaluate((el) => el.contains(document.activeElement) && document.activeElement !== document.body)
// Fin des animations en cours
export const settled = (page) => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))

// Boîte dans la page, arrondie au demi-pixel
export const pageBox = (locator) => locator.evaluate((el) => {
  const b = el.getBoundingClientRect(); const r = (v) => Math.round(v * 2) / 2
  return { x: r(b.x + scrollX), y: r(b.y + scrollY), width: r(b.width), height: r(b.height) }
})
export function near(actual, expected, what, tol = 2) {
  expect(actual, `${what} introuvable`).not.toBeNull()
  for (const [k, v] of Object.entries(expected)) expect.soft(Math.abs(actual[k] - v), `${what} ${k} : ${actual[k]} au lieu de ${v}`).toBeLessThanOrEqual(tol)
}
export const center = (b) => ({ cx: b.x + b.width / 2, cy: b.y + b.height / 2 })

// Encre : boîte des pixels qui passent le test dans une région de la fenêtre (page non défilée)
export const lum = (c) => (c[0] + c[1] + c[2]) / 3
export const WHITE = (c) => lum(c) > 215
export const DARK = (c) => lum(c) < 120
export const SATURATED = (c) => Math.max(...c) - Math.min(...c) > 90 && Math.max(...c) > 150
export const NOT_WHITE = (c) => lum(c) < 235
export async function ink(page, { x, y, width, height }, test) {
  const clip = { x: Math.max(0, Math.floor(x)), y: Math.max(0, Math.floor(y)), width: Math.ceil(width), height: Math.ceil(height) }
  const png = PNG.sync.read(await page.screenshot({ clip }))
  let a = Infinity, b = Infinity, e = -1, f = -1
  for (let j = 0; j < png.height; j++) for (let i = 0; i < png.width; i++) {
    const k = (j * png.width + i) * 4
    if (test([png.data[k], png.data[k + 1], png.data[k + 2]])) { a = Math.min(a, i); b = Math.min(b, j); e = Math.max(e, i); f = Math.max(f, j) }
  }
  return e < 0 ? null : { x: clip.x + a, y: clip.y + b, width: e - a + 1, height: f - b + 1 }
}
export async function count(page, clip, test) {
  const png = PNG.sync.read(await page.screenshot({ clip }))
  let n = 0
  for (let k = 0; k < png.data.length; k += 4) if (test([png.data[k], png.data[k + 1], png.data[k + 2]])) n++
  return n
}
export async function pixel(page, x, y) {
  const shot = PNG.sync.read(await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 } }))
  return [shot.data[0], shot.data[1], shot.data[2]]
}
// Encre d'un élément : sa boîte, élargie de m px
export const inkOf = async (page, locator, test, m = 4) => { const b = await pageBox(locator); return ink(page, { x: b.x - m, y: b.y - m, width: b.width + 2 * m, height: b.height + 2 * m }, test) }

export const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
export const overlap = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

// Part des pixels dont un canal diffère de plus de 40 (mesure du SDL-FM), contre une maquette JPG décodée par le navigateur :
// sur tout l'écran et par zone ({ nom: { x, y, width, height, minus } }), hors des rectangles exclus (ce que la maquette ne dessine pas)
export async function compare(page, screenshot, jpg, { exclude = [], zones = {} } = {}) {
  return page.evaluate(async ([a, b, exclude, zones]) => {
    const load = async (src) => { const im = new Image(); im.src = src; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data } }
    const A = await load(a), B = await load(b)
    if (A.w !== B.w || A.h !== B.h) throw new Error(`capture ${A.w}×${A.h} ≠ maquette ${B.w}×${B.h}`)
    const inside = (r, x, y) => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height
    const names = Object.keys(zones)
    const seen = Object.fromEntries(names.map((n) => [n, 0])), off = Object.fromEntries(names.map((n) => [n, 0]))
    let total = 0, counted = 0
    for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
      if (exclude.some((r) => inside(r, x, y))) continue
      const i = (y * A.w + x) * 4
      const differs = Math.max(Math.abs(A.d[i] - B.d[i]), Math.abs(A.d[i + 1] - B.d[i + 1]), Math.abs(A.d[i + 2] - B.d[i + 2])) > 40
      counted++
      if (differs) total++
      for (const n of names) {
        const z = zones[n]
        if (!inside(z, x, y) || (z.minus ?? []).some((r) => inside(r, x, y))) continue
        seen[n]++
        if (differs) off[n]++
      }
    }
    return { total: total / counted, zones: Object.fromEntries(names.filter((n) => seen[n]).map((n) => [n, off[n] / seen[n]])) }
  }, [`data:image/png;base64,${screenshot.toString('base64')}`, `data:image/jpeg;base64,${jpg.toString('base64')}`, exclude, zones])
}
