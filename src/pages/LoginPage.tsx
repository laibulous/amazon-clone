import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);

  // Where to redirect after login (defaults to /checkout)
  const from = (location.state as { from?: string })?.from || '/checkout';

  const handleSignIn = () => {
    // Requirement: simulate login by setting mock user: { name: 'Laiba', isPrimeMember: true }
    login({ name: 'Laiba', isPrimeMember: true });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand Logo Header */}
      <div className="mb-6 text-center">
        <div className="flex flex-col items-center leading-none">
          <div className="flex items-baseline">
            <span className="text-3xl font-black tracking-tight text-gray-900">
              amazon
            </span>
            <span className="text-sm font-semibold text-amber-500 ml-0.5">
              .clone
            </span>
          </div>
          <div className="w-16 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full mt-0.5 -rotate-2" />
        </div>
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-sm bg-white rounded-lg border border-gray-300 p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
        <p className="text-xs text-gray-600 mb-6">
          Sign in to your Amazon account to continue to checkout and complete your order.
        </p>

        {/* Mock Account Preview */}
        <div className="bg-amber-50/70 border border-amber-200 rounded p-3 mb-5 text-xs text-amber-900">
          <p className="font-semibold flex items-center gap-1 text-amber-950 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            Mock Evaluation Account
          </p>
          <p className="text-[11px] text-amber-800">
            Account: <strong>Laiba</strong> · Prime Membership: <strong>Active</strong>
          </p>
        </div>

        {/* 4. Simple "Sign in to continue" Button */}
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 font-bold py-2.5 px-4 rounded-md text-sm border border-[#fcd200] hover:border-[#a88734] shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-gray-800" />
          <span>Sign in to continue</span>
        </button>

        <p className="text-[11px] text-gray-500 mt-4 leading-tight">
          By signing in, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
        </p>

        <div className="mt-6 pt-5 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
