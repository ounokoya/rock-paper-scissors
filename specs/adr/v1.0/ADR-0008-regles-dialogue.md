# ADR-0008 : Règles en `dialog` natif ; schémas intégrés, corrigés AA ; règles en texte

## Statut
Accepté (2026-11-06) — G2 (Q-A1, Q-A2), G3 (G3-3), règle FM « prefer native element », M55.

## Contexte
La fenêtre des règles doit prendre le focus, le garder, se fermer par Échap, la croix ou le voile (≥ 768 px) et le rendre à « Rules » ; les schémas du starter ont « BEATS » et les flèches à 2,1:1, la croix à 1,5:1 ; « BEATS » doit être en Barlow.

## Options
| Option | Pour | Contre |
|---|---|---|
| **`dialog` + `showModal()`, qui prend le focus lui-même (`tabindex="-1"`) ; schémas SVG intégrés à la page depuis des copies corrigées (choisie)** | Focus, Échap et lecteurs d'écran fournis ; « BEATS » prend la police de la page | Copies des SVG du starter à tenir |
| `<img>` des SVG du starter | Rien à copier | Couleurs sous AA ; une image SVG ne voit pas les polices de la page |

## Décision
- Copies corrigées dans `src/assets/` : `#B1B4C5` → `#6B7087` sur les textes et les flèches seulement (les anneaux restent `#B1B4C5`, décoratifs) ; croix Navy 900 sans opacité ; `viewBox` ajouté pour la mise à l'échelle. Les originaux du starter (`icon-close.svg`, `image-rules.svg`, `image-rules-bonus.svg`) sont retirés d'`images/` (v1.0.3, rapport IA R4) : une seule version de chaque fichier ; l'original reste dans l'historique git et le starter de FM.
- Schéma intégré, `aria-hidden`, son texte en Barlow Semi Condensed 700 par le CSS ; les règles de D1 en liste, masquée à l'écran et lue par les lecteurs d'écran.
- Tab reste dans le dialogue ; voile par `::backdrop` (≥ 768 px), page blanche entière en dessous ; à la fermeture, focus sur « Rules ».

## Conséquences
- Vérifié par S3, S7, S14, S16, A4, A5.
- Fitness function : aucun SVG de `src/assets/` n'a d'original en double dans `images/`.
