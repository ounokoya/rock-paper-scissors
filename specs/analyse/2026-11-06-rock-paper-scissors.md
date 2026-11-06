# 2026-11-06 — Rapport d'exécution : Rock, Paper, Scissors

> SDL-FM 1.7.0, Phases 7 et 8. Tests sur le build de production (`vite build` + `vite preview`) ; parcours réel dans le navigateur intégré, affiché (`document.visibilityState` = `visible`), sur le serveur de développement (`.claude/launch.json` « rps-dev », `http://localhost:5181/rock-paper-scissors/`), à 320, 375, 714, 768 et 1440 px.

## 1. Tests automatiques (Phase 7)

`npm test` : **7 tests unitaires et 216 tests Playwright, tous réussis** (Playwright : 63 s).

| Fichier | Scénarios | Résultat |
|---|---|---|
| `interactions.spec.js` | En tête : S1 (souris, à 375, 768 et 1440 : gagner, perdre, égalité, Play Again, score affiché et gardé, halos mesurés à l'écran), S1 au doigt, S2 (clavier seul), S3 (règles : Tab reste dedans, Échap, croix, ouvertes pendant une partie), S4 (changer de version, gagner, revenir, rechargement) ; A7 (Tab jusqu'au dernier élément, à chaque étape et dans les règles, contour à chaque arrêt) ; S14 (survols et focus mesurés à l'écran) ; S15 (mouvements, réglage réduit) | ✅ 29 / 29 |
| `game.spec.js` | S9 (les 9 et 25 paires de signes), S10 (rythme 1 s puis 0,5 s, score à l'étape 4 seulement, partie abandonnée au rechargement), S11 (tirage de la maison), S12 (valeurs gardées, score long dans sa boîte), S13 (choix de version à l'étape 1 seulement) | ✅ 19 / 19 |
| `layout.spec.js` | S5 à S7 (positions des maquettes à 2 px près, sur l'élément ou sur son encre, à 1366, 768, 375 et 1440) ; règles dans des fenêtres basses ; S8 (8 largeurs × 8 vues sans défilement horizontal ; boutons du bas sous le jeu dans une fenêtre basse) | ✅ 91 / 91 |
| `accessibility.spec.js` | S16 (axe-core : 5 vues × 2 versions × 3 largeurs) ; A2 (repères, axe « region »), S18 et A1, A3, A4 (règles en texte, dans l'ordre du README), A10 | ✅ 43 / 43 |
| `static.spec.js` | S17 : W3C Nu et html-validate (HTML servi et 6 vues rendues), ESLint, longueurs sans `px`, propriétés logiques, `aria-label` | ✅ 6 / 6 |
| `fitness.spec.js` | ADR-0003 (règles pures), ADR-0004 (couleurs dans les tokens), ADR-0005 (police servie avec le site, seule dépendance), ADR-0007 (trois clés gardées), ADR-0010 (aucun fichier de maquette éditable), ADR-0011 (base de Vite) | ✅ 6 / 6 |
| `visual.spec.js` | S19 : les 22 maquettes FM rejouées (§9 de la spec) | ✅ 22 / 22 |
| `tests/unit/rules.test.js` | U1 à U5 | ✅ 7 / 7 |

### Comparaison visuelle (seuil 5 %, G3-6)

| Écran | Desktop | Mobile | Lizard-Spock desktop | Lizard-Spock mobile |
|---|---|---|---|---|
| Étape 1 | 1,13 % | 2,64 % | 1,43 % | 2,73 % |
| Étape 2 | 1,10 % | 1,56 % | 1,33 % | 1,54 % |
| Étape 3 | 1,47 % | 1,98 % | 1,80 % | 1,92 % |
| Étape 4 gagnée · perdue | 1,61 % · 1,55 % | 2,61 % · 2,55 % | — · 1,90 % | 2,48 % · — |
| Règles | 0,64 % | 1,11 % | 1,01 % | 3,10 % |

Le reste des écarts : lissage des bords (jetons, lettres) et le bouton de choix de version, absent des maquettes FM (0,5 à 1 point sur mobile). Les règles gardent les teintes AA de G3-3 (« BEATS » et flèches `#6b7087`, croix Navy 900), plus foncées que les maquettes.

## 2. Premier passage des tests sur le code (Phase 6)

19 maquettes sur 22 sous 5 % dès le premier build. Défauts trouvés par les tests et corrigés :

| Défaut | Test | Correctif |
|---|---|---|
| Fenêtre des règles étirée sur toute la hauteur (desktop) | S19 règles (16 %), S7 | `block-size: fit-content` : un `dialog` fixé en haut et en bas s'étire avec `auto` |
| Schéma Lizard-Spock coupé sur mobile | S19 (10 %), S7 | `viewBox` ajouté aux copies corrigées : sans lui, le SVG réduit ne se met pas à l'échelle |
| « The House Picked » décalé de 8 px (mobile) | S6 | La figure a la largeur de son jeton ; le libellé plus large déborde des deux côtés |
| Tab sortait du dialogue des règles après la croix | S3 | Tab et Maj + Tab gardés dans le dialogue |
| Fermer les règles à l'étape 4 donnait le focus à « Play Again » | S3 | Le focus va à « Play Again » au passage à l'étape 4 seulement |

Mesures des tests corrigées (le test se trompait, pas le jeu) : axe-core attendait ses minuteries alors que l'horloge de la page était arrêtée ; les coins arrondis du score comptaient comme chiffre ; le contour de focus était mesuré sur le filet du bouton ; les étapes de S1 et S2 dépendaient du temps réel sous charge (elles sont avancées par l'horloge, le rythme reste vérifié par S10 et S15).

## 3. Parcours réel (Phase 8)

| Vérification | Résultat |
|---|---|
| 1440 px, clavier seul : Tab jusqu'au choix de version (contour blanc), Maj + Tab sur Rock, Entrée | Étapes 2, 3, 4 ; « You lose », score −1 (signe moins typographique), halos derrière la maison ; annonce « You picked Rock, the house picked Paper: you lose. Score -1 » |
| Règles ouvertes au clavier, fenêtre passée de 1440 à 375 puis à 1440 | Page blanche entière à 375 (titre, schéma centré, croix en bas), boîte de 400 × 415 centrée à 1440 ; le focus reste dans le dialogue ; Échap le rend à « Rules » |
| 768 × 1024 : étape 4 (résultat sous les jetons), Play Again à la souris, passage à Lizard-Spock | Pentagone, logo et titre de la page « Rock, Paper, Scissors, Lizard, Spock », score 0 annoncé ; survol du bouton (fond blanc à 10 %) |
| Partie Lizard-Spock à la souris (Spock contre Spock) | « Draw », score inchangé, aucun halo |
| Rechargement | Version Lizard-Spock et scores retrouvés (`rps/version` = `bonus`, `rps/score/original` = `-1`, `rps/score/bonus` = `0`) |
| 320 × 640, Lizard-Spock | Plateau réduit à la largeur, rien ne déborde (largeur de défilement 320) |
| Premier affichage, navigateur affiché | Aucune image vide ; logo, jetons et liens présents dès le premier rendu |

**Écarts relevés et corrigés pendant le parcours :**

- Règles dans une fenêtre basse : la boîte desktop (415 ou 461 px) dépassait l'écran sous 480 px de haut, sans défiler ; sur mobile très bas, le schéma Lizard-Spock touchait le titre. Tests ajoutés, **rouges avant le correctif** (fenêtre hors de l'écran à 1366 × 400 ; 1,4 px sous le titre à 375 × 480) : la boîte desktop ne dépasse plus l'écran et défile ; la page mobile garde 600 px de haut et défile.
- Précaution (aucune zone vide vue en local) : le logo et les liens de l'autre version, les icônes de Lizard-Spock et la croix des règles ne se chargeaient qu'à leur premier affichage. Elles sont chargées d'avance au démarrage, et la croix est intégrée à la page : en ligne, aucune image ne manquera à l'ouverture des règles ou au changement de version.

**Verdict : conforme.** Phase 9 (README).
