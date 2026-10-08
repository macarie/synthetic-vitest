# All snapshots

This synthetic suite mixes snapshot types and repeated assertions within individual tests across seven [Vitest projects](https://vitest.dev/guide/projects), configured in `vitest.config.ts`.

## Coverage

| Project | Snapshot scenarios |
| --- | --- |
| `values` | External, inline, and raw snapshots; hints, counters, property matchers, built-in types, circular references, and concurrent tests. |
| `inline` | Multiple assertions per test or source line, multiline strings, Unicode, escaping, and external/raw companions. |
| `raw` | HTML, JSON, Markdown, SQL, CSS, and text files; whitespace, CRLF, and missing final newlines. |
| `errors` | External and inline snapshots of thrown errors, rejected promises, thrown strings, causes, and aggregate errors. |
| `serializers` | Configured and runtime serializers, nested composition, inline/external snapshots, and unprocessed raw JSON. |
| `domains` | Semantic comparison, regex and subset templates, order-independent entries, and custom matchers built from `Snapshots` composables. |
| `browser` | DOM, raw HTML, ordinary values, ARIA templates, and screenshots mixed with text snapshots. |

External snapshots use serialized `.snap` files; raw snapshots compare file contents directly. Domain snapshots use custom capture, rendering, parsing, and comparison.

Browser tests run in headless Chromium. Screenshots use fixed-size color blocks without fonts, animations, or network resources, with shared PNG references across operating systems.

## Run tests

Run commands from this folder:

```sh
pnpm test
pnpm test:node
pnpm test:browser
pnpm test --project domains
pnpm test --project inline --project errors
pnpm test tests/values/mixed.test.ts
pnpm test:watch
```

Browser tests require Playwright's Chromium headless shell. Install it with `pnpm browser:install`. On Linux systems that need browser libraries, use `pnpm exec playwright install --with-deps chromium --only-shell`.

The checked-in baseline passes with glitch mode disabled. Use `CI=1 pnpm test` to also fail on missing or obsolete snapshots.

## Reproduce snapshot failures

Enable glitch mode with an optional seed:

```sh
GLITCH=1 SEED=demo-42 pnpm test
GLITCH=1 SEED=demo-42 pnpm test --project domains
```

Glitch mode intentionally produces snapshot mismatches, including screenshots, and exits with a nonzero status. Soft assertions let later snapshots run after earlier failures. The configuration sets `update: 'none'` to preserve the baseline.

`SEED` accepts any string and defaults to `snapshot-errors`. Setting it alone does not enable glitch mode or change baseline output. Mutations are deterministic for each seed, fixture ID, and input, independent of execution order, concurrency, or test filters. Structured fixtures remain valid JSON, HTML, and domain data.

## Update the baseline

Disable glitch mode when updating snapshots:

```sh
GLITCH=0 pnpm test --update
GLITCH=0 pnpm test --update --project domains
```

Review generated changes in test files (inline snapshots), `tests/**/__snapshots__/` (serialized and domain snapshots), each project's `raw/` or `outputs/` folder, and `tests/browser/__screenshots__/` (PNG references). Failure attachments and reports are ignored under `.vitest/` directories.

See Vitest's [snapshot guide](https://vitest.dev/guide/snapshot), [ARIA snapshot guide](https://vitest.dev/guide/browser/aria-snapshots), and [visual regression guide](https://vitest.dev/guide/browser/visual-regression-testing).
