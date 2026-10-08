import { expect, test } from 'vitest'
import { html, markdown, record, text } from '../../src/fixtures'

test('raw HTML and JSON with serialized and inline companions', async () => {
  await expect.soft(html('raw:html')).toMatchFileSnapshot('./outputs/catalogue.html')
  await expect.soft(`${JSON.stringify(record('raw:json'), null, 2)}\n`).toMatchFileSnapshot('./outputs/catalogue.json')
  expect.soft(record('raw:companion')).toMatchSnapshot()
  expect.soft(text('raw:inline', 'Raw files ready')).toMatchInlineSnapshot(`"Raw files ready"`)
})

test('multiple raw files in one test', async () => {
  await expect.soft(markdown('raw:md')).toMatchFileSnapshot('./outputs/report.md')
  await expect.soft(text('raw:sql', "SELECT 'snapshot catalogue' AS title;\n")).toMatchFileSnapshot('./outputs/query.sql')
  await expect.soft(text('raw:css', '.snapshot { content: "catalogue ready"; }\n')).toMatchFileSnapshot('./outputs/styles.css')
})
