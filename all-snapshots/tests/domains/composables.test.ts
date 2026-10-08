import { expect, test } from 'vitest'
import { domainRecord, text } from '../../src/fixtures'

test('custom snapshot composables cover external inline and raw files', async () => {
  expect.soft(text('domains:uppercase:file', 'Custom external snapshot')).toMatchUppercaseSnapshot()
  expect.soft(text('domains:uppercase:inline', 'Custom inline snapshot')).toMatchUppercaseInlineSnapshot(`"CUSTOM INLINE SNAPSHOT"`)
  await expect.soft(text('domains:uppercase:raw', 'Custom raw snapshot\n')).toMatchUppercaseFileSnapshot('./raw/uppercase.txt')
  expect.soft(domainRecord('domains:uppercase:domain')).toMatchCatalogueSnapshot()
})

test('multiple domain snapshots in the same test retain separate counters', () => {
  expect.soft(domainRecord('domains:counters:first')).toMatchCatalogueSnapshot()
  expect.soft(domainRecord('domains:counters:second')).toMatchCatalogueSnapshot()
  expect.soft(domainRecord('domains:counters:inline')).toMatchCatalogueInlineSnapshot(`
    extra=not asserted by subset templates
    name=Synthetic catalogue
    revision=42
    status=ready
  `)
})
