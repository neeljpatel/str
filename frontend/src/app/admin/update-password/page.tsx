'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    
    // We update the active session's user natively. 
    // They are logged in because they arrived via the secure email link callback!
    const { error: authError } = await supabase.auth.updateUser({
      password: password
    });

    if (!authError) {
      // Successfully updated the password
      router.push('/admin/dashboard');
      router.refresh(); 
    } else {
      setError(authError.message || 'Failed to update password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f9] flex items-center justify-center p-4 font-sans text-[#566a7f]">
      <div className="bg-white p-10 rounded-[0.5rem] w-full max-w-[400px] border border-[#eceef1] shadow-[0_0.25rem_1rem_rgba(161,172,184,0.15)] relative">
        <div className="mb-8 text-center">
          <h1 className="text-[1.375rem] font-bold text-[#566a7f] mb-2 tracking-tight">Set New Password</h1>
          <p className="text-[#a1acb8] text-[0.9375rem]">Please securely update your password.</p>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
             <label className="block text-[0.75rem] font-medium text-[#566a7f] uppercase mb-1.5">New Password</label>
             <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all placeholder:text-[#b4bdc6] text-[0.9375rem]"
            />
          </div>
          <div>
             <label className="block text-[0.75rem] font-medium text-[#566a7f] uppercase mb-1.5">Confirm Password</label>
             <input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all placeholder:text-[#b4bdc6] text-[0.9375rem]"
            />
          </div>
          {error && <p className="text-[#ff3e1d] text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#696cff] hover:bg-[#5f61e6] text-white rounded-[0.375rem] px-4 py-2.5 text-[0.9375rem] font-medium transition-colors shadow-[0_0.125rem_0.25rem_0_rgba(105,108,255,0.4)] mt-4 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
