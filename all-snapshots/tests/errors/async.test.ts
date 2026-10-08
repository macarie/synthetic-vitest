import { expect, test } from 'vitest'
import { error, text } from '../../src/fixtures'

test('rejected promises use both error snapshot matchers', async () => {
  await expect.soft(Promise.reject(error('errors:reject:external'))).rejects.toThrowErrorMatchingSnapshot('rejection')
  await expect.soft(Promise.reject(error('errors:reject:inline'))).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: Synthetic validation failed: invalid snapshot input]`)
  await expect.soft(Promise.resolve(text('errors:resolve', 'Recovered result'))).resolves.toMatchInlineSnapshot(`"Recovered result"`)
})

test('causes and aggregate errors are serialized together', () => {
  const cause = error('errors:cause')
  expect.soft(new Error(text('errors:outer', 'Outer synthetic failure'), { cause })).toMatchSnapshot('caused error')
  expect.soft(new AggregateError([cause, error('errors:aggregate')], text('errors:aggregate:title', 'Several synthetic failures'))).toMatchInlineSnapshot(`[AggregateError: Several synthetic failures]`)
})
