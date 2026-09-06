import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  CheckCircle2,
  Lock,
  Building2,
  Users,
  Wallet
} from 'lucide-react';

export const LoginModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithPhoneAndOtp, demoUsers, switchUser } = useChit();
  
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState('4242');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginWithPhoneAndOtp(phoneNumber, otp);
      setStep('phone');
    }, 600);
  };

  const selectQuickRole = (user) => {
    switchUser(user.id);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Background Decorative Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold mb-3 shadow-lg shadow-teal-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white">Welcome to TrustChit</h3>
          <p className="text-xs text-slate-400 mt-1">Instant phone verification for secure chit fund access</p>
        </div>

        {/* Phone / OTP Form */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex rounded-xl border border-slate-700 bg-slate-950/70 focus-within:border-teal-500 transition-colors">
                <span className="inline-flex items-center px-3 text-xs font-semibold text-slate-400 border-r border-slate-800">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Demo mock OTP will be automatically generated</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Get OTP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter 4-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-teal-400 hover:underline"
                >
                  Change Number
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4242"
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.5em] font-mono text-teal-300 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Sandbox OTP: <strong className="font-mono">4242</strong> (Auto-filled)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verify & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Fast Demo Role Selector */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Profile Switch
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map((u) => {
              const isForeman = u.role === 'FOREMAN';
              const isAgent = u.role === 'FIELD_AGENT';
              return (
                <button
                  key={u.id}
                  onClick={() => selectQuickRole(u)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                    isForeman 
                      ? 'bg-indigo-950/40 border-indigo-800/60 hover:border-indigo-500' 
                      : isAgent 
                        ? 'bg-emerald-950/40 border-emerald-800/60 hover:border-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-teal-500'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{u.name}</p>
                    <p className={`text-[10px] truncate ${isForeman ? 'text-indigo-400 font-semibold' : isAgent ? 'text-emerald-400' : 'text-teal-400'}`}>
                      {u.role === 'FOREMAN' ? 'Foreman / Admin' : u.role === 'FIELD_AGENT' ? 'Field Agent' : 'Chit Member'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
