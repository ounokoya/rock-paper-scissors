# ADR-0005 : Barlow Semi Condensed par Fontsource

## Statut
Accepté (2026-11-06) — guide de style (600 et 700) ; téléchargement au verrou, avec l'accord de Koya.

## Contexte
Toute l'interface et le texte « BEATS » du schéma des règles sont en Barlow Semi Condensed 600 et 700 ; le site doit fonctionner sans service tiers.

## Options
| Option | Pour | Contre |
|---|---|---|
| **`@fontsource/barlow-semi-condensed`, sous-ensemble latin, 600 et 700 (choisie)** | Servie avec le site, rien hors du domaine ; même méthode que le Kanban | Une dépendance npm |
| Google Fonts | Rien à installer | Requête vers un autre domaine |

## Décision
- `@fontsource/barlow-semi-condensed` (latin 600, 700) importé dans `src/app.css` ; le texte du schéma des règles, intégré à la page, prend cette police par le CSS.

## Conséquences
- Fitness function : rien n'est chargé hors du domaine ; Barlow Semi Condensed 600 et 700 se chargent ; une seule dépendance d'exécution, la police.
