import { test, expect } from '@playwright/test'
import { open, ORDER, houseWill, banner, main, logo, token, picked, housePicked, result, playAgain, rulesButton, switchButton, rules, closeRules, pageBox, near, ink, inkOf, pixel, lum, WHITE, DARK, SATURATED, NOT_WHITE, noHorizontalScroll, overlap } from './helpers.js'

// Spec §5 et §8 — S5 à S8 : positions de la maquette (à 2 px près), mesurées sur l'élément ou sur son encre à l'écran

const STEP1 = {
  desktop: {
    size: [1366, 768],
    banner: { x: 331, y: 46, width: 704, height: 154 },
    logo: { original: { x: 363, y: 75, width: 162, height: 99 }, bonus: { x: 362, y: 67, width: 115, height: 114 } },
    score: { x: 859, y: 66, width: 150, height: 114 },
    tokens: {
      original: { D: 198, Paper: [544, 361], Scissors: [822, 361], Rock: [683, 588] },
      bonus: { D: 144, Scissors: [684, 318], Paper: [846.5, 447.5], Rock: [781.5, 633.5], Lizard: [584, 634], Spock: [520, 447] },
    },
    switch: { x: 1009, y: 695, width: 180, height: 42 },
    rules: { x: 1205, y: 695, width: 130, height: 42 },
  },
  mobile: {
    size: [375, 750],
    banner: { x: 30, y: 30, width: 315, height: 100 },
    logo: { original: { x: 54, y: 55.5, width: 84, height: 51.5 }, bonus: { x: 54.5, y: 54.5, width: 51, height: 51 } },
    score: { x: 251, y: 44, width: 80, height: 72 },
    tokens: {
      original: { D: 129, Paper: [96.5, 297.5], Scissors: [278, 298.5], Rock: [187.5, 446.5] },
      bonus: { D: 95, Scissors: [188, 271.5], Paper: [296, 355], Rock: [252, 478], Lizard: [123, 478], Spock: [80, 356] },
    },
    switch: { x: 97.5, y: 595, width: 180, height: 42 },
    rules: { x: 123, y: 653, width: 130, height: 42 },
  },
}

// Boîte de la boîte du score : l'encre blanche dans la moitié droite de l'en-tête
const scoreBox = async (page) => { const b = await pageBox(banner(page)); return ink(page, { x: b.x + b.width / 2, y: b.y, width: b.width / 2, height: b.height }, WHITE) }

for (const [size, v] of Object.entries(STEP1)) {
  for (const version of ['original', 'bonus']) {
    test(`S5 — ${size} ${v.size.join(' × ')}, ${version}, étape 1 : en-tête, logo, score, jetons, choix de version, Rules`, async ({ page }) => {
      await open(page, ...v.size, { version, motion: 'reduce' })
      await page.mouse.move(1, 1)
      near(await pageBox(banner(page)), v.banner, 'en-tête')
      near(await pageBox(logo(page)), v.logo[version], 'logo')
      near(await scoreBox(page), v.score, 'boîte du score')
      const { D, ...centers } = v.tokens[version]
      for (const sign of ORDER[version]) {
        const b = await pageBox(token(page, sign))
        const [cx, cy] = centers[sign]
        near({ width: b.width, cx: b.x + b.width / 2, cy: b.y + b.width / 2 }, { width: D, cx, cy }, `jeton ${sign}`)
      }
      near(await pageBox(switchButton(page, version)), v.switch, 'choix de version')
      near(await pageBox(rulesButton(page)), v.rules, 'Rules')
    })
  }
}

test('S5 — 1440 × 900, étape 1 : la mise en page de 1366, centrée ; Rules et le choix de version à 32 px du bas', async ({ page }) => {
  await open(page, 1440, 900, { motion: 'reduce' })
  near(await pageBox(banner(page)), { x: 368, y: 46, width: 704, height: 154 }, 'en-tête')
  for (const [sign, cx, cy] of [['Paper', 581, 361], ['Scissors', 859, 361], ['Rock', 720, 588]]) {
    const b = await pageBox(token(page, sign))
    near({ cx: b.x + b.width / 2, cy: b.y + b.width / 2 }, { cx, cy }, `jeton ${sign}`)
  }
  near(await pageBox(rulesButton(page)), { x: 1278, y: 826, width: 130, height: 42 }, 'Rules')
  near(await pageBox(switchButton(page, 'original')), { x: 1082, y: 826, width: 180, height: 42 }, 'choix de version')
})

