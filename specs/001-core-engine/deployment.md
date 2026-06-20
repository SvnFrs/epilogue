# Deployment Plan: self-host on the Arch laptop

Target: Arch Linux headless laptop (Intel i3-11th, 24GB RAM), Docker installed, solo dev, behind
home NAT. Dev happens elsewhere; the laptop is the always-on server.

## Compose topology

One `docker-compose.yml` on an internal bridge network `epilogue_net`. Only the proxy is reachable.

- **caddy** — reverse proxy + automatic TLS, fronted by Tailscale. Routes the app to `web`; the API
  is internal-only (not proxied publicly). `epilogue.<tailnet>.ts.net { reverse_proxy web:3000 }`.
- **web** — Next.js standalone (`node server.js`). No published ports; reached via Caddy; calls `api`
  over the internal network. Mem limit ~1GB.
- **api** — Elysia on **Bun** (`oven/bun` base image). No published ports; reached only by `web`
  (and, Phase 2b, a scoped public route via Cloudflare Tunnel). Sole owner of Drizzle + DB access. Mem limit ~1GB.
- **postgres** — `postgres:17-alpine`, no published ports, named volume `pgdata`, reachable only by
  `api`. Mem limit ~4GB.
- **backup** — cron sidecar running `pg_dump -Fc` nightly into host bind-mount `./backups`.

Healthchecks/`depends_on`: `api` waits for a ready Postgres; `web` waits for a healthy `api`.
Drizzle migrations run as a one-shot `api` deploy step, not in the request path.

## Decisions

- **Reverse proxy → Caddy.** Auto-HTTPS + renewal, ~30MB RAM, human-readable Caddyfile. Fits a
  fixed 2–3 service stack. (Traefik's label auto-discovery only pays off at 10+ services; nginx = manual certbot.)
- **Remote access → Tailscale (primary).** Laptop + dev machine on the tailnet; admin/SSH/app stay
  private, no port-forwarding, bypasses CGNAT via outbound. Add **Cloudflare Tunnel** later, in
  front of ONLY the Phase 2b public read-only route — don't move the whole stack to Cloudflare.
- **CI/CD → build in GitHub Actions, laptop pulls.** Actions builds the image, pushes
  `ghcr.io/SvnFrs/epilogue:<git-sha>`; a `deploy.sh` on the laptop (triggered via Tailscale SSH
  from the job) runs `docker compose pull && docker compose up -d`. Keeps the i3 clean (no build
  load, no inbound runner). SHA-pinned tags → deterministic rollback. (Avoid Watchtower's surprise
  auto-restarts; avoid a self-hosted runner with repo access on a home box.)
- **Secrets → `.env` (gitignored) + Docker secrets.** Commit only `.env.example`. DB password +
  API keys in `secrets/` mounted as `*_FILE` env vars (kept out of `docker inspect`). GHCR pull
  token in Actions secrets. `.gitignore`: `.env`, `secrets/`, `backups/`.
- **Backups → named volume + nightly `pg_dump -Fc`.** Retain 7 daily + 4 weekly. Sync `./backups`
  offsite (rclone to B2/Drive, or a second tailnet machine). **Monthly restore test** into a
  throwaway container — a backup you've never restored isn't a backup.

## Sizing / logging (24GB host, shared dev laptop)
- Postgres: `shared_buffers=2GB`, `effective_cache_size=6GB`, `work_mem=32MB`,
  `maintenance_work_mem=256MB`, `max_connections=50`.
- Per-service `deploy.resources.limits` (mem) so a runaway can't OOM the host. Leave remaining RAM
  as OS page cache (it's what makes Postgres fast).
- Logging: `json-file` driver, `max-size=10m`, `max-file=3` per service (~30MB/service cap).

## Bring-up sequence
1. Add multi-stage `Dockerfile` (`output:"standalone"`) + `.dockerignore`.
2. `tailscale up --ssh` on laptop + dev machine; confirm reachability by tailnet name.
3. Create `.env` from example; DB password → `secrets/postgres_password`; verify `.gitignore`.
4. Write `docker-compose.yml` (caddy, web, api, postgres, backup) + Caddyfile + `Dockerfile.web` + `Dockerfile.api`.
5. `docker compose up -d postgres`; wait healthy; run Drizzle migrations via a one-shot `api` task.
6. `docker compose up -d`; hit the site over the tailnet; confirm Caddy TLS and that `web` reaches `api`.
7. Wire CI (Actions → GHCR → Tailscale SSH `deploy.sh`).
8. Enable backup sidecar; run one dump; restore-test before trusting it.
9. (Phase 2b) Cloudflare Tunnel → public read-only route only.

> Prereq not yet in the repo: there is no `package.json` / `Dockerfile` / compose file today —
> `src/` is the static POC. Scaffolding the Bun-workspace monorepo (`apps/web` Next.js on Node +
> `apps/api` Elysia on Bun + `packages/contracts`) and the two Dockerfiles (`Dockerfile.web` Node,
> `Dockerfile.api` Bun) precedes all of the above.
