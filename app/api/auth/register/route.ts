import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getInviteByToken, markInviteUsed, createUser, createSession, getUserByEmail } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, email, password, firstName, lastName } = await request.json();

    // Check if this is an invite-based registration or public registration
    if (token) {
      // Invite-based registration
      if (!password || !firstName || !lastName) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        );
      }

      // Validate invite token
      const invite = getInviteByToken(token);
      if (!invite) {
        return NextResponse.json(
          { error: 'Invalid or expired invite token' },
          { status: 400 }
        );
      }

      // Create user
      const user = createUser({
        email: invite.email,
        password,
        firstName,
        lastName,
        role: 'user',
        onboardingComplete: false,
      });

      // Mark invite as used
      markInviteUsed(token, user.id);

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

      const { passwordHash, ...userWithoutPassword } = user;
      return NextResponse.json({
        user: userWithoutPassword,
        redirectTo: '/onboarding',
      });
    } else {
      // Public registration
      if (!email || !password || !firstName || !lastName) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }

      // Validate password strength
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }

      // Create user
      const user = createUser({
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        onboardingComplete: false,
      });

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

      const { passwordHash, ...userWithoutPassword } = user;
      return NextResponse.json({
        user: userWithoutPassword,
        redirectTo: '/onboarding',
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET to verify invite token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const invite = getInviteByToken(token);
    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid or expired invite token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: invite.email,
    });
  } catch (error) {
    console.error('Verify invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
