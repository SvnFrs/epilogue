#!/usr/bin/env bash
# T045 — backup + restore drill (deployment.md: "a backup you've never restored isn't a
# backup"). Takes a custom-format pg_dump of the live DB, restores it into a throwaway
# database, verifies the row counts match, then drops the throwaway. Run periodically;
# CI/cron can call it after the nightly dump. Non-destructive to the live DB.
set -euo pipefail

cd "$(dirname "$0")/.."

PGUSER="${POSTGRES_USER:-epilogue}"
PGDB="${POSTGRES_DB:-epilogue}"
TESTDB="${PGDB}_restore_test"
COMPOSE="docker compose -f docker/docker-compose.yml"
PSQL="$COMPOSE exec -T postgres psql -U ${PGUSER} -v ON_ERROR_STOP=1"

echo "→ dumping ${PGDB} (custom format)"
$COMPOSE exec -T postgres pg_dump -U "$PGUSER" -Fc "$PGDB" > /tmp/epilogue-restore-test.dump
$COMPOSE exec -T postgres sh -c "cat > /tmp/rt.dump" < /tmp/epilogue-restore-test.dump
DUMP_BYTES=$(wc -c < /tmp/epilogue-restore-test.dump)
echo "  dump = ${DUMP_BYTES} bytes"
[ "$DUMP_BYTES" -gt 0 ] || { echo "✗ empty dump" >&2; exit 1; }

cleanup() { $PSQL -d "$PGDB" -c "DROP DATABASE IF EXISTS ${TESTDB};" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "→ restoring into throwaway ${TESTDB}"
$PSQL -d "$PGDB" -c "DROP DATABASE IF EXISTS ${TESTDB};" >/dev/null
$PSQL -d "$PGDB" -c "CREATE DATABASE ${TESTDB};" >/dev/null
$COMPOSE exec -T postgres pg_restore -U "$PGUSER" -d "$TESTDB" --no-owner /tmp/rt.dump

echo "→ verifying row counts (live vs restored)"
fail=0
for t in users entries volatile_contexts ledgers backlinks; do
  src=$($PSQL -d "$PGDB"   -tAc "SELECT count(*) FROM ${t};" | tr -d '[:space:]')
  dst=$($PSQL -d "$TESTDB" -tAc "SELECT count(*) FROM ${t};" | tr -d '[:space:]')
  if [ "$src" = "$dst" ]; then
    echo "  ✓ ${t}: ${src}"
  else
    echo "  ✗ ${t}: live=${src} restored=${dst}" >&2
    fail=1
  fi
done

[ "$fail" -eq 0 ] || { echo "✗ restore mismatch" >&2; exit 1; }
echo "✓ backup restores cleanly — counts match"
