// Facts the pages share, and the latest release (read from GitHub when the site is built).

export const REPO = 'https://github.com/usevitrine/vitrine';
export const PLUGINS_REPO = 'https://github.com/usevitrine/vitrine-plugins';
export const CHANGELOG = `${REPO}/blob/main/CHANGELOG.md`;
export const RELEASES = `${REPO}/releases/latest`;

export type Release = { version: string; date: string; windows: string | null; windowsArm: string | null };

let cached: Promise<Release> | null = null;

/** The latest release: its version, date and the Windows installers' links - x64 and arm64 (none read: the releases
 *  page; no arm64 one before 1.0.6). */
export function latestRelease(): Promise<Release> {
  cached ??= (async () => {
    try {
      const res = await fetch('https://api.github.com/repos/usevitrine/vitrine/releases/latest', {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'vitrine.software build' },
      });
      if (!res.ok) throw new Error(String(res.status));
      const r = (await res.json()) as { tag_name: string; published_at: string; assets: { name: string; browser_download_url: string }[] };
      const setup = (arch: string) =>
        r.assets.find((a) => a.name.startsWith('Vitrine-Setup-') && a.name.endsWith(`-${arch}.exe`))?.browser_download_url ?? null;
      return { version: r.tag_name.replace(/^v/, ''), date: r.published_at.slice(0, 10), windows: setup('x64'), windowsArm: setup('arm64') };
    } catch {
      return { version: '', date: '', windows: null, windowsArm: null };
    }
  })();
  return cached;
}
