import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUsers, getInvites } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = getUsers().map(({ passwordHash, ...user }) => user);
    const invites = getInvites();

    return NextResponse.json({ users, invites });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
