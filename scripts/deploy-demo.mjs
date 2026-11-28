// @ts-check
import { main } from './demo-site.mjs';

try {
    process.stdout.write(`${main(process.argv.slice(2))}\n`);
} catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
}
