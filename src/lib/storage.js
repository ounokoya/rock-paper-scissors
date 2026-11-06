// Version et scores gardés dans le navigateur (ADR-0007, D5) : trois clés texte, lues par les règles pures
import { readScore, readVersion } from './rules.js'

export const KEYS = { version: 'rps/version', original: 'rps/score/original', bonus: 'rps/score/bonus' }

// stockage indisponible (navigation privée stricte) : le jeu marche sans garder
function read(key) {
  try { return localStorage.getItem(key) } catch { return null }
}
function write(key, value) {
  try { localStorage.setItem(key, String(value)) } catch { /* rien à garder */ }
}

export const loadVersion = () => readVersion(read(KEYS.version))
export const loadScores = () => ({ original: readScore(read(KEYS.original)), bonus: readScore(read(KEYS.bonus)) })
export const saveScore = (version, score) => write(KEYS[version], score)
export const saveVersion = (version) => write(KEYS.version, version)
