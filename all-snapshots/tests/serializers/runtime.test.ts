import { expect, test } from 'vitest'
import { packet, text } from '../../src/fixtures'

expect.addSnapshotSerializer({
  test: value => value !== null && typeof value === 'object' && value.kind === 'badge',
  serialize: value => `Badge(${value.label})`,
})

test('runtime and configured serializers compose in one test', () => {
  expect.soft({ kind: 'badge', label: text('serializers:badge:a', 'Snapshot ready') }).toMatchSnapshot()
  expect.soft({ kind: 'badge', label: text('serializers:badge:b', 'Inline ready') }).toMatchInlineSnapshot(`Badge(Inline ready)`)
  expect.soft(packet('serializers:runtime:packet')).toMatchInlineSnapshot(`
    Packet /snapshots/catalogue
    {
      "count": 2,
      "items": [
        "inline",
        "external",
      ],
      "status": "ready",
      "title": "Snapshot catalogue",
    }
  `)
})

test('serializer handles nested values and repeated snapshots', () => {
  const value = { badge: { kind: 'badge', label: text('serializers:nested', 'Nested badge') }, packet: packet('serializers:nested:packet') }
  expect.soft(value).toMatchSnapshot('nested serializers')
  expect.soft(value).toMatchInlineSnapshot(`
    {
      "badge": Badge(Nested badge),
      "packet": Packet /snapshots/catalogue
    {
        "count": 2,
        "items": [
          "inline",
          "external",
        ],
        "status": "ready",
        "title": "Snapshot catalogue",
      },
    }
  `)
})
