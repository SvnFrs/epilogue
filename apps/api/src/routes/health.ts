/** Liveness for Docker/Caddy (contracts/api.md). No owner scope — public. */
import { Elysia } from 'elysia';

export const healthRoutes = new Elysia().get('/health', () => ({
  status: 'ok',
  service: 'epilogue-api',
}));
