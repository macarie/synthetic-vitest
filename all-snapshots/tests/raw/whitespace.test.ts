import { expect, test } from 'vitest'
import { text } from '../../src/fixtures'

test('raw text preserves whitespace without snapshot serialization', async () => {
  const value = text('raw:whitespace', 'Header\n\n  two spaces\n\ttab\ntrailing spaces  \n')
  await expect.soft(value).toMatchFileSnapshot('./outputs/whitespace.txt')
  expect.soft(value).toMatchInlineSnapshot(`
    "Header

      two spaces
    	tab
    trailing spaces  
    "
  `)
  expect.soft(value).toMatchSnapshot('same content serialized')
})

test('CRLF and no final newline are distinct raw fixtures', async () => {
  await expect.soft(text('raw:crlf', 'First line\r\nSecond line\r\n')).toMatchFileSnapshot('./outputs/crlf.txt')
  await expect.soft(text('raw:no-newline', 'No final newline')).toMatchFileSnapshot('./outputs/no-newline.txt')
  expect.soft(text('raw:escaped', 'Literal \\n is not a newline')).toMatchInlineSnapshot(`"Literal \\n is not a newline"`)
})
