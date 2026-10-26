// Puts the demo (the app's web client in demo mode, its search engine and library) at public/demo/app, where /demo
// shows it: `npm run demo [folder]` - a built demo folder (default: the submodule's web/dist-demo, made there with
// `npm run build:demo <snapshot folder>`). public/demo/app is not in git (~110 MB of media).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const site = resolve(import.meta.dirname, '..');
const from = resolve(process.argv[2] ?? join(site, 'app', 'web', 'dist-demo'));
const to = join(site, 'public', 'demo', 'app');
if (!existsSync(join(from, 'demo.wasm')) || !existsSync(join(from, 'snapshot.json'))) {
  console.error(`no built demo with its library in ${from} (in app/web: npm run build:demo <snapshot folder>)`);
  process.exit(1);
}
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log(`demo: ${from} -> public/demo/app`);
