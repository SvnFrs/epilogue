/** Server entry (Bun). Run after the migrate one-shot has exited 0 (eng-review T3). */
import { app } from './app';
import { env } from './env';

app.listen(env.PORT, () => {
  console.log(`[api] Epilogue API on :${env.PORT} (env=${env.NODE_ENV})`);
});
