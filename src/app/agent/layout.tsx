'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import type { ConfirmationResult } from '@/lib/firebase';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

function AgentLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) { void e; }
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const getRecaptchaVerifier = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) { void e; }
      window.recaptchaVerifier = undefined;
    }
    if (recaptchaRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, { size: 'invisible' });
    }
    return window.recaptchaVerifier;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/agent/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: phone.startsWith('+') ? phone : `+91${phone}`, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); } else { setSuccess(data.message); }
    } catch (err: unknown) {
      console.error(err);
      setError('Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;
      const verifier = getRecaptchaVerifier();
      if (!verifier) { setError('reCAPTCHA not initialized. Please refresh.'); setLoading(false); return; }
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmation(result);
      setStep('otp');
    } catch (err: unknown) {
      console.error('OTP send error:', err);
      window.recaptchaVerifier = undefined;
      setError('Failed to send OTP. Check the phone number and try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (!confirmation) { setError('No OTP session. Please resend.'); setLoading(false); return; }
      const result = await confirmation.confirm(otp);
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;
      const res = await fetch('/api/auth/agent/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, firebaseUid: result.user.uid }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Verification failed'); setLoading(false); return; }
      onSuccess();
    } catch (err: unknown) {
      console.error('OTP verify error:', err);
      setError('Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex gap-2 mb-6">
          <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Login
          </button>
          <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Register
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{success}</div>}

        {mode === 'register' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Agent Registration</h1>
              <p className="text-gray-500 mt-2">Register to join FourPs as an agent.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" placeholder="9876543210" maxLength={10} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading || !name || phone.length < 10}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Register'}
              </button>
            </form>
          </>
        )}

        {mode === 'login' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Agent Login</h1>
              <p className="text-gray-500 mt-2">Sign in with your registered mobile number</p>
            </div>
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" placeholder="9876543210" maxLength={10} required />
                  </div>
                </div>
                <button type="submit" disabled={loading || phone.length < 10}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 text-center text-xl tracking-widest" placeholder="123456" maxLength={6} required />
                  <p className="text-sm text-gray-500 mt-2">OTP sent to +91{phone}</p>
                </div>
                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button type="button" onClick={() => { setStep('phone'); setOtp(''); }}
                  className="w-full text-gray-500 text-sm hover:text-blue-600">← Change number</button>
              </form>
            )}
          </>
        )}
        <div ref={recaptchaRef} />
      </div>
    </div>
  );
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (data.authenticated && data.role === 'agent') {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    } catch (err: unknown) {
      console.error(err);
      setAuthState('unauthenticated');
    }
  };

  useEffect(() => { checkAuth(); }, []);

  if (authState === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500">Loading...</p></div>;
  }

  if (authState === 'unauthenticated') {
    return <AgentLoginForm onSuccess={() => { setAuthState('authenticated'); router.refresh(); }} />;
  }

  return <>{children}</>;
}
