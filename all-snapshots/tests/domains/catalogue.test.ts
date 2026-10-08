import { expect, test } from 'vitest'
import { domainRecord, record } from '../../src/fixtures'

test('domain snapshots share a test with regular snapshots', () => {
  expect.soft(domainRecord('domains:external')).toMatchCatalogueSnapshot()
  expect.soft(domainRecord('domains:inline')).toMatchCatalogueInlineSnapshot(`
    extra=not asserted by subset templates
    name=Synthetic catalogue
    revision=42
    status=ready
  `)
  expect.soft(record('domains:regular')).toMatchSnapshot('regular object')
  expect.soft(record('domains:regular:inline')).toMatchInlineSnapshot(`
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

test('semantic templates match regexes and subsets', () => {
  expect.soft(domainRecord('domains:pattern')).toMatchCatalogueInlineSnapshot(`
    name=Synthetic catalogue
    revision=/^[0-9]+$/
    status=ready
  `)
  expect.soft({ ...domainRecord('domains:order'), extra: 'ignored', revision: '314' }).toMatchCatalogueInlineSnapshot(`
    status=ready
    revision=/^[0-9]+$/
    name=Synthetic catalogue
  `)
  expect.soft(domainRecord('domains:pattern:file')).toMatchCatalogueSnapshot()
})
