# 2026-11-06 — Rapport IA FM : Rock, Paper, Scissors (v1.0.2)

> Soumission du 2026-11-06 avec l'accord de Koya (« Oui, soumets ») ; rapport IA généré dès la soumission, sur le dépôt de ce moment (v1.0.2, sans le lien de la solution, ajouté juste après). Solution : https://www.frontendmentor.io/solutions/rock-paper-scissors-lizard-spock-svelte-5-tailwind-v4-playwright-XZIdVxKJa5 — rapport à `/report`, seul l'auteur le voit. Tri fait en relisant le code et les tests cités. Objectif de Koya : toutes les notes à 9,0 ou plus.

## Notes

| Partie | Note |
|---|---|
| **Global** | **9,3 / 10** (Exceptional) |
| Code Quality | 9,4 : Best Practices 9,7 · File Organization 9,2 · Architecture 9,5 · Testing **7,8** |
| Design & UX | **8,2** : Accessibility **8,2** |
| Documentation | 9,8 : README 9,9 · Commits 9,6 |

Sous 9,0 : Testing (7,8) et Accessibility (8,2).

## Remarques triées

| # | Partie | Remarque FM | Verdict | Proposition |
|---|---|---|---|---|
| R1 | Testing | S1 (`interactions.spec.js:22`) attendrait un score qui « revient à 0 » aux 2ᵉ et 3ᵉ parties, alors que Play Again ne le remet pas à zéro | **Faux positif sur le fond** : les scores attendus (1, 0, 0) sont déjà cumulés (victoire +1, défaite −1, égalité 0) ; mais le tableau `GAMES` ne le dit pas | Score attendu calculé dans le test, partie après partie (`expected += POINTS[résultat]`), avec un commentaire ; même calcul dans S2 |
| R2 | Accessibility | Le score change dans un simple `span` : un lecteur d'écran ne l'apprend pas ; ajouter `aria-live` ou mettre le score dans l'annonce | **Faux positif sur le fond** : l'annonce du résultat finit déjà par « Score 13 » (`game.svelte.js:53`), testée par S2 et S9 ; le relecteur a lu `Header.svelte` | Commentaire dans `Header.svelte` qui renvoie à l'annonce ; README : l'annonce cite le score. Pas d'`aria-live` en plus (le score serait annoncé deux fois) |
| R3 | Accessibility | `outline: none` sur la zone du jeu et le dialogue (`app.css:65`), que le script focalise : au clavier, on ne voit plus où est le focus | **Juste** | Contour visible au clavier (`:focus-visible`) : blanc autour de la zone du jeu et de la fenêtre des règles (desktop), Navy à l'intérieur de la page des règles (mobile) ; rien à la souris ; spec §6 et A7 ; test |
| R4 | File Organization | `icon-close.svg`, `image-rules.svg`, `image-rules-bonus.svg` à la fois dans `images/` et `src/assets/` | **Juste** : les copies de `src/assets/` sont les versions corrigées AA (ADR-0008) ; les originaux de `images/` ne servent plus | Originaux retirés d'`images/` ; ADR-0008 et README disent d'où viennent les copies corrigées |
| R5 | Architecture (suggestion) | `game.svelte.js` mêle état, stockage, minuteries, score et annonces | Juste (9,5 : pas sous 9,0) | Stockage dans `src/lib/storage.js` (clés, lecture, écriture, ADR-0007) ; `game.svelte.js` garde l'état, le déroulé et les annonces |
| R6 | README (suggestion) | Ajouter un résumé de 3 ou 4 lignes en tête : pile, site, versions, commande de test | Juste | Résumé en tête de l'Overview |
| R7 | Commits (suggestion) | Le commit de la Phase 6 réunit tout le jeu | Juste, mais l'historique publié ne se réécrit pas | Les correctifs : un commit par remarque ; à la prochaine Phase 6, un commit par partie (règles, état, écrans, règles du jeu) |

