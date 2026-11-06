import { test, expect } from '@playwright/test'
import { open, outcome, announce, LOGO, TITLE, houseWill, stored, main, logo, token, playAgain, rulesButton, switchButton, rules, closeRules, status, expectScore, expectStep, focusWithin, settled, lum, pixel, count, ink, pageBox, WHITE } from './helpers.js'

// Spec §6 et §8 — en tête, les parties menées au bout (S1 à la souris et au doigt, S2 au clavier seul, S3 règles, S4 versions),
// à 375, 768 et 1440 px ; puis survols et focus (S14), mouvements (S15)

const WIDTHS = { 375: 750, 768: 1024, 1440: 900 }
// Étape 4 (§5) : centres des jetons et rayon ; à 1440, la mise en page de 1366 décalée de 37 px
const STEP4 = { 375: { r: 64.5, mine: [94, 292], house: [282, 292] }, 768: { r: 145.5, mine: [201.5, 511], house: [566.5, 511] }, 1440: { r: 145.5, mine: [387, 511], house: [1032, 511] } }
// Halos (D7) : un point à 1,3 rayon du centre de chaque jeton, vers le bord de la page
const haloPoints = (w) => { const s = STEP4[w]; return { mine: [s.mine[0] - 1.3 * s.r, s.mine[1]], house: [s.house[0] + 1.3 * s.r, s.house[1]] } }
// D2 : points d'une partie. Play Again ne remet pas le score à zéro : le score attendu se cumule d'une partie à l'autre
const POINTS = { win: 1, lose: -1, draw: 0 }
// trois parties de suite : victoire (0 → 1), défaite (1 → 0), égalité (0 → 0)
const GAMES = [['Paper', 'Rock'], ['Scissors', 'Rock'], ['Rock', 'Rock']]

