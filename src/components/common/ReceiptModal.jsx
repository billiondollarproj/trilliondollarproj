import React from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  X, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Building2, 
  Share2 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ReceiptModal = () => {
  const { activeReceipt, setActiveReceipt } = useChit();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        
        {/* Close */}
        <button
          onClick={() => setActiveReceipt(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header */}
        <div className="text-center pb-4 border-b border-dashed border-slate-700">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">TrustChit Escrow Receipt</h3>
          <p className="text-[11px] text-teal-400 font-mono">Receipt No: {activeReceipt.receiptNo}</p>
        </div>

        {/* Receipt Details Table */}
        <div className="py-4 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Chit Fund:</span>
            <span className="font-semibold text-white text-right max-w-[200px] truncate">{activeReceipt.chitName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Member Name:</span>
            <span className="font-semibold text-white">{activeReceipt.memberName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Date & Timestamp:</span>
            <span className="font-mono text-slate-300">{activeReceipt.paidAt}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Payment Channel:</span>
            <span className="font-medium text-teal-300">{activeReceipt.paymentMode}</span>
          </div>

          {activeReceipt.collectedBy && (
            <div className="flex justify-between bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <span className="text-emerald-300">Collected By:</span>
              <span className="font-bold text-emerald-200">{activeReceipt.collectedBy}</span>
            </div>
          )}

          {activeReceipt.transactionRef && (
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Ref:</span>
              <span className="font-mono text-slate-400 text-[11px]">{activeReceipt.transactionRef}</span>
            </div>
          )}

          <div className="pt-3 border-t border-dashed border-slate-700 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-200">Total Amount Paid</span>
            <span className="font-display text-2xl font-black text-emerald-400 font-mono">
              {formatCurrency(activeReceipt.amount)}
            </span>
          </div>
        </div>

        {/* Security Stamp & Barcode simulation */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center my-2">
          <div className="font-mono text-[10px] tracking-[0.3em] text-slate-500 mb-1">
            ||| | |||| || | |||| ||| |||| | ||
          </div>
          <p className="text-[10px] text-teal-400/80 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Verified by TrustChit Foreman Escrow Vault
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => setActiveReceipt(null)}
            className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
