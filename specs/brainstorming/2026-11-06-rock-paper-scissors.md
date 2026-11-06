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
