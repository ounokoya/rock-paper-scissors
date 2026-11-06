import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { open, LOGO, houseWill, banner, logo, token, picked, housePicked, result, playAgain, rulesButton, switchButton, rules, expectStep, compare } from './helpers.js'

// Spec §8 et §9 — S19 : les 22 maquettes FM (JPG du starter, specs/reference/), seuil de 5 % par écran (G3-6), et par zone.
// Chaque maquette est rejouée : score gardé de 12, la maison fixée sur le signe de la maquette ; le contenu est vérifié avant la capture.
// La comparaison ne compte pas le choix de version, ajouté au jeu et absent des maquettes (G3-1) ; elle est faite sur tout
// l'écran et zone par zone (en-tête, jeu, bas de page ; règles : la fenêtre et la page derrière), pour qu'un écart local
// ne se dilue pas dans un écran juste par ailleurs. Les zones viennent des éléments de la page, pas de coordonnées écrites.

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
// 5 % aussi par zone : la boîte du score masquée laisse l'écran entier à 2,6 % (sous le seuil), mais l'en-tête à 6,7 %
const MAX_ZONE = 0.05

// Zones de l'écran, tirées de la boîte de l'en-tête, de Rules et de la fenêtre des règles ; rectangles exclus
async function regions(page, step, [width, height]) {
  const all = { x: 0, y: 0, width, height }
  const grow = (b, m) => ({ x: b.x - m, y: b.y - m, width: b.width + 2 * m, height: b.height + 2 * m })
  // le choix de version n'existe qu'à l'étape 1 (et derrière la fenêtre des règles ouverte à l'étape 1)
  const switcher = switchButton(page, 'original').or(switchButton(page, 'bonus'))
  const version = await switcher.count() ? await switcher.boundingBox() : null
  if (step === 'rules') {
    const box = await rules(page).boundingBox()
    const covers = box.width >= width - 1 && box.height >= height - 1
    if (covers) return { exclude: [], zones: { 'fenêtre des règles': all } }
    return { exclude: version ? [grow(version, 4)] : [], zones: { 'fenêtre des règles': box, 'page derrière': { ...all, minus: [box] } } }
  }
  const exclude = version ? [grow(version, 4)] : []
  const head = await banner(page).boundingBox()
  const bottom = Math.min(...[await rulesButton(page).boundingBox(), version].filter(Boolean).map((b) => b.y)) - 8
  const top = head.y + head.height + 8
  return { exclude, zones: { 'en-tête': { x: 0, y: 0, width, height: top }, 'jeu': { x: 0, y: top, width, height: bottom - top }, 'bas de page': { x: 0, y: bottom, width, height: height - bottom } } }
}

for (const [file, version, size, step, mine, theirs] of SCREENS) {
  test(`S19 — ${file} (≤ ${MAX * 100} % sur l'écran et sur chaque zone)`, async ({ page }, testInfo) => {
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
    const { exclude, zones } = await regions(page, step, SIZE[size])
    const shot = await page.screenshot({ caret: 'hide', animations: 'disabled' })
    await testInfo.attach(`${file}.png`, { body: shot, contentType: 'image/png' })
    const diff = await compare(page, shot, readFileSync(`${REF}${file}.jpg`), { exclude, zones })
    const pct = (v) => `${(v * 100).toFixed(2)} %`
    testInfo.annotations.push({ type: 'pixels différents', description: `${pct(diff.total)} ; ${Object.entries(diff.zones).map(([n, v]) => `${n} ${pct(v)}`).join(', ')}` })
    expect(diff.total, 'écran entier').toBeLessThanOrEqual(MAX)
    for (const [name, v] of Object.entries(diff.zones)) expect.soft(v, `zone « ${name} »`).toBeLessThanOrEqual(MAX_ZONE)
  })
}
