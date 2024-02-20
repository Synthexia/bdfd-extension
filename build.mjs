import { build } from "esbuild";

const [argument] = process.argv.splice(2);

let minify = false;

if (argument == '--minify')
    minify = true;

console.log(`Building the extension... Minify: ${minify}.`);

await build({
    minify,
    bundle: true,
    platform: 'node',
    entryPoints: ['./src/extension.ts'],
    external: ['vscode', 'canvas'],
    outdir: './dist/'
});

console.log('Extension was built.');
