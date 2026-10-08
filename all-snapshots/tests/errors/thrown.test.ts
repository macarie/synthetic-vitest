import { expect, test } from 'vitest'
import { error, text } from '../../src/fixtures'

test('thrown errors have external and inline snapshots', () => {
  expect.soft(() => { throw error('errors:throw:external') }).toThrowErrorMatchingSnapshot('validation')
  expect.soft(() => { throw error('errors:throw:inline') }).toThrowErrorMatchingInlineSnapshot(`[TypeError: Synthetic validation failed: invalid snapshot input]`)
  expect.soft(() => { throw new RangeError(text('errors:range', 'Synthetic range exceeded')) }).toThrowErrorMatchingInlineSnapshot(`[RangeError: Synthetic range exceeded]`)
})

test('error values and thrown strings mix with regular snapshots', () => {
  expect.soft(error('errors:value')).toMatchSnapshot('error value')
  expect.soft(() => { throw text('errors:string', 'Synthetic string failure') }).toThrowErrorMatchingInlineSnapshot(`"Synthetic string failure"`)
  expect.soft(text('errors:message', 'Validation report complete')).toMatchInlineSnapshot(`"Validation report complete"`)
})
