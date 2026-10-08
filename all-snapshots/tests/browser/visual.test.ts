import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { mountPixels } from '../../src/browser-fixtures'
import { text } from '../../src/fixtures'

test('two screenshots plus inline and external values', async () => {
  const root = mountPixels('browser:visual:blocks')
  await expect.soft(page.getByTestId('pixels')).toMatchScreenshot('all-blocks')
  await expect.soft(root.firstElementChild!).toMatchScreenshot('first-block')
  expect.soft(text('browser:visual:inline', 'Pixel snapshot complete')).toMatchInlineSnapshot(`"Pixel snapshot complete"`)
  expect.soft(text('browser:visual:external', 'Visual reference ready')).toMatchSnapshot()
})

test('screenshots coexist with raw files and DOM snapshots', async () => {
  const root = mountPixels('browser:visual:mixed')
  await expect.soft(page.getByTestId('pixels')).toMatchScreenshot('mixed-blocks')
  expect.soft(root).toMatchSnapshot('pixel DOM')
  await expect.soft(root.outerHTML).toMatchFileSnapshot('./raw/pixels.html')
})
