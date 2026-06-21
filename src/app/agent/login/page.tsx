'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgentLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', email: '' });
  const [regMsg, setRegMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/agent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // If must change password, redirect to change-password page
      if (data.agent?.mustChangePassword) {
        router.push('/agent/change-password');
      } else {
        router.push('/agent');
      }
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMsg('');

    const res = await fetch('/api/auth/agent/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    });
    const data = await res.json();

    if (res.ok) {
      setRegMsg('✅ Registration submitted! Admin will review and share your login credentials.');
      setRegForm({ name: '', phone: '', email: '' });
    } else {
      setRegMsg(`❌ ${data.error || 'Registration failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-blue-900">FourPs<span className="text-blue-500">.in</span></Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">Agent Portal</h1>
        </div>

        {!showRegister ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <div>
                <p className="text-sm text-gray-600">Don&apos;t have an account?</p>
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-600 font-medium text-sm hover:underline mt-1"
                >
                  Register as Agent
                </button>
              </div>
              <div className="border-t pt-3">
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-orange-600 font-medium text-sm hover:underline"
                >
                  Forgot Password?
                </button>
                <p className="text-xs text-gray-400 mt-1">Submit the registration form again with your phone number. Admin will reset your password.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Agent Registration</h2>
            <p className="text-sm text-gray-500 mb-4">Submit your details. Admin will review and share login credentials with you.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (with country code)</label>
                <input
                  type="text"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                />
              </div>
              {regMsg && <p className={`text-sm ${regMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{regMsg}</p>}
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
                Submit Registration
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-blue-600 text-sm hover:underline w-full text-center"
            >
              ← Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
