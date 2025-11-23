import { NextRequest, NextResponse } from 'next/server';
import { versionHistoryService } from '@/lib/version-history';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const { searchParams } = new URL(request.url);
    const v1 = parseInt(searchParams.get('v1') || '0');
    const v2 = parseInt(searchParams.get('v2') || '0');

    if (!v1 || !v2) {
      return NextResponse.json(
        { error: 'Both version numbers are required' },
        { status: 400 }
      );
    }

    const comparison = await versionHistoryService.compareVersions(roomId, v1, v2);

    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Error comparing versions:', error);
    return NextResponse.json(
      { error: 'Failed to compare versions' },
      { status: 500 }
    );
  }
}