21 constats positifs (tokens, stockage protégé, `cqi`, organisation des dossiers, règles pures, composants, dialogue natif, texte des règles, région de statut, horloge et tirage maîtrisés dans les tests, couverture souris, clavier et doigt, README, commits, notes « rouge avant le correctif »).

## Corrections (v1.0.3, accord de Koya : « Oui, corrige »)

| # | Commit | Test |
|---|---|---|
| R1 | `test: calcule le score attendu partie après partie dans S1 et S2` | S1 vérifie la suite des scores (1, 0, 0) |
| R2 | `docs: dit où le nouveau score est annoncé, à côté du score` | S2 (annonce avec le score) |
| R3 | `fix: contour au clavier sur la zone du jeu et la fenêtre des règles` | A7 à 375 et 1440, rouge avant le correctif |
| R4 | `chore: retire les originaux du starter remplacés par leurs copies corrigées AA` | fitness ADR-0008, rouge avant le retrait |
| R5 | `refactor: stockage de la version et des scores dans src/lib/storage.js` | fitness ADR-0007, rouge avant le déplacement |
| R6 | `docs(readme): résume le jeu, la pile et les tests en tête` | — |

222 tests Playwright et 7 unitaires verts en local. Planche des états Penpot mise à jour (contour au clavier).

## Proposition

Corriger R1 à R6 en v1.0.3 (un commit par remarque, tests ajoutés), rejouer la suite en local puis en ligne, pousser et publier, puis « Regenerate report » (1 crédit) : chaque étape avec l'accord de Koya.

## Rapport regénéré sur v1.0.3 (2026-11-06, accord de Koya : « Oui, publie et regénère », 1 crédit)

v1.0.3 poussée (`main`, tag `v1.0.3`) et publiée (`gh-pages` ; un premier build GitHub Pages a échoué, « Page build failed », puis un second est resté bloqué ; republié, servi après 4 min) ; suite rejouée en ligne : **222 / 222**.

| Partie | v1.0.2 | v1.0.3 |
|---|---|---|
| **Global** | 9,3 | **9,4** |
| Code Quality | 9,4 | 9,4 : Best Practices 9,7 · File Organization 9,2 · Architecture 9,5 · Testing **8,2** (7,8) |
| Design & UX | 8,2 | **8,7** : Accessibility **8,7** (8,2) |
| Documentation | 9,8 | 9,8 : README **10,0** (9,9) · Commits 9,6 |

Encore sous 9,0 : Testing (8,2) et Accessibility (8,7).