// Étapes 2 à 4 : jetons mesurés à leur encre colorée (centre en x, haut de la face, largeur), libellés et résultat à leur encre blanche
const GAME = {
  desktop: { size: [1366, 768], band: [150, 330, 1250, 710], split: 683, D: 291, top: 365.5, mine: { 2: 494, 4: 350 }, house: { 2: 859, 4: 995 }, labels: { y: 279, 2: [491, 856.5], 4: [347, 992.5] }, result: { y: 447, cx: 682.5 }, again: { x: 573, y: 513, width: 220, height: 48 } },
  mobile: { size: [375, 750], band: [0, 200, 375, 380], split: 187.5, D: 129, top: 227.5, mine: { 2: 94, 4: 94 }, house: { 2: 282, 4: 282 }, labels: { y: 388.5, 2: [93, 280.5], 4: [93, 280.5] }, result: { y: 488, cx: 187.5 }, again: { x: 78, y: 554, width: 220, height: 48 } },
}
const halves = async (page, g) => {
  const [x0, y0, x1, y1] = g.band
  return [await ink(page, { x: x0, y: y0, width: g.split - x0, height: y1 - y0 }, SATURATED), await ink(page, { x: g.split, y: y0, width: x1 - g.split, height: y1 - y0 }, SATURATED)]
}
const tokenAt = (b) => b && { cx: b.x + b.width / 2, top: b.y, width: b.width }

for (const [size, g] of Object.entries(GAME)) {
  for (const step of [2, 3, 4]) {
    for (const [mine, theirs] of step === 4 ? [['Paper', 'Rock'], ['Scissors', 'Rock']] : [['Scissors', 'Rock']]) {
      test(`S6 — ${size} ${g.size.join(' × ')}, étape ${step}${step === 4 ? ` (${mine} contre ${theirs})` : ''} : jetons, libellés${step === 4 ? ', résultat, Play Again' : ''}`, async ({ page }) => {
        await open(page, ...g.size, { clock: true, motion: 'reduce' })
        await houseWill(page, 'original', theirs)
        await token(page, mine).click()
        await page.clock.runFor(step === 2 ? 0 : step === 3 ? 1000 : 1500)
        await expect(picked(page).getByRole('img', { name: mine, exact: true })).toBeVisible()
        await page.mouse.move(1, 1)
        const k = step === 4 ? 4 : 2
        const [left, right] = await halves(page, g)
        near(tokenAt(left), { cx: g.mine[k], top: g.top, width: g.D }, 'mon jeton')
        if (step === 2) {
          await expect(housePicked(page).getByRole('img')).toHaveCount(0)
          expect(right, 'pas de jeton de la maison à l\'étape 2').toBeNull()
        } else near(tokenAt(right), { cx: g.house[k], top: g.top, width: g.D }, 'jeton de la maison')
        for (const [i, text] of ['You Picked', 'The House Picked'].entries()) {
          const b = await inkOf(page, main(page).getByText(text, { exact: true }), WHITE)
          near(b && { y: b.y, cx: b.x + b.width / 2 }, { y: g.labels.y, cx: g.labels[k][i] }, `libellé « ${text} »`)
        }
        if (step === 4) {
          const b = await inkOf(page, result(page), WHITE)
          near(b && { y: b.y, cx: b.x + b.width / 2 }, g.result, 'résultat')
          near(await pageBox(playAgain(page)), g.again, 'Play Again')
        }
      })
    }
  }
}

test('S6 — 768 × 1024, étape 4 : en-tête, jetons, puis résultat et Play Again sous les jetons ; Rules en bas à droite', async ({ page }) => {
  await open(page, 768, 1024, { clock: true, motion: 'reduce' })
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  await page.clock.runFor(1500)
  await expect(result(page)).toHaveText('You Win')
  await page.mouse.move(1, 1)
  near(await pageBox(banner(page)), { x: 32, y: 46, width: 704, height: 154 }, 'en-tête')
  const [left, right] = await halves(page, { band: [0, 330, 768, 700], split: 384 })
  near(tokenAt(left), { cx: 201.5, top: 365.5, width: 291 }, 'mon jeton')
  near(tokenAt(right), { cx: 566.5, top: 365.5, width: 291 }, 'jeton de la maison')
  const b = await inkOf(page, result(page), WHITE)
  near(b && { y: b.y, cx: b.x + b.width / 2 }, { y: 730, cx: 384 }, 'résultat')
  near(await pageBox(playAgain(page)), { x: 274, y: 796, width: 220, height: 48 }, 'Play Again')
  near(await pageBox(rulesButton(page)), { x: 606, y: 950, width: 130, height: 42 }, 'Rules')
})

