import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { open, SIGNS, RULES, LOGO, TITLE, SWITCH, houseWill, banner, main, logo, token, picked, housePicked, result, rulesButton, switchButton, rules, closeRules, expectStep } from './helpers.js'

// Spec §7 et §8 — S16 : axe-core sans violation sérieuse ou critique ; A1, A2, A4, A10 ; S18 : titre, langue, un seul h1

const first = { original: 'Paper', bonus: 'Scissors' }
const VIEWS = {
  'étape 1': async (page, v) => { await expectStep(page, 1, { version: v }) },
  'étape 2': async (page, v) => { await houseWill(page, v, 'Rock'); await token(page, first[v]).click(); await expectStep(page, 2, { version: v, mine: first[v] }) },
  'étape 3': async (page, v) => { await houseWill(page, v, 'Rock'); await token(page, first[v]).click(); await page.clock.runFor(1000); await expectStep(page, 3, { version: v, mine: first[v], theirs: 'Rock' }) },
  'étape 4': async (page, v) => { await houseWill(page, v, 'Rock'); await token(page, first[v]).click(); await page.clock.runFor(1500); await expectStep(page, 4, { version: v, mine: first[v], theirs: 'Rock' }) },
  'règles': async (page) => { await rulesButton(page).click(); await expect(rules(page)).toBeVisible() },
}

for (const version of ['original', 'bonus']) {
  for (const width of [375, 768, 1440]) {
    for (const [name, go] of Object.entries(VIEWS)) {
      test(`S16 — axe-core : ${name}, ${version}, ${width} px`, async ({ page }) => {
        await open(page, width, 900, { version, clock: true })
        await go(page, version)
        // axe attend ses propres minuteries : l'horloge de la page reprend (la vue peut alors passer à l'étape suivante)
        await page.clock.resume()
        const { violations } = await new AxeBuilder({ page }).analyze()
        const serious = violations.filter((v) => ['serious', 'critical'].includes(v.impact))
        expect(serious.map((v) => `${v.id} : ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
      })
    }
  }
}

for (const [name, go] of Object.entries(VIEWS)) {
  test(`A2 — ${name} : un en-tête (banner), un contenu (main) ; rien hors des repères (axe « region »)`, async ({ page }) => {
    await open(page, 1440, 900, { clock: true })
    await go(page, 'original')
    await expect(banner(page)).toHaveCount(1)
    await expect(main(page)).toHaveCount(1)
    await page.clock.resume()
    const { violations } = await new AxeBuilder({ page }).withRules(['region']).analyze()
    expect(violations.map((v) => `${v.id} : ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
  })
}

for (const version of ['original', 'bonus']) {
  test(`S18, A1 — ${version} : titre de la page, langue en, un seul h1 (le logo), h2 du résultat`, async ({ page }) => {
    await open(page, 1440, 900, { version, clock: true })
    await expect(page).toHaveTitle(TITLE[version])
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(logo(page)).toHaveAccessibleName(LOGO[version])
    await houseWill(page, version, 'Rock')
    await token(page, 'Rock').click()
    await page.clock.runFor(1500)
    await expect(result(page)).toHaveText('Draw')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })

  test(`A4 — ${version} : les règles en texte, dans l'ordre du README ; schéma et liens décoratifs`, async ({ page }) => {
    await open(page, 1440, 900, { version })
    // étape 1 : les liens du triangle ou du pentagone ne sont pas des images exposées ; une image ne peut être que le signe d'un jeton
    await expectStep(page, 1, { version })
    const images = main(page).getByRole('img')
    for (let i = 0; i < await images.count(); i++) await expect(images.nth(i)).toHaveAccessibleName(new RegExp(`^(${SIGNS[version].join('|')})$`))
    await rulesButton(page).click()
    await expect(rules(page).getByRole('listitem')).toHaveText(RULES[version].map(([w, l]) => `${w} beats ${l}`))
    await expect(rules(page).getByRole('img')).toHaveCount(0)
    await expect(closeRules(page)).toBeVisible()
  })

  test(`A3 — ${version} : aux étapes 2 à 4, les signes sont des images nommées dans deux figures ; aucun jeton n'est un bouton`, async ({ page }) => {
    await open(page, 1440, 900, { version, clock: true })
    await houseWill(page, version, 'Paper')
    await token(page, 'Rock').click()
    await page.clock.runFor(1500)
    await expect(picked(page).getByRole('img')).toHaveAccessibleName('Rock')
    await expect(housePicked(page).getByRole('img')).toHaveAccessibleName('Paper')
    await expect(main(page).getByRole('button')).toHaveText([/play again/i, /rules/i])
  })

  test(`A10 — ${version} : le nom du choix de version contient son libellé visible`, async ({ page }) => {
    await open(page, 1440, 900, { version })
    const b = switchButton(page, version)
    await expect(b).toHaveAccessibleName(SWITCH[version])
    const label = (await b.innerText()).trim().toLowerCase()
    expect(label.length).toBeGreaterThan(0)
    expect(SWITCH[version].toLowerCase()).toContain(label)
  })
}
