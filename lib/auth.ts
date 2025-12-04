import { cookies } from 'next/headers';
import { getSessionById, getUserById, type User } from './db';

const SESSION_COOKIE = 'vibrantly_session';

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  const user = getUserById(session.userId);
  if (!user) {
    return null;
  }

  return { user };
}

export async function requireAuth(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}

export { SESSION_COOKIE };
