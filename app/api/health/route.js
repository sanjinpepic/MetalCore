import { NextResponse } from 'next/server';
import { prisma } from '../../src/lib/prisma.js';

export async function GET() {
    const startedAt = Date.now();
    try {
        const [steelCount] = await Promise.all([
            prisma.steel.count(),
        ]);
        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            steelCount,
            latencyMs: Date.now() - startedAt,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        // Return the failure reason so connection issues can be diagnosed
        // from the outside. Never include the connection string itself.
        return NextResponse.json(
            {
                status: 'error',
                database: 'unreachable',
                error: err?.message ?? 'Unknown error',
                code: err?.code ?? null,
                latencyMs: Date.now() - startedAt,
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
