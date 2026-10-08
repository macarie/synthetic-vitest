import { inject } from 'vitest'
import { glitchText } from './glitch'
import type { SnapshotMode } from './glitch'

declare module 'vitest' {
  interface ProvidedContext {
    snapshotMode: SnapshotMode
  }
}

export function text(id: string, value = 'Synthetic snapshot output'): string {
  return glitchText(value, id, inject('snapshotMode'))
}

export function record(id: string) {
  return {
    title: text(`${id}:title`, 'Snapshot catalogue'),
    status: text(`${id}:status`, 'ready'),
    items: [text(`${id}:first`, 'inline'), text(`${id}:second`, 'external')],
    count: 2,
  }
}

export function html(id: string) {
  return `<article data-kind="snapshot">\n  <h2>${text(`${id}:heading`, 'Snapshot catalogue')}</h2>\n  <p>${text(`${id}:body`, 'Raw HTML &amp; inline values')}</p>\n</article>\n`
}

export function markdown(id: string) {
  return `# ${text(`${id}:heading`, 'Snapshot report')}\n\n- ${text(`${id}:first`, 'Inline snapshots')}\n- ${text(`${id}:second`, 'File snapshots')}\n\n\`literal backticks\` and "quotes"\n`
}

export function error(id: string) {
  return new TypeError(text(id, 'Synthetic validation failed: invalid snapshot input'))
}

export function domainRecord(id: string) {
  return {
    name: text(`${id}:name`, 'Synthetic catalogue'),
    status: text(`${id}:status`, 'ready'),
    revision: '42',
    extra: 'not asserted by subset templates',
  }
}

export function packet(id: string) {
  return { kind: 'packet' as const, route: text(`${id}:route`, '/snapshots/catalogue'), payload: record(id) }
}
