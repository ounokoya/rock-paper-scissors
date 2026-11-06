# Analyse visuelle — Rock, Paper, Scissors

> SDL-FM 1.7.0, Phase 2 (avant G2). Schéma : `rock-paper-scissors-analyse.png` (source `.excalidraw`, canevas partagé x 131 000). Maquettes JPG du starter à l'échelle 1 (desktop 1366 × 768, mobile 375 × 750), mesurées au pixel dans Chromium ; tailles de police calées sur l'encre avec Barlow Semi Condensed (±1 px, affinées en Phase 3). Pas de fichier Figma.
> **Corrigé en Phase 3** : les tailles ci-dessous sont sous-estimées de 2 px environ (boutons et « PLAY AGAIN » 16 px, libellé du score 14 px, titre des règles 32 px) ; valeurs retenues dans `penpot/maquette.md`.

## 1. Structure

### Desktop (1366 × 768)

| # | Élément | Mesure |
|---|---|---|
| 1 | En-tête | (331, 46) 704 × 154 ; filet 3 px blanc à ~29 % (#5d6e88 mesuré ; le guide nomme « Gray 600 » #565469) ; coins ≈ 15–20 px ; fond transparent |
| 2 | Titre | `logo.svg` 162 × 99 à sa taille ; encre (367, 76) 155 × 92 ; centré en hauteur |
| 3 | Score | (859, 66) 150 × 114, blanc (#f9f9f9 → #f5f3f4) ; « SCORE » Blue 700 ≈ 12 px gras, espacement ≈ 3,5 px ; chiffre ≈ 64 px gras, ≈ Gray 600 |
| 4–6 | Jetons (étape 1) | Ø 198 + bord de 5 à 7 px (teinte foncée) ; disque blanc Ø 152 (anneau 23 px) avec ombre intérieure en haut ; icônes à 4/3 de leur taille ; centres papier (544, 361), ciseaux (822, 361), pierre (683, 588) ; `bg-triangle.svg` 313 × 278 noir à 20 % |
| 7 | Rules | (1205, 695) 130 × 42 ; filet 2 px blanc à ~55 % ; coins ~8 px ; « RULES » ≈ 14 px demi-gras, espacement ≈ 3 px ; 32 px des bords |
| — | Libellés étapes 2 à 4 | « YOU PICKED » (y 279) et « THE HOUSE PICKED » ≈ 24 px gras blanc, espacement ≈ 3 px |
| — | Grands jetons | Ø 291 + bord ~11 px ; disque Ø 225 ; icônes ×2 ; étapes 2 et 3 : centres x 494 et 859 ; étape 4 : x 350 et 995 |
| — | Place de la maison (étape 2) | disque Ø 225 noir à ~10 % |
| — | Résultat | « YOU WIN » / « YOU LOSE » ≈ 56 px gras, espacement ≈ 1 px, (587, 447) |
| — | Play Again | (573, 513) 220 × 48, blanc, coins ~8 px ; « PLAY AGAIN » ≈ 14 px demi-gras, espacement ≈ 3 px, Navy 900 |
| — | Halos du gagnant | 3 disques blancs à ~3 % (rayons ≈ 211, 280, 355 px pour un jeton de 146) ; décoratifs |
| — | Règles | boîte (483, 177) 400 × 415, coins ~8 px ; « RULES » ≈ 32 px gras Navy 900 ; croix 19 × 19 en haut à droite ; `image-rules.svg` 304 × 270 ; voile noir à 50 % |

### Mobile (375 × 750)

| Élément | Mesure |
|---|---|
| En-tête | (30, 30) 315 × 100, filet 3 px, coins ~8 px ; logo à 50 % (81 × 49) ; score (251, 44) 80 × 72, « SCORE » ≈ 10 px, chiffre ≈ 40 px |
| Jetons | Ø 129 + bord ~4 px, disque Ø 99 (anneau 15 px) ; mêmes places aux étapes 1 à 4 (x 30 et 219 aux étapes 2 à 4) |
| Libellés | sous les jetons, y 388, ≈ 15 px, espacement ≈ 2,5 px |
| Résultat, Play Again | « YOU WIN » ≈ 56 px (92, 488) ; bouton (78, 554) 220 × 48 |
| Rules | (123, 653) 130 × 42, centré, 55 px du bas |
| Règles | page entière blanche ; titre centré y 102 ; image 304 × 270 ; croix centrée en bas (179, 665) |

### Version Lizard-Spock

`logo-bonus.svg` 115 × 114 (≈ 47 % sur mobile) ; cinq jetons Ø 144 (mobile Ø 94–96), disque Ø 111 (74) sur `bg-pentagon.svg` (329 × 313, noir à 20 %) : ciseaux en haut, papier à droite, pierre en bas à droite, lézard en bas à gauche, Spock à gauche ; lézard Purple 600/700, Spock Light blue 400/500 ; étapes 2 à 4 sur la même grille que le jeu de base ; règles : boîte 400 × 461, `image-rules-bonus.svg` 340 × 330.

## 2. Comportement

Une partie : étape 1, choisir un signe (clic, Entrée ou Espace) → étape 2, mon signe en grand, place de la maison vide → étape 3, la maison choisit au hasard (même probabilité) → étape 4, résultat, score ±1, halo du gagnant, annonce → « Play Again » → étape 1. Gagner +1, perdre −1 (README). « Rules » ouvre la fenêtre des règles (Échap, croix ou voile la ferment ; le focus revient à « Rules »). Score gardé au rechargement.

## 3. Inventaire des éléments interactifs

| Élément | Normal | Survol | Focus | Remarque |
|---|---|---|---|---|
| Jetons | anneau + disque | proposition : halo blanc léger | contour blanc 3 px décalé | désactivés après le choix |
| Rules | filet blanc | proposition : fond blanc à 10 % | contour blanc décalé | ouvre la fenêtre |
| Play Again | blanc, texte navy | texte rouge (Q-B6) | contour blanc décalé | relance |
| Croix des règles | gris clair | Navy 900 | contour Navy | ferme |
| Choix de version (ajouté) | à dessiner en Phase 3 | comme Rules | contour blanc | Q-B1 |

Aucun survol ni focus n'est dessiné par FM : tous sont des propositions.

## 4. Contrastes

Blanc sur le fond : 12:1 à 17:1 ✓ ; « SCORE » #2a46c0 sur blanc : 7,7:1 ✓ ; chiffre #565469 : 7,3:1 ✓ ; « PLAY AGAIN » #3b4363 : 9,7:1 ✓ (en rouge #9c1633 : 8,2:1 ; #dc2e4e : 4,6:1) ; titre des règles : 9,7:1 ✓. **Sous le seuil** : croix des règles ~#d2d3d8 sur blanc 1,5:1 (icône seule d'un bouton, 3:1 requis) ; « BEATS » et flèches de `image-rules.svg` #b1b4c5 sur blanc 2,1:1 (texte d'image). Décoratifs : filet de l'en-tête, triangle, pentagone, halos, place vide.

## 5. Questions pour G2

| # | Question | Proposition |
|---|---|---|
| Q-A1 | Croix des règles à 1,5:1 | Navy 900 #3b4363 à 100 % (9,7:1), même dessin |
| Q-A2 | « BEATS » et flèches à 2,1:1 | SVG intégré à la page, « BEATS » et flèches en #6b7087 (4,9:1) ; règles aussi en texte pour les lecteurs d'écran (« Paper beats Rock »…) |
| Q-B1 | Passage d'une version à l'autre (pas de dessin FM) | Bouton « Lizard-Spock » / « Original » à côté de « Rules », même style ; version gardée ; un score par version |
| Q-B2 | Rythme de la partie | Étape 2 pendant 1 s, étape 3 pendant 0,5 s, puis le résultat ; sans mouvement si `prefers-reduced-motion` (mêmes étapes) |
| Q-B3 | Égalité (non dessinée) ; score négatif | « DRAW », score inchangé, pas de halo ; score négatif permis (le README dit « perd un point ») |
| Q-B4 | Clavier et annonces | Jetons = boutons nommés (« Paper »…), désactivés après le choix ; focus sur « Play Again » à l'étape 4 ; résultat annoncé (« You picked Paper, the house picked Rock: you win, score 13 ») |
| Q-B5 | Survols | Jetons : léger halo blanc ; Rules : fond blanc à 10 % |
| Q-B6 | « PLAY AGAIN » rouge sur un seul écran (desktop perdu, bouton plus haut : curseur ?), navy sur les autres écrans perdus | Lu comme le survol : navy au repos, rouge au survol |
| Q-L1 | Point de rupture | Mise en page desktop dès 768 px ; à l'étape 4 entre 768 et 1023 px, résultat sous les jetons (comme sur mobile) ; grille desktop complète dès 1024 px |
| Q-L2 | Pied d'attribution du starter | Retiré (absent des maquettes) ; crédit FM dans le README |
