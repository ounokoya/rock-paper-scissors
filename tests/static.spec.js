import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { HtmlValidate } from 'html-validate'
import { ESLint } from 'eslint'
import { open, houseWill, logo, token, result, rulesButton, rules, switchButton } from './helpers.js'

// Spec §8 — S17 : validateur W3C Nu, html-validate et eslint au réglage de FM, gardes des règles FM déjà vues

const root = (path) => new URL(`../${path}`, import.meta.url).pathname
const vnu = root('node_modules/vnu-jar/build/dist/vnu.jar')
const w3c = (html) => {
  try { execFileSync('java', ['-jar', vnu, '--errors-only', '--format', 'text', '-'], { input: html, encoding: 'utf8', stdio: 'pipe' }); return '' } catch (error) { return `${error.stdout}${error.stderr}` }
}
const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'doctype-style': 'off', 'void-style': 'off' } })
const rendered = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'doctype-style': 'off', 'void-style': 'off', 'attribute-boolean-style': ['error', { style: 'empty' }], 'attribute-empty-style': ['error', { style: 'empty' }], 'no-trailing-whitespace': 'off' } })
const htmlErrors = async (html, served) => (await (served ? validator : rendered).validateString(html)).results.flatMap((r) => r.messages).map((m) => `${m.line}:${m.column} ${m.ruleId} — ${m.message}`)

// Le HTML servi, puis le document rendu de chaque vue (le jeu est construit dans le navigateur)
async function documents(page, request) {
  const docs = { 'HTML servi': await (await request.get('./')).text() }
  const dom = () => page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)
  await open(page, 1440, 900, { clock: true })
  await expect(logo(page)).toBeVisible()
  docs['étape 1'] = await dom()
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  docs['étape 2'] = await dom()
  await page.clock.runFor(1500)
  await expect(result(page)).toBeVisible()
  docs['étape 4'] = await dom()
  await rulesButton(page).click()
  await expect(rules(page)).toBeVisible()
  docs['règles'] = await dom()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Play Again', exact: true }).click()
  await switchButton(page, 'original').click()
  docs['étape 1 Lizard-Spock'] = await dom()
  await rulesButton(page).click()
  await expect(rules(page)).toBeVisible()
  docs['règles Lizard-Spock'] = await dom()
  return docs
}

test('S17 — validateur W3C Nu : aucune erreur (HTML servi et vues rendues)', async ({ page, request }) => {
  test.setTimeout(90_000)
  for (const [name, html] of Object.entries(await documents(page, request))) expect.soft(w3c(html), name).toBe('')
})

test('S17 — Règles FM : html-validate sans erreur (HTML servi et vues rendues)', async ({ page, request }) => {
  for (const [name, html] of Object.entries(await documents(page, request))) expect.soft(await htmlErrors(html, name === 'HTML servi'), name).toEqual([])
})

test('S17 — Règles FM : eslint sans erreur dans le JavaScript du dépôt', async () => {
  expect(existsSync(root('src')), 'src/').toBe(true)
  const eslint = new ESLint({ cwd: root(''), errorOnUnmatchedPattern: false })
  const results = await eslint.lintFiles(['src', 'tests', 'scripts', '*.js'])
  expect(results.flatMap((r) => r.messages.map((m) => `${r.filePath.split('/').slice(-2).join('/')}:${m.line} ${m.ruleId} — ${m.message}`))).toEqual([])
})

// CSS écrit à la main : fichiers .css et blocs <style> des composants
const files = (dir) => readdirSync(dir).flatMap((f) => statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)])
const css = () => files(root('src')).flatMap((f) => f.endsWith('.css') ? [readFileSync(f, 'utf8')] : f.endsWith('.svelte') ? [...readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]) : [])
  .join('\n').replace(/\/\*[\s\S]*?\*\//g, '')

test('Règles FM — aucune longueur en px écrite à la main (CSS du dépôt)', () => {
  expect(existsSync(root('src')), 'src/').toBe(true)
  const text = css()
  expect(text.length, 'CSS du jeu').toBeGreaterThan(0)
  expect(text.match(/\b\d+(\.\d+)?px\b/g) ?? []).toEqual([])
})

test('Règles FM — aria-label seulement sur un élément interactif ou un repère', async ({ page }) => {
  await open(page, 1440, 900, { clock: true })
  await expect(logo(page)).toBeVisible()
  const misused = () => page.evaluate(() => {
    const ok = 'a[href], button, input, select, textarea, summary, iframe, img, area, form, fieldset, figure, table, td, th, main, nav, header, footer, aside, section, dialog, svg, [role]'
    return [...document.querySelectorAll('[aria-label]')].filter((el) => !el.matches(ok)).map((el) => `<${el.localName} aria-label="${el.getAttribute('aria-label')}">`)
  })
  expect(await misused()).toEqual([])
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  await page.clock.runFor(1500)
  expect(await misused()).toEqual([])
  await rulesButton(page).click()
  expect(await misused()).toEqual([])
})

test('Règles FM — CSS : propriétés logiques et longueurs en fonctions', () => {
  expect(existsSync(root('src')), 'src/').toBe(true)
  const text = css().replace(/@theme[^{]*{[\s\S]*?\n}/g, '').replace(/@font-face\s*{[^}]*}/g, '')
  const declarations = [...text.matchAll(/(^|[;{\s])([a-z-]+)\s*:\s*([^;{}]+);/g)].map((m) => [m[2], m[3].trim()])
  const physical = /^(padding|margin|border)-(left|right|top|bottom)(-width)?$|^(min-|max-)?(width|height)$|^(top|left|right|bottom)$/
  const sized = /^(padding|margin|gap|inset)(-|$)|^(min-|max-)?(inline-size|block-size)$|^border-(block|inline)/
  const found = []
  for (const [prop, value] of declarations) {
    if (physical.test(prop)) found.push(`${prop}: ${value} (propriété physique)`)
    if (prop === 'text-align' && /^(left|right)$/.test(value)) found.push(`text-align: ${value} (propriété physique)`)
    if (sized.test(prop) && /\d(\.\d+)?(rem|em|px)\b/.test(value.replace(/(calc|min|max|clamp)\([^)]*\)/g, ''))) found.push(`${prop}: ${value} (longueur fixe)`)
  }
  expect(found).toEqual([])
})
