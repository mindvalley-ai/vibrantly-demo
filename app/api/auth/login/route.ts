import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(user, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = createSession(user.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(session.expiresAt),
      path: '/',
    });

    // Return user info (without password hash)
    const { passwordHash, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      redirectTo: user.role === 'admin' ? '/admin' : (user.onboardingComplete ? '/dashboard' : '/onboarding'),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
