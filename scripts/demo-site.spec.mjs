import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { compareVersions, deployDemo, main, parseVersion, renderIndex } from './demo-site.mjs';

describe('demo site', () => {
    /** @type {string} */
    let root;
    /** @type {string} */
    let site;

    /**
     * Creates a fake demo build whose index.html names the build.
     *
     * @param {string} name
     * @returns {string}
     */
    function build(name) {
        const dir = join(root, 'builds', name);

        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), name);
        writeFileSync(join(dir, `main-${name}.js`), '');

        return dir;
    }

    /**
     * @param {string} version
     * @param {string} [angular]
     * @returns {{ latestUpdated: boolean }}
     */
    function deploy(version, angular = `${version.split('.')[0]}.3.12`) {
        return deployDemo({ angular, billboard: '4.1.5', latest: build(`${version}-latest`), site, snapshot: build(`${version}-snapshot`), version });
    }

    /**
     * @param {...string} path
     * @returns {string}
     */
    function read(...path) {
        return readFileSync(join(site, ...path), 'utf8');
    }

    beforeEach(() => {
        root = mkdtempSync(join(tmpdir(), 'demo-site-'));
        site = join(root, 'site');
        mkdirSync(site);
    });

    afterEach(() => {
        rmSync(root, { force: true, recursive: true });
    });

    describe('parseVersion', () => {
        it('parses a plain version', () => {
            expect(parseVersion('17.2.10')).toEqual([17, 2, 10]);
        });

        it.each(['17', '17.0', 'v17.0.0', '17.0.0-rc.0', '17.0.0 '])('rejects "%s"', (version) => {
            expect(() => parseVersion(version)).toThrow(`Expected a version like 17.0.0, got "${version}".`);
        });
    });

    describe('compareVersions', () => {
        it('orders by major, then minor, then patch', () => {
            expect(compareVersions('18.0.0', '17.9.9')).toBeGreaterThan(0);
            expect(compareVersions('17.1.0', '17.0.9')).toBeGreaterThan(0);
            expect(compareVersions('17.0.2', '17.0.10')).toBeLessThan(0);
            expect(compareVersions('17.0.0', '17.0.0')).toBe(0);
        });
    });

    describe('deployDemo', () => {
        it('publishes the line folder, the snapshot folder and the index', () => {
            expect(deploy('17.0.0')).toEqual({ latestUpdated: true });

            expect(read('v17', 'index.html')).toBe('17.0.0-latest');
            expect(read('v17', '17.0.0', 'index.html')).toBe('17.0.0-snapshot');
            expect(JSON.parse(read('v17', 'demo.json'))).toEqual({ angular: '17.3.12', billboard: '4.1.5', version: '17.0.0' });
            expect(read('.nojekyll')).toBe('');
            expect(read('index.html')).toContain('<a href="v17/">17.0.0</a>');
        });

        it('keeps other lines when deploying a second line', () => {
            deploy('17.0.0');
            deploy('18.0.0');

            expect(read('v17', 'index.html')).toBe('17.0.0-latest');
            expect(read('v17', '17.0.0', 'index.html')).toBe('17.0.0-snapshot');
            expect(read('v18', 'index.html')).toBe('18.0.0-latest');
            expect(read('v18', '18.0.0', 'index.html')).toBe('18.0.0-snapshot');

            const index = read('index.html');

            expect(index).toContain('<a href="v17/">17.0.0</a>');
            expect(index).toContain('<a href="v18/">18.0.0</a>');
            expect(index.indexOf('v18/')).toBeLessThan(index.indexOf('v17/'));
        });

        it('keeps unrelated files at the site root', () => {
            writeFileSync(join(site, 'CNAME'), 'example.com');

            deploy('17.0.0');

            expect(read('CNAME')).toBe('example.com');
        });

        it('replaces the line folder with a newer version and keeps earlier snapshots', () => {
            deploy('17.0.0');
            deploy('17.0.1');

            expect(read('v17', 'index.html')).toBe('17.0.1-latest');
            expect(existsSync(join(site, 'v17', 'main-17.0.0-latest.js'))).toBe(false);
            expect(read('v17', '17.0.0', 'index.html')).toBe('17.0.0-snapshot');
            expect(read('v17', '17.0.1', 'index.html')).toBe('17.0.1-snapshot');
            expect(read('index.html')).toContain('<a href="v17/17.0.1/">17.0.1</a>, <a href="v17/17.0.0/">17.0.0</a>');
        });

        it('only refreshes the snapshot when the line already serves a newer version', () => {
            deploy('17.0.0');
            deploy('17.1.0');

            expect(deploy('17.0.0')).toEqual({ latestUpdated: false });

            expect(read('v17', 'index.html')).toBe('17.1.0-latest');
            expect(JSON.parse(read('v17', 'demo.json'))).toMatchObject({ version: '17.1.0' });
            expect(readdirSync(join(site, 'v17', '17.0.0'))).toEqual(['index.html', 'main-17.0.0-snapshot.js']);
        });

        it('rejects a version whose major differs from the Angular major', () => {
            expect(() => deploy('18.0.0', '17.3.12')).toThrow('Version 18.0.0 does not match Angular 17.3.12: the major versions must be equal.');
            expect(readdirSync(site)).toEqual([]);
        });

        it('rejects an invalid billboard.js version', () => {
            expect(() => deployDemo({ angular: '17.3.12', billboard: 'latest', latest: build('a'), site, snapshot: build('b'), version: '17.0.0' })).toThrow(
                'Expected a version like 17.0.0, got "latest".',
            );
        });
    });

    describe('renderIndex', () => {
        it('lists only line folders that have demo information', () => {
            deploy('17.0.0');
            mkdirSync(join(site, 'v19'));
            mkdirSync(join(site, 'assets'));
            writeFileSync(join(site, 'v20'), '');

            const index = renderIndex(site);

            expect(index).toContain('<td>17</td>');
            expect(index).toContain('<code>npm install angular-billboard@17 billboard.js@4</code>');
            expect(index).not.toContain('v19');
            expect(index).not.toContain('v20');
            expect(index).not.toContain('assets');
        });

        it('escapes values read from the demo information', () => {
            mkdirSync(join(site, 'v17'));
            writeFileSync(join(site, 'v17', 'demo.json'), JSON.stringify({ angular: '17.3.12', billboard: '4.1.5', version: '<b>"&"</b>' }));

            expect(renderIndex(site)).toContain('&lt;b&gt;&quot;&amp;&quot;&lt;/b&gt;');
        });

        it('renders an empty table for an empty site', () => {
            expect(renderIndex(site)).toContain('<tbody>\n\n        </tbody>');
        });
    });

    describe('main', () => {
        /**
         * @param {string} version
         * @returns {string[]}
         */
        function args(version) {
            return [
                '--version',
                version,
                '--angular',
                '17.3.12',
                '--billboard',
                '4.1.5',
                '--latest',
                build(`${version}-latest`),
                '--snapshot',
                build(`${version}-snapshot`),
                '--site',
                site,
            ];
        }

        it('reports where the version was deployed', () => {
            expect(main(args('17.1.0'))).toBe('Deployed 17.1.0 to v17/ and v17/17.1.0/.');
            expect(main(args('17.0.0'))).toBe('Deployed 17.0.0 to v17/17.0.0/ only: v17/ already serves a newer version.');
        });

        it('requires every option', () => {
            expect(() => main(['--version', '17.0.0', '--site', site])).toThrow('Missing required options: --angular, --billboard, --latest, --snapshot.');
        });

        it('rejects unknown options', () => {
            expect(() => main(['--force'])).toThrow();
        });
    });

    describe('deploy-demo command', () => {
        const script = resolve('scripts/deploy-demo.mjs');

        it('deploys and prints a summary', () => {
            const result = spawnSync(
                process.execPath,
                [script, '--version', '17.0.0', '--angular', '17.3.12', '--billboard', '4.1.5', '--latest', build('l'), '--snapshot', build('s'), '--site', site],
                { encoding: 'utf8' },
            );

            expect(result.status).toBe(0);
            expect(result.stdout).toBe('Deployed 17.0.0 to v17/ and v17/17.0.0/.\n');
            expect(read('v17', 'index.html')).toBe('l');
        });

        it('exits with an error message on invalid input', () => {
            const result = spawnSync(process.execPath, [script, '--version', 'next'], { encoding: 'utf8' });

            expect(result.status).toBe(1);
            expect(result.stderr).toBe('Missing required options: --angular, --billboard, --latest, --site, --snapshot.\n');
        });
    });
});
