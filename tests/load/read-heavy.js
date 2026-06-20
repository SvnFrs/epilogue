import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Read-heavy profile (~85%) — browse → open item → load context + ledger (testing.md
 * tier 4). Target the i3/24GB host: ≤30 concurrent, latency under modest load. Watch the
 * Postgres pool — it saturates before CPU on this hardware.
 */
const BASE = __ENV.API_URL || 'http://localhost:4000';
const OWNER = __ENV.OWNER_ID || '00000000-0000-4000-8000-000000000001';
const SECRET = __ENV.OWNER_SECRET || 'dev-owner-secret-change-me';
const headers = { 'X-Epilogue-Owner': OWNER, 'X-Epilogue-Owner-Secret': SECRET };

export const options = {
  scenarios: {
    average: { executor: 'constant-vus', vus: Number(__ENV.VUS || 12), duration: __ENV.DURATION || '5m' },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const list = http.get(`${BASE}/entries`, { headers });
  check(list, { 'list 200': (r) => r.status === 200 });
  const entries = list.json();
  if (Array.isArray(entries) && entries.length) {
    const id = entries[Math.floor(Math.random() * entries.length)].id;
    const detail = http.get(`${BASE}/entries/${id}`, { headers });
    check(detail, { 'detail 200': (r) => r.status === 200 });
    http.get(`${BASE}/entries/${id}/ledger`, { headers });
  }
  sleep(1);
}
