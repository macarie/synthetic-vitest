import { describe, expect, test } from 'vitest'
import { markdown, text } from '../../src/fixtures'

describe('escaping and whitespace', () => {
  test('quotes backticks slashes and interpolation literals', () => {
    expect.soft(text('inline:escapes', '"double" \'single\' `backticks` ${literal} \\path\\file')).toMatchInlineSnapshot(`""double" 'single' \`backticks\` \${literal} \\path\\file"`)
    expect.soft(text('inline:unicode', 'Café — 日本語 — 🚀 synthetic output')).toMatchInlineSnapshot(`"Café — 日本語 — 🚀 synthetic output"`)
  })

  test('multiline snapshots and raw content in the same test', async () => {
    expect.soft(text('inline:multiline', 'First line\n\n  Indented line\n\tTabbed line\nFinal line\n')).toMatchInlineSnapshot(`
      "First line

        Indented line
      	Tabbed line
      Final line
      "
    `)
    expect.soft(markdown('inline:markdown')).toMatchSnapshot('markdown serialized')
    await expect.soft(markdown('inline:markdown')).toMatchFileSnapshot('./raw/report.md')
  })
})
