# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

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
