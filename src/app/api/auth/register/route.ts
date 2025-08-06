import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { RegisterCredentials } from '@/types';

/**
 * POST /api/auth/register
 *
 * User registration endpoint with comprehensive validation and security
 * - Validates email format and uniqueness
 * - Enforces password strength requirements
 * - Hashes passwords using bcrypt with salt rounds
 * - Returns JWT token for immediate authentication
 *
 * @param {NextRequest} request - HTTP request with email and password
 * @returns {NextResponse} JSON response with success status, token, and user data
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterCredentials = await request.json();
    const { email, password } = body;

    // Comprehensive input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'Password cannot exceed 128 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const password_hash = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      password_hash
    });

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          created_at: user.created_at
        }
      },
      message: 'User registered successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
