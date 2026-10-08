import { expect, test } from 'vitest'
import { packet, text } from '../../src/fixtures'

test('configured serializer applies to file and inline snapshots', () => {
  expect.soft(packet('serializers:configured:a')).toMatchSnapshot('first packet')
  expect.soft(packet('serializers:configured:b')).toMatchInlineSnapshot(`
    Packet /snapshots/catalogue
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
  expect.soft(packet('serializers:configured:c')).toMatchSnapshot('second packet')
})

test('serialized snapshots coexist with unprocessed raw files', async () => {
  const value = packet('serializers:raw')
  expect.soft(value).toMatchInlineSnapshot(`
    Packet /snapshots/catalogue
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
  await expect.soft(`${JSON.stringify(value, null, 2)}\n`).toMatchFileSnapshot('./raw/packet.json')
  expect.soft(text('serializers:plain', 'Unserialized string')).toMatchSnapshot()
})
