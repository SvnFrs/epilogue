> **Historical — part of the superseded 001 Core Engine spec** (superseded by spec 002, [`specs/002-marginalia-rebuild/spec.md`](../002-marginalia-rebuild/spec.md), and constitution v2.0.0, 2026-10-09). Its deploy instructions still describe how the 001 code runs. Kept as a record; not a source.

# Deployment: self-host on the Arch laptop

Target: Arch Linux headless laptop (Intel i3-11th, 24GB RAM), Docker installed, solo dev, behind
home NAT. Dev happens elsewhere; the laptop is the always-on server.

This doc describes what `docker/docker-compose.yml`, `docker/*.sh` and
`.github/workflows/deploy.yml` actually do. Where that falls short of the original plan, it says
so under **Known gaps**; the original rationale is kept under **Decisions**.

## What compose runs

| Service | Image | Ports | Role |
|---|---|---|---|
| `postgres` | `postgres:17-alpine` | `127.0.0.1:5432` (host tools only) | Named volume `pgdata`; `pg_isready` healthcheck. |
| `migrate` | `ghcr.io/svnfrs/epilogue-api:${IMAGE_TAG}` | — | One-shot `bun src/db/migrate.ts`: applies `drizzle/` migrations, seeds the single owner, exits 0. Waits for a healthy `postgres`. |
| `api` | `ghcr.io/svnfrs/epilogue-api:${IMAGE_TAG}` | `expose 4000` (internal) | Elysia on Bun. Starts only after `migrate` exits 0. |
| `web` | `ghcr.io/svnfrs/epilogue-web:${IMAGE_TAG}` | `expose 3000` (internal) | Next.js standalone on Node; `API_URL=http://api:4000`. Starts once `api` has *started* (no api healthcheck). |
| `caddy` | `caddy:2-alpine` | `80`, `443` on `${EPILOGUE_BIND_IP:-127.0.0.1}` only | `reverse_proxy web:3000` for site `$EPILOGUE_HOST` (default `localhost`); `80` redirects to HTTPS. Mounts `/var/run/tailscale` (ro) so a `*.ts.net` site gets its cert from tailscaled. |
| `backup` | `postgres:17-alpine` | — | Runs `docker/backup.sh` (see Backups). Healthcheck = a daily dump newer than 26h exists. |

- One compose default network (`<project>_default`); `api` and `postgres` are not reachable from
  outside it except postgres on the host's loopback. Caddy is reachable only on
  `EPILOGUE_BIND_IP`: unset, that's `127.0.0.1` (local dev); on the server, its tailnet IPv4, so
  the LAN can't reach it.
- **TLS:** with `EPILOGUE_HOST` set to the server's full MagicDNS name, Caddy (2.5+) sees the
  `*.ts.net` suffix and fetches the certificate from tailscaled over the mounted socket — no ACME,
  nothing public. Any other name falls back to Caddy's usual issuers (`localhost` → internal CA).
