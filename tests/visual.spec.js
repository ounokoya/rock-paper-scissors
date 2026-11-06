import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { open, LOGO, houseWill, logo, token, picked, housePicked, result, playAgain, rulesButton, rules, expectStep, diffRatio } from './helpers.js'

// Spec §8 et §9 — S19 : les 22 maquettes FM (JPG du starter, specs/reference/), seuil de 5 % par écran (G3-6).
// Chaque maquette est rejouée : score gardé de 12, la maison fixée sur le signe de la maquette ; le contenu est vérifié avant la capture.

const REF = new URL('../specs/reference/', import.meta.url).pathname
const MAX = 0.05
const SIZE = { desktop: [1366, 768], mobile: [375, 750] }
// [maquette, version, taille, étape, je choisis, la maison]
const SCREENS = [
  ['desktop-etape-1', 'original', 'desktop', 1],
  ['desktop-etape-2', 'original', 'desktop', 2, 'Scissors', 'Rock'],
  ['desktop-etape-3', 'original', 'desktop', 3, 'Scissors', 'Rock'],
  ['desktop-etape-4-gagne', 'original', 'desktop', 4, 'Paper', 'Rock'],
  ['desktop-etape-4-perdu', 'original', 'desktop', 4, 'Scissors', 'Rock'],
  ['desktop-regles', 'original', 'desktop', 'rules'],
  ['mobile-etape-1', 'original', 'mobile', 1],
  ['mobile-etape-2', 'original', 'mobile', 2, 'Rock', 'Scissors'],
  ['mobile-etape-3', 'original', 'mobile', 3, 'Rock', 'Scissors'],
  ['mobile-etape-4-gagne', 'original', 'mobile', 4, 'Rock', 'Scissors'],
  ['mobile-etape-4-perdu', 'original', 'mobile', 4, 'Paper', 'Scissors'],
  ['mobile-regles', 'original', 'mobile', 'rules'],
  ['bonus-desktop-etape-1', 'bonus', 'desktop', 1],
  ['bonus-desktop-etape-2', 'bonus', 'desktop', 2, 'Scissors', 'Spock'],
  ['bonus-desktop-etape-3', 'bonus', 'desktop', 3, 'Scissors', 'Spock'],
  ['bonus-desktop-etape-4', 'bonus', 'desktop', 4, 'Scissors', 'Spock'],
  ['bonus-desktop-regles', 'bonus', 'desktop', 'rules'],
  ['bonus-mobile-etape-1', 'bonus', 'mobile', 1],
  ['bonus-mobile-etape-2', 'bonus', 'mobile', 2, 'Scissors', 'Spock'],
  ['bonus-mobile-etape-3', 'bonus', 'mobile', 3, 'Scissors', 'Spock'],
  ['bonus-mobile-etape-4', 'bonus', 'mobile', 4, 'Lizard', 'Spock'],
  ['bonus-mobile-regles', 'bonus', 'mobile', 'rules'],
]
const AFTER = { 2: 0, 3: 1000, 4: 1500 }

for (const [file, version, size, step, mine, theirs] of SCREENS) {
  test(`S19 — ${file} (≤ ${MAX * 100} %)`, async ({ page }, testInfo) => {
    await open(page, ...SIZE[size], { version, [version]: 12, clock: true, motion: 'reduce' })
    // une page vide reste loin de 5 % ici, mais le contenu doit d'abord être là (M48)
    await expect(logo(page)).toHaveAccessibleName(LOGO[version])
    if (step === 'rules') {
      await rulesButton(page).click()
      await expect(rules(page)).toBeVisible()
    } else if (step === 1) {
      await expectStep(page, 1, { version })
    } else {
      await houseWill(page, version, theirs)
      await token(page, mine).click()
      await page.clock.runFor(AFTER[step])
      await expect(picked(page).getByRole('img', { name: mine, exact: true })).toBeVisible()
      if (step > 2) await expect(housePicked(page).getByRole('img', { name: theirs, exact: true })).toBeVisible()
      if (step === 4) await expect(result(page)).toBeVisible()
    }
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))))
    // la maquette « perdu » desktop montre le survol de Play Again (Q-B6)
    if (file === 'desktop-etape-4-perdu') await playAgain(page).hover()
    else await page.mouse.move(1, 1)
    await page.evaluate(() => document.activeElement?.blur())
    const shot = await page.screenshot({ caret: 'hide', animations: 'disabled' })
    await testInfo.attach(`${file}.png`, { body: shot, contentType: 'image/png' })
    const ratio = await diffRatio(page, shot, readFileSync(`${REF}${file}.jpg`))
    testInfo.annotations.push({ type: 'pixels différents', description: `${(ratio * 100).toFixed(2)} %` })
    expect(ratio).toBeLessThanOrEqual(MAX)
  })
}
