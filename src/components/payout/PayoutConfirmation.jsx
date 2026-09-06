import React, { useEffect } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Wallet, 
  Percent, 
  Sparkles, 
  Layers,
  FileCheck,
  Receipt,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PayoutConfirmation = () => {
  const { selectedChit, setActiveTab, setActiveReceipt } = useChit();

  if (!selectedChit) return null;

  // Latest settled cycle
  const settledCycles = [...(selectedChit.cycles || [])].filter((c) => c.type === 'AUCTION');
  const latestCycle = settledCycles[settledCycles.length - 1] || selectedChit.cycles[selectedChit.cycles.length - 1];

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981', '#f59e0b', '#6366f1'],
      });
    } catch {
      // Ignore
    }
  }, [latestCycle?.cycleNo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 p-8 rounded-3xl border border-teal-500/30 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 font-black">
              <Award className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Cycle {latestCycle?.cycleNo || selectedChit.currentCycle - 1} Settled
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Escrow Cleared
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Prize Payout Confirmed & Disbursed
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Winning Bidder: <strong className="text-teal-300 font-bold">{latestCycle?.winnerName}</strong> • Disbursed via Escrow Account
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Net Payout Released</span>
            <span className="font-display text-3xl font-black text-emerald-400 font-mono">
              {formatCurrency(latestCycle?.netPayout || selectedChit.value)}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Settlement Pipeline Status */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Statutory Disbursement Pipeline Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Auction Finalized</span>
            </div>
            <p className="text-slate-400 text-[11px]">Winning bid cryptographically logged</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Foreman Signoff</span>
            </div>
            <p className="text-slate-400 text-[11px]">Surety & KYC verified</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Escrow Drawdown</span>
            </div>
            <p className="text-slate-400 text-[11px]">Fund release from {selectedChit.bankEscrow.split('#')[0]}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Bank Account Credited</span>
            </div>
            <p className="text-slate-400 text-[11px]">Ref: {latestCycle?.transactionRef || 'UPI/NEFT/HDFC2026'}</p>
          </div>
        </div>
      </div>

      {/* Comprehensive Settlement Math Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Financial Math Breakdown */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-display text-lg font-bold text-white">Chit Settlement Calculation</h3>
            <span className="text-xs text-teal-400 font-mono">Chit Funds Act Sec 22 Formula</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Gross Chit Pot Value:</span>
              <span className="font-mono font-bold text-white text-sm">{formatCurrency(selectedChit.value)}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div>
                <span className="text-slate-400">Winning Foregone Discount ({latestCycle?.discountPercent || 25}%):</span>
                <p className="text-[10px] text-slate-500">Amount foregone by winner to claim pot</p>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">
                - {formatCurrency(latestCycle?.winningBidDiscount || 0)}
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
              <div>
                <span className="text-indigo-300 font-medium">Foreman Statutory 5% Commission:</span>
                <p className="text-[10px] text-slate-500">Platform & organizer management fee</p>
              </div>
              <span className="font-mono font-bold text-indigo-300 text-sm">
                {formatCurrency(latestCycle?.foremanFee || selectedChit.value * 0.05)}
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
              <div>
                <span className="text-emerald-300 font-bold">Total Distributable Member Dividend:</span>
                <p className="text-[10px] text-emerald-400/80">Discount minus Foreman fee distributed equally</p>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {formatCurrency(latestCycle?.totalDividend || 0)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-white">Net Payout Transferred to Winner</span>
                <p className="text-[11px] text-slate-400">{latestCycle?.winnerName}</p>
              </div>
              <span className="font-display text-2xl font-black text-emerald-400 font-mono">
                {formatCurrency(latestCycle?.netPayout || selectedChit.value)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Next Cycle Impact & Ledger Sync Notification */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              <h4 className="font-display text-base font-bold text-white">Next Cycle Benefit to You</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Because of the winning discount of <strong className="text-amber-400">{formatCurrency(latestCycle?.winningBidDiscount || 0)}</strong>, every member in the group receives a dividend credit of:
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-xs text-slate-400 block">Your Dividend Discount</span>
              <div className="font-display text-3xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(latestCycle?.dividendPerMember || 0)}
              </div>
              <p className="text-[11px] text-teal-300 mt-1 font-medium">
                Deducted automatically from your next monthly installment!
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Next Month Base:</span>
              <span className="font-mono text-slate-400 line-through">{formatCurrency(selectedChit.baseMonthlyContribution)}</span>
            </div>

            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-xs flex justify-between items-center">
              <span className="text-emerald-300 font-bold">Your Net Installment Due:</span>
              <span className="font-mono font-black text-emerald-400 text-base">
                {formatCurrency(latestCycle?.memberInstallmentDue || selectedChit.baseMonthlyContribution)}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('ledger')}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
            >
              <span>View Updated Digital Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