- Config is plain env from the repo-root `.env`. Compose reads `docker/.env`, so on a fresh
  checkout create the symlink: `ln -s ../.env docker/.env` (it's gitignored). `OWNER_SECRET` is
  required (`:?`); everything else has a dev default.
- `IMAGE_TAG` defaults to `local`; the `build:` blocks let `docker compose … up -d --build` run
  the stack from source without GHCR.
- **What comes from where:** CI ships only the two images. `docker-compose.yml`, `Caddyfile`,
  `backup.sh` and the deploy scripts come from the laptop's git checkout, so `git pull` it when
  those change.

## Backups

`docker/backup.sh`, run by the `backup` sidecar (busybox sh inside `postgres:17-alpine`; libpq
env `PGHOST/PGUSER/PGPASSWORD/PGDATABASE` from compose). On container start and then every 24h:

1. `pg_dump -Fc` into a hidden temp file in `docker/backups/`.
2. Verify it is non-empty and readable (`pg_restore --list`); only then rename it atomically to
   `epilogue-daily-YYYYMMDD.dump` (one per UTC day; a same-day re-run replaces it).
3. The first good dump of each ISO week is hard-linked as `epilogue-weekly-YYYY-Www.dump` (no
   extra space; survives the daily being pruned).
4. Prune to the newest **7 daily + 4 weekly** (`BACKUP_KEEP_DAILY` / `BACKUP_KEEP_WEEKLY`).

**On failure** it logs `[backup] … FAILED: …` to stderr, deletes the temp file, and exits 1, so
Docker restarts the container (`restart: unless-stopped`) and retries. It shows up as a restart
loop in `docker compose ps` and in `docker compose logs backup`; independently, the healthcheck
turns `unhealthy` when no daily dump is newer than 26h.

- Back up on demand (e.g. before a risky migration):
  `docker compose -f docker/docker-compose.yml run --rm backup --once`
- **Restore drill** — `./docker/restore-test.sh [dump]`. Restores the newest sidecar dump (or the
  one given) into a throwaway `<db>_restore_test` database with `pg_restore --exit-on-error`, then:
  fails if the newest dump is older than `MAX_AGE_HOURS` (26), if any table the live DB has
  (from `information_schema`) is missing from the restore, or if `public.users` is empty; prints
  live-vs-restored row counts for each table (they differ legitimately by writes since the dump).
  The copied dump and throwaway DB are removed on exit; the sidecar's files are never touched.
  Run it monthly and after a deploy that adds a migration.

## CI/CD

`.github/workflows/deploy.yml`, on push to `main` or manual dispatch:

1. **test** — Bun 1.4.0 (pinned; the version that wrote `bun.lock`) + Node 20 for Vitest:
   typecheck, unit, component, integration (Testcontainers on the runner's Docker).
2. **build-and-push** — both images to GHCR, tagged with the 12-char commit sha and `latest`.
3. **deploy** — runs **only if the repo variable `DEPLOY_ENABLED` is `true`** (the job doesn't
   check the secrets). Joins the tailnet as an ephemeral `tag:ci` node, then plain OpenSSH (not
   Tailscale SSH) to the laptop, sending only the image tag. The key's forced command
   `docker/deploy-ssh.sh` accepts exactly `^[0-9a-f]{12}$` and runs `docker/deploy.sh`: pull
   images → `run --rm migrate` → `up -d --no-build --remove-orphans` → prune dangling images →
   `ps`.

Third-party actions are pinned to commit SHAs (tag in a trailing comment); GitHub's own
`actions/*` stay on major tags.

**Rollback:** on the laptop, `IMAGE_TAG=<older sha> ./docker/deploy.sh`. Drizzle migrations are
forward-only, so rolling back across a migration means restoring a dump.

## Host ops (one-time, on the laptop)

1. **Tailscale** — `tailscale up` with MagicDNS on, **without `--ssh`** (if it's on:
   `tailscale set --ssh=false`). Tailscale SSH takes over port 22 for tailnet traffic, which
   would bypass OpenSSH and the `authorized_keys` restrictions in step 4.
2. **Deploy user + checkout** — a user in the `docker` group (that is root-equivalent; it's why
   step 4 pins the key to one command). `git clone` the repo to `~/epilogue`, create `.env` from
   `.env.example` (`OWNER_SECRET=$(openssl rand -hex 32)`, a real `POSTGRES_PASSWORD`), and
   `ln -s ../.env docker/.env`. In `.env`, for Caddy:
   - `EPILOGUE_HOST` (and `WEB_ORIGIN=https://…`) = the laptop's full MagicDNS name, exactly
     `tailscale status --json | jq -r .Self.DNSName` minus the trailing dot. Tailscale only
     issues a cert for the machine's own name.
   - `EPILOGUE_BIND_IP` = `tailscale ip -4`.
   - Enable **HTTPS Certificates** in the Tailscale admin console (DNS page; MagicDNS on).
     Off by default — Caddy can't get a `*.ts.net` cert until it's on. The name will appear in
     public Certificate Transparency logs.
   - Binding to the tailnet IP races tailscaled at boot (Docker may start Caddy before
     `tailscale0` has its address, and the bind fails). Let the bind happen early:
     `echo 'net.ipv4.ip_nonlocal_bind = 1' | sudo tee /etc/sysctl.d/90-epilogue.conf && sudo sysctl --system`.
3. **GHCR pull login** — as the deploy user, once:

   ```bash
   # classic PAT with ONLY the read:packages scope (fine-grained tokens can't pull from GHCR)
   echo "$PAT" | docker login ghcr.io -u <github-user> --password-stdin
   ```

   Stored in `~/.docker/config.json` (base64, not encrypted; keep it `0600` or use a credential
   helper). Needed while the packages are private; re-run when the PAT expires.
4. **CI deploy key, pinned to a forced command**:

   ```bash
   ssh-keygen -t ed25519 -N '' -C epilogue-ci -f epilogue-ci
   # epilogue-ci      → GitHub secret DEPLOY_SSH_KEY, then delete the local copy
   # epilogue-ci.pub  → one line in the deploy user's ~/.ssh/authorized_keys:
   ```

   ```text
   restrict,from="100.64.0.0/10,fd7a:115c:a1e0::/48",command="/home/epilogue/epilogue/docker/deploy-ssh.sh" ssh-ed25519 AAAA… epilogue-ci
   ```

   - `restrict` — no pty, no port/agent/X11 forwarding, no `~/.ssh/rc`.
   - `from=` — only tailnet addresses (Tailscale's IPv4 CGNAT range and IPv6 prefix).
   - `command=` (absolute path) — sshd runs `deploy-ssh.sh` whatever the client asked for, with
     the request in `$SSH_ORIGINAL_COMMAND`. Anything but a 12-char lowercase hex tag is
     rejected; a valid tag runs `deploy.sh` with `IMAGE_TAG=<tag>`. The key can deploy a CI build
     and nothing else.
   - Check: `ssh -i epilogue-ci epilogue@<laptop> id` must print `✗ rejected …`.
5. **Tailscale ACL — `tag:ci` reaches the laptop's port 22 and nothing else**:

   ```jsonc
   {
     "tagOwners": { "tag:ci": ["autogroup:admin"] },
     "hosts": { "epilogue-laptop": "100.x.y.z" }, // the laptop's tailnet IP
     "acls": [
       { "action": "accept", "src": ["tag:ci"], "dst": ["epilogue-laptop:22"] },
       // …your own rules. Use "autogroup:member" for your devices, NOT "*": "*" includes
       // tagged nodes, so the default allow-all rule would hand tag:ci the whole tailnet.
     ],
   }
   ```

   Create an OAuth client (Tailscale admin → Settings → OAuth clients) allowed to create auth
   keys for `tag:ci` → GitHub secrets `TS_OAUTH_CLIENT_ID` / `TS_OAUTH_SECRET`.
6. **GitHub** — secrets `DEPLOY_HOST` (the laptop's tailnet name/IP) and `DEPLOY_USER`, plus the
   ones above; then the repo **variable** `DEPLOY_ENABLED=true`.
7. **First bring-up** — `IMAGE_TAG=latest ./docker/deploy.sh`, then `./docker/restore-test.sh`
   (the sidecar dumps on start, so there's one to restore immediately). Check TLS from another
   tailnet device: `curl -I https://<EPILOGUE_HOST>/`; `docker compose -f
   docker/docker-compose.yml logs caddy` shows the cert being obtained (or why not).

## Known gaps (compose vs. the original plan)

- **Caddy binds IPv4 only.** MagicDNS also returns the laptop's tailnet IPv6; clients that try it
  first get a refusal and fall back to IPv4.
- **No api healthcheck** (the `/health` route exists), so `web` doesn't wait for a healthy api.
- **No memory limits, log rotation, or Postgres tuning** in compose; the Sizing section below is
  the target.
- **Secrets are plain env vars** from `.env` (visible in `docker inspect`); no Docker secrets /
  `*_FILE`.
- **Backups stay on the laptop's disk** — no offsite sync yet. Dumps are written by root with
  mode `0644`.
- Bun drift: CI pins 1.4.0, but the Dockerfiles build on `oven/bun:1.2-alpine` with
  `bun install --frozen-lockfile || bun install` (the fallback hides lockfile drift).
- (Phase 2b) Cloudflare Tunnel for the public read-only route: not started.

## Decisions (original rationale, 2026-06-20)

- **Reverse proxy → Caddy.** Auto-HTTPS + renewal, ~30MB RAM, human-readable Caddyfile. Fits a
  fixed 2–3 service stack. (Traefik's label auto-discovery only pays off at 10+ services; nginx =
  manual certbot.)
- **Remote access → Tailscale (primary).** Laptop + dev machine on the tailnet; admin/SSH/app stay
  private, no port-forwarding, bypasses CGNAT via outbound. Add **Cloudflare Tunnel** later, in
  front of ONLY the Phase 2b public read-only route — don't move the whole stack to Cloudflare.
- **CI/CD → build in GitHub Actions, laptop pulls.** Keeps the i3 clean (no build load, no inbound
  runner). SHA-tagged images → deterministic rollback. (Avoid Watchtower's surprise auto-restarts;
  avoid a self-hosted runner with repo access on a home box.)
- **Secrets → `.env` (gitignored)**, only `.env.example` committed. Docker secrets mounted as
  `*_FILE` were the plan (kept out of `docker inspect`); not done yet (Known gaps).
- **Backups → nightly `pg_dump -Fc`, 7 daily + 4 weekly, restore-tested** — a backup you've never
  restored isn't a backup. Offsite sync (rclone to B2/Drive, or a second tailnet machine) still to
  do.

## Sizing / logging (target — not applied in compose yet)

- Postgres: `shared_buffers=2GB`, `effective_cache_size=6GB`, `work_mem=32MB`,
  `maintenance_work_mem=256MB`, `max_connections=50`.
- Per-service `deploy.resources.limits` (mem: web ~1GB, api ~1GB, postgres ~4GB) so a runaway
  can't OOM the host. Leave remaining RAM as OS page cache.
- Logging: `json-file` driver, `max-size=10m`, `max-file=3` per service (~30MB/service cap).

## Status

Images, compose, `deploy.sh` + `deploy-ssh.sh`, `backup.sh`, `restore-test.sh` and the CI
workflow exist; the backup sidecar (dump, retention, failure exit) and the restore drill (pass +
each failure path) were exercised against a throwaway compose project on 2026-10-08, as was
Caddy's single-address bind (other addresses refused), `EPILOGUE_HOST` pass-through, and the
tailscaled socket reachable through the read-only mount. Not yet exercised: an actual `*.ts.net`
cert (needs tailnet HTTPS enabled). Remaining: the host ops above and the first live `up -d`
over the tailnet, plus the Known gaps.
