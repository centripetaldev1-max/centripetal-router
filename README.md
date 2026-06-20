# centripetal-router

A minimal, stateless HTTP router service built with **Next.js App Router** and deployed on **Vercel**.

No frontend. No auth. No database client. Pure API.

---

## Endpoints

### `GET /api/health`

Returns service health information.

**Response `200`:**
```json
{
  "status": "ok",
  "service": "centripetal-router",
  "version": "1.0.0",
  "time": "2024-01-01T00:00:00.000Z"
}
```

---

### `POST /api/resolve`

Resolves an intent string to a deterministic route and handler.

**Request body:**
```json
{
  "intent": "read.records",
  "context": {}
}
```

| Field     | Type     | Required | Description                        |
|-----------|----------|----------|------------------------------------|
| `intent`  | string   | ✅ yes    | The intent key to resolve          |
| `context` | object   | ❌ no     | Optional context payload (ignored) |

**Response `200`:**
```json
{
  "mode": "baseline",
  "intent": "read.records",
  "route": "db.select",
  "handler": "local",
  "note": "baseline floor"
}
```

**Response `400`** (missing or non-string intent):
```json
{ "error": "intent required" }
```

#### Built-in baseline route map

| Intent          | Route               | Handler |
|-----------------|---------------------|---------|
| `read.records`  | `db.select`         | local   |
| `write.record`  | `db.upsert`         | local   |
| `list.recent`   | `db.select.recent`  | local   |
| *(any unknown)* | `db.select`         | local   |

The service **always** returns a valid route for any valid intent — unknown intents fall through to the safe baseline floor.

---

## Environment Variables

Copy `.env.example` to `.env.local` and set values. **Never commit `.env.local`.**

| Variable               | Required | Default   | Description                                          |
Update README with full API docs and env var reference| `SUPABASE_URL`         | No       | —         | Supabase project URL (reserved, unused in v1.0.0)    |
| `SUPABASE_ANON_KEY`    | No       | —         | Supabase anon key (reserved, unused in v1.0.0)       |
| `ROUTER_SMART_ENABLED` | No       | `false`   | Set to `"true"` to enable smart routing placeholder   |

The service **builds and starts successfully with all env vars unset**. No DB calls are made.

---

## Running locally

```bash
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

## Deploying to Vercel

Push to `main` — Vercel auto-deploys. Set env vars in the Vercel dashboard under **Settings → Environment Variables**.
