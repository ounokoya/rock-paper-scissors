<script>
  import Header from './components/Header.svelte'
  import Picker from './components/Picker.svelte'
  import Duel from './components/Duel.svelte'
  import Rules from './components/Rules.svelte'
  import { game, switchVersion } from './lib/game.svelte.js'
  import { notice } from './lib/announce.svelte.js'
  import { VERSIONS } from './lib/signs.js'

  let rulesOpen = $state(false)
  let rulesButton

  const other = $derived(VERSIONS[game.version === 'original' ? 'bonus' : 'original'].name)

  $effect(() => { document.title = VERSIONS[game.version].title })

  function closeRules() {
    rulesOpen = false
    rulesButton.focus()
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
      <button type="button" class="outline-button" bind:this={rulesButton} onclick={() => { rulesOpen = true }}>Rules</button>
    </div>
    <p class="sr-only" role="status">{notice.text}</p>
    {#if rulesOpen}
      <Rules version={game.version} onclose={closeRules} />
    {/if}
  </main>
</div>
