# ADR-0006 : Déroulé d'une partie en quatre étapes, minuté dans l'état du jeu

## Statut
Accepté (2026-11-06) — G2 (Q-B2, Q-B3, Q-B4), G3 (G3-7).

## Contexte
Étape 2 pendant 1 s, étape 3 pendant 0,5 s, puis le résultat ; le score change à l'étape 4 ; le même rythme sans mouvement si `prefers-reduced-motion` ; les tests fixent le tirage de la maison (`Math.random`) et avancent l'horloge de la page.

## Options
| Option | Pour | Contre |
|---|---|---|
| **Étape dans l'état (`1` à `4`), deux `setTimeout` lancés au choix, tirage de la maison au choix (choisie)** | Rythme indépendant des animations ; testable avec l'horloge de Playwright ; une partie abandonnée au rechargement ne compte pas | Les minuteries à annuler si l'on change de page |
| Enchaînement par la fin des animations | Animation et état liés | Sans animation (réglage réduit), plus d'enchaînement ; rythme lié au navigateur |

## Décision
- `pick(sign)` : étape 2, signe de la maison tiré tout de suite (`housePick(version, Math.random())`, un tirage par partie) ; après 1 s l'étape 3 ; après 0,5 s l'étape 4, le score (`nextScore`) et son enregistrement, l'annonce, le focus sur « Play Again ».
- Animations en CSS ou Web Animations (aucune boucle `requestAnimationFrame` dont dépendrait l'état) : le jeton de la maison grandit, le résultat et les halos apparaissent en fondu ; aucune si `prefers-reduced-motion: reduce`.
- `playAgain()` : étape 1, focus sur le jeton choisi.

## Conséquences
- Vérifié par S1 à S4, S9 à S11, S15, U2, U3.
