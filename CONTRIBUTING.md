# Contributing

Thanks for helping! angular-billboard is a deliberately thin Angular wrapper around [billboard.js](https://naver.github.io/billboard.js/): billboard.js options go in, the billboard.js chart instance comes out. Please keep changes in that spirit.

## Picking an issue

Start with the oldest [open issue that is not blocked and not assigned](https://github.com/akysil/angular-billboard/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee+-is%3Ablocked+sort%3Acreated-asc). An issue shows as blocked until the issues it depends on are closed. Comment on the issue to claim it before you start.

## Workflow

1. Open or pick an issue first, so the change is agreed before you write it.
2. Open a pull request against `main`.
3. Add or update tests. CI must pass before merging.

## Development

Use Node 18 or 20 (`.nvmrc` pins 20), then install with `npm ci`.

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint and Prettier over the whole workspace (`npm run lint:fix` fixes what it can) |
| `npm test` | Unit tests with Vitest, with coverage |
| `npm run build` | Builds the library into `dist/angular-billboard` |
| `npm run build:demo` | Builds the demo application |
| `npm run check:package` | Checks the built library package with publint and Are the Types Wrong (run `npm run build` first) |
| `npm start` | Serves the demo application |

The library lives in `projects/angular-billboard` and the demo app in `projects/demo`.

## Reporting bugs

Use the bug report form and include a reproduction if you can. Questions about chart options belong to billboard.js.

## Code of conduct

Be kind and constructive. This project follows the [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Report unacceptable behaviour privately to the maintainer through GitHub.
