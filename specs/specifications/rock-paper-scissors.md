# Spec — Rock, Paper, Scissors

> SDL-FM 1.7.0, Phase 4. Sources : analyse validée (G2) `specs/visuel/rock-paper-scissors-analyse.md`, maquette validée (G3) `specs/visuel/penpot/maquette.md` (fichier Penpot « rock-paper-scissors »), tokens `specs/reference/tokens.md`, README et guide de style du starter, décisions dans `specs/brainstorming/2026-11-06-rock-paper-scissors.md`.
> Cette spec dit **quoi** et **pourquoi**, jamais **comment**.

## 1. Objectif

Le jeu Rock, Paper, Scissors contre l'ordinateur (« la maison »), et sa version Rock, Paper, Scissors, Lizard, Spock : on choisit un signe, la maison choisit au hasard, le résultat change le score. Un score par version, gardé au rechargement, comme la version choisie. Mise en page des maquettes à chaque largeur, de 320 px aux grands écrans ; tout se joue à la souris, au toucher ou au clavier seul.

## 2. Données et règles du jeu

| # | Règle | Origine |
|---|---|---|
| D1 | Signes : Original = Rock, Paper, Scissors ; Lizard-Spock = Rock, Paper, Scissors, Lizard, Spock (dans cet ordre, celui du nom du jeu). Victoires (README) : Original : Paper beats Rock, Rock beats Scissors, Scissors beats Paper ; Lizard-Spock : Scissors beats Paper, Paper beats Rock, Rock beats Lizard, Lizard beats Spock, Spock beats Scissors, Scissors beats Lizard, Paper beats Spock, Rock beats Scissors, Lizard beats Paper, Spock beats Rock | README |
| D2 | Résultat : je gagne si mon signe bat celui de la maison, je perds si le sien bat le mien, égalité si c'est le même ; score +1, −1 ou inchangé ; un score négatif est permis | README, Q-B3 |
| D3 | La maison choisit au hasard, chaque signe de la version avec la même chance, sans tenir compte du mien : le n-ième signe de D1, n = ⌊ `Math.random()` × nombre de signes ⌋ (les tests fixent `Math.random`) | Q-B2, G1 |
| D4 | Déroulé d'une partie : étape 1, je choisis ; étape 2 pendant 1 s (mon signe, place de la maison vide) ; étape 3 pendant 0,5 s (le signe de la maison) ; étape 4 : le résultat, le score change et il est gardé à ce moment-là. Recharger avant l'étape 4 abandonne la partie : le score ne change pas | Q-B2 |
| D5 | Un score par version, gardé dans le navigateur : clés `rps/score/original` et `rps/score/bonus` (un entier écrit en base 10) ; la version gardée : `rps/version` (`original` ou `bonus`). Premier passage : Original, scores à 0. Une valeur gardée illisible (pas un entier : vide, `abc`, `1.5`) vaut 0 ; une version inconnue vaut Original | README (bonus), Q-B1 |
| D6 | On change de version seulement à l'étape 1 ; le changement montre l'étape 1 de l'autre version avec son score, et il est gardé | Q-B1, G3-1 |
| D7 | Étape 4 : halos derrière le signe gagnant (le mien si je gagne, celui de la maison si je perds), aucun halo en cas d'égalité | maquettes, G3-7 |

## 3. Écrans et contenu

### 3.1 En-tête (toutes les étapes)

Le titre du jeu, image `logo.svg` (Original) ou `logo-bonus.svg` (Lizard-Spock), `h1` ; la boîte du score : « SCORE » et le score de la version ouverte (D5).

### 3.2 Étape 1 : choisir

Original : trois jetons, Paper (en haut à gauche), Scissors (en haut à droite), Rock (en bas), sur les liens `bg-triangle.svg`. Lizard-Spock : cinq jetons sur `bg-pentagon.svg`, Scissors en haut puis, dans le sens des aiguilles d'une montre, Paper, Rock, Lizard, Spock. Un jeton : bord foncé, face de la couleur du signe, disque blanc, icône du starter (§4).

### 3.3 Étapes 2 à 4 : la partie

