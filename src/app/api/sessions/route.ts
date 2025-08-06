import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import User from '@/models/User';
import { MongooseSession } from '@/types';

/**
 * GET /api/sessions
 *
 * Public endpoint to retrieve all published wellness sessions
 * No authentication required - this is for browsing published content
 *
 * @returns {Object} JSON response with success status and sessions array
 * @returns {boolean} success - Whether the request was successful
 * @returns {Array} data - Array of published sessions with author information
 */
export async function GET() {
  try {
    await connectDB();

    // Get all published sessions (public)
    const sessions = await Session.find({ status: 'published' })
      .populate({
        path: 'user_id',
        select: 'email',
        model: User
      })
      .sort({ created_at: -1 })
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
        updated_at: sessionData.updated_at,
        author: sessionData.user_id?.email || 'Unknown'
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
