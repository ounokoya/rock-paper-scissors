import { test, expect } from '@playwright/test'
import { open, SIGNS, KEYS, LOGO, TITLE, outcome, announce, houseWill, play, stored, banner, logo, token, housePicked, playAgain, switchButton, status, expectScore, expectStep, ink, WHITE, DARK } from './helpers.js'

// Spec §2 et §8 — S9 à S13 : règles du jeu, rythme, hasard de la maison, valeurs gardées, choix de version
// (horloge de la page arrêtée : le test l'avance lui-même)

for (const version of ['original', 'bonus']) {
  const n = SIGNS[version].length
  test(`S9 — ${version} : les ${n * n} paires de signes donnent le résultat de D2 ; score, données gardées et annonce suivent`, async ({ page }) => {
    test.setTimeout(120_000)
    await open(page, 1366, 768, { version, clock: true, motion: 'reduce' })
    let score = 0
    for (const mine of SIGNS[version]) for (const theirs of SIGNS[version]) {
      const r = outcome(version, mine, theirs)
      await play(page, version, mine, theirs, { clock: true })
      score += r === 'win' ? 1 : r === 'lose' ? -1 : 0
      await expectScore(page, score)
      await expect(status(page)).toHaveText(announce(mine, theirs, r, score))
      expect((await stored(page))[version], `${mine} contre ${theirs}`).toBe(String(score))
      await playAgain(page).click()
    }
  })

  test(`S11 — ${version} : Math.random à (k + 0,5) / ${n} → la maison choisit le k-ième signe de D1`, async ({ page }) => {
    await open(page, 1366, 768, { version, clock: true, motion: 'reduce' })
    for (const theirs of SIGNS[version]) {
      await houseWill(page, version, theirs)
      await token(page, 'Rock').click()
      await page.clock.runFor(1500)
      await expect(housePicked(page).getByRole('img', { name: theirs, exact: true })).toBeVisible()
      await playAgain(page).click()
    }
  })
}

test('S10 — étape 2 jusqu\'à 1 s, étape 3 de 1 s à 1,5 s, étape 4 ensuite ; le score change et il est gardé à l\'étape 4 seulement', async ({ page }) => {
  await open(page, 1366, 768, { original: 5, clock: true })
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  await expectStep(page, 2, { mine: 'Paper' })
  await page.clock.runFor(999)
  await expectStep(page, 2, { mine: 'Paper' })
  await page.clock.runFor(1)
  await expectStep(page, 3, { mine: 'Paper', theirs: 'Rock' })
  await expectScore(page, 5)
  expect((await stored(page)).original).toBe('5')
  await page.clock.runFor(499)
  await expectStep(page, 3, { mine: 'Paper', theirs: 'Rock' })
  await expectScore(page, 5)
  await page.clock.runFor(1)
  await expectStep(page, 4, { mine: 'Paper', theirs: 'Rock' })
  await expectScore(page, 6)
  expect((await stored(page)).original).toBe('6')
})

for (const [step, at] of [[2, 500], [3, 1200]]) {
  test(`S10 — recharger à l'étape ${step} abandonne la partie : le score n'a pas changé`, async ({ page }) => {
    await open(page, 1366, 768, { original: 5, clock: true })
    await houseWill(page, 'original', 'Rock')
    await token(page, 'Paper').click()
    await page.clock.runFor(at)
    await expectStep(page, step, { mine: 'Paper', theirs: 'Rock' })
    await page.reload()
    await expectStep(page, 1)
    await expectScore(page, 5)
    expect((await stored(page)).original).toBe('5')
  })
}

test('S11 — sans tirage fixé, 30 parties : la maison choisit au moins deux signes différents', async ({ page }) => {
  await open(page, 1366, 768, { clock: true, motion: 'reduce' })
  const seen = new Set()
  for (let i = 0; i < 30; i++) {
    await token(page, 'Rock').click()
    await page.clock.runFor(1500)
    await expect(playAgain(page)).toBeVisible()
    for (const s of SIGNS.original) if (await housePicked(page).getByRole('img', { name: s, exact: true }).count()) seen.add(s)
    await playAgain(page).click()
  }
  expect(seen.size).toBeGreaterThanOrEqual(2)
})

for (const [what, raw, expected] of [['« 12 »', '12', 12], ['« -3 »', '-3', -3], ['vide', '', 0], ['« abc »', 'abc', 0], ['« 1.5 »', '1.5', 0]]) {
  test(`S12 — score gardé ${what} : ${expected}`, async ({ page }) => {
    await open(page, 1366, 768, { raw: { [KEYS.original]: raw } })
    await expectScore(page, expected)
  })
}

test('S12 — version gardée « bonus » : Lizard-Spock ; version inconnue : Original', async ({ page }) => {
  await open(page, 1366, 768, { raw: { [KEYS.version]: 'bonus', [KEYS.bonus]: '4' } })
  await expect(logo(page)).toHaveAccessibleName(LOGO.bonus)
  await expect(page).toHaveTitle(TITLE.bonus)
  await expectScore(page, 4)
  await open(page, 1366, 768, { raw: { [KEYS.version]: 'spock', [KEYS.original]: '7' } })
  await expect(logo(page)).toHaveAccessibleName(LOGO.original)
  await expect(page).toHaveTitle(TITLE.original)
  await expectScore(page, 7)
})

// Le score tient dans sa boîte : l'encre de la boîte (libellé et chiffre) reste à 4 px de ses bords
for (const [width, height] of [[375, 750], [1366, 768]]) {
  for (const value of [9999, -999]) {
    test(`S12 — ${value} tient dans la boîte du score à ${width} px`, async ({ page }) => {
      await open(page, width, height, { original: value })
      await expectScore(page, value)
      const b = await banner(page).boundingBox()
      const box = await ink(page, { x: b.x + b.width / 2, y: b.y, width: b.width / 2, height: b.height }, WHITE)
      expect(box, 'boîte du score').not.toBeNull()
      // sans les coins arrondis (8 px), où le fond sombre apparaît
      const text = await ink(page, { x: box.x + 1, y: box.y + 8, width: box.width - 2, height: box.height - 16 }, DARK)
      expect(text, 'chiffre du score').not.toBeNull()
      expect(text.x - box.x, 'marge gauche').toBeGreaterThanOrEqual(4)
      expect(box.x + box.width - (text.x + text.width), 'marge droite').toBeGreaterThanOrEqual(4)
    })
  }
}

test('S13 — le choix de version est là à l\'étape 1 ; plus aux étapes 2, 3 et 4 ; il revient avec Play Again', async ({ page }) => {
  await open(page, 1366, 768, { clock: true })
  await expect(switchButton(page, 'original')).toBeVisible()
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  await expectStep(page, 2, { mine: 'Paper' })
  await expect(switchButton(page, 'original')).toBeHidden()
  await page.clock.runFor(1000)
  await expectStep(page, 3, { mine: 'Paper', theirs: 'Rock' })
  await expect(switchButton(page, 'original')).toBeHidden()
  await page.clock.runFor(500)
  await expectStep(page, 4, { mine: 'Paper', theirs: 'Rock' })
  await expect(switchButton(page, 'original')).toBeHidden()
  await playAgain(page).click()
  await expect(switchButton(page, 'original')).toBeVisible()
})
