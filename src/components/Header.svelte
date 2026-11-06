<script>
  import { game } from '../lib/game.svelte.js'
  import { VERSIONS } from '../lib/signs.js'

  const version = $derived(VERSIONS[game.version])
  const score = $derived(game.scores[game.version])
  // signe moins typographique ; un chiffre long prend une taille plus petite pour tenir dans la boîte (S12)
  const shown = $derived(score < 0 ? `\u2212${-score}` : String(score))
</script>

<header class="header">
  <h1 class="logo" data-version={game.version}>
    <img src={version.logo} alt={version.logoAlt} width={version.logoSize[0]} height={version.logoSize[1]} />
  </h1>
  <!-- Le nouveau score est annoncé avec le résultat par la région de statut (A8 ; game.svelte.js, finish :
       « You picked Paper, the house picked Rock: you win. Score 13 ») : pas d'aria-live ici, le score serait annoncé deux fois -->
  <p class="score">
    <span class="score-label">Score</span>
    <span class="score-value" data-length={Math.min(shown.length, 6)}>{shown}</span>
  </p>
</header>
