import { expect, Snapshots } from 'vitest'
import type { DomainSnapshotAdapter } from 'vitest'

type Captured = Record<string, string>
type Expected = Record<string, string | RegExp>

function render(entries: Record<string, string | RegExp>) {
  return `\n${Object.keys(entries).sort().map(key => `${key}=${entries[key]}`).join('\n')}\n`
}

export const catalogueAdapter: DomainSnapshotAdapter<Captured, Expected> = {
  name: 'catalogue-kv',
  capture(received) {
    if (!received || typeof received !== 'object' || Array.isArray(received)) {
      throw new TypeError('Catalogue domain expects an object')
    }
    return Object.fromEntries(Object.entries(received).map(([key, value]) => [key, String(value)]))
  },
  render,
  parseExpected(input) {
    return Object.fromEntries(input.trim().split('\n').map(line => {
      const separator = line.indexOf('=')
      if (separator < 1) throw new TypeError(`Invalid catalogue entry: ${line}`)
      const value = line.slice(separator + 1)
      return [line.slice(0, separator), value.startsWith('/') && value.endsWith('/')
        ? new RegExp(value.slice(1, -1))
        : value]
    }))
  },
  match(captured, expected) {
    let pass = true
    const resolved: Captured = {}
    for (const [key, template] of Object.entries(expected)) {
      const actual = captured[key]
      const matches = actual !== undefined && (template instanceof RegExp ? template.test(actual) : actual === template)
      pass &&= matches
      // Preserve matching patterns during updates, and detect missing keys.
      resolved[key] = matches ? String(template) : actual ?? '<missing>'
    }
    return { pass, resolved: render(resolved), expected: render(expected) }
  },
}

expect.extend({
  toMatchCatalogueSnapshot(received: unknown) {
    return Snapshots.toMatchDomainSnapshot.call(this, catalogueAdapter, received)
  },
  toMatchCatalogueInlineSnapshot(received: unknown, inlineSnapshot?: string) {
    return Snapshots.toMatchDomainInlineSnapshot.call(this, catalogueAdapter, received, inlineSnapshot)
  },
  toMatchUppercaseSnapshot(received: string) {
    return Snapshots.toMatchSnapshot.call(this, received.toUpperCase())
  },
  toMatchUppercaseInlineSnapshot(received: string, inlineSnapshot?: string) {
    return Snapshots.toMatchInlineSnapshot.call(this, received.toUpperCase(), inlineSnapshot)
  },
  async toMatchUppercaseFileSnapshot(received: string, file: string) {
    return Snapshots.toMatchFileSnapshot.call(this, received.toUpperCase(), file)
  },
})

declare module 'vitest' {
  interface Matchers<R, T> {
    toMatchCatalogueSnapshot(): R
    toMatchCatalogueInlineSnapshot(inlineSnapshot?: string): R
    toMatchUppercaseSnapshot(): R
    toMatchUppercaseInlineSnapshot(inlineSnapshot?: string): R
    toMatchUppercaseFileSnapshot(file: string): Promise<void>
  }
}