« YOU PICKED » et mon jeton en grand ; « THE HOUSE PICKED » et, à l'étape 2, la place vide de la maison (disque sombre), puis son jeton. Étape 4 : « YOU WIN », « YOU LOSE » ou « DRAW » et le bouton « PLAY AGAIN », entre les deux jetons (≥ 1024 px) ou dessous (< 1024 px) ; les halos de D7.

### 3.4 Bas de page

« RULES » à toutes les étapes ; le choix de version à l'étape 1 seulement : « LIZARD-SPOCK » dans la version Original, « ORIGINAL » dans Lizard-Spock (G3-1).

### 3.5 Règles (dialogue modal)

« RULES » (`h2`), la croix de fermeture, le schéma des règles de la version ouverte (`image-rules.svg` ou `image-rules-bonus.svg`, « BEATS » et flèches en `#6b7087`, croix en Navy 900 : G3-3) ; les règles de D1 aussi en texte, lues par les lecteurs d'écran (Q-A2). ≥ 768 px : boîte blanche centrée sur un voile noir à 50 % ; < 768 px : page blanche entière, croix en bas.

La page a la langue `en`, l'icône du starter et pour titre « Rock, Paper, Scissors » (Original) ou « Rock, Paper, Scissors, Lizard, Spock » (Lizard-Spock). Le pied d'attribution du starter est retiré (Q-L2).

## 4. Tokens

Couleurs, typographies et construction : `specs/reference/tokens.md` et bibliothèque Penpot (`specs/visuel/penpot/maquette.md`).

| Rôle | Valeur |
|---|---|
| Fond | dégradé radial `#1f3756` (en haut) → `#141639` |
| Scissors : face · bord | dégradé vers Gold 500 `#ec9e0e` · Gold 600 `#c56b1b` |
| Paper | Blue 500 `#4865f4` · Blue 700 `#2a46c0` |
| Rock | Red 600 `#dc2e4e` · Red 800 `#9c1633` |
| Lizard | Purple 600 `#834fe3` · Purple 700 `#5f37a9` |
| Spock | Light blue 400 `#40b9ce` · Light blue 500 `#2d8ca9` |
| Disque des jetons | `#dbdbdb` → `#f1f1f1`, ombre intérieure en haut `#babfd3` |
| Icônes, texte des boutons blancs, titre et croix des règles | Navy 900 `#3b4363` |
| « SCORE » · chiffre du score | Blue 700 `#2a46c0` · `#565469` |
| Filet de l'en-tête · des boutons à filet | blanc à 29 % · à 55 % |
| Halos du gagnant | 3 disques blancs à 3 %, rayons 1,45, 1,92 et 2,44 fois celui du jeton |
| Place vide de la maison | noir à 10 % |
| Survol de « PLAY AGAIN » | Red 800 `#9c1633` |

Jeton : bord décalé vers le bas de 3,6 % du diamètre ; disque blanc de 152/198 du diamètre ; icône à l'échelle disque / 111, abaissée de 3,5/198 du diamètre. Diamètres : 198 (étape 1 desktop), 144 (Lizard-Spock desktop), 291 (étapes 2 à 4, ≥ 768 px), 129 (mobile), 95 (Lizard-Spock mobile).

Barlow Semi Condensed, en capitales :

| Typographie | Taille / graisse | Espacement |
|---|---|---|
| Résultat | 56 / 700 | 0 |
| Libellés « YOU PICKED »… | 24 / 700 (< 768 px : 15 / 700) | 3 px (1,875 px) |
| Chiffre du score | 64 / 700 (< 768 px : 40) | 0 |
| « SCORE » | 14 / 700 (< 768 px : 10) | 3 px (1,5 px) |
| Boutons (RULES, PLAY AGAIN, choix de version) | 16 / 600 | 2,5 px |
| Titre des règles | 32 / 700 | 0 |

## 5. Mise en page

| Largeur | Disposition |
|---|---|
| 320 à 767 px | maquette mobile ; en-tête à 30 px des bords (largeur − 60, 704 au plus) ; jeux et boutons centrés ; sous 375 px, la grille des jetons se réduit à proportion de la largeur |
| 768 à 1023 px | maquette desktop, centrée ; étape 4 : résultat et « PLAY AGAIN » sous les deux jetons (Q-L1, G3-4) |
| ≥ 1024 px | maquette desktop, centrée ; étape 4 : résultat entre les deux jetons |

