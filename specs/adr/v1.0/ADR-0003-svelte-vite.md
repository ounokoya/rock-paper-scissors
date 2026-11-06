# ADR-0003 : Svelte 5 et Vite, une application d'une page sans SvelteKit

## Statut
Accepté (2026-11-06) — Pré-dev 1 (P2).

## Contexte
Un jeu en quatre étapes, deux versions, un score par version, une fenêtre des règles : un état partagé entre l'en-tête (score, logo), le jeu, les boutons du bas et le dialogue.

## Options
| Option | Pour | Contre |
|---|---|---|
| **Svelte 5 + Vite + Tailwind v4, kit du Kanban (choisie)** | Runes (`$state`, `$derived`) pour l'état ; outils, tests et leçons de l'Invoice et du Kanban | Un cadriciel de plus que le JavaScript seul |
| HTML + JavaScript sans cadriciel | Aucune dépendance | Mise à jour du DOM à écrire pour chaque étape |

## Décision
- Svelte 5 (runes), Vite, Tailwind CSS v4 ; un état central dans `src/lib/game.svelte.js`, le stockage dans `src/lib/storage.js` ; règles pures dans `src/lib/rules.js` (`SIGNS`, `RULES`, `beats`, `outcome`, `housePick`, `nextScore`, `readScore`, `readVersion`).
- Build statique publié sous `/rock-paper-scissors/` (ADR-0011).

## Conséquences
- Règles testées sans navigateur (U1 à U5, `node --test`) ; parties et écrans dans Playwright.
- Fitness function : `src/lib/rules.js` n'importe rien et ne touche ni au DOM, ni au stockage, ni au hasard (le tirage lui est passé).
