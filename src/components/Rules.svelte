<script>
  import { onMount } from 'svelte'
  import { RULES } from '../lib/rules.js'
  import { NAMES } from '../lib/signs.js'
  import closeIcon from '../assets/icon-close.svg?raw'
  import scheme from '../assets/image-rules.svg?raw'
  import schemeBonus from '../assets/image-rules-bonus.svg?raw'

  // Règles (ADR-0008) : dialogue modal natif qui prend le focus lui-même ; Échap, la croix ou un clic sur le voile
  // appellent onclose, et le parent rend le focus à « Rules » (A5) ; le schéma corrigé AA est décoratif, les règles sont aussi en texte
  let { version, onclose } = $props()

  let dialog
  let fromBackdrop = false
  let closed = false

  onMount(() => {
    dialog.showModal()
    dialog.focus()
  })

  // La croix, Échap et le voile ferment tout de suite : l'événement close du navigateur arrive dans une tâche suivante,
  // et celui d'une fenêtre déjà fermée ne doit rien faire (elle a pu être rouverte entre-temps)
  function close() {
    if (closed) return
    closed = true
    dialog.close()
    onclose()
  }

  // Tab et Maj + Tab restent dans le dialogue (A5) : le navigateur laisserait sortir le focus après la croix
  function trap(event) {
    if (event.key !== 'Tab') return
    const items = [...dialog.querySelectorAll('button')]
    const at = items.indexOf(document.activeElement)
    event.preventDefault()
    const next = at < 0 ? (event.shiftKey ? items.length - 1 : 0) : (at + (event.shiftKey ? -1 : 1) + items.length) % items.length
    items[next].focus()
  }
</script>

<dialog
  bind:this={dialog}
  class="rules"
  data-version={version}
  tabindex="-1"
  aria-labelledby="rules-title"
  onclose={close}
  oncancel={(event) => { event.preventDefault(); close() }}
  onkeydown={trap}
  onpointerdown={(event) => { fromBackdrop = event.target === dialog }}
  onclick={(event) => { if (fromBackdrop && event.target === dialog) close() }}
>
  <div class="rules-body">
    <h2 id="rules-title" class="rules-title">Rules</h2>
    <button type="button" class="rules-close" aria-label="Close rules" onclick={close}>
      <span class="rules-close-icon" aria-hidden="true">{@html closeIcon}</span>
    </button>
    <div class="rules-scheme" aria-hidden="true">{@html version === 'bonus' ? schemeBonus : scheme}</div>
    <ul class="sr-only">
      {#each RULES[version] as [winner, loser] (`${winner}-${loser}`)}
        <li>{NAMES[winner]} beats {NAMES[loser]}</li>
      {/each}
    </ul>
  </div>
</dialog>
