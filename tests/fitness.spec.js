import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { open, KEYS, houseWill, logo, token, result, playAgain, switchButton } from './helpers.js'

// Fitness functions des ADR-0003 à ADR-0011 (specs/adr/v1.0)

const root = (path) => new URL(`../${path}`, import.meta.url).pathname
const files = (dir) => readdirSync(dir).flatMap((f) => statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)])
const COLOR = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/i
const code = (text) => text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--[\s\S]*?-->/g, '')

test('ADR-0003 — src/lib/rules.js n\'importe rien et ne touche ni au DOM, ni au stockage, ni au hasard', () => {
  expect(existsSync(root('src/lib/rules.js')), 'src/lib/rules.js').toBe(true)
  const text = code(readFileSync(root('src/lib/rules.js'), 'utf8'))
  expect(text).not.toMatch(/^\s*import\b/m)
  expect(text).not.toMatch(/\b(document|window|localStorage|sessionStorage|Math\.random|setTimeout|fetch)\b/)
})

test('ADR-0004 — aucune couleur écrite en dur dans src/ hors des valeurs de tokens de src/app.css', () => {
  expect(existsSync(root('src/app.css')), 'src/app.css').toBe(true)
  const found = []
  for (const f of files(root('src')).filter((f) => /\.(svelte|css|js)$/.test(f))) {
    let text = readFileSync(f, 'utf8')
    if (f.endsWith('app.css')) text = text.replace(/--[\w-]+\s*:[^;]+;/g, '')
    if (COLOR.test(code(text))) found.push(f.split('/src/')[1])
  }
  expect(found).toEqual([])
})

test('ADR-0005 — rien n\'est chargé hors du domaine ; Barlow Semi Condensed 600 et 700 se chargent ; une seule dépendance d\'exécution', async ({ page, baseURL }) => {
  const outside = []
  page.on('request', (r) => { if (!r.url().startsWith('data:') && new URL(r.url()).origin !== new URL(baseURL).origin) outside.push(r.url()) })
  await open(page, 1440)
  await expect(logo(page)).toBeVisible()
  const faces = ['600 16px "Barlow Semi Condensed"', '700 16px "Barlow Semi Condensed"']
  const found = await page.evaluate(async (list) => { const ok = []; for (const f of list) if ((await document.fonts.load(f)).length) ok.push(f); return ok }, faces)
  expect(found).toEqual(faces)
  expect(outside).toEqual([])
  const pkg = JSON.parse(readFileSync(root('package.json'), 'utf8'))
  expect(Object.keys(pkg.dependencies ?? {})).toEqual(['@fontsource/barlow-semi-condensed'])
})

test('ADR-0007 — seul src/lib/storage.js touche au stockage du navigateur', () => {
  const users = files(root('src')).filter((f) => /\.(svelte|js)$/.test(f) && /\blocalStorage\b/.test(code(readFileSync(f, 'utf8'))))
  expect(users.map((f) => f.split('/src/')[1])).toEqual(['lib/storage.js'])
})

test('ADR-0007 — la page n\'écrit que les trois clés de D5', async ({ page }) => {
  await open(page, 1440, 900, { clock: true })
  await houseWill(page, 'original', 'Rock')
  await token(page, 'Paper').click()
  await page.clock.runFor(1500)
  await expect(result(page)).toBeVisible()
  await playAgain(page).click()
  await switchButton(page, 'original').click()
  const keys = await page.evaluate(() => Object.keys(localStorage).sort())
  expect(keys).toEqual([KEYS.original, KEYS.version].sort())
  expect(keys.every((k) => Object.values(KEYS).includes(k))).toBe(true)
})

test('ADR-0008 — les SVG corrigés AA de src/assets/ n\'ont pas d\'original en double dans images/', () => {
  const corrected = readdirSync(root('src/assets')).filter((f) => f.endsWith('.svg'))
  expect(corrected.length).toBeGreaterThan(0)
  expect(corrected.filter((f) => existsSync(root(`images/${f}`)))).toEqual([])
})

test('ADR-0010 — aucun fichier de maquette éditable suivi par git', () => {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root(''), encoding: 'utf8' }).split('\n')
  expect(tracked.length).toBeGreaterThan(10)
  expect(tracked.filter((f) => /\.(fig|sketch|xd)$/i.test(f))).toEqual([])
})

test('ADR-0011 — la base de Vite est /rock-paper-scissors/', () => {
  expect(readFileSync(root('vite.config.js'), 'utf8')).toMatch(/base:\s*'\/rock-paper-scissors\/'/)
})
