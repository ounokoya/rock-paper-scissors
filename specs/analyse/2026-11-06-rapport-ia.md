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

## Proposition

Corriger R1 à R6 en v1.0.3 (un commit par remarque, tests ajoutés), rejouer la suite en local puis en ligne, pousser et publier, puis « Regenerate report » (1 crédit) : chaque étape avec l'accord de Koya.
