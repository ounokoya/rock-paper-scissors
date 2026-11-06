# ADR-0010 : Maquettes JPG du starter comme références, sans fichier Figma

## Statut
Accepté (2026-11-06) — Pré-dev 1 (P4), règle de Koya (pas de fichier Figma).

## Contexte
Challenge gratuit : les 22 maquettes JPG du starter sont libres ; les tests visuels en ont besoin partout (en local et contre le site en ligne).

## Options
| Option | Pour | Contre |
|---|---|---|
| **JPG du starter dans `specs/reference/`, suivis par git ; décodés par le navigateur au test (choisie)** | Tests visuels partout ; aucune dépendance de plus | Les maquettes gardent les teintes sous AA (écart de moins de 1 %) |
| Fichier Figma | Mesures exactes | Refusé par Koya |

## Décision
- `specs/reference/*.jpg` (maquettes renommées) ; aucun `.fig`, `.sketch`, `.xd` dans le dépôt.

## Conséquences
- Fitness function : aucun fichier de maquette éditable suivi par git.
