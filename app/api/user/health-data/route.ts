import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserHealthData, saveUserHealthData } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const healthData = getUserHealthData(session.user.id);
    return NextResponse.json({ healthData: healthData || null });
  } catch (error) {
    console.error('Get health data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const healthData = saveUserHealthData(session.user.id, data);

    return NextResponse.json({ healthData });
  } catch (error) {
    console.error('Save health data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
