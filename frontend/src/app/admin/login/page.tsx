'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Admin2Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // We utilize the browser client to securely authenticate.
    // Supabase automatically secures the session cookie.
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!authError) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(authError.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f9] flex items-center justify-center p-4 font-sans text-[#566a7f]">
      <div className="bg-white p-10 rounded-[0.5rem] w-full max-w-[400px] border border-[#eceef1] shadow-[0_0.25rem_1rem_rgba(161,172,184,0.15)] relative">
        <div className="mb-8 text-center">
          <h1 className="text-[1.375rem] font-bold text-[#566a7f] mb-2 tracking-tight">CAC Admin</h1>
          <p className="text-[#a1acb8] text-[0.9375rem]">Please sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[0.75rem] font-medium text-[#566a7f] uppercase mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chicagoavecollective.com"
              required
              className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all placeholder:text-[#b4bdc6] text-[0.9375rem]"
            />
          </div>
          <div>
             <label className="block text-[0.75rem] font-medium text-[#566a7f] uppercase mb-1.5">Password</label>
             <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
              className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all placeholder:text-[#b4bdc6] text-[0.9375rem]"
            />
          </div>
          {error && <p className="text-[#ff3e1d] text-xs font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#696cff] hover:bg-[#5f61e6] text-white rounded-[0.375rem] px-4 py-2.5 text-[0.9375rem] font-medium transition-colors shadow-[0_0.125rem_0.25rem_0_rgba(105,108,255,0.4)] mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
