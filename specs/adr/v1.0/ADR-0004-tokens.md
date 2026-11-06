# ADR-0004 : Tokens de la maquette dans `src/app.css`, teintes AA comprises

## Statut
Accepté (2026-11-06) — G2 (Q-A1, Q-A2), G3 (G3-3, G3-5).

## Contexte
Dix teintes de signes, les neutres du guide de style, le fond en dégradé, le disque des jetons, les filets, les halos ; deux teintes AA (croix des règles Navy 900, « BEATS » et flèches `#6b7087`) ; sept typographies.

## Options
| Option | Pour | Contre |
|---|---|---|
| **Tokens dans `src/app.css` (`@theme`), composants qui n'écrivent que des rôles (choisie)** | Une seule source, comme le Kanban | — |
| Couleurs dans chaque composant | Rien à nommer | Teintes AA et dégradés dispersés |

## Décision
- Couleurs, dégradés, ombres, typographies et points de rupture (768 et 1024 px) dans `src/app.css`.
- La couleur d'un signe est un token nommé d'après le signe (`--color-rock-face`, `--color-rock-edge`…) ; les règles rendent le nom du signe, jamais sa couleur (U5, M50).
- Les SVG du starter et leurs copies corrigées AA gardent leurs couleurs dans les fichiers `.svg` (ADR-0008).

## Conséquences
- Fitness function : aucune couleur écrite en dur dans les `.svelte`, `.css` et `.js` de `src/` hors des valeurs de tokens de `src/app.css`.
