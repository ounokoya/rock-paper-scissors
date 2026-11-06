# Maquette Penpot — Rock, Paper, Scissors

> SDL-FM 1.7.0, Phase 3 (avant G3). Fichier Penpot **« rock-paper-scissors »** (nom vérifié avant toute écriture). Planches : `ecrans.png` (écrans clés) et `composants.png` (états). Rendus : export SVG de chaque écran, rendu dans Chromium avec Barlow Semi Condensed (l'export PNG de Penpot n'a pas la police, M16), comparé à la maquette FM avec la mesure du SDL-FM (part des pixels dont un canal diffère de plus de 40).

## Bibliothèque

- **23 couleurs** : les dix teintes des signes et les neutres du guide ; fond (haut `#1F3756`, bas `#141639`) ; disque (`#DBDBDB` → `#F1F1F1`, ombre intérieure `#BABFD3`) ; filets blancs à 29 % (en-tête) et 55 % (boutons) ; AA : croix Navy 900 (Q-A1), « BEATS » et flèches `#6B7087` (Q-A2).
- **9 typographies** Barlow Semi Condensed, en capitales :

| Typographie | Taille / graisse | Espacement |
|---|---|---|
| Résultat (YOU WIN, YOU LOSE) | 56 / 700 | 0 |
| Libellé desktop (YOU PICKED…) | 24 / 700 | 3 px |
| Libellé mobile | 15 / 700 | 1,875 px |
| Chiffre du score | 64 / 700 (mobile 40) | 0 |
| Libellé du score | 14 / 700 (mobile 10) | 3 px (mobile 1,5) |
| Boutons (RULES, PLAY AGAIN, choix de version) | 16 / 600 | 2,5 px |
| Titre des règles | 32 / 700 | 0 |

**Correction de la Phase 2** : les tailles de l'analyse étaient sous-estimées (le calage prenait la plus petite taille de même hauteur arrondie). Recalculées avec la hauteur de capitale réelle de Barlow (0,70 em) : boutons 16 px et non 14, libellé du score 14 px et non 12, titre des règles 32 px.

## Composants et construction

- **Jeton** (5 signes, toute taille) : bord foncé (teinte 600/700/800) décalé vers le bas de 3,6 % du diamètre ; face en léger dégradé (teinte claire → teinte 500) ; disque blanc à 152/198 du diamètre, en dégradé, ombre intérieure en haut ; icône du starter à l'échelle disque / 111, abaissée de 3,5/198 du diamètre (ciseaux décalés de 4/198 vers la gauche). Tailles : 198 (étape 1 desktop), 291 (étapes 2 à 4), 129 (mobile), 144 (Lizard-Spock desktop), 95 (Lizard-Spock mobile).
- **Halos du gagnant** : trois disques blancs à 3 %, rayons 1,45, 1,92 et 2,44 fois celui du jeton.
- **Bouton à filet** (Rules, choix de version) et **Play Again** : états de `composants.png`.
- **Voile** des règles : noir à 50 %.
- **Contour au clavier** de la zone du jeu et de la fenêtre des règles, focalisées par le script (v1.0.3, rapport IA R3) : blanc de 3 px autour (zone : 12 px ; boîte des règles : 4 px) ; page des règles mobile : Navy 900 à 8 px à l'intérieur ; planche `composants.png`, en bas à droite.

## Écrans et calage (rendu de la maquette Penpot contre maquette FM)

| Écran | Écart |
|---|---|
| Desktop, étape 1 | 0,94 % |
| Desktop, étape 4 gagnée | 1,50 % |
| Desktop, règles (corrections AA) | 0,56 % |
| Desktop, Lizard-Spock | 1,40 % |
| Mobile, étape 1 | 2,59 % |
| Mobile, étape 4 gagnée | 2,96 % |
| Mobile, règles (corrections AA) | 0,82 % |
| Mobile, Lizard-Spock | 2,87 % |
| Tablette 768, étape 4 | pas de maquette FM (Q-L1) |

Le bouton de choix de version, absent des maquettes FM, compte pour 0,5 à 1 point sur mobile. Mesures de contrôle : logo, « SCORE », chiffre, texte de Rules et icônes des jetons à 1 ou 2 px de la maquette FM.

## Points G3

| # | Point | Proposition |
|---|---|---|
| G3-1 | Choix de version (Q-B1) | Visible **seulement à l'étape 1** (pas de changement de jeu en cours de partie) ; desktop : à gauche de Rules, (1009, 695) 180 × 42 ; mobile : au-dessus de Rules, centré, (97,5 ; 595) ; libellé « LIZARD-SPOCK » dans le jeu de base, « ORIGINAL » dans Lizard-Spock |
| G3-2 | États (Q-B5, Q-B6) | Jeton : survol = halo blanc à 10 %, focus = contour blanc 3 px décalé ; Rules et choix de version : survol = fond blanc à 10 %, focus = contour blanc ; Play Again : survol = texte Red 800 `#9C1633` (8,2:1), focus = contour blanc ; croix des règles : Navy 900, focus = contour Navy |
| G3-3 | Règles AA (Q-A1, Q-A2) | Croix Navy 900 à 100 % ; « BEATS » et flèches `#6B7087` ; les anneaux du schéma restent `#B1B4C5` (décoratifs) |
| G3-4 | Tablette (Q-L1) | De 768 à 1023 px : grille desktop, résultat et Play Again sous les deux jetons à l'étape 4 ; Rules en bas à droite |
| G3-5 | Typographies | Tailles corrigées ci-dessus (boutons 16 px, libellé du score 14 px, titre des règles 32 px) |
| G3-6 | Seuil visuel | 5 % par écran pour le code contre les maquettes FM (la maquette Penpot est à 0,56–2,96 %) ; depuis v1.0.5, 5 % aussi par zone (en-tête, jeu, bas de page ; règles : fenêtre, page derrière), le choix de version exclu |
| G3-7 | Égalité (Q-B3) | Même mise en page que le résultat : « DRAW », pas de halo, score inchangé (pas dessinée : elle reprend l'étape 4) |
