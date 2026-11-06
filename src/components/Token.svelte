<script>
  import { ICONS, ICON_SIZE, NAMES } from '../lib/signs.js'

  // Un jeton (spec §4) : bouton à l'étape 1, image nommée par son signe ensuite (A3) ; halos s'il gagne (D7)
  let { sign, onclick, winner = false, appear = false, ref = $bindable() } = $props()
</script>

{#snippet face()}
  <span class="token-disc">
    <img class="token-icon" src={ICONS[sign]} alt={NAMES[sign]} width={ICON_SIZE[sign][0]} height={ICON_SIZE[sign][1]} />
  </span>
{/snippet}

{#if onclick}
  <button type="button" class="token" data-sign={sign} bind:this={ref} {onclick}>{@render face()}</button>
{:else}
  <span class="token" class:token-winner={winner} class:token-appear={appear} data-sign={sign}>{@render face()}</span>
{/if}
