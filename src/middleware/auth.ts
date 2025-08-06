import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { AuthUser } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
}

// For routes without params
export const withAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const token = getTokenFromRequest(req);

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

      req.user = user;
      return await handler(req);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
};

// For routes with params
export const withAuthParams = <T extends Record<string, string | string[]>>(
  handler: (req: AuthenticatedRequest, context: { params: T }) => Promise<NextResponse>
) => {
  return async (req: AuthenticatedRequest, context: { params: T }): Promise<NextResponse> => {
    try {
      const token = getTokenFromRequest(req);

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

      req.user = user;
      return await handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
};
