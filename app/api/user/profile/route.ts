import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateUser } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { passwordHash, ...userWithoutPassword } = session.user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();

    // Only allow updating certain fields
    const allowedFields = ['firstName', 'lastName', 'age', 'weight', 'height', 'gender', 'onboardingComplete'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const updatedUser = updateUser(session.user.id, filteredUpdates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
