<script>
  import { onMount } from 'svelte'
  import Header from './components/Header.svelte'
  import Picker from './components/Picker.svelte'
  import Duel from './components/Duel.svelte'
  import Rules from './components/Rules.svelte'
  import { game, switchVersion } from './lib/game.svelte.js'
  import { notice } from './lib/announce.svelte.js'
  import { VERSIONS, ICONS } from './lib/signs.js'

  let rulesOpen = $state(false)
  // une fenêtre neuve à chaque ouverture : rouverte aussitôt après une fermeture, elle n'hérite pas de l'ancienne
  let rulesKey = $state(0)
  let rulesButton

  const other = $derived(VERSIONS[game.version === 'original' ? 'bonus' : 'original'].name)

  $effect(() => { document.title = VERSIONS[game.version].title })

  // images montrées plus tard (l'autre version, ses icônes) : chargées d'avance, pour qu'aucune ne manque à son premier affichage
  onMount(() => {
    for (const src of [...Object.values(VERSIONS).flatMap((v) => [v.logo, v.links]), ...Object.values(ICONS)]) new Image().src = src
  })

  // le navigateur rend déjà le focus à « Rules » en fermant le dialogue ; l'événement close arrive ensuite :
  // il ne reprend le focus que s'il s'est perdu, jamais s'il a déjà bougé
  function closeRules() {
    rulesOpen = false
    if (!document.activeElement || document.activeElement === document.body) rulesButton.focus()
  }
</script>

<div class="page" data-version={game.version}>
  <Header />
  <main class="main">
    <div class="game">
      {#if game.step === 1}
        <Picker />
      {:else}
        <Duel {rulesOpen} />
      {/if}
    </div>
    <div class="bar">
      {#if game.step === 1}
        <button type="button" class="outline-button outline-button-wide" aria-label="Switch to {other}" onclick={switchVersion}>{other}</button>
      {/if}
      <button type="button" class="outline-button" aria-haspopup="dialog" bind:this={rulesButton} onclick={() => { rulesKey += 1; rulesOpen = true }}>Rules</button>
    </div>
    <p class="sr-only" role="status">{notice.text}</p>
    {#if rulesOpen}
      {#key rulesKey}
        <Rules version={game.version} onclose={closeRules} />
      {/key}
    {/if}
  </main>
</div>
