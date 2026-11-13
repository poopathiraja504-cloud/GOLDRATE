import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session && !error) {
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStatus('error');
        setTimeout(() => navigate('/login'), 2000);
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
        {status === 'verifying' && (
          <>
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h2 className="text-base font-bold text-white">Authenticating with Google...</h2>
            <p className="text-xs text-slate-400">Verifying session credentials and loading your portfolio.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h2 className="text-base font-bold text-white">Login Successful!</h2>
            <p className="text-xs text-slate-400">Redirecting to your dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-rose-400 font-bold">Authentication failed</div>
            <p className="text-xs text-slate-400">Redirecting back to login...</p>
          </>
        )}
      </div>
    </div>
  );
};

