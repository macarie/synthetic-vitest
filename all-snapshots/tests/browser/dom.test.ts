import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { mountCatalogue } from '../../src/browser-fixtures'
import { record } from '../../src/fixtures'

test('DOM serialization inline ARIA and raw HTML in one test', async () => {
  const main = mountCatalogue('browser:dom:mixed')
  expect.soft(main).toMatchSnapshot('DOM element')
  expect.soft(main.querySelector('h1')).toMatchInlineSnapshot(`
    <h1>
      Snapshot catalogue
    </h1>
  `)
  await expect.soft(page.getByRole('main').element()).toMatchAriaInlineSnapshot(`
    - main "Catalogue":
      - heading "Snapshot catalogue" [level=1]
      - list "Snapshot kinds":
        - listitem: Inline snapshots
        - listitem: File snapshots
      - button "Capture snapshot"
  `)
  await expect.soft(main.outerHTML).toMatchFileSnapshot('./raw/catalogue.html')
})

test('multiple ARIA snapshots and ordinary values coexist', async () => {
  mountCatalogue('browser:dom:aria')
  await expect.soft(page.getByRole('main').element()).toMatchAriaSnapshot()
  await expect.soft(page.getByRole('list').element()).toMatchAriaInlineSnapshot(`
    - list "Snapshot kinds":
      - listitem: Inline snapshots
      - listitem: File snapshots
  `)
  await expect.soft(page.getByRole('button').element()).toMatchAriaSnapshot()
  expect.soft(record('browser:dom:record')).toMatchInlineSnapshot(`
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

test('ARIA templates retain patterns and strict child directives', async () => {
  mountCatalogue('browser:dom:patterns')
  await expect.soft(page.getByRole('main').element()).toMatchAriaInlineSnapshot(`
    - main "Catalogue":
      - /children: deep-equal
      - heading "Snapshot catalogue" [level=1]
      - list "Snapshot kinds":
        - listitem: /Inline .*/
        - listitem: File snapshots
      - button "Capture snapshot"
  `)
  await expect.soft(page.getByRole('button').element()).toMatchAriaInlineSnapshot(`- button "Capture snapshot"`)
})
