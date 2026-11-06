# ADR-0007 : Version et scores gardés dans `localStorage`

## Statut
Accepté (2026-11-06) — Pré-dev 1 (P1), G2 (Q-B1, Q-B3).

## Contexte
Le score doit rester après un rechargement (bonus) ; un score par version ; la version choisie gardée ; une valeur gardée peut être illisible.

## Options
| Option | Pour | Contre |
|---|---|---|
| **`localStorage`, trois clés texte : `rps/version`, `rps/score/original`, `rps/score/bonus` (choisie)** | Simple, synchrone ; chaque valeur lisible seule | Lié au navigateur |
| Un seul objet JSON | Une clé | Un JSON abîmé perd tout |

## Décision
- Lecture au chargement par `readScore` (entier sûr écrit en base 10, sinon 0) et `readVersion` (`bonus`, sinon `original`).
- Écriture du score à l'étape 4 ; de la version à chaque changement ; stockage indisponible : le jeu marche sans garder.

## Conséquences
- Vérifié par S1, S4, S10, S12, U4.
- Fitness function : la page n'écrit que ces trois clés.
