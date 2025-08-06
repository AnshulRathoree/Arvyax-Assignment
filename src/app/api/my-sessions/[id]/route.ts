import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { MongooseSession } from '@/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth check
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = user.id;
    const resolvedParams = await params;
    const sessionId = resolvedParams.id;

    // Find session by ID and user ID
    const session = await Session.findOne({
      _id: sessionId,
      user_id: userId
    }).lean();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    const sessionData = session as unknown as MongooseSession;
    return NextResponse.json({
      success: true,
      data: {
        _id: sessionData._id?.toString(),
        title: sessionData.title,
        tags: sessionData.tags,
        json_file_url: sessionData.json_file_url,
        status: sessionData.status,
        created_at: sessionData.created_at,
        updated_at: sessionData.updated_at
      }
    });

  } catch (error) {
    console.error('Get session by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth check
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = user.id;
    const resolvedParams = await params;
    const sessionId = resolvedParams.id;

    // Delete session by ID and user ID
    const session = await Session.findOneAndDelete({
      _id: sessionId,
      user_id: userId
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