for (const [w, h] of Object.entries(WIDTHS)) {
  const width = Number(w)

  test(`S1 — souris, ${w} px : gagner, perdre, égalité, chaque fois Play Again ; étapes dans l'ordre, score à l'écran et gardé, halos du gagnant`, async ({ page }) => {
    // horloge de la page avancée par le test : chaque étape est vue à coup sûr (le rythme est vérifié par S10)
    await open(page, width, h, { clock: true })
    await expectScore(page, 0)
    const light = {}
    let score = 0
    const shown = []
    for (const [mine, theirs] of GAMES) {
      const result = outcome('original', mine, theirs)
      score += POINTS[result]
      await houseWill(page, 'original', theirs)
      await token(page, mine).click()
      await expectStep(page, 2, { mine })
      await page.clock.runFor(1000)
      await expectStep(page, 3, { mine, theirs })
      await page.clock.runFor(500)
      await expectStep(page, 4, { mine, theirs })
      await expectScore(page, score)
      expect((await stored(page)).original).toBe(String(score))
      await settled(page)
      const p = haloPoints(width)
      light[result] = { mine: lum(await pixel(page, ...p.mine)), house: lum(await pixel(page, ...p.house)) }
      await playAgain(page).click()
      await expectStep(page, 1)
      // Play Again garde le score
      await expectScore(page, score)
      shown.push(score)
    }
    expect(shown, 'scores cumulés après chaque partie').toEqual([1, 0, 0])
    // plus clair derrière le gagnant qu'à l'égalité (aucun halo), pareil du côté perdant
    expect(light.win.mine - light.draw.mine, 'halo derrière mon jeton gagnant').toBeGreaterThan(8)
    expect(Math.abs(light.win.house - light.draw.house), 'pas de halo derrière la maison perdante').toBeLessThanOrEqual(3)
    expect(light.lose.house - light.draw.house, 'halo derrière la maison gagnante').toBeGreaterThan(8)
    expect(Math.abs(light.lose.mine - light.draw.mine), 'pas de halo derrière mon jeton perdant').toBeLessThanOrEqual(3)
  })

  test(`S2 — clavier seul, ${w} px : trois parties (Entrée, Espace), focus sur Play Again puis sur le jeton choisi, résultats annoncés`, async ({ page }) => {
    await open(page, width, h, { clock: true })
    await houseWill(page, 'original', 'Rock', 'Rock', 'Rock')
    await page.keyboard.press('Tab')
    await expect(token(page, 'Paper')).toBeFocused()
    const keys = { Paper: 'Enter', Scissors: 'Space', Rock: 'Enter' }
    let score = 0
    for (const [mine, theirs] of GAMES) {
      const r = outcome('original', mine, theirs)
      score += POINTS[r]
      await expect(token(page, mine)).toBeFocused()
      await page.keyboard.press(keys[mine])
      await expectStep(page, 2, { mine })
      // le focus n'est pas perdu : il est dans la zone du jeu
      await expect.poll(() => focusWithin(main(page))).toBe(true)
      await page.clock.runFor(1500)
      await expect(playAgain(page)).toBeFocused()
      await expectStep(page, 4, { mine, theirs })
      await expect(status(page)).toHaveText(announce(mine, theirs, r, score))
      await expectScore(page, score)
      expect((await stored(page)).original).toBe(String(score))
      await page.keyboard.press('Enter')
      await expectStep(page, 1)
      await expect(token(page, mine)).toBeFocused()
      if (mine !== 'Rock') await page.keyboard.press('Tab')
    }
  })

  test(`S3 — clavier seul, ${w} px : règles ouvertes, Tab reste dedans, fermées par Échap puis par la croix ; ouvertes pendant une partie, qui continue`, async ({ page }) => {
    await open(page, width, h, { clock: true })
    // étape 1 : Paper, Scissors, Rock, choix de version, Rules
    for (let i = 0; i < 5; i++) await page.keyboard.press('Tab')
    await expect(rulesButton(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(rules(page)).toBeVisible()
    await expect(rules(page)).toBeFocused()
    for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab']) {
      await page.keyboard.press(key)
      expect(await focusWithin(rules(page)), `focus dans les règles après ${key}`).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(rules(page)).toBeHidden()
    await expect(rulesButton(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(rules(page)).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(closeRules(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(rules(page)).toBeHidden()
    await expect(rulesButton(page)).toBeFocused()
    // pendant une partie : Rock choisi, les règles ouvertes à l'étape 2 ; la partie continue derrière, le focus reste dans les règles
    await houseWill(page, 'original', 'Scissors')
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Shift+Tab')
    await expect(token(page, 'Rock')).toBeFocused()
    await page.keyboard.press('Enter')
    await expectStep(page, 2, { mine: 'Rock' })
    await page.keyboard.press('Tab')
    await expect(rulesButton(page)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(rules(page)).toBeFocused()
    await page.clock.runFor(1500)
    expect(await focusWithin(rules(page)), 'focus resté dans les règles à l\'étape 4').toBe(true)
    await page.keyboard.press('Escape')
    await expect(rulesButton(page)).toBeFocused()
    await expectStep(page, 4, { mine: 'Rock', theirs: 'Scissors' })
    await expectScore(page, 1)
    await expect(status(page)).toHaveText(announce('Rock', 'Scissors', 'win', 1))
  })

  test(`S4 — clavier seul, ${w} px : passer à Lizard-Spock, gagner Lizard contre Spock, revenir à Original ; version et scores gardés`, async ({ page }) => {
    await open(page, width, h, { original: 2 })
    await expectScore(page, 2)
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab')
    await expect(switchButton(page, 'original')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(switchButton(page, 'bonus')).toBeFocused()
    await expectStep(page, 1, { version: 'bonus' })
    await expect(logo(page)).toHaveAccessibleName(LOGO.bonus)
    await expect(page).toHaveTitle(TITLE.bonus)
    await expectScore(page, 0)
    await expect(status(page)).toHaveText('Lizard-Spock. Score 0')
    expect((await stored(page)).version).toBe('bonus')
    // Lizard : deux places avant le choix de version (Scissors, Paper, Rock, Lizard, Spock, choix, Rules)
    await houseWill(page, 'bonus', 'Spock')
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Shift+Tab')
    await expect(token(page, 'Lizard')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(playAgain(page)).toBeFocused()
    await expectStep(page, 4, { version: 'bonus', mine: 'Lizard', theirs: 'Spock' })
    await expect(status(page)).toHaveText(announce('Lizard', 'Spock', 'win', 1))
    await expectScore(page, 1)
    await page.keyboard.press('Enter')
    await expect(token(page, 'Lizard')).toBeFocused()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(switchButton(page, 'bonus')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(switchButton(page, 'original')).toBeFocused()
    await expectStep(page, 1)
    await expect(logo(page)).toHaveAccessibleName(LOGO.original)
    await expect(page).toHaveTitle(TITLE.original)
    await expectScore(page, 2)
    await expect(status(page)).toHaveText('Original. Score 2')
    expect(await stored(page)).toEqual({ version: 'original', original: '2', bonus: '1' })
    // rechargement : la version et les deux scores retrouvés
    await page.reload()
    await expectScore(page, 2)
    await switchButton(page, 'original').focus()
    await page.keyboard.press('Enter')
    await expectScore(page, 1)
    await page.reload()
    await expect(logo(page)).toHaveAccessibleName(LOGO.bonus)
    await expectScore(page, 1)
  })
}

// S3 : à la fermeture, le navigateur rend le focus à « Rules » ; l'événement close, qui arrive après, ne doit pas le reprendre
// si le focus a déjà bougé (course vue sur le site en ligne)
test('S3 — règles fermées par la croix, focus déplacé aussitôt : il n\'est pas repris par « Rules »', async ({ page }) => {
  await open(page, 1366, 768)
  await rulesButton(page).focus()
  await page.keyboard.press('Enter')
  await expect(rules(page)).toBeFocused()
  const other = await switchButton(page, 'original').elementHandle()
  await closeRules(page).evaluate((close, next) => { close.click(); next.focus() }, other)
  await expect(rules(page)).toBeHidden()
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)))
  await expect(switchButton(page, 'original')).toBeFocused()
})

// S3 : rouvrir les règles aussitôt après les avoir fermées : l'événement close de la fenêtre fermée ne referme pas la nouvelle
test('S3 — règles fermées puis rouvertes aussitôt : la nouvelle fenêtre reste ouverte', async ({ page }) => {
  await open(page, 1366, 768)
  await rulesButton(page).click()
  await expect(rules(page)).toBeVisible()
  const reopen = await rulesButton(page).elementHandle()
  await closeRules(page).evaluate((close, button) => { close.click(); button.click() }, reopen)
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)))
  await expect(rules(page)).toBeVisible()
  await expect(rules(page)).toBeFocused()
})

// A7 : Tab de bout en bout, jamais un nombre fixe de tabulations ; chaque arrêt a son contour de focus
async function tabRound(page) {
  const stops = []
  for (let i = 0; i < 20; i++) {
    const stop = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const s = getComputedStyle(el)
      return { name: el.getAttribute('aria-label') || el.querySelector('img')?.alt || el.textContent.trim(), outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 }
    })
    if (!stop || (stops.length && stop.name === stops[0].name)) break
    stops.push(stop)
    await page.keyboard.press('Tab')
  }
  return stops
}
const ROUNDS = {
  'étape 1, Original': ['Paper', 'Scissors', 'Rock', 'Switch to Lizard-Spock', 'Rules'],
  'étape 1, Lizard-Spock': ['Scissors', 'Paper', 'Rock', 'Lizard', 'Spock', 'Switch to Original', 'Rules'],
  'étape 4': ['Play Again', 'Rules'],
  'règles': ['Close rules'],
}
for (const width of [375, 1440]) {
  for (const [name, expected] of Object.entries(ROUNDS)) {
    test(`A7 — clavier seul, ${width} px, ${name} : Tab jusqu'au dernier élément, dans l'ordre de lecture, contour visible à chaque arrêt`, async ({ page }) => {
      await open(page, width, 900, { clock: true, version: name.includes('Lizard') ? 'bonus' : 'original' })
      if (name === 'étape 4') {
        await houseWill(page, 'original', 'Rock')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Enter')
        await page.clock.runFor(1500)
        await expect(playAgain(page)).toBeFocused()
      } else if (name === 'règles') {
        await page.keyboard.press('Tab')
        await rulesButton(page).focus()
        await page.keyboard.press('Enter')
        await expect(rules(page)).toBeFocused()
        await page.keyboard.press('Tab')
      } else {
        await page.keyboard.press('Tab')
      }
      const stops = await tabRound(page)
      expect(stops.map((s) => s.name)).toEqual(expected)
      for (const s of stops) expect.soft(s.outline, `contour de ${s.name}`).toBe(true)
    })
  }
}

test.describe('toucher', () => {
  test.use({ hasTouch: true })
  test('S1 — au doigt, 375 px : une partie gagnée, Play Again', async ({ page }) => {
    await open(page, 375, 750)
    await houseWill(page, 'original', 'Paper')
    await token(page, 'Scissors').tap()
    await expectStep(page, 4, { mine: 'Scissors', theirs: 'Paper' })
    await expectScore(page, 1)
    await playAgain(page).tap()
    await expectStep(page, 1)
  })
})

// S14 : survols et focus (§6), mesurés à l'écran, à 1366 × 768 (positions de la §5)
const PAPER = { cx: 544, cy: 361, r: 99 }
const RULES_BOX = { x: 1205, y: 695, width: 130, height: 42 }
const SWITCH_BOX = { x: 1009, y: 695, width: 180, height: 42 }
const maxLum = async (page, xs, y) => Math.max(...await Promise.all(xs.map(async (x) => lum(await pixel(page, x, y)))))
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const pageSize = (page) => page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight])

