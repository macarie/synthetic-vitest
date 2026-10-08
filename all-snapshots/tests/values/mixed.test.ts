import { expect, test } from 'vitest'
import { html, record, text } from '../../src/fixtures'

test('external and inline snapshots in the same test', async () => {
  expect.soft(record('values:mixed:record')).toMatchSnapshot('catalogue')
  expect.soft(text('values:mixed:title', 'Catalogue ready')).toMatchInlineSnapshot(`"Catalogue ready"`)
  expect.soft(record('values:mixed:second')).toMatchSnapshot('second catalogue')
  await expect.soft(html('values:mixed:html')).toMatchFileSnapshot('./raw/mixed.html')
})

test('property matchers retain stable snapshot content', () => {
  const value = { ...record('values:properties'), createdAt: new Date('2026-01-01'), requestId: 'request-123' }
  expect.soft(value).toMatchSnapshot({ createdAt: expect.any(Date), requestId: expect.any(String) }, 'masked metadata')
  expect.soft(value).toMatchInlineSnapshot({ createdAt: expect.any(Date), requestId: expect.any(String) }, `
    {
      "count": 2,
      "createdAt": Any<Date>,
      "items": [
        "inline",
        "external",
      ],
      "requestId": Any<String>,
      "status": "ready",
      "title": "Snapshot catalogue",
    }
  `)
})

test('repeated external snapshots use counters and hints', () => {
  expect.soft(text('values:counter:one', 'First output')).toMatchSnapshot()
  expect.soft(text('values:counter:two', 'Second output')).toMatchSnapshot()
  expect.soft(text('values:counter:three', 'Third output')).toMatchSnapshot('named output')
})
