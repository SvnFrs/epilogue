/**
 * Convert an embed URL into something safe to render (T033 — real provider embed,
 * replacing the POC's fake play button). Only known video providers become iframes;
 * anything else renders as a link card (no arbitrary third-party iframes).
 */
export type Embed = { kind: 'iframe'; src: string; provider: string } | { kind: 'link'; href: string };

export function resolveEmbed(url: string): Embed {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { kind: 'link', href: url };
  }
  const host = u.hostname.replace(/^www\./, '');

  // YouTube
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = u.searchParams.get('v');
    if (id) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}`, provider: 'YouTube' };
  }
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1);
    if (id) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}`, provider: 'YouTube' };
  }
  // Vimeo
  if (host === 'vimeo.com') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}`, provider: 'Vimeo' };
  }
  return { kind: 'link', href: url };
}
