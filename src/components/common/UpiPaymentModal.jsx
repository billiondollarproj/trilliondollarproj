import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  QrCode, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Sparkles,
  Lock,
  Building2,
  Percent
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const UpiPaymentModal = () => {
  const { isUpiModalOpen, setIsUpiModalOpen, selectedChit, currentUser, makeMemberPayment } = useChit();
  const [selectedApp, setSelectedApp] = useState('UPI_GPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpiModalOpen || !selectedChit) return null;

  // Find current user's ledger entry for this chit
  const memberLedgerEntry = selectedChit.ledger.find((l) => l.memberId === currentUser.id) || {
    baseAmount: selectedChit.baseMonthlyContribution,
    dividendCredited: 4250,
    netPayable: selectedChit.baseMonthlyContribution - 4250,
    status: 'PENDING',
  };

  const amountToPay = memberLedgerEntry.netPayable;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      makeMemberPayment({
        chitId: selectedChit.id,
        memberId: currentUser.id,
        paymentMode: selectedApp,
        amount: amountToPay,
      });
      setIsUpiModalOpen(false);
    }, 1200);
  };

  const upiApps = [
    { id: 'UPI_GPAY', name: 'Google Pay', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { id: 'UPI_PHONEPE', name: 'PhonePe', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { id: 'UPI_PAYTM', name: 'Paytm UPI', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { id: 'UPI_BHIM', name: 'BHIM / CRED', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsUpiModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-white">UPI Instant Payment</h3>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                0% Gateway Fee
              </span>
            </div>
            <p className="text-xs text-slate-400">{selectedChit.name} • Cycle {selectedChit.currentCycle}</p>
          </div>
        </div>

        {/* Bill & Dividend Breakdown Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Base Monthly Contribution</span>
            <span className="font-mono text-slate-300">{formatCurrency(memberLedgerEntry.baseAmount)}</span>
          </div>

          <div className="flex justify-between text-xs text-emerald-400 font-medium bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" />
              Past Cycle Auction Dividend Discount
            </span>
            <span className="font-mono">- {formatCurrency(memberLedgerEntry.dividendCredited)}</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex justify-between items-baseline">
            <div>
              <span className="text-sm font-bold text-white">Net Amount to Pay</span>
              <p className="text-[10px] text-slate-400">Direct to Escrow: {selectedChit.bankEscrow}</p>
            </div>
            <span className="font-display text-2xl font-black text-teal-400 font-mono">
              {formatCurrency(amountToPay)}
            </span>
          </div>
        </div>

        {/* App Selector Grid */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-semibold text-slate-300">
            Choose Payment App
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {upiApps.map((app) => {
              const isSelected = selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedApp(app.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? `${app.bg} border-teal-500 ring-1 ring-teal-500`
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-xs font-bold text-slate-200">{app.name}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Demo Section */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/70 flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shrink-0">
            <QrCode className="w-10 h-10 text-slate-900" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-200">Scan & Pay via any UPI App</p>
            <p className="text-[11px] text-slate-400">UPI ID: <span className="font-mono text-teal-300">trustchit.escrow@icici</span></p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Connecting to UPI Sandbox Gateway...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Simulate Pay {formatCurrency(amountToPay)} Now</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          256-Bit Escrow Vault Security • Instant Settlement
        </p>

      </div>
    </div>
  );
};
