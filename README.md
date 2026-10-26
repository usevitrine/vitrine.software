# vitrine.software

The website of [Vitrine](https://github.com/usevitrine/vitrine), a fast, self-hosted media library with a built-in
downloader: https://vitrine.software

Built with [Astro](https://astro.build) (fully static) and deployed to Cloudflare Workers on every push to `main`
(`.github/workflows/deploy.yml`). The app itself is a submodule (`app/`): the site uses its colors, logo and
scrollbar, and the demo is its web client in demo mode.

```sh
git clone --recurse-submodules https://github.com/usevitrine/vitrine.software
npm ci
npm run dev        # http://localhost:4321
```

## The demo

`/demo` shows the app with a library of public-domain art and Blender open-movie clips, its search running Vitrine's
own index compiled to WebAssembly. Every deploy builds it from the app submodule (`npm run build:demo` in `app/web`),
so it always matches the app the site points at. Its library isn't in git (~120 MB): the deploy downloads
`demo-library.tar.gz` (`snapshot.json` and `media/`) from this repository's release tagged `demo`.

**Following the app**: `.github/workflows/update-app.yml` checks once a day for a new Vitrine release, moves the
submodule to it and deploys - a release reaches the site and its demo within a day (or run the workflow by hand).

**A new library** (other art or clips; needs Go, in `app/`): `go run ./tools/demolib`, `go run ./tools/demosnap`, then
pack the snapshot folder's `snapshot.json` and `media/` as `demo-library.tar.gz` and upload it to the `demo` release
(`gh release upload demo demo-library.tar.gz --clobber`). Locally: `npm run build:demo --prefix app/web -- <snapshot
folder>`, then `npm run demo` puts it at `public/demo/app`.

## Screenshots

`src/assets/shots/` come from the app repository's `tools/siteshots` (every screen at desktop and phone widths, from
the demo library).

## Credits

Art: the [Art Institute of Chicago](https://www.artic.edu/open-access) (public domain). Clips: the Blender open
movies, (c) Blender Foundation, [CC BY](https://creativecommons.org/licenses/by/4.0/). Comics: Winsor McCay (public
domain). Code: AGPL-3.0, like Vitrine.