test('S14 — survol d\'un jeton : disque blanc à 10 % autour, 11 % du diamètre plus large ; taille de la page inchangée', async ({ page }) => {
  await open(page, 1366, 768, { motion: 'reduce' })
  await page.mouse.move(1, 1)
  const size = await pageSize(page)
  const inside = [PAPER.cx - PAPER.r - 10, PAPER.cy], outside = [PAPER.cx - PAPER.r - 28, PAPER.cy]
  const before = [lum(await pixel(page, ...inside)), lum(await pixel(page, ...outside))]
  await token(page, 'Paper').hover()
  expect(lum(await pixel(page, ...inside)) - before[0], 'halo de survol').toBeGreaterThan(10)
  expect(Math.abs(lum(await pixel(page, ...outside)) - before[1]), 'rien au-delà du halo').toBeLessThanOrEqual(3)
  expect(await pageSize(page)).toEqual(size)
})

test('S14 — focus clavier d\'un jeton : contour blanc de 3 px décalé de 7 px de la face', async ({ page }) => {
  await open(page, 1366, 768, { motion: 'reduce' })
  await expect(token(page, 'Paper')).toBeVisible()
  await page.mouse.move(1, 1)
  const ring = range(PAPER.cx - PAPER.r - 11, PAPER.cx - PAPER.r - 5)
  expect(await maxLum(page, ring, PAPER.cy), 'sans focus').toBeLessThan(120)
  await page.keyboard.press('Tab')
  await expect(token(page, 'Paper')).toBeFocused()
  expect(await maxLum(page, ring, PAPER.cy), 'contour de focus').toBeGreaterThan(200)
})