// S7 : règles ; l'encre du titre et de la croix (sombre), du schéma (tout ce qui n'est pas blanc sous le titre)
const RULES = {
  'desktop original': { size: [1366, 768], version: 'original', box: { x: 483, y: 177, width: 400, height: 415 }, title: { x: 517, y: 216, width: 80, height: 22 }, close: { x: 832, y: 215, width: 19, height: 19 }, scheme: { x: 532, y: 289, width: 304, height: 270 } },
  'desktop bonus': { size: [1366, 768], version: 'bonus', box: { x: 483, y: 154, width: 400, height: 461 }, title: { x: 517, y: 193, width: 80, height: 22 }, close: { x: 832, y: 192, width: 19, height: 19 }, scheme: { x: 515, y: 238, width: 336, height: 330 } },
  'mobile original': { size: [375, 750], version: 'original', box: { x: 0, y: 0, width: 375, height: 750 }, title: { x: 147, y: 102, width: 80, height: 22 }, close: { x: 179, y: 665, width: 19, height: 19 }, scheme: { x: 35, y: 240, width: 304, height: 270 } },
  'mobile bonus': { size: [375, 750], version: 'bonus', box: { x: 0, y: 0, width: 375, height: 750 }, title: { x: 147, y: 102, width: 80, height: 22 }, close: { x: 179, y: 665, width: 19, height: 19 }, scheme: { x: 33, y: 223, width: 310, height: 304 } },
}
for (const [name, r] of Object.entries(RULES)) {
  test(`S7 — règles, ${name} : fenêtre, titre, croix, schéma ; voile à 50 % sur desktop`, async ({ page }) => {
    await open(page, ...r.size, { version: r.version, motion: 'reduce' })
    await page.mouse.move(1, 1)
    const before = lum(await pixel(page, 100, 400))
    await rulesButton(page).click()
    await expect(rules(page)).toBeVisible()
    await page.mouse.move(1, 1)
    near(await pageBox(rules(page)), r.box, 'fenêtre des règles')
    near(await inkOf(page, rules(page).getByRole('heading', { level: 2, name: 'Rules' }), DARK), r.title, 'titre « RULES »')
    near(await inkOf(page, closeRules(page), DARK), r.close, 'croix')
    // le schéma : sous le titre, au-dessus de la croix quand elle est en bas (mobile)
    const top = r.title.y + r.title.height + 12
    const bottom = r.close.y > top ? r.close.y - 8 : r.box.y + r.box.height - 6
    near(await ink(page, { x: r.box.x + 6, y: top, width: r.box.width - 12, height: bottom - top }, NOT_WHITE), r.scheme, 'schéma des règles')
    if (r.size[0] >= 768) expect(Math.abs(lum(await pixel(page, 100, 400)) - before / 2), 'voile noir à 50 %').toBeLessThanOrEqual(3)
  })
}

