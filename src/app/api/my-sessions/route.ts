import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { MongooseSession } from '@/types';

async function getMySessions(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const userId = request.user!.id;

    // Get all sessions for the authenticated user
    const sessions = await Session.find({ user_id: userId })
      .sort({ updated_at: -1 })
      .lean();

    const formattedSessions = sessions.map(session => {
      const sessionData = session as unknown as MongooseSession;
      return {
        _id: sessionData._id?.toString(),
        title: sessionData.title,
        tags: sessionData.tags,
        json_file_url: sessionData.json_file_url,
        status: sessionData.status,
        created_at: sessionData.created_at,
        updated_at: sessionData.updated_at
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSessions
    });

  } catch (error) {
    console.error('Get my sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getMySessions);
