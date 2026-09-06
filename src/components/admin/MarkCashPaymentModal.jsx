import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  Banknote, 
  X, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Stamp,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const MarkCashPaymentModal = () => {
  const { 
    isCashModalOpen, 
    setIsCashModalOpen, 
    selectedChit, 
    currentUser, 
    selectedLedgerItemForCash, 
    markCashPaymentByAgent 
  } = useChit();

  const [selectedMemberId, setSelectedMemberId] = useState(
    selectedLedgerItemForCash?.memberId || selectedChit?.ledger?.find(l => l.status !== 'PAID')?.memberId || ''
  );
  const [receiptSlipNo, setReceiptSlipNo] = useState(`TC-CSH-${Math.floor(10000 + Math.random() * 90000)}`);
  const [notes, setNotes] = useState('Physical cash collected at doorstep. Receipt copy handed over.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCashModalOpen || !selectedChit) return null;

  // Selected ledger entry
  const targetMemberEntry = selectedChit.ledger.find(
    (l) => l.memberId === (selectedLedgerItemForCash?.memberId || selectedMemberId)
  ) || selectedChit.ledger[0];

  const handleRecordCash = (e) => {
    e.preventDefault();
    if (!targetMemberEntry) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      markCashPaymentByAgent({
        chitId: selectedChit.id,
        memberId: targetMemberEntry.memberId,
        receiptSlipNo,
        notes,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsCashModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-white">Record Cash Collection</h3>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Agent Counterfoil
              </span>
            </div>
            <p className="text-xs text-slate-400">Mark offline doorstep collection for non-UPI members</p>
          </div>
        </div>

        <form onSubmit={handleRecordCash} className="space-y-4">
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Member
            </label>
            <select
              value={targetMemberEntry?.memberId || selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {selectedChit.ledger.map((item) => (
                <option key={item.memberId} value={item.memberId} className="bg-slate-900 text-slate-200">
                  Slot #{item.slotNo} - {item.memberName} ({formatCurrency(item.netPayable)}) {item.status === 'PAID' ? '• [Already Paid]' : '• [PENDING]'}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Member Name</span>
              <span className="font-bold text-white">{targetMemberEntry?.memberName}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Installment Due (Post-Dividend)</span>
              <span className="font-bold text-emerald-400 font-mono">{formatCurrency(targetMemberEntry?.netPayable)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Authorized Collection By</span>
              <span className="font-medium text-slate-300">{currentUser.name} ({currentUser.role === 'FIELD_AGENT' ? 'Field Agent' : 'Foreman'})</span>
            </div>
          </div>

          {/* Physical Receipt Serial Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Physical Receipt Book Slip #
            </label>
            <div className="relative">
              <input
                type="text"
                value={receiptSlipNo}
                onChange={(e) => setReceiptSlipNo(e.target.value)}
                placeholder="e.g. TC-CSH-98212"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                required
              />
              <Stamp className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Unique counterfoil number recorded for audit compliance</p>
          </div>

          {/* Field Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Collection Notes / Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Record Cash Receipt</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
