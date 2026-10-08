export interface SnapshotMode {
  glitch: boolean
  seed: string
}

function hash(input: string): number {
  let state = 2166136261
  for (let i = 0; i < input.length; i++) {
    state = Math.imul(state ^ input.charCodeAt(i), 16777619)
  }
  return state >>> 0
}

// Every call has its own random stream: scheduling, filters and concurrency
// cannot change the output for a given seed + fixture ID + input.
export function glitchText(input: string, id: string, mode: SnapshotMode): string {
  if (!mode.glitch) return input
  const characters = [...input]
  const positions = characters.flatMap((char, index) => /[a-zA-Z0-9]/.test(char) ? [index] : [])
  if (!positions.length) throw new Error(`No mutable characters in fixture ${id}`)
  let state = hash(`${mode.seed}\0${id}\0${input}`)
  const random = () => {
    state = (state + 0x6D2B79F5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const count = Math.min(3, positions.length)
  for (let i = 0; i < count; i++) {
    const [position] = positions.splice(Math.floor(random() * positions.length), 1)
    const original = characters[position].toLowerCase()
    const alternatives = [...alphabet].filter(char => char.toLowerCase() !== original).join('')
    characters[position] = alternatives[Math.floor(random() * alternatives.length)]
  }
  return characters.join('')
}