| # | Partie | Constat | Verdict | Proposition |
|---|---|---|---|---|
| T1 | Testing | Les deux constats sont positifs (horloge et tirage maîtrisés, couverture souris, clavier, doigt) ; le résumé : « keeping visual assertions resilient while retaining meaningful design verification » | Juste : les tests d'`interactions.spec.js` mesurent halos, survols et contours à des coordonnées écrites en dur (centres des jetons, boîtes de Rules, du choix de version, de Play Again, de la croix) | Coordonnées tirées de la boîte réelle de chaque élément (jeton, bouton, figure) ; les positions restent vérifiées par `layout.spec.js` |
| A1 | Accessibility | Trois constats positifs (dialogue natif, schéma décoratif et règles en texte, région de statut), aucun reproche | — | Renforcer ce que le relecteur lit : « Rules » annonce qu'il ouvre un dialogue (`aria-haspopup="dialog"`) ; le choix est annoncé à l'étape 2 (« You picked Paper. The house is picking. ») ; les jetons de l'étape 1 forment un groupe nommé (« Pick a sign ») et la zone du jeu, focalisée par le script, un groupe nommé (« Game ») ; spec §7 et tests |
| — | File Organization, Architecture | Mêmes constats que sur v1.0.2 (doublons d'`images/`, stockage dans `game.svelte.js`), mot pour mot, mêmes notes | **Déjà corrigés en v1.0.3** (vérifié sur GitHub : `images/` sans les doublons, `src/lib/storage.js`) : ces parties n'ont pas été réévaluées | Rien à faire ; à revoir au prochain rapport |

### Corrections (v1.0.4, accord de Koya : « Oui, corrige »)

| # | Commit | Test |
|---|---|---|
| T1 | `test: mesure halos, survols et contours depuis la boîte de chaque élément` | `interactions.spec.js` vert deux fois de suite |
| A1 | `feat: le bouton Rules annonce qu'il ouvre un dialogue` | A5, rouge avant |
| A1 | `feat: annonce le choix du joueur pendant que la maison choisit` | S2, rouge avant |
| A1 | `feat: nomme le groupe des jetons et la zone du jeu` | A3, rouge avant |

225 tests Playwright et 7 unitaires verts en local.

## Rapport regénéré sur v1.0.4 (2026-11-06, accord de Koya : « Oui, publie et regénère », 1 crédit)

v1.0.4 poussée (`main`, tag `v1.0.4`) et publiée (`gh-pages`, servie en 7,5 min) ; suite rejouée en ligne : **225 / 225**.

Notes **identiques** à celles de la v1.0.3 : global 9,4 ; Best Practices 9,7 · File Organization 9,2 · Architecture 9,5 · Testing **8,2** · Accessibility **8,7** · README 10,0 · Commits 9,6. Constats de Testing (2) et d'Accessibility (3) identiques au mot près, tous positifs ; seul le résumé est réécrit, avec la même piste : « keeping visual assertions resilient while retaining meaningful design verification is a worthwhile area of polish ».

Lecture : comme pour File Organization et Architecture au rapport précédent (M60), les parties n'ont pas été réévaluées malgré les changements (T1 réécrit les mesures d'`interactions.spec.js`, A1 ajoute trois éléments d'accessibilité). Le guide FM « Solution Reports Overview » ne dit pas ce que la regénération réévalue.

### Dernière tentative (v1.0.5, accord de Koya : « Dernière tentative »)

`test: compare chaque écran aux maquettes zone par zone, choix de version exclu` : 5 % au plus sur l'écran et sur chaque zone (au plus haut 3,66 %, en-tête mobile) ; essai jetable : la boîte du score masquée donne 2,60 % sur l'écran (passerait) et 6,70 % sur l'en-tête (échoue). 225 tests Playwright et 7 unitaires verts en local.

## Rapport regénéré sur v1.0.5 (2026-11-06, accord de Koya : « Oui, publie et regénère », 1 crédit)

v1.0.5 poussée (`main`, tag `v1.0.5`) et publiée (`gh-pages` ; code du site identique à v1.0.4) ; suite rejouée en ligne : **225 / 225**.

Notes inchangées : global 9,4 ; Testing **8,2** ; Accessibility **8,7** ; le reste identique. Accessibility : mêmes trois constats positifs. Testing : un **troisième constat**, nouveau et précis :

| # | Partie | Constat | Verdict | Proposition |
|---|---|---|---|---|
| T2 | Testing | `interactions.spec.js:41` : après un choix, les tests avancent l'horloge sans jamais tenter un second choix ni « Play Again » pendant les étapes 2 et 3 ; une régression qui permettrait un double choix ou un redémarrage prématuré passerait | **Juste** : `pick()` ignore un choix hors de l'étape 1 et les jetons disparaissent, mais aucun test ne le tente | En tête des interactions : pendant les étapes 2 et 3, ni jeton ni Play Again ; Entrée et Espace sur la zone du jeu, un clic là où étaient les jetons : aucun effet (même étape, même signe de la maison, aucun tirage de plus, score inchangé) ; à la souris et au clavier |

### Correction (v1.0.6, accord de Koya : « Traite T2 »)

`test: tente un second choix et Play Again pendant le déroulé d'une partie` : tests de garde (le jeu bloquait déjà ces tentatives) ; preuve qu'ils peuvent échouer : Play Again affiché pendant le déroulé (S1 et S2 rouges), Entrée sur la zone qui relance la partie (S2 rouge), deux régressions essayées puis retirées. 225 tests Playwright et 7 unitaires verts en local.

