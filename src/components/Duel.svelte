<script>
  import { onMount, untrack } from 'svelte'
  import Token from './Token.svelte'
  import { game, playAgain } from '../lib/game.svelte.js'
  import { HEADINGS } from '../lib/signs.js'

  // Étapes 2 à 4 (spec §3.3) ; le focus va à la zone du jeu, puis à « Play Again » sauf si les règles sont ouvertes (§6)
  let { rulesOpen = false } = $props()
  let zone
  let again = $state()

  onMount(() => zone.focus())

  // au passage à l'étape 4 seulement : la fermeture des règles, plus tard, rend le focus à « Rules »
  $effect(() => {
    if (game.step === 4 && again && !untrack(() => rulesOpen)) again.focus()
  })
</script>

<div class="duel" data-step={game.step} role="group" aria-label="Game" tabindex="-1" bind:this={zone}>
  <figure class="pick pick-mine">
    <figcaption class="pick-label">You Picked</figcaption>
    <Token sign={game.mine} winner={game.result === 'win'} />
  </figure>
  <figure class="pick pick-house">
    <figcaption class="pick-label">The House Picked</figcaption>
    {#if game.step >= 3}
      <Token sign={game.house} winner={game.result === 'lose'} appear />
    {:else}
      <span class="place"></span>
    {/if}
  </figure>
  {#if game.step === 4}
    <div class="outcome">
      <h2 class="result">{HEADINGS[game.result]}</h2>
      <button type="button" class="again" bind:this={again} onclick={playAgain}>Play Again</button>
    </div>
  {/if}
</div>
