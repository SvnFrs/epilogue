import 'server-only';

/**
 * Server-only API config (eng-review T9). The owner secret lives ONLY on the web
 * server — never shipped to the browser (that's why this file is `server-only` and the
 * client talks to the same-origin /api proxy instead). Phase 3 swaps this fixed owner
 * for an authenticated session with no data change.
 */
export const serverConfig = {
  apiUrl: process.env.API_URL ?? 'http://localhost:4000',
  ownerId: process.env.OWNER_ID ?? '00000000-0000-4000-8000-000000000001',
  ownerSecret: process.env.OWNER_SECRET ?? 'dev-owner-secret-change-me',
};

export function ownerHeaders(): Record<string, string> {
  return {
    'x-epilogue-owner': serverConfig.ownerId,
    'x-epilogue-owner-secret': serverConfig.ownerSecret,
  };
}
