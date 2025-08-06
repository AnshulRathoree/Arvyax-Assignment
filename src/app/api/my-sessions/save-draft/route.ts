import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { MongooseSession } from '@/types';

async function saveDraft(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const userId = request.user!.id;
    const body = await request.json();
    const { _id, title, tags, json_file_url } = body;

    // Validate input
    if (!title || !json_file_url) {
      return NextResponse.json(
        { success: false, error: 'Title and JSON file URL are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(json_file_url)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid URL' },
        { status: 400 }
      );
    }

    let session;

    if (_id) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id, user_id: userId },
        {
          title: title.trim(),
          tags: tags || [],
          json_file_url: json_file_url.trim(),
          status: 'draft',
          updated_at: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Session not found or unauthorized' },
          { status: 404 }
        );
      }
    } else {
      // Create new session
      session = await Session.create({
        user_id: userId,
        title: title.trim(),
        tags: tags || [],
        json_file_url: json_file_url.trim(),
        status: 'draft'
      });
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
      },
      message: 'Draft saved successfully'
    });

  } catch (error) {
    console.error('Save draft error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(saveDraft);
