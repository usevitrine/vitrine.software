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
own index compiled to WebAssembly. It isn't in git (~130 MB): the deploy downloads `vitrine-demo.tar.gz` from this
repository's release tagged `demo`. To make it (needs Go and Node, in `app/`):

```sh
go run ./tools/demolib       # fetch the art and clips, build the library (cached)
go run ./tools/demosnap      # export its snapshot
cd web && npm run build:demo -- <snapshot folder>   # -> web/dist-demo
```

Then `npm run demo` here puts it at `public/demo/app` for a local build; for the site, pack `web/dist-demo` as
`vitrine-demo.tar.gz` and upload it to the `demo` release.

## Screenshots

`src/assets/shots/` come from the app repository's `tools/siteshots` (every screen at desktop and phone widths, from
the demo library).

## Credits

Art: the [Art Institute of Chicago](https://www.artic.edu/open-access) (public domain). Clips: the Blender open
movies, (c) Blender Foundation, [CC BY](https://creativecommons.org/licenses/by/4.0/). Comics: Winsor McCay (public
domain). Code: AGPL-3.0, like Vitrine.