for (const [name, box, locate] of [['Rules', RULES_BOX, rulesButton], ['choix de version', SWITCH_BOX, (page) => switchButton(page, 'original')]]) {
  test(`S14 — ${name} : survol = fond blanc à 10 %, focus = contour blanc décalé de 2 px ; taille de la page inchangée`, async ({ page }) => {
    await open(page, 1366, 768, { motion: 'reduce' })
    await page.mouse.move(1, 1)
    const size = await pageSize(page)
    const inside = [box.x + 8, box.y + 8]
    const before = lum(await pixel(page, ...inside))
    await locate(page).hover()
    expect(lum(await pixel(page, ...inside)) - before, 'fond de survol').toBeGreaterThan(10)
    expect(await pageSize(page)).toEqual(size)
    await page.mouse.move(1, 1)
    // contour de 3 px décalé de 2 px : de 5 à 3 px à gauche du bouton (son filet n'en fait pas partie)
    const b = await pageBox(locate(page))
    const ring = range(Math.floor(b.x) - 5, Math.floor(b.x) - 3)
    expect(await maxLum(page, ring, b.y + b.height / 2), 'sans focus').toBeLessThan(120)
    await locate(page).focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await expect(locate(page)).toBeFocused()
    expect(await maxLum(page, ring, b.y + b.height / 2), 'contour de focus').toBeGreaterThan(200)
  })
}

