import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'centripetal-router',
      version: '1.0.0',
      time: new Date().toISOString(),
    },
    { status: 200 }
  );
}
