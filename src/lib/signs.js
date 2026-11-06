// Ce que l'écran montre de chaque signe et de chaque version (spec §3, §7) ; les couleurs sont dans src/app.css (ADR-0004)
import rock from '../../images/icon-rock.svg'
import paper from '../../images/icon-paper.svg'
import scissors from '../../images/icon-scissors.svg'
import lizard from '../../images/icon-lizard.svg'
import spock from '../../images/icon-spock.svg'
import logo from '../../images/logo.svg'
import logoBonus from '../../images/logo-bonus.svg'
import triangle from '../../images/bg-triangle.svg'
import pentagon from '../../images/bg-pentagon.svg'

export const ICONS = { rock, paper, scissors, lizard, spock }
// largeur et hauteur des icônes du starter, pour réserver leur place
export const ICON_SIZE = { rock: [48, 48], paper: [49, 59], scissors: [51, 58], lizard: [63, 60], spock: [45, 59] }
export const NAMES = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors', lizard: 'Lizard', spock: 'Spock' }

// A3 : ordre de lecture des jetons de l'étape 1 (Original : en haut à gauche, à droite, en bas ; Lizard-Spock : dans le sens des aiguilles d'une montre)
export const ORDER = { original: ['paper', 'scissors', 'rock'], bonus: ['scissors', 'paper', 'rock', 'lizard', 'spock'] }

export const VERSIONS = {
  original: { name: 'Original', title: 'Rock, Paper, Scissors', logo, logoAlt: 'Rock Paper Scissors', logoSize: [162, 99], links: triangle, linksSize: [313, 278] },
  bonus: { name: 'Lizard-Spock', title: 'Rock, Paper, Scissors, Lizard, Spock', logo: logoBonus, logoAlt: 'Rock Paper Scissors Lizard Spock', logoSize: [115, 114], links: pentagon, linksSize: [329, 313] },
}

export const HEADINGS = { win: 'You Win', lose: 'You Lose', draw: 'Draw' }
export const SAID = { win: 'you win', lose: 'you lose', draw: 'draw' }