test('S14 — Play Again : texte Red 800 au survol, navy au repos ; contour blanc au focus clavier', async ({ page }) => {
  await open(page, 1366, 768, { motion: 'reduce' })
  const box = { x: 573, y: 513, width: 220, height: 48 }
  const red = (c) => c[0] - c[2] > 60 && c[0] > 100
  await houseWill(page, 'original', 'Rock', 'Rock')
  await token(page, 'Paper').click()
  await expectStep(page, 4, { mine: 'Paper', theirs: 'Rock' })
  await page.mouse.move(1, 1)
  expect(await count(page, box, red), 'texte navy au repos').toBe(0)
  expect(await ink(page, box, WHITE), 'bouton blanc').not.toBeNull()
  await playAgain(page).hover()
  expect(await count(page, box, red), 'texte rouge au survol').toBeGreaterThan(30)
  await page.mouse.move(1, 1)
  const b = await pageBox(playAgain(page))
  const ring = range(Math.floor(b.x) - 5, Math.floor(b.x) - 3)
  expect(await maxLum(page, ring, b.y + b.height / 2), 'sans contour après un clic').toBeLessThan(120)
  // au clavier : le focus arrive sur Play Again avec son contour
  await playAgain(page).press('Enter')
  await expect(token(page, 'Paper')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(playAgain(page)).toBeFocused()
  expect(await maxLum(page, ring, b.y + b.height / 2), 'contour de focus').toBeGreaterThan(200)
})

test('S14 — croix des règles : Navy 900 ; contour Navy au focus clavier', async ({ page }) => {
  await open(page, 1366, 768, { motion: 'reduce' })
  await rulesButton(page).click()
  await expect(rules(page)).toBeVisible()
  const icon = { x: 832, y: 215, width: 19, height: 19 }
  const around = { x: icon.x - 12, y: icon.y - 12, width: icon.width + 24, height: icon.height + 24 }
  const navy = (c) => lum(c) < 120 && c[2] > c[0]
  const quiet = await count(page, around, navy)
  expect(quiet, 'croix Navy').toBeGreaterThan(20)
  await page.keyboard.press('Tab')
  await expect(closeRules(page)).toBeFocused()
  expect(await count(page, around, navy) - quiet, 'contour de focus').toBeGreaterThan(150)
})

// S15 : mouvements comptés dans la page (animations CSS, transitions, Web Animations)
function countMotion() {
  globalThis.__motion = 0
  for (const e of ['animationstart', 'transitionrun']) document.addEventListener(e, () => { globalThis.__motion++ }, true)
  const animate = Element.prototype.animate
  Element.prototype.animate = function (...args) {
    const a = animate.apply(this, args)
    if (Number(a.effect?.getComputedTiming?.().duration) > 0) globalThis.__motion++
    return a
  }
}
const motion = (page) => page.evaluate(() => globalThis.__motion)
const durations = (page) => page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('*')].flatMap((el) => {
  const s = getComputedStyle(el)
  return [...s.transitionDuration.split(','), ...s.animationDuration.split(',')].map(parseFloat)
})))

for (const reduce of [false, true]) {
  test(`S15 — ${reduce ? 'prefers-reduced-motion : aucune animation ni transition' : 'sans réglage : le jeton de la maison et le résultat s\'animent'} ; étapes 2, 3, 4 au même rythme`, async ({ page }) => {
    await page.addInitScript(countMotion)
    await open(page, 1366, 768, { clock: true, motion: reduce ? 'reduce' : 'no-preference' })
    await houseWill(page, 'original', 'Rock')
    await token(page, 'Paper').click()
    await page.clock.runFor(999)
    await expectStep(page, 2, { mine: 'Paper' })
    await page.clock.runFor(1)
    await expectStep(page, 3, { mine: 'Paper', theirs: 'Rock' })
    await page.clock.runFor(499)
    await expectStep(page, 3, { mine: 'Paper', theirs: 'Rock' })
    await page.clock.runFor(1)
    await expectStep(page, 4, { mine: 'Paper', theirs: 'Rock' })
    await playAgain(page).hover()
    await rulesButton(page).click()
    await expect(rules(page)).toBeVisible()
    if (reduce) {
      expect(await motion(page), 'mouvements lancés').toBe(0)
      expect(await durations(page), 'durées de transition et d\'animation').toBe(0)
    } else {
      expect(await motion(page), 'mouvements lancés').toBeGreaterThan(0)
    }
  })
}