// S7 : règles dans des fenêtres basses (zone qui défile, M45) : rien ne se chevauche, la fenêtre tient dans l'écran et défile
for (const version of ['original', 'bonus']) {
  for (const [w, h] of [[375, 600], [375, 480]]) {
    test(`S7 — règles, ${w} × ${h}, ${version} : titre, schéma et croix sans se chevaucher ; la croix se clique`, async ({ page }) => {
      await open(page, w, h, { version, motion: 'reduce' })
      await page.mouse.move(1, 1)
      await rulesButton(page).click()
      await expect(rules(page)).toBeVisible()
      await page.mouse.move(1, 1)
      const title = await rules(page).getByRole('heading', { level: 2, name: 'Rules' }).boundingBox()
      const top = Math.ceil(title.y + title.height) + 1
      const upper = await ink(page, { x: 6, y: top, width: w - 12, height: h - top - 1 }, NOT_WHITE)
      expect(upper.y - (title.y + title.height), 'écart sous le titre').toBeGreaterThanOrEqual(8)
      await closeRules(page).scrollIntoViewIfNeeded()
      const close = await closeRules(page).boundingBox()
      const lower = await ink(page, { x: 6, y: 1, width: w - 12, height: Math.floor(close.y) - 2 }, NOT_WHITE)
      expect(close.y - (lower.y + lower.height), 'écart au-dessus de la croix').toBeGreaterThanOrEqual(8)
      await closeRules(page).click()
      await expect(rules(page)).toBeHidden()
    })
  }
  test(`S7 — règles, 1366 × 400, ${version} : la fenêtre tient dans l'écran et défile ; la croix se clique`, async ({ page }) => {
    await open(page, 1366, 400, { version, motion: 'reduce' })
    await rulesButton(page).click()
    await expect(rules(page)).toBeVisible()
    // la fenêtre est fixe : sa boîte à l'écran, la page ayant défilé jusqu'au bouton Rules
    const box = await rules(page).boundingBox()
    expect(box.y, 'haut de la fenêtre').toBeGreaterThanOrEqual(0)
    expect(box.y + box.height, 'bas de la fenêtre').toBeLessThanOrEqual(400)
    expect(await rules(page).evaluate((d) => d.scrollHeight > d.clientHeight && getComputedStyle(d).overflowY !== 'hidden'), 'la fenêtre défile').toBe(true)
    await closeRules(page).click()
    await expect(rules(page)).toBeHidden()
  })
}

// S8 : pas de défilement horizontal ; boutons du bas jamais sur le jeu
const VIEWS = {
  'étape 1': async () => {},
  'étape 1 Lizard-Spock': async () => {},
  'étape 2': async (page) => { await houseWill(page, 'original', 'Rock'); await token(page, 'Scissors').click() },
  'étape 3': async (page) => { await houseWill(page, 'original', 'Rock'); await token(page, 'Scissors').click(); await page.clock.runFor(1000) },
  'étape 4 gagnée': async (page) => { await houseWill(page, 'original', 'Rock'); await token(page, 'Paper').click(); await page.clock.runFor(1500) },
  'étape 4 perdue': async (page) => { await houseWill(page, 'original', 'Rock'); await token(page, 'Scissors').click(); await page.clock.runFor(1500) },
  'règles': async (page) => { await rulesButton(page).click(); await expect(rules(page)).toBeVisible() },
  'règles Lizard-Spock': async (page) => { await rulesButton(page).click(); await expect(rules(page)).toBeVisible() },
}
for (const width of [320, 375, 767, 768, 1023, 1024, 1366, 1440]) {
  for (const [name, go] of Object.entries(VIEWS)) {
    test(`S8 — ${width} px, ${name} : pas de défilement horizontal`, async ({ page }) => {
      await open(page, width, 800, { clock: true, motion: 'reduce', version: name.includes('Lizard') ? 'bonus' : 'original' })
      await expect(logo(page)).toBeVisible()
      await go(page)
      expect(await noHorizontalScroll(page)).toBe(true)
    })
  }
}

for (const [width, height] of [[1366, 600], [375, 600], [320, 568]]) {
  test(`S8 — ${width} × ${height} : Rules et le choix de version sous le jeu, sans le recouvrir`, async ({ page }) => {
    await open(page, width, height, { clock: true, motion: 'reduce' })
    const below = [await pageBox(rulesButton(page)), await pageBox(switchButton(page, 'original'))]
    for (const sign of ORDER.original) {
      const t = await pageBox(token(page, sign))
      for (const b of below) expect(overlap(b, t), `bouton du bas sur ${sign}`).toBe(false)
    }
    await houseWill(page, 'original', 'Rock')
    await token(page, 'Paper').click()
    await page.clock.runFor(1500)
    await expect(result(page)).toHaveText('You Win')
    const r = await pageBox(rulesButton(page))
    for (const [what, el] of [['Play Again', playAgain(page)], ['résultat', result(page)], ['You Picked', picked(page)], ['The House Picked', housePicked(page)]]) {
      expect(overlap(r, await pageBox(el)), `Rules sur ${what}`).toBe(false)
    }
  })
}
