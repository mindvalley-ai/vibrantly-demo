import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createInvite, getUserByEmail, getInvites } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if invite already exists
    const existingInvites = getInvites();
    const existingInvite = existingInvites.find(
      i => i.email.toLowerCase() === email.toLowerCase() && !i.usedAt
    );
    if (existingInvite) {
      return NextResponse.json(
        { error: 'An invite for this email already exists', invite: existingInvite },
        { status: 400 }
      );
    }

    const invite = createInvite(email, session.user.id);

    // Generate invite URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/register/${invite.token}`;

    return NextResponse.json({
      invite,
      inviteUrl,
      message: `Invite created! Share this link with ${email}: ${inviteUrl}`,
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
