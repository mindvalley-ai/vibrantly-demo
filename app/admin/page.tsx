'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  onboardingComplete: boolean;
}

interface Invite {
  id: string;
  token: string;
  email: string;
  createdAt: string;
  usedAt?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState<{ url?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!response.ok || data.user?.role !== 'admin') {
        router.push('/login');
        return;
      }

      setCurrentUser(data.user);
    } catch {
      router.push('/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        setInvites(data.invites || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteResult(null);
    setInviting(true);

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newInviteEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setInviteResult({ error: data.error });
        return;
      }

      setInviteResult({ url: data.inviteUrl });
      setNewInviteEmail('');
      fetchUsers(); // Refresh the list
    } catch {
      setInviteResult({ error: 'Failed to create invite' });
    } finally {
      setInviting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-xl text-[#6b7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Header */}
      <header className="bg-[#181d26] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#232d14] rounded-xl flex items-center justify-center border-2 border-[#c4dd00]">
              <span className="text-xl">🌟</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Vibrantly Admin</h1>
              <p className="text-sm opacity-70">Welcome, {currentUser?.firstName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#232d14] text-white rounded-lg hover:bg-[#c4dd00] hover:text-[#181d26] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-[#232d14]">{users.length}</div>
            <div className="text-[#6b7280]">Total Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-2">✉️</div>
            <div className="text-3xl font-bold text-[#232d14]">{invites.filter(i => !i.usedAt).length}</div>
            <div className="text-[#6b7280]">Pending Invites</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-[#232d14]">{users.filter(u => u.onboardingComplete).length}</div>
            <div className="text-[#6b7280]">Onboarded Users</div>
          </div>
        </div>

        {/* Invite User */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-[#0f131a] mb-4">Invite New User</h2>
          <form onSubmit={handleInvite} className="flex gap-4">
            <input
              type="email"
              value={newInviteEmail}
              onChange={(e) => setNewInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-4 py-3 border-2 border-[#e5e7eb] rounded-xl focus:border-[#c4dd00] focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={inviting}
              className="px-6 py-3 bg-[#c4dd00] text-[#181d26] font-bold rounded-xl hover:bg-[#84cc16] transition-colors disabled:opacity-50"
            >
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
          </form>

          {inviteResult?.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {inviteResult.error}
            </div>
          )}

          {inviteResult?.url && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-semibold mb-2">Invite created! Share this link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteResult.url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(inviteResult.url!)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-[#0f131a] mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                    <td className="py-3 px-4 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="py-3 px-4 text-[#6b7280]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.onboardingComplete
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.onboardingComplete ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6b7280] text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invites */}
        {invites.filter(i => !i.usedAt).length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f131a] mb-4">Pending Invites</h2>
            <div className="space-y-3">
              {invites.filter(i => !i.usedAt).map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-[#6b7280]">
                      Invited {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/register/${invite.token}`)}
                    className="px-4 py-2 bg-[#e5e7eb] text-[#0f131a] rounded-lg hover:bg-[#c4dd00] transition-colors text-sm font-medium"
                  >
                    Copy Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
