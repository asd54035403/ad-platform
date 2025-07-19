import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken } from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (role !== 'advertiser' && role !== 'publisher') {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }

    const userId = await createUser(email, password, name, role);
    const token = generateToken(userId, email, role);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        id: userId,
        email,
        name,
        role,
        token
      }
    });

  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}