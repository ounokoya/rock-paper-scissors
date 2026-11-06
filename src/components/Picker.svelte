<script>
  import { onMount } from 'svelte'
  import Token from './Token.svelte'
  import { game, pick } from '../lib/game.svelte.js'
  import { ORDER, VERSIONS } from '../lib/signs.js'

  // Étape 1 (spec §3.2) : les jetons sur le triangle ou le pentagone, dans l'ordre de lecture (A3)
  const refs = $state({})
  const version = $derived(VERSIONS[game.version])

  // après « Play Again » : le focus revient au jeton choisi (§6)
  onMount(() => {
    if (game.refocus && game.mine) refs[game.mine]?.focus()
    game.refocus = false
  })
</script>

<div class="board" data-version={game.version} role="group" aria-label="Pick a sign">
  <img class="board-links" src={version.links} alt="" width={version.linksSize[0]} height={version.linksSize[1]} />
  {#each ORDER[game.version] as sign (sign)}
    <Token {sign} onclick={() => pick(sign)} bind:ref={refs[sign]} />
  {/each}
</div>
