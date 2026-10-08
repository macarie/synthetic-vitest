import type { SnapshotSerializer } from 'vitest'

export default {
  test: value => value !== null && typeof value === 'object' && value.kind === 'packet',
  serialize(value, config, indentation, depth, refs, printer) {
    return `Packet ${value.route}\n${printer(value.payload, config, indentation, depth, refs)}`
  },
} satisfies SnapshotSerializer
