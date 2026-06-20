import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResolveBody {
  intent?: unknown;
  context?: Record<string, unknown>;
}

interface BaselineEntry {
  route: string;
  handler: string;
}

interface ResolveResponse {
  mode: 'smart' | 'baseline';
  intent: string;
  route: string;
  handler: string;
  note: string;
}

// ---------------------------------------------------------------------------
// Baseline route map — deterministic, never throws
// ---------------------------------------------------------------------------

const BASELINE_MAP: Record<string, BaselineEntry> = {
  'read.records': { route: 'db.select', handler: 'local' },
  'write.record': { route: 'db.upsert', handler: 'local' },
  'list.recent': { route: 'db.select.recent', handler: 'local' },
};

// Safe floor for any unknown intent
const BASELINE_FLOOR: BaselineEntry = { route: 'db.select', handler: 'local' };

function resolveBaseline(intent: string): BaselineEntry {
  return BASELINE_MAP[intent] ?? BASELINE_FLOOR;
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: ResolveBody;

  try {
    body = (await request.json()) as ResolveBody;
  } catch {
    return NextResponse.json({ error: 'intent required' }, { status: 400 });
  }

  const { intent } = body;

  // Validate intent
  if (intent === undefined || intent === null || typeof intent !== 'string') {
    return NextResponse.json({ error: 'intent required' }, { status: 400 });
  }

  const smartEnabled =
    (process.env.ROUTER_SMART_ENABLED ?? 'false').toLowerCase() === 'true';

  const baseline = resolveBaseline(intent);

  const result: ResolveResponse = smartEnabled
    ? {
        mode: 'smart',
        intent,
        route: baseline.route,
        handler: baseline.handler,
        note: 'smart routing enabled (placeholder logic); falls back to baseline',
      }
    : {
        mode: 'baseline',
        intent,
        route: baseline.route,
        handler: baseline.handler,
        note: 'baseline floor',
      };

  return NextResponse.json(result, { status: 200 });
}
