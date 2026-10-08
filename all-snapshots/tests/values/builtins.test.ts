import { expect, test } from 'vitest'
import { text } from '../../src/fixtures'

test('maps sets dates regexes and typed arrays', () => {
  const label = text('values:builtins:label', 'Synthetic collection')
  expect.soft({
    label,
    map: new Map([['title', label], ['state', text('values:builtins:state', 'ready')]]),
    set: new Set([label, 'snapshots']),
    date: new Date('2026-01-01T00:00:00.000Z'),
    regex: /snapshot/gi,
    bytes: new TextEncoder().encode(label),
    bigint: 9007199254740993n,
    missing: undefined,
    specialNumbers: [NaN, Infinity, -0],
  }).toMatchSnapshot()
  expect.soft(new Map([['label', label]])).toMatchInlineSnapshot(`
    Map {
      "label" => "Synthetic collection",
    }
  `)
})

test('cycles and shared references', () => {
  const node: { label: string; self?: unknown } = { label: text('values:cycle', 'Circular catalogue') }
  node.self = node
  expect.soft(node).toMatchSnapshot('cycle')
  expect.soft([node, node]).toMatchInlineSnapshot(`
    [
      {
        "label": "Circular catalogue",
        "self": [Circular],
      },
      {
        "label": "Circular catalogue",
        "self": [Circular],
      },
    ]
  `)
})

test.concurrent('concurrent snapshot assertions use local expect A', async ({ expect }) => {
  await Promise.resolve()
  expect.soft(text('values:concurrent:a', 'Concurrent alpha')).toMatchSnapshot()
  expect.soft(text('values:concurrent:a2', 'Concurrent alpha inline')).toMatchInlineSnapshot(`"Concurrent alpha inline"`)
})

test.concurrent('concurrent snapshot assertions use local expect B', async ({ expect }) => {
  await Promise.resolve()
  expect.soft(text('values:concurrent:b', 'Concurrent beta')).toMatchSnapshot()
  expect.soft(text('values:concurrent:b2', 'Concurrent beta inline')).toMatchInlineSnapshot(`"Concurrent beta inline"`)
})
