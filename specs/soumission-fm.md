# Soumission Frontend Mentor

> SDL-FM 1.7.0 Phase 13. Textes préparés pour le formulaire « Submit solution » du challenge. La soumission est publique et faite au nom de Koya : elle n'est envoyée qu'avec son accord, au moment de l'envoi (« Oui, soumets », 2026-11-06).
>
> **Envoyée le 2026-11-06** avec l'accord de Koya, textes ci-dessous inchangés (les 5 tags existent sur FM) : https://www.frontendmentor.io/solutions/rock-paper-scissors-lizard-spock-svelte-5-tailwind-v4-playwright-XZIdVxKJa5

## Informations générales

| Champ | Valeur |
|---|---|
| Solution title (70 caractères max) | Rock Paper Scissors Lizard Spock: Svelte 5, Tailwind v4, Playwright (67) |
| Repository URL | https://github.com/ounokoya/rock-paper-scissors |
| Live site URL | https://ounokoya.github.io/rock-paper-scissors/ |
| Tags (5 max, hors HTML/CSS/JS) | `svelte`, `tailwind-css`, `vite`, `accessibility`, `playwright` |
| Visibilité | Public |

Rapport IA : avec Pro, généré dès la soumission (Advanced : +100 points).

## What are you most proud of, and what would you do differently next time?

I'm most proud of the tests: 218 Playwright tests and 7 unit tests, written from a spec before the code. They replace `Math.random` in the page to choose the house's sign and drive the page's clock, so every game of the designs is replayed exactly (same signs, same score) and the 22 screens differ from the JPG designs by 0.6–3.1 %. The games are played to the end with the mouse and with the keyboard alone at 375, 768 and 1440 px, and with a finger on a phone.

Next time, I'd run the keyboard tests against the live site several times from the start. Two timing bugs around the rules dialog only showed up there: closing then reopening it quickly, and focus jumping back to the Rules button after it had already moved.

## What challenges did you encounter, and how did you overcome them?

- **Triangle and pentagon that keep their shape**: the board is a container; each token's position and size are percentages of its width in container query units (`cqi`), read from the designs, so the whole board shrinks as one below 375 px. Every part of a token (edge, disc, icon, hover ring, halos) is a fraction of its diameter, so one component works at five sizes.
- **The rules dialog**: a modal `<dialog>` is pinned to the top and bottom of the screen, so `block-size: auto` stretched it to the full height; `fit-content` with a `max-block-size` keeps its size and lets it scroll in a short window. The dialog also closes at once on Escape, the close button or the backdrop, instead of waiting for the browser's `close` event, which arrives later.
- **What the designs leave open**: a draw, switching between the two versions, negative scores and the timing of the reveal are not drawn. A draw reuses the result layout with "Draw" and no halos; a "Lizard-Spock" / "Original" button sits next to Rules at step 1 only; each version keeps its own score in `localStorage`.
- **Contrast**: the rules diagram's "BEATS" labels and arrows were 2.1:1 and the close icon 1.5:1; the diagram is inlined with `#6b7087` (4.9:1), the icon is drawn in the dark navy, and the rules are also given as text to screen readers.

## What specific areas of your project would you like help with?

1. The result is announced in a status region ("You picked Paper, the house picked Rock: you win. Score 13") and focus moves to Play Again. Is that enough with a screen reader, or would you also move focus to the result heading?
2. During the reveal (steps 2 and 3), the chosen sign is no longer a button, so focus moves to the game area (`tabindex="-1"`). Would you handle focus differently while the house is picking?
3. The version switch is not in the designs; I placed it next to Rules and show it at step 1 only. Would you put it somewhere else, or keep it visible during a game?
