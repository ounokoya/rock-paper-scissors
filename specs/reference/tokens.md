# Tokens — Rock, Paper, Scissors

> SDL-FM 1.7.0, Phase 1. Valeurs du `style-guide.md` du starter seulement ; ce qui manque (tailles, espacements, rayons, ombres, rôles exacts des teintes) est mesuré sur les maquettes JPG en Phase 2. Pas de fichier Figma (règle de Koya).

## Largeurs des maquettes

| Maquette | Largeur | Hauteur de l'image |
|---|---|---|
| Mobile | 375 px | 750 px |
| Desktop | 1366 px | 768 px |

Le guide demande un rendu juste de 320 px aux grands écrans.

## Couleurs

Valeurs HSL du guide ; hexadécimal calculé (arrondi au plus proche).

### Signes (deux teintes chacun ; le rôle de chaque teinte est vérifié en Phase 2)

| Nom du guide | HSL | Hex |
|---|---|---|
| Gold 500 | hsl(39, 89%, 49%) | `#ec9e0e` |
| Gold 600 | hsl(28, 76%, 44%) | `#c56b1b` |
| Blue 500 | hsl(230, 89%, 62%) | `#4865f4` |
| Blue 700 | hsl(229, 64%, 46%) | `#2a46c0` |
| Red 600 | hsl(349, 71%, 52%) | `#dc2e4e` |
| Red 800 | hsl(347, 75%, 35%) | `#9c1633` |
| Purple 600 | hsl(261, 73%, 60%) | `#834fe3` |
| Purple 700 | hsl(261, 51%, 44%) | `#5f37a9` |
| Light blue 400 | hsl(189, 59%, 53%) | `#40b9ce` |
| Light blue 500 | hsl(194, 58%, 42%) | `#2d8ca9` |

### Neutres

| Nom du guide | Rôle donné par le guide | HSL | Hex |
|---|---|---|---|
| Navy 900 | texte sombre | hsl(229, 25%, 31%) | `#3b4363` |
| Blue 700 | texte du score | hsl(229, 64%, 46%) | `#2a46c0` |
| Gray 600 | contour de l'en-tête | hsl(246, 11%, 37%) | `#565469` |

### Fond

Dégradé radial de hsl(214, 47%, 23%) (`#1f3756`) à hsl(237, 48%, 15%) (`#141639`).

## Typographie

- Famille : Barlow Semi Condensed.
- Graisses : 600 et 700.

## Images du starter

`images/` : `logo.svg` et `logo-bonus.svg` (titres des deux versions), `icon-rock.svg`, `icon-paper.svg`, `icon-scissors.svg`, `icon-lizard.svg`, `icon-spock.svg`, `bg-triangle.svg` et `bg-pentagon.svg` (liens entre les signes), `image-rules.svg` et `image-rules-bonus.svg` (schémas des règles), `icon-close.svg`, `favicon-32x32.png`. Depuis v1.0.3, ces trois derniers SVG ne sont plus dans `images/` : seules leurs copies corrigées AA, dans `src/assets/`, servent (ADR-0008).
