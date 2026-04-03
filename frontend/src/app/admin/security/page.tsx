'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Lock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SecurityPage() {
  const [users, setUsers] = useState<{id: string, email: string}[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await fetch('http://localhost:8000/api/v1/admin/users', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
          if (data.users?.length > 0) {
            setSelectedUserId(data.users[0].id);
          }
        } else {
          setMessage({ type: 'error', text: 'Ensure FastAPI backend is running on 8000 alongside Next.js.' });
        }
      } catch (err: any) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to connect to backend.' });
      } finally {
        setFetching(false);
      }
    };

    fetchUsers();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !newPassword) return;
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No active session.');

      const payload = {
        user_id: selectedUserId,
        new_password: newPassword
      };

      const res = await fetch('http://localhost:8000/api/v1/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to update password.');
      }

      setMessage({ type: 'success', text: 'Password successfully updated in Supabase!' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-[0.5rem] shadow-[0_0.125rem_0.25rem_rgba(161,172,184,0.1)] border border-[#eceef1] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eceef1] flex items-center gap-3">
          <div className="bg-[rgba(105,108,255,0.16)] p-2 rounded-md">
            <Lock className="text-[#696cff]" size={20} />
          </div>
          <div>
            <h2 className="text-[1.125rem] font-bold tracking-tight text-[#566a7f]">Security & Access</h2>
            <p className="text-[0.875rem] text-[#a1acb8]">Admin utilities to manage platform users</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-[1rem] font-semibold text-[#566a7f] mb-4">Reset User Password</h3>
          
          {message && (
            <div className={`mb-5 p-4 rounded-md flex items-start gap-3 border ${
              message.type === 'error' 
                ? 'bg-[#ffe2db] border-[#ffb19a] text-[#ff3e1d]' 
                : 'bg-[#e8fadf] border-[#b3eb98] text-[#71dd37]'
            }`}>
              {message.type === 'error' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
              <p className="text-[0.9375rem] font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            {/* User Dropdown */}
            <div>
              <label className="block text-[0.75rem] font-semibold text-[#566a7f] uppercase mb-1.5">Select User</label>
              {fetching ? (
                <div className="w-full bg-[#f5f5f9] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 flex items-center text-[#a1acb8] text-[0.9375rem]">
                  <RefreshCw size={16} className="animate-spin mr-2" /> Loading users from backend...
                </div>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all text-[0.9375rem]"
                  required
                >
                  {users.length === 0 && <option value="">No users found</option>}
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.email}</option>
                  ))}
                </select>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[0.75rem] font-semibold text-[#566a7f] uppercase mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new secure password"
                required
                minLength={6}
                className="w-full bg-white text-[#566a7f] border border-[#d9dee3] rounded-[0.375rem] px-3.5 py-2.5 outline-none focus:border-[#696cff] focus:ring-[0.15rem] focus:ring-[rgba(105,108,255,0.1)] transition-all placeholder:text-[#b4bdc6] text-[0.9375rem]"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || fetching || users.length === 0}
                className="w-full flex items-center justify-center bg-[#696cff] hover:bg-[#5f61e6] disabled:bg-[#a5a7ff] disabled:cursor-not-allowed text-white rounded-[0.375rem] px-4 py-2.5 text-[0.9375rem] font-medium transition-colors shadow-[0_0.125rem_0.25rem_0_rgba(105,108,255,0.4)]"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Force Password Reset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
