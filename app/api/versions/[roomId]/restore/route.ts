import { NextRequest, NextResponse } from 'next/server';
import { versionHistoryService } from '@/lib/version-history';
import { getCurrentUser } from '@/lib/auth';
import { liveblocks } from '@/lib/liveblocks';

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const body = await request.json();
    const { version } = body;

    if (!version) {
      return NextResponse.json(
        { error: 'Version number is required' },
        { status: 400 }
      );
    }

    // Get the version to restore
    const versionToRestore = await versionHistoryService.getVersion(roomId, version);
    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    // Update the Liveblocks room with the restored content
    await liveblocks.updateRoom(roomId, {
      metadata: {
        title: versionToRestore.title
      }
    });

    // Create a new version entry for the restoration
    const restoredVersion = await versionHistoryService.restoreVersion(roomId, version);

    return NextResponse.json({ 
      message: 'Document restored successfully',
      version: restoredVersion
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
