// @ts-check
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

/**
 * @typedef {object} LineInfo
 * @property {string} angular Angular version the demo was built with.
 * @property {string} billboard billboard.js version the demo was built with.
 * @property {string} version Library version served at the line's folder.
 */

/**
 * @typedef {object} DeployOptions
 * @property {string} angular Angular version the demo was built with.
 * @property {string} billboard billboard.js version the demo was built with.
 * @property {string} latest Build output with the base href of the line folder, `vN/`.
 * @property {string} site Checkout of the published site, updated in place.
 * @property {string} snapshot Build output with the base href of the snapshot folder, `vN/N.x.y/`.
 * @property {string} version Library version being deployed, `N.x.y`.
 */

const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/;
const LINE_PATTERN = /^v(\d+)$/;
const INFO_FILE = 'demo.json';

/**
 * Parses a plain `major.minor.patch` version.
 *
 * @param {string} version
 * @returns {[number, number, number]}
 */
export function parseVersion(version) {
    const match = VERSION_PATTERN.exec(version);

    if (!match) {
        throw new Error(`Expected a version like 17.0.0, got "${version}".`);
    }

    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Compares two plain versions.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} A negative number when `a` is lower, zero when equal, a positive number when higher.
 */
export function compareVersions(a, b) {
    const left = parseVersion(a);
    const right = parseVersion(b);

    return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

/**
 * Publishes one demo build into the site: `vN/N.x.y/` always, and `vN/` unless that line already serves a newer version.
 * Folders of other lines and other snapshots are left untouched. The root index is regenerated afterwards.
 *
 * @param {DeployOptions} options
 * @returns {{ latestUpdated: boolean }}
 */
export function deployDemo(options) {
    const [major] = parseVersion(options.version);
    const [angularMajor] = parseVersion(options.angular);

    parseVersion(options.billboard);

    if (major !== angularMajor) {
        throw new Error(`Version ${options.version} does not match Angular ${options.angular}: the major versions must be equal.`);
    }

    const lineDir = join(options.site, `v${major}`);
    const snapshotDir = join(lineDir, options.version);

    rmSync(snapshotDir, { force: true, recursive: true });
    mkdirSync(snapshotDir, { recursive: true });
    cpSync(options.snapshot, snapshotDir, { recursive: true });

    const current = readLineInfo(lineDir);
    const latestUpdated = !current || compareVersions(options.version, current.version) >= 0;

    if (latestUpdated) {
        for (const entry of readdirSync(lineDir)) {
            if (!VERSION_PATTERN.test(entry)) {
                rmSync(join(lineDir, entry), { force: true, recursive: true });
            }
        }

        cpSync(options.latest, lineDir, { recursive: true });

        /** @type {LineInfo} */
        const info = { angular: options.angular, billboard: options.billboard, version: options.version };

        writeFileSync(join(lineDir, INFO_FILE), `${JSON.stringify(info, null, 4)}\n`);
    }

    writeFileSync(join(options.site, '.nojekyll'), '');
    writeFileSync(join(options.site, 'index.html'), renderIndex(options.site));

    return { latestUpdated };
}

/**
 * Renders the root page that lists every release line found in the site.
 *
 * @param {string} site
 * @returns {string}
 */
export function renderIndex(site) {
    const lines = readdirSync(site, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && LINE_PATTERN.test(entry.name))
        .map((entry) => {
            const dir = join(site, entry.name);

            return { dir, info: readLineInfo(dir), major: Number(entry.name.slice(1)), name: entry.name };
        })
        .filter((line) => line.info !== undefined)
        .sort((a, b) => b.major - a.major);

    const rows = lines.map(({ dir, info, major, name }) => {
        const line = /** @type {LineInfo} */ (info);
        const [billboardMajor] = parseVersion(line.billboard);
        const snapshots = readdirSync(dir)
            .filter((entry) => VERSION_PATTERN.test(entry))
            .sort((a, b) => compareVersions(b, a))
            .map((version) => `<a href="${name}/${version}/">${version}</a>`)
            .join(', ');

        return [
            '            <tr>',
            `                <td>${major}</td>`,
            `                <td><a href="${name}/">${escapeHtml(line.version)}</a></td>`,
            `                <td>${escapeHtml(line.billboard)}</td>`,
            `                <td><code>npm install angular-billboard@${major} billboard.js@${billboardMajor}</code></td>`,
            `                <td>${snapshots}</td>`,
            '            </tr>',
        ].join('\n');
    });

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>angular-billboard demos</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 60rem; padding: 0 1rem; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border-bottom: 1px solid #ddd; padding: 0.5rem; text-align: left; vertical-align: top; }
    </style>
</head>
<body>
    <h1>angular-billboard demos</h1>
    <p>One live demo per Angular version. <a href="https://github.com/akysil/angular-billboard">Source on GitHub</a>.</p>
    <table>
        <thead>
            <tr>
                <th>Angular</th>
                <th>angular-billboard</th>
                <th>billboard.js</th>
                <th>Install</th>
                <th>All versions</th>
            </tr>
        </thead>
        <tbody>
${rows.join('\n')}
        </tbody>
    </table>
</body>
</html>
`;
}

/**
 * Command line entry: `node scripts/deploy-demo.mjs --version 17.0.0 --angular 17.3.12 --billboard 4.1.5 --latest <dir> --snapshot <dir> --site <dir>`.
 *
 * @param {string[]} args
 * @returns {string} A summary of what was deployed.
 */
export function main(args) {
    const { values } = parseArgs({
        args,
        options: {
            angular: { type: 'string' },
            billboard: { type: 'string' },
            latest: { type: 'string' },
            site: { type: 'string' },
            snapshot: { type: 'string' },
            version: { type: 'string' },
        },
        strict: true,
    });

    const missing = ['angular', 'billboard', 'latest', 'site', 'snapshot', 'version'].filter((name) => !values[/** @type {keyof typeof values} */ (name)]);

    if (missing.length > 0) {
        throw new Error(`Missing required options: ${missing.map((name) => `--${name}`).join(', ')}.`);
    }

    const options = /** @type {DeployOptions} */ (values);
    const { latestUpdated } = deployDemo(options);
    const [major] = parseVersion(options.version);

    return latestUpdated
        ? `Deployed ${options.version} to v${major}/ and v${major}/${options.version}/.`
        : `Deployed ${options.version} to v${major}/${options.version}/ only: v${major}/ already serves a newer version.`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * @param {string} lineDir
 * @returns {LineInfo | undefined}
 */
function readLineInfo(lineDir) {
    const file = join(lineDir, INFO_FILE);

    return existsSync(file) ? /** @type {LineInfo} */ (JSON.parse(readFileSync(file, 'utf8'))) : undefined;
}
