# Synthetic Vitest Tests

This repository is a collection of projects containing synthetic tests for [Vitest](https://vitest.dev/). Each project lives in its own folder on the `trunk` branch and contains a test suite intended to exercise particular behavior or workloads. These suites may be used to investigate existing behavior or to validate changes to Vitest, such as performance improvements.

The projects are independent. This repository is not a monorepo; each project's setup and test commands are run from its own folder.

This is an **unofficial testing repository**. Its suites are not representative benchmarks, and results should not be treated as a general measure of Vitest performance. Tests may deliberately stress areas where Vitest has limitations or expose behavior that is unusual in normal applications.

## Test suites by folder

| Folder | What it tests |
| --- | --- |

<!--
Repository context for future maintainers and AI agents:
- This repository is an unofficial collection of synthetic Vitest test projects, not a Vitest project or an official benchmark suite.
- Projects live in separate folders on the trunk branch. They are independent projects, not a monorepo.
- Describe the specific scenarios in each folder; do not imply that results represent typical application performance.
- List folder rows in alphabetical order. When adding a project folder, add a row to the table above with a relative link to that folder and a concise description of what its tests exercise (for example, snapshot testing variants).
- Example catalog row: | [folder-name](./folder-name/) | Brief description of the tests in this folder. |
-->
