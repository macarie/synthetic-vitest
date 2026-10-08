import { expect, test } from 'vitest'
import { record, text } from '../../src/fixtures'

test('three inline snapshots in a single test', () => {
  expect.soft(text('inline:multiple:a', 'First inline value')).toMatchInlineSnapshot(`"First inline value"`)
  expect.soft(text('inline:multiple:b', 'Second inline value')).toMatchInlineSnapshot(`"Second inline value"`)
  expect.soft(record('inline:multiple:object')).toMatchInlineSnapshot(`
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

test('several inline snapshots on one source line', () => {
  expect.soft(text('inline:same-line:a', 'Left value')).toMatchInlineSnapshot(`"Left value"`); expect.soft(text('inline:same-line:b', 'Right value')).toMatchInlineSnapshot(`"Right value"`)
})

test('inline and external storage share the same file', () => {
  expect.soft(record('inline:storage:a')).toMatchInlineSnapshot(`
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
  expect.soft(record('inline:storage:b')).toMatchSnapshot('external companion')
})
