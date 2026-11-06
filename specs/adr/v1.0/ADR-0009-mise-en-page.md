# ADR-0009 : Mise en page en trois paliers ; plateaux des jetons à proportions fixes

## Statut
Accepté (2026-11-06) — G2 (Q-L1), G3 (G3-4).

## Contexte
Positions de la maquette au pixel à 375 et 1366 px ; triangle et pentagone où chaque jeton est posé sur un sommet ; sous 375 px, tout doit tenir dans la largeur ; règles FM : longueurs en `rem`, propriétés logiques.

## Options
| Option | Pour | Contre |
|---|---|---|
| **Plateau (triangle ou pentagone) dimensionné en `rem` avec `min()` sur la largeur de la fenêtre, jetons placés en pourcentage du plateau ; étapes 2 à 4 en grille (choisie)** | Les positions de la maquette exactes, réduites à proportion sous 375 px | Positions à calculer une fois depuis la maquette |
| Flexbox et marges | Moins de calcul | Triangle et pentagone approximatifs |

## Décision
- Moins de 768 px : maquette mobile ; 768 à 1023 px : maquette desktop, résultat sous les jetons ; 1024 px et plus : résultat entre les jetons.
- Halos coupés aux bords de la page (aucun défilement horizontal) ; boutons du bas sous le jeu quand la fenêtre est basse.

## Conséquences
- Vérifié par S5 à S8, S19.