En-tête à 46 px du haut (30 px sous 768 px). « RULES » à 32 px des bords droit et bas de la fenêtre (≥ 768 px), centré à 55 px du bas (< 768 px) ; le choix de version à sa gauche (≥ 768 px) ou au-dessus (< 768 px). Fenêtre moins haute que le contenu : la page défile en hauteur, les boutons du bas restent sous le jeu, jamais par-dessus. Jamais de défilement horizontal, halos compris.

Positions de la maquette (px, coin haut gauche, ou centre noté « c » ; à 2 px près) :

| Élément | 1366 × 768 | 375 × 750 |
|---|---|---|
| En-tête · logo | (331, 46) 704 × 154 · (363, 75) 162 × 99 | (30, 30) 315 × 100 · (54, 55,5) 84 × 51,5 |
| Logo Lizard-Spock | (362, 67) 115 × 114 | (54,5 ; 54,5) 51 × 51 |
| Score | (859, 66) 150 × 114 | (251, 44) 80 × 72 |
| Étape 1 : Paper · Scissors · Rock (Ø 198 · 129) | c (544, 361) · c (822, 361) · c (683, 588) | c (96,5 ; 297,5) · c (278 ; 298,5) · c (187,5 ; 446,5) |
| Étape 1 : liens du triangle | (527, 353) 313 × 278 | (89, 293) 197 × 175 |
| Lizard-Spock : Scissors · Paper · Rock · Lizard · Spock (Ø 144 · 95) | c (684, 318) · c (846,5 ; 447,5) · c (781,5 ; 633,5) · c (584, 634) · c (520, 447) | c (188 ; 271,5) · c (296, 355) · c (252, 478) · c (123, 478) · c (80, 356) |
| Lizard-Spock : liens du pentagone | (518,5 ; 325) 329 × 313 | (86, 268) 204 × 194 |
| Choix de version (étape 1) | (1009, 695) 180 × 42 | (97,5 ; 595) 180 × 42 |
| Rules | (1205, 695) 130 × 42 | (123, 653) 130 × 42 |
| Étapes 2 et 3 : mon jeton · la maison (Ø 291 · 129) | c (494, 511) · c (859, 511) | c (94, 292) · c (282, 292) |
| Étape 2 : place vide de la maison | Ø 225, c (858, 511) | Ø 110, c (281 ; 293,5) |
| Étapes 2 et 3 : libellés (haut de l'encre, centre) | y 279, x 491 · 856,5 | y 388, x 93 · 280,5 |
| Étape 4 : mon jeton · la maison | c (350, 511) · c (995, 511) | c (94, 292) · c (282, 292) |
| Étape 4 : libellés (haut de l'encre, centre) | y 279, x 347 · 992,5 | y 388, x 93 · 280,5 |
| Étape 4 : résultat (haut de l'encre, centre) · Play Again | y 447, x 682 · (573, 513) 220 × 48 | y 488, x 187 · (78, 554) 220 × 48 |
| Règles : boîte · titre (encre) · croix (encre) · schéma (encre) | (483, 177) 400 × 415 · (517, 216) 80 × 22 · (832, 215) 19 × 19 · (532, 289) 304 × 270 | page entière · (147, 102) 80 × 22 · c (188 ; 674,5) 19 × 19 · (35, 240) 304 × 270 |
| Règles Lizard-Spock : boîte · titre · croix · schéma (encre) | (483, 154) 400 × 461 · (517, 193) · (832, 192) · (515, 238) 336 × 330 | page entière · (147, 102) · c (188 ; 674,5) · (33, 223) 310 × 304 (schéma réduit à la largeur de la page moins 60 px) |

À 768 × 1024, étape 4 (G3-4) : en-tête (32, 46) 704 × 154 ; jetons c (201,5 ; 511) et c (566,5 ; 511) ; résultat sous les jetons, encre y 730, centré ; Play Again (274, 796) 220 × 48 ; Rules (606, 950). À 1440, la même mise en page qu'à 1366, centrée (décalée de 37 px).

## 6. États et interactions

| Élément | Normal | Survol | Focus clavier |
|---|---|---|---|
| Jeton (étape 1) | §4 | disque blanc à 10 % autour du jeton, 11 % du diamètre plus large (176 pour 144) | contour blanc de 3 px, décalé de 7 px de la face |
| Rules, choix de version | filet blanc à 55 %, coins 8 px | fond blanc à 10 % | contour blanc de 3 px, décalé de 2 px |
| Play Again | blanc, texte Navy 900 | texte Red 800 `#9c1633` (8,2:1) | contour blanc de 3 px, décalé de 2 px |
| Croix des règles | Navy 900 | Navy 900 | contour Navy 900 de 3 px, décalé de 4 px |
| Zone du jeu (étapes 2 à 4) et fenêtre des règles, focalisées par le script | — | — | au clavier seulement (v1.0.3, rapport IA R3) : contour blanc de 3 px, décalé de 12 px autour des jetons, de 4 px autour de la boîte des règles ; page des règles (mobile) : contour Navy 900 à 8 px à l'intérieur |

| Événement | Effet |
|---|---|
| Choisir un jeton (clic, toucher, Entrée ou Espace) | étape 2 (D4) ; on ne peut plus choisir ; le choix est annoncé (« You picked Paper. The house is picking. », v1.0.4) ; le focus va à la zone du jeu, qui montre son contour au clavier |
| Étape 4 | le résultat est annoncé (« You picked Paper, the house picked Rock: you win. Score 13 ») ; le focus va à « Play Again » (si les règles sont ouvertes, il y reste ; à leur fermeture, il revient à « Rules ») |
| « Play Again » | étape 1, même version ; le focus va au jeton choisi à la partie précédente |
| « Rules » | le dialogue s'ouvre et prend le focus ; Tab reste dedans ; la croix, Échap ou (≥ 768 px) un clic sur le voile le ferment ; le focus revient à « Rules » ; la partie en cours continue derrière |
| Choix de version | l'autre version, à l'étape 1, avec son score (D6) ; titre de la page et logo suivent ; annoncé (« Lizard-Spock. Score 3 ») ; le focus reste sur le bouton, dont le libellé change |

Animations : à l'étape 3, le jeton de la maison apparaît en grandissant (300 ms au plus) ; à l'étape 4, résultat et halos apparaissent en fondu. Avec `prefers-reduced-motion: reduce` : aucune animation ni transition, les mêmes étapes au même rythme (Q-B2).

## 7. Accessibilité

### Contrats

| # | Contrat |
|---|---|
| A1 | Un seul `h1` (le titre du jeu, texte alternatif du logo) ; `h2` pour le résultat et le titre des règles |
| A2 | Repères : `header` (en-tête), `main` (le jeu et les boutons du bas) ; rien hors des repères |
| A3 | Jetons de l'étape 1 : boutons natifs nommés par leur signe, dans l'ordre de lecture (Original : Paper, Scissors, Rock ; Lizard-Spock : Scissors, Paper, Rock, Lizard, Spock) ; aux étapes 2 à 4, les jetons sont des images nommées par leur signe dans deux figures (« You Picked », « The House Picked ») |
| A4 | Liens du triangle ou du pentagone, halos, place vide, schéma des règles : décoratifs ; les règles en texte (D1) remplacent le schéma pour les lecteurs d'écran |
| A5 | Règles : `dialog` modal natif nommé par son titre, qui prend le focus lui-même et le rend à « Rules » |
| A6 | Contraste AA (4,5:1 ; 3:1 pour les grands textes, les icônes et les contours de focus), survols compris |
| A7 | Focus visible sur chaque élément interactif, et sur la zone du jeu et la fenêtre des règles quand le script leur donne le focus au clavier ; ordre clavier = ordre de lecture ; une partie entière, les règles et le choix de version se font au clavier seul |
| A8 | Région de statut : le choix (étape 2), le résultat de chaque partie avec le nouveau score et le changement de version y sont annoncés (§6) |
| A9 | Pas d'animation ni de transition si `prefers-reduced-motion: reduce` |
| A10 | Le nom accessible du choix de version contient son libellé visible (« Switch to Lizard-Spock » pour « LIZARD-SPOCK ») |

### Noms accessibles utilisés par les tests

| Élément | Rôle | Nom |
|---|---|---|
| En-tête | banner | heading (1) contenant img « Rock Paper Scissors » (Lizard-Spock : « Rock Paper Scissors Lizard Spock ») ; le texte « Score » suivi du score |
| Étape 1 | group · button | « Pick a sign » (v1.0.4) · « Paper », « Scissors », « Rock » (Lizard-Spock : et « Lizard », « Spock ») |
| Étapes 2 à 4 | group | « Game » (v1.0.4) : la zone du jeu, qui reçoit le focus après le choix |
| Étapes 2 à 4 | figure | « You Picked » : img du signe (« Paper »…) ; « The House Picked » : à l'étape 2 aucune image, ensuite img du signe |
| Étape 4 | heading (2) · button | « You Win », « You Lose » ou « Draw » · « Play Again » |
| Annonces | status | « You picked Paper. The house is picking. » (étape 2) ; « You picked Paper, the house picked Rock: you win. Score 13 » (« you lose », « draw ») ; « Lizard-Spock. Score 3 » ou « Original. Score 12 » |
| Bas de page | button | « Rules » (`aria-haspopup` « dialog », v1.0.4) ; à l'étape 1 « Switch to Lizard-Spock » ou « Switch to Original » |
| Règles | dialog | « Rules » ; button « Close rules » ; list : une ligne par règle de D1 (« Paper beats Rock »…), 3 ou 10 |

## 8. Critères d'acceptation

```
Parties menées au bout (en tête des tests d'interaction : souris puis clavier seul, à 375, 768 et 1440 px)
S1  Given score 0, la maison fixée, la souris   When je joue Paper contre Rock, Scissors contre Rock, Rock contre Rock, chacune suivie de Play Again   Then étapes 2, 3, 4 dans l'ordre ; « You Win », « You Lose », « Draw » ; score 1, 0, 0 à l'écran et dans rps/score/original ; halos du côté gagnant, aucun à l'égalité ; l'étape 1 revient
S2  Given le clavier seul   When Tab jusqu'à un jeton, Entrée (puis Espace à la partie suivante), Entrée sur Play Again   Then mêmes résultats ; le focus sur Play Again à l'étape 4, puis sur le jeton choisi ; chaque résultat annoncé
S3  Given le clavier seul, à chaque étape   When j'ouvre Rules, Tab jusqu'au bout, Échap ; puis Rules et Entrée sur Close rules   Then le dialogue prend le focus, le garde, se ferme ; le focus revient à Rules ; la partie en cours continue
S4  Given le clavier seul, score Original 2   When Switch to Lizard-Spock, je joue Lizard contre Spock, Play Again, Switch to Original   Then 5 jetons, logo, titre de la page et score Lizard-Spock (0 puis 1) ; puis Original et son score 2 ; chaque changement annoncé ; après rechargement, la version et les deux scores retrouvés

Mise en page (positions de la §5)
S5  Given 1366 × 768 et 375 × 750, étape 1, chaque version   Then en-tête, logo, score, jetons, choix de version, Rules à leurs positions (les liens du triangle et du pentagone, décoratifs, sont vérifiés par S19)
S6  Given 1366 × 768 et 375 × 750, étapes 2, 3, 4   Then libellés, jetons, place vide, résultat, Play Again à leurs positions ; Given 768 × 1024, étape 4   Then résultat et Play Again sous les jetons, à leurs positions
S7  Given les règles à 1366 × 768 (chaque version) et à 375 × 750   Then boîte centrée sur un voile à 50 %, ou page entière et croix en bas, à leurs positions
S8  Given 320, 375, 767, 768, 1023, 1024, 1366, 1440 px, chaque étape et les règles   Then pas de défilement horizontal ; Given 1366 × 600   Then Rules sous le jeu, sans le recouvrir

Règles du jeu
S9  Given chaque paire de signes (9 Original, 25 Lizard-Spock), la maison fixée   Then le résultat de D2
S10 Given une partie   Then étape 2 jusqu'à 1 s, étape 3 de 1 s à 1,5 s, étape 4 ensuite ; le score change seulement à l'étape 4 ; Given un rechargement à l'étape 2 ou 3   Then le score n'a pas changé
S11 Given chaque version, Math.random fixé à (k + 0,5) / n pour chaque signe k   Then la maison choisit le k-ième signe de D1 ; Given Math.random non fixé, 30 parties   Then au moins deux signes différents pour la maison
S12 Given des valeurs gardées illisibles (vide, abc, 1.5) ou une version inconnue   Then score 0, version Original ; Given « -3 »   Then -3 ; Given 9999 et -999 à 375 px   Then le chiffre tient dans sa boîte
S13 Given l'étape 1   Then le choix de version est là ; Given les étapes 2, 3, 4   Then il n'y est plus

États et accessibilité
S14 Given chaque jeton, Rules, le choix de version, Play Again, la croix   When survol, puis focus clavier   Then l'état de la §6 ; aucun changement de taille de la page
S15 Given prefers-reduced-motion: reduce   Then aucune animation ni transition, les étapes au même rythme
S16 Given chaque étape, les règles, chaque version, à 375, 768 et 1440   Then axe-core : aucune violation sérieuse ou critique
S17 Given le HTML servi et chaque vue rendue   Then validateur W3C Nu et html-validate (réglage FM) sans erreur ; eslint sans erreur ; gardes des règles FM (rem, aria-label, CSS logique)
S18 Given chaque version   Then titre de la page, langue en, un seul h1

Visuel (G3-6 : 5 % par écran et, depuis v1.0.5, 5 % par zone — en-tête, jeu, bas de page ; règles : la fenêtre et la page derrière — contre les JPG du starter de specs/reference/ ; le choix de version, absent des maquettes, n'est pas compté)
S19 Given les 22 écrans des maquettes FM, rejoués avec un score gardé de 12 et la maison fixée sur les signes de chaque maquette (§9), le pointeur sur Play Again pour desktop-etape-4-perdu   Then le contenu de l'écran est là (titre, jetons, résultat ou dialogue), puis la capture vs la maquette ≤ 5,0 % sur l'écran entier et sur chaque zone
```

Règles sans navigateur (`node --test tests/unit/`)

```
U1 D1, D2 : résultat de chaque paire (9 et 25) ; en Original chaque signe en bat 1, en Lizard-Spock 2 ; jamais les deux sens
U2 D3 : signe de la maison selon une valeur de Math.random (0, juste sous 1/n, 1/n, juste sous 1) ; sur 30 000 tirages, chaque signe entre 30 et 37 % (Original), 18 et 22 % (Lizard-Spock)
U3 D2 : nouveau score après une victoire, une défaite, une égalité, y compris sous 0
U4 D5 : lecture des valeurs gardées (« 12 », « -3 » ; vide, « abc », « 1.5 », null → 0 ; version « bonus », « original », autre → original)
U5 Les règles rendent des noms (signe, résultat, version), jamais une couleur ni une taille (fitness d'ADR des tokens)
```

## 9. Contenu des maquettes (pour S19)

Chaque maquette montre une partie précise ; le test la rejoue en fixant la maison (D3) et en gardant un score de 12 avant de jouer.

| Maquette | Je choisis | La maison | Score affiché |
|---|---|---|---|
| desktop-etape-1, mobile-etape-1, bonus-*-etape-1 | — | — | 12 |
| desktop-etape-2, desktop-etape-3 | Scissors | — · Rock | 12 |
| desktop-etape-4-gagne | Paper | Rock | 13 |
| desktop-etape-4-perdu | Scissors | Rock | 11 |
| mobile-etape-2, mobile-etape-3, mobile-etape-4-gagne | Rock | — · Scissors · Scissors | 12 · 12 · 13 |
| mobile-etape-4-perdu | Paper | Scissors | 11 |
| bonus-desktop-etape-2, -3, -4 | Scissors | — · Spock · Spock | 12 · 12 · 11 |
| bonus-mobile-etape-2, -3 | Scissors | — · Spock | 12 |
| bonus-mobile-etape-4 | Lizard | Spock | 13 |
| desktop-regles, mobile-regles, bonus-*-regles | — (étape 1) | — | 12 |

Les maquettes desktop sont à 1366 × 768, les maquettes mobiles à 375 × 750. Le choix de version, absent des maquettes FM, est présent à l'étape 1 (0,5 à 1 point d'écart, G3-6).
