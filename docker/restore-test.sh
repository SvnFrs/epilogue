#!/usr/bin/env bash
# T045 — restore drill (deployment.md: "a backup you've never restored isn't a backup").
# Restores the NEWEST dump the backup sidecar wrote to docker/backups/ (or the dump passed
# as $1) into a throwaway database, then checks it: pg_restore succeeds with no errors,
# every table in the live DB exists in the restore, and the owner row is present. Row
# counts are printed live vs restored; they can legitimately differ (writes since the
# dump), so they're for eyeballing, not a pass/fail. Fails if the newest dump is older
# than MAX_AGE_HOURS — that means the sidecar has stopped producing them.
# Non-destructive to the live DB; the copied dump + throwaway DB are removed on exit.
#
#   ./docker/restore-test.sh                                   # newest sidecar dump
#   ./docker/restore-test.sh docker/backups/epilogue-weekly-2026-W41.dump
set -euo pipefail

cd "$(dirname "$0")/.."

PGUSER="${POSTGRES_USER:-epilogue}"
PGDB="${POSTGRES_DB:-epilogue}"
TESTDB="${PGDB}_restore_test"
BACKUP_DIR="${BACKUP_DIR:-docker/backups}" # the sidecar's ./backups bind mount
MAX_AGE_HOURS="${MAX_AGE_HOURS:-26}"
COMPOSE="${COMPOSE:-docker compose -f docker/docker-compose.yml}"
PSQL="$COMPOSE exec -T postgres psql -U ${PGUSER} -v ON_ERROR_STOP=1"
REMOTE_DUMP="/tmp/epilogue-restore-test.$$.dump" # copy inside the postgres container

if [ $# -gt 0 ]; then
  DUMP="$1"
else
  DUMP=$(ls -1t "$BACKUP_DIR"/epilogue-*.dump 2>/dev/null | head -n 1 || true)
  [ -n "$DUMP" ] || { echo "✗ no sidecar dumps in ${BACKUP_DIR} — is the backup service running?" >&2; exit 1; }
fi
[ -s "$DUMP" ] || { echo "✗ ${DUMP} is missing or empty" >&2; exit 1; }
AGE_H=$(( ($(date +%s) - $(stat -c %Y "$DUMP")) / 3600 ))
if [ $# -eq 0 ] && [ "$AGE_H" -ge "$MAX_AGE_HOURS" ]; then
  echo "✗ newest dump $(basename "$DUMP") is ${AGE_H}h old (limit ${MAX_AGE_HOURS}h) — the backup sidecar is not producing dumps" >&2
  exit 1
fi

cleanup() {
  $PSQL -d "$PGDB" -c "DROP DATABASE IF EXISTS ${TESTDB};" >/dev/null 2>&1 || true
  $COMPOSE exec -T postgres rm -f "$REMOTE_DUMP" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "→ restoring $(basename "$DUMP") ($(wc -c <"$DUMP") bytes, ${AGE_H}h old) into throwaway ${TESTDB}"
$COMPOSE exec -T postgres sh -c "cat > ${REMOTE_DUMP}" <"$DUMP"
$PSQL -d "$PGDB" -c "SET client_min_messages = warning;" -c "DROP DATABASE IF EXISTS ${TESTDB};" >/dev/null
$PSQL -d "$PGDB" -c "CREATE DATABASE ${TESTDB};" >/dev/null
$COMPOSE exec -T postgres pg_restore -U "$PGUSER" -d "$TESTDB" --no-owner --exit-on-error "$REMOTE_DUMP"

# every user table, schema-qualified + quoted (drizzle's migration journal included)
TABLES_SQL="SELECT format('%I.%I', table_schema, table_name) FROM information_schema.tables
  WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')
  ORDER BY 1;"
mapfile -t LIVE < <($PSQL -d "$PGDB" -tAc "$TABLES_SQL")
mapfile -t RESTORED < <($PSQL -d "$TESTDB" -tAc "$TABLES_SQL")
[ "${#RESTORED[@]}" -gt 0 ] || { echo "✗ the restore contains no tables" >&2; exit 1; }

echo "→ tables (restored vs live)"
fail=0
for t in "${RESTORED[@]}"; do
  dst=$($PSQL -d "$TESTDB" -tAc "SELECT count(*) FROM ${t};")
  if printf '%s\n' "${LIVE[@]}" | grep -qxF -- "$t"; then
    src=$($PSQL -d "$PGDB" -tAc "SELECT count(*) FROM ${t};")
  else
    src="(not in live)"
  fi
  printf '  ✓ %-36s restored=%-8s live=%s\n' "$t" "$dst" "$src"
done
for t in "${LIVE[@]}"; do
  if ! printf '%s\n' "${RESTORED[@]}" | grep -qxF -- "$t"; then
    echo "  ✗ ${t}: in the live DB but missing from the restore (a migration newer than the dump? re-check after the next one)" >&2
    fail=1
  fi
done

# the seeded owner (migrate one-shot) — every row hangs off it, so a dump without it is useless
owners=$($PSQL -d "$TESTDB" -tAc "SELECT count(*) FROM public.users;" 2>/dev/null || echo 0)
if [ "$owners" -lt 1 ]; then
  echo "  ✗ public.users is empty — no owner row in the dump" >&2
  fail=1
fi

[ "$fail" -eq 0 ] || { echo "✗ restore check failed" >&2; exit 1; }
echo "✓ $(basename "$DUMP") restores cleanly"
