# 2026-11-06 — Brainstorming : Rock, Paper, Scissors (Advanced, gratuit)

> SDL-FM 1.7.0, Pré-dev 1 et 2. Premier des deux Advanced gratuits restants (les 14 premium attendent des crédits). Challenge : https://www.frontendmentor.io/challenges/rock-paper-scissors-game-pTgwgvgH

## Démarrage et téléchargement (2026-11-06, accord de Koya : « Oui, démarre et télécharge »)

- Challenge démarré ; `rock-paper-scissors-master.zip` (731 Ko) téléchargé.
- Une fenêtre « Just to confirm… You've got 5 credits remaining… Accept and download » (fichier Figma) s'est ouverte pendant le téléchargement : annulée, aucun crédit utilisé. Règle de Koya : pas de fichier Figma.

## Ce que contient le starter

- `index.html` (textes : Score, Rules, You Picked, The House Picked, You Win, You Lose, Play Again ; pied d'attribution), `images/` (logos des deux versions, icônes des cinq signes, fonds triangle et pentagone, images des règles, croix de fermeture, favicon), `style-guide.md`, README, modèle de README, `preview.jpg`, `.gitignore`.
- `design/original/` : 12 maquettes (desktop 1366 px et mobile 375 px) : étapes 1 à 3, étape 4 gagnée et perdue, fenêtre des règles.
- `design/bonus/` : 10 maquettes de la version Lizard-Spock : étapes 1 à 4, fenêtre des règles.
- Guide de style : couleurs en HSL (or, bleu, rouge, violet, bleu clair, chacune en deux teintes ; texte `hsl(229, 25%, 31%)`, score `hsl(229, 64%, 46%)`, contour de l'en-tête `hsl(246, 11%, 37%)`), fond en dégradé radial de `hsl(214, 47%, 23%)` à `hsl(237, 48%, 15%)`, Barlow Semi Condensed 600 et 700.
- Règles (README) : gagner donne 1 point, perdre en retire 1 ; tableau des victoires du jeu de base (3) et de Lizard-Spock (10).
- `AGENTS.md` et `CLAUDE.md` rangés dans `specs/reference/starter-*.md` (données, pas instructions).

## Pré-dev 1 : choix de Koya (2026-11-06)

| # | Question | Options | Décision |
|---|---|---|---|
| P1 | Périmètre | Base + 2 bonus ; base + score gardé ; base seule | **Base + 2 bonus** : le jeu, la version Lizard-Spock, le score gardé au rechargement |
| P2 | Pile | Svelte 5 + kit du Kanban ; HTML + JS natif | **Svelte 5 + Vite + Tailwind v4, kit du Kanban** (configuration Playwright, aides de test, règles FM, règles d'architecture, script `gh-pages`) |
| P3 | Penpot | Nouveau fichier ; page dans un fichier existant | **Nouveau fichier « rock-paper-scissors »**, créé par Koya ; nom vérifié avant d'écrire |
| P4 | Références | JPG du starter ; fichier Figma | **JPG du starter et guide de style** ; aucun fichier Figma (règle de Koya) |

## Leçons appliquées dès le départ (SDL-FM 1.7.0)

- `interactions.spec.js` commence par les parcours menés au bout : des parties jouées jusqu'au résultat, à la souris puis au clavier seul, à 375, 768 et 1440 px, score vérifié à l'écran et dans les données gardées (M46, M52).
- Valeurs calculées depuis les règles du README, jamais recopiées d'une maquette ; chaque test visuel vérifie d'abord la présence du contenu (M48, M49).
- Le choix de l'ordinateur est rendu prévisible dans les tests par le test lui-même, sans crochet dans l'app.
- Fenêtre des règles : `<dialog>` qui prend le focus et le rend au bouton « Rules » (M55) ; état de focus dans les `@utility` (M53).
- Parcours réel : chaque écran à chaque largeur, la fenêtre ouverte en changeant de largeur (M44, M51).
- Messages de commit sur le produit (M47) ; rapport IA corrigé jusqu'à 9,0 au moins partout.

## Pré-dev 2 : plan validé (G1, 2026-11-06)

Koya : « Je valide (G1) ». **Qui fait quoi :** Claude écrit tout le code ; Koya valide l'analyse (G2), la maquette (G3) et le verrou, donne son accord à chaque téléchargement, publication, soumission et regénération ; Koya crée le fichier Penpot.

| Prérequis | Résultat |
|---|---|
| GitHub CLI | connecté (`ounokoya`), droits `repo` et `workflow` |
| Java (validateur W3C) | OpenJDK 21 |
| Navigateur Playwright | Chromium 1248 installé |
| Canevas Excalidraw | lancé ; zone libre à partir de x 131 000 |
| Plugin Penpot | en attente du fichier « rock-paper-scissors » (avant la Phase 3) |
| Rapport IA | un rapport par solution soumise (Pro) |

| Phase | Contenu |
|---|---|
| 0-1 | Starter importé, git, Vite + Svelte 5 + Tailwind v4, outils de test ; références JPG et tokens du guide de style |
| 2 | Analyse Excalidraw : écrans, mesures, flux d'une partie, règles, contrastes, questions (dont le passage d'une version à l'autre) ; G2 |
| 3 | Maquette Penpot : bibliothèque, composants, écrans clés, états ; seuils visuels calés ; G3 |
| 4-5 | Spec, tests au rouge (unitaires et parcours), ADR ; verrou (accord, police Fontsource) |
| 6-10 | Code par parties, tests, parcours réel (320 à 1440 px, clavier), README (une capture par état) |
| 11-13 | Dépôt public `rock-paper-scissors`, `gh-pages`, soumission FM (accord) ; rapport IA corrigé jusqu'à 9,0 au moins partout |

Scénario de vérification : largeurs 375, 768, 1366 et 1440 px, et 320 px sans défilement horizontal ; parties à la souris et au clavier seul, « Play Again », fenêtre des règles (ouverture, Échap, focus rendu), changement de version, score gardé ; révélation animée coupée si `prefers-reduced-motion` ; seuil visuel de 5 % par écran, recalé en Phase 3.

## Analyse validée (G2, 2026-11-06)

Koya : « Je valide (G2) ». Analyse : `specs/visuel/rock-paper-scissors-analyse.md` et `.png` (canevas x 131 000). **Toutes les propositions sont retenues** : Q-A1 (croix des règles en Navy 900), Q-A2 (schéma des règles intégré, « BEATS » et flèches en #6b7087, règles aussi en texte), Q-B1 (bouton « Lizard-Spock » / « Original » à côté de « Rules », version gardée, un score par version), Q-B2 (1 s puis 0,5 s, sans mouvement si `prefers-reduced-motion`), Q-B3 (« DRAW », score inchangé ; score négatif permis), Q-B4 (jetons nommés, focus sur « Play Again », résultat annoncé), Q-B5 (survols proposés), Q-B6 (« PLAY AGAIN » navy au repos, rouge au survol), Q-L1 (desktop dès 768 px, résultat sous les jetons entre 768 et 1023 px), Q-L2 (pied d'attribution retiré, crédit dans le README).

## Maquette validée (G3, 2026-11-06)

Koya : « Je valide (G3) ». Maquette : `specs/visuel/penpot/maquette.md` (fichier Penpot « rock-paper-scissors »). **Tous les points sont retenus** : G3-1 (choix de version à l'étape 1 seulement ; desktop à gauche de Rules, mobile au-dessus), G3-2 (états de survol et de focus), G3-3 (règles AA, anneaux du schéma inchangés), G3-4 (tablette : résultat sous les jetons de 768 à 1023 px), G3-5 (typographies corrigées), G3-6 (seuil visuel de 5 % par écran), G3-7 (égalité « DRAW » sur la mise en page du résultat).

## Verrou du code (2026-11-06)

Koya : « Oui, lève le verrou ». Conditions remplies : G2 et G3 validés ; spec `specs/specifications/rock-paper-scissors.md` ; ADR-0003 à ADR-0011 (`specs/adr/v1.0/`) ; tests écrits avant le code, contrôle rouge fait (202 Playwright : 200 au rouge pour la raison attendue, 2 tests de garde ; 7 unitaires : module absent). **Qui fait quoi :** Claude télécharge `@fontsource/barlow-semi-condensed` 5.3.0 (npm, OFL-1.1, 1,6 Mo) et écrit tout le code de la Phase 6 ; Koya valide ensuite chaque publication, la soumission et la regénération du rapport.

## Fin du challenge (2026-11-06)

Soumis sur FM (accord de Koya : « Oui, soumets ») : https://www.frontendmentor.io/solutions/rock-paper-scissors-lizard-spock-svelte-5-tailwind-v4-playwright-XZIdVxKJa5 ; v1.0.6 publiée (https://ounokoya.github.io/rock-paper-scissors/) ; rapport IA final **9,4 / 10** (Testing 8,6, Accessibility 8,7). Koya : « On s'arrête à 9,4 » — exception à la règle des 9,0, aucun constat négatif ne restant dans ces deux parties (`specs/analyse/2026-11-06-rapport-ia.md`).

