import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import UserModel from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build search criteria
    const searchCriteria: any = {};
    
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ];
    }

    // Exclude current user from results
    searchCriteria._id = { $ne: currentUser.id };

    const users = await UserModel
      .find(searchCriteria)
      .select('name email avatarUrl color')
      .limit(limit)
      .skip(offset)
      .sort({ name: 1 })
      .lean();

    const totalUsers = await UserModel.countDocuments(searchCriteria);

    return NextResponse.json({
      users,
      total: totalUsers,
      hasMore: offset + limit < totalUsers
    });

  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
