#!/bin/sh
# Backup sidecar (deployment.md §Backups). Runs inside postgres:17-alpine (busybox sh);
# compose mounts it read-only and passes the connection as libpq env (PGHOST, PGUSER,
# PGPASSWORD, PGDATABASE).
#
# Each run: `pg_dump -Fc` into a temp file, check the archive is readable, then rename it
# into place — a failed or partial dump never takes a real backup's name. The first good
# dump of each ISO week is hard-linked as that week's weekly. Then prune to KEEP_DAILY
# dailies + KEEP_WEEKLY weeklies. Any failure exits non-zero, so Docker restarts the
# container and the error is in `docker compose logs backup` (fail loudly, never an
# empty "backup").
#
#   sh backup.sh          loop: back up now, then every BACKUP_INTERVAL_SECONDS
#   sh backup.sh --once   back up once and exit (`docker compose run --rm backup --once`)
set -eu

BACKUP_DIR="${BACKUP_DIR:-/backups}"
KEEP_DAILY="${BACKUP_KEEP_DAILY:-7}"
KEEP_WEEKLY="${BACKUP_KEEP_WEEKLY:-4}"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"

log() { echo "[backup] $(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }
die() {
  echo "[backup] $(date -u +%Y-%m-%dT%H:%M:%SZ) FAILED: $*" >&2
  exit 1
}

# prune <prefix> <keep> — names embed a sortable date, so newest-first is a reverse sort
prune() {
  ls -1 "$BACKUP_DIR/$1"-*.dump 2>/dev/null | sort -r | tail -n +"$(($2 + 1))" |
    while read -r f; do
      rm -f -- "$f"
      log "pruned $(basename "$f")"
    done
}

backup_once() {
  day=$(date -u +%Y%m%d)
  week=$(date -u +%G-W%V)
  tmp="$BACKUP_DIR/.epilogue-$day.$$.dump.tmp"
  daily="$BACKUP_DIR/epilogue-daily-$day.dump" # one per day; a same-day re-run replaces it
  weekly="$BACKUP_DIR/epilogue-weekly-$week.dump"

  if ! pg_dump -Fc -f "$tmp"; then
    rm -f -- "$tmp"
    die "pg_dump of ${PGDATABASE:-?}@${PGHOST:-?} exited non-zero"
  fi
  if [ ! -s "$tmp" ] || ! pg_restore --list "$tmp" >/dev/null; then
    rm -f -- "$tmp"
    die "pg_dump wrote an empty or unreadable archive"
  fi
  mv -f -- "$tmp" "$daily" # same filesystem → atomic rename
  log "wrote $(basename "$daily") ($(wc -c <"$daily") bytes)"

  if [ ! -e "$weekly" ]; then
    # hard link: no extra space, and it outlives the daily being pruned
    ln -- "$daily" "$weekly"
    log "linked $(basename "$weekly")"
  fi

  prune epilogue-daily "$KEEP_DAILY"
  prune epilogue-weekly "$KEEP_WEEKLY"
}

mkdir -p "$BACKUP_DIR"
if [ "${1:-}" = "--once" ]; then
  backup_once
  exit 0
fi
while :; do
  backup_once
  sleep "$INTERVAL"
done
