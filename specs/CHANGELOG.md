# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

## [1.0.6] — 2026-11-06

Après le rapport regénéré sur la v1.0.5 (9,4 ; nouveau constat T2 en Testing ; `specs/analyse/2026-11-06-rapport-ia.md`).

### Added
- S1 et S2 tentent un second choix et Play Again pendant le déroulé (étapes 2 et 3), à la souris et au clavier : aucun effet, un seul tirage par partie (tirage témoin resté en file). Deux régressions essayées puis retirées sont attrapées (T2).

## [1.0.5] — 2026-11-06

Dernière tentative sur la seule piste du rapport regénéré (« keeping visual assertions resilient while retaining meaningful design verification »).

### Changed
- Les 22 comparaisons visuelles mesurent l'écart sur tout l'écran et sur chaque zone (en-tête, jeu, bas de page ; règles : la fenêtre et la page derrière), tirée de la boîte des éléments ; 5 % au plus partout ; le choix de version, absent des maquettes, n'est pas compté (S19, G3-6). La boîte du score masquée laisse l'écran à 2,6 %, mais l'en-tête à 6,7 % : le défaut est maintenant rouge.

## [1.0.4] — 2026-11-06

Après le rapport regénéré sur la v1.0.3 (9,4 ; Testing 8,2, Accessibility 8,7 ; `specs/analyse/2026-11-06-rapport-ia.md`), un commit par changement.

### Added
- Le choix est annoncé à l'étape 2 (« You picked Paper. The house is picking. ») ; le résultat suit avec le nouveau score (A8).
- « Rules » annonce qu'il ouvre un dialogue (`aria-haspopup="dialog"`) (A5).
- Les jetons de l'étape 1 forment le groupe « Pick a sign » ; la zone du jeu, focalisée après le choix, le groupe « Game » (§7).

### Changed
- `interactions.spec.js` mesure halos, survols et contours depuis la boîte de chaque élément, plus aucune coordonnée écrite en dur (T1).
- README : sémantique et tests à jour ; 232 tests.

## [1.0.3] — 2026-11-06

Corrections après le rapport IA de Frontend Mentor (9,3 / 10 ; `specs/analyse/2026-11-06-rapport-ia.md`), un commit par remarque.

### Added
- Résumé en tête du README : le site et les deux versions, la pile, la commande des tests (R6).
- Fitness functions : seul `src/lib/storage.js` touche au stockage (ADR-0007) ; aucun SVG corrigé n'a d'original en double dans `images/` (ADR-0008).

### Changed
- S1 et S2 calculent le score attendu partie après partie : il se cumule, Play Again ne le remet pas à zéro (R1).
- `Header.svelte` dit où le nouveau score est annoncé : avec le résultat, dans la région de statut (R2).
- Stockage de la version et des scores dans `src/lib/storage.js` ; `game.svelte.js` garde l'état et le déroulé (R5).

### Fixed
- La zone du jeu et la fenêtre des règles, focalisées par le script, montrent un contour au clavier (blanc ; Navy à l'intérieur de la page des règles sur mobile) ; aucun à la souris (R3, A7). Test ajouté, rouge avant le correctif.

### Removed
- Les originaux du starter `icon-close.svg`, `image-rules.svg` et `image-rules-bonus.svg`, remplacés par leurs copies corrigées AA de `src/assets/` (R4).

## [1.0.2] — 2026-11-06

Second correctif trouvé en rejouant S3 cinq fois sur le site en ligne (v1.0.1 : 217 / 217 en un passage, mais 10 échecs sur 15 en répétant S3).

### Fixed
- Rouvrir les règles juste après les avoir fermées (Échap puis Entrée) : l'état « règles ouvertes » ne repassait à faux qu'avec l'événement `close`, qui arrive plus tard ; la fenêtre ne se rouvrait pas, ou l'événement tardif refermait la nouvelle. La croix, Échap et le voile ferment désormais tout de suite ; chaque ouverture crée une fenêtre neuve ; l'événement tardif d'une fenêtre déjà fermée est ignoré (A5). Test ajouté, rouge avant le correctif.

## [1.0.1] — 2026-11-06

Correctif trouvé en rejouant la suite sur le site en ligne (Phase 12 : 214 tests sur 216 ; S3 échouait 6 fois sur 15).

### Fixed
- Fermer les règles : le navigateur rend le focus à « Rules », puis l'événement `close`, qui arrive après, le reprenait, même si le focus avait déjà bougé (Maj + Tab juste après la fermeture). « Rules » ne reprend plus le focus que s'il s'est perdu (A5). Test ajouté, rouge avant le correctif.

## [1.0.0] — 2026-11-06

Première version (SDL-FM 1.7.0, Advanced gratuit, maquettes JPG et Penpot, sans fichier Figma).

### Added
- En-tête : titre du jeu de la version ouverte (`h1`) et boîte du score ; signe moins typographique, chiffre réduit au-delà de 3 caractères (spec §3.1).
- Étape 1 : trois jetons sur le triangle (Original) ou cinq sur le pentagone (Lizard-Spock), boutons nommés par leur signe, dans l'ordre de lecture (spec §3.2, A3).
- Étapes 2 à 4 : mon signe, la place vide puis le signe de la maison, après 1 s puis 0,5 s ; « You Win », « You Lose » ou « Draw » ; halos derrière le gagnant ; « Play Again » qui rend le focus au jeton choisi ; résultat annoncé (D2 à D4, D7, §6).
- Choix de version à l'étape 1 (« Lizard-Spock » / « Original ») ; un score par version ; version et scores gardés dans le navigateur, valeurs illisibles ramenées à 0 et à Original (D5, D6).
- Règles : dialogue natif qui prend le focus et le garde, fermé par Échap, la croix ou le voile (≥ 768 px) ; schémas corrigés AA intégrés à la page ; règles aussi en texte ; page entière sur mobile ; défile dans une fenêtre basse (§3.5, ADR-0008).
- Mise en page au pixel des maquettes à 375 et 1366 px, tablette de G3-4, réduite à proportion jusqu'à 320 px (§5, ADR-0009).
- Survols et contours de focus de G3-2 ; aucune animation avec `prefers-reduced-motion` (§6, A9).
- Barlow Semi Condensed servie avec le site (ADR-0005) ; publication sous `/rock-paper-scissors/` (ADR-0011).
- 7 tests unitaires et 216 tests Playwright : parties menées au bout à la souris, au doigt et au clavier seul à trois largeurs, règles du jeu, rythme, positions, accessibilité, validateurs et règles FM, 22 écrans contre les maquettes, fitness functions des ADR.
