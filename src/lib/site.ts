// Facts the pages share, and the latest release (read from GitHub when the site is built).

export const REPO = 'https://github.com/usevitrine/vitrine';
export const PLUGINS_REPO = 'https://github.com/usevitrine/vitrine-plugins';
export const CHANGELOG = `${REPO}/blob/main/CHANGELOG.md`;
export const RELEASES = `${REPO}/releases/latest`;

export type Release = { version: string; date: string; windows: string | null };

let cached: Promise<Release> | null = null;

/** The latest release: its version, date and the Windows installer's link (none read: the releases page). */
export function latestRelease(): Promise<Release> {
  cached ??= (async () => {
    try {
      const res = await fetch('https://api.github.com/repos/usevitrine/vitrine/releases/latest', {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'vitrine.software build' },
      });
      if (!res.ok) throw new Error(String(res.status));
      const r = (await res.json()) as { tag_name: string; published_at: string; assets: { name: string; browser_download_url: string }[] };
      const setup = r.assets.find((a) => /^Vitrine-Setup-.*-x64\.exe$/.test(a.name));
      return { version: r.tag_name.replace(/^v/, ''), date: r.published_at.slice(0, 10), windows: setup?.browser_download_url ?? null };
    } catch {
      return { version: '', date: '', windows: null };
    }
  })();
  return cached;
}
