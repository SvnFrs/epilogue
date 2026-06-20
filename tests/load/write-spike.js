import http from 'k6/http';
import { check } from 'k6';

/**
 * Write-spike profile (US1 save-state) — bursts of context writes (serialization + JSONB
 * under contention). The save op is TAGGED so its own threshold applies (testing.md t4).
 */
const BASE = __ENV.API_URL || 'http://localhost:4000';
const OWNER = __ENV.OWNER_ID || '00000000-0000-4000-8000-000000000001';
const SECRET = __ENV.OWNER_SECRET || 'dev-owner-secret-change-me';
const ENTRY = __ENV.ENTRY_ID; // a GAME entry id to hammer
const headers = { 'Content-Type': 'application/json', 'X-Epilogue-Owner': OWNER, 'X-Epilogue-Owner-Secret': SECRET };

export const options = {
  scenarios: {
    spike: { executor: 'ramping-vus', startVUs: 1, stages: [
      { duration: '30s', target: 20 },
      { duration: '1m', target: 20 },
      { duration: '30s', target: 0 },
    ] },
  },
  thresholds: {
    'http_req_duration{op:save}': ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  if (!ENTRY) throw new Error('set ENTRY_ID to a GAME entry');
  const body = JSON.stringify({
    payload: {
      checkpoint: `checkpoint @ ${Date.now()}`,
      threads: [{ id: 't1', text: 'thread', done: false }],
      keymap: [{ action: 'jump', key: 'Space' }],
    },
  });
  const res = http.put(`${BASE}/entries/${ENTRY}/context`, body, { headers, tags: { op: 'save' } });
  check(res, { 'save 200': (r) => r.status === 200 });
}
