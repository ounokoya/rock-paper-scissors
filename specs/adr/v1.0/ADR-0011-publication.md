# ADR-0011 : Publication sur GitHub Pages sous /rock-paper-scissors/

## Statut
Accepté (2026-11-06) — Pré-dev 1 (P1).

## Contexte
FM demande un site en ligne et un dépôt public.

## Options
| Option | Pour | Contre |
|---|---|---|
| **Branche `gh-pages` publiée par `npm run deploy` (choisie)** | Comme les solutions précédentes ; pas de workflow Actions | Une étape manuelle |
| GitHub Actions | Automatique | Jeton sans droit `workflow` par défaut (M1) |

## Décision
- `base: '/rock-paper-scissors/'` dans Vite ; dépôt public `ounokoya/rock-paper-scissors`, avec l'accord de Koya.

## Conséquences
- Tests en ligne : `BASE_URL=https://ounokoya.github.io/rock-paper-scissors/ npx playwright test`.
- Fitness function : la base de Vite est `/rock-paper-scissors/`.
