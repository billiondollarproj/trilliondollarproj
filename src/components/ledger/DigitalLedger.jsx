import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  Banknote, 
  Smartphone, 
  Sparkles,
  Printer,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DigitalLedger = () => {
  const { 
    selectedChit, 
    currentUser, 
    setIsUpiModalOpen, 
    setIsCashModalOpen, 
    setSelectedLedgerItemForCash, 
    setActiveReceipt 
  } = useChit();

  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'
  const [searchTerm, setSearchTerm] = useState('');

  if (!selectedChit) return null;

  // Ledger stats calculation
  const totalMembers = selectedChit.ledger?.length || 0;
  const paidEntries = selectedChit.ledger?.filter((l) => l.status === 'PAID') || [];
  const pendingEntries = selectedChit.ledger?.filter((l) => l.status === 'PENDING') || [];
  const overdueEntries = selectedChit.ledger?.filter((l) => l.status === 'OVERDUE') || [];

  const totalCollectedAmount = paidEntries.reduce((acc, curr) => acc + curr.netPayable, 0);
  const totalPendingAmount = [...pendingEntries, ...overdueEntries].reduce((acc, curr) => acc + curr.netPayable, 0);
  const totalCycleTarget = totalCollectedAmount + totalPendingAmount;
  const collectionPercentage = totalCycleTarget > 0 ? Math.round((totalCollectedAmount / totalCycleTarget) * 100) : 0;

  // Filtered entries
  const filteredLedger = (selectedChit.ledger || []).filter((item) => {
    const matchesFilter = 
      filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch = 
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.receiptNo && item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const isForemanOrAgent = currentUser.role === 'FOREMAN' || currentUser.role === 'FIELD_AGENT';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Digital Ledger</h1>
            <span className="bg-teal-500/10 text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Cycle {selectedChit.currentCycle} of {selectedChit.durationMonths}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {selectedChit.name} • Escrow: {selectedChit.bankEscrow} • 100% On-Chain Transparent Audit
          </p>
        </div>

        {/* Top Ledger Actions */}
        <div className="flex items-center gap-2">
          {isForemanOrAgent && (
            <button
              onClick={() => {
                setSelectedLedgerItemForCash(null);
                setIsCashModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Banknote className="w-4 h-4" />
              <span>Record Doorstep Cash Collection</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Print or Export Ledger"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Real-time Collection Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Collected */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected (This Month)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(totalCollectedAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {paidEntries.length} of {totalMembers} members contributed
          </p>
        </div>

        {/* Total Pending */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pending / Due</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-amber-400 font-mono">
            {formatCurrency(totalPendingAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {pendingEntries.length + overdueEntries.length} members pending
          </p>
        </div>

        {/* Collection % Tracker */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Escrow Pot Fulfillment</span>
            <span className="font-bold text-teal-400 text-sm font-mono">{collectionPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 my-2">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Target: {formatCurrency(totalCycleTarget)} for Month {selectedChit.currentCycle}
          </p>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'ALL' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalMembers})
          </button>
          <button
            onClick={() => setFilterStatus('PAID')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paid ({paidEntries.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingEntries.length})
          </button>
          <button
            onClick={() => setFilterStatus('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'OVERDUE' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overdue ({overdueEntries.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member, phone, receipt..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Slot #</th>
                <th className="py-3.5 px-4 font-semibold">Member Details</th>
                <th className="py-3.5 px-4 font-semibold">Base Due</th>
                <th className="py-3.5 px-4 font-semibold">Dividend Credit</th>
                <th className="py-3.5 px-4 font-semibold">Net Payable</th>
                <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                <th className="py-3.5 px-4 font-semibold">Channel / Receipt</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLedger.map((row) => {
                const isCurrentUser = row.memberId === currentUser.id;
                const isPaid = row.status === 'PAID';
                const isOverdue = row.status === 'OVERDUE';

                return (
                  <tr 
                    key={row.id} 
                    className={`transition-colors ${
                      isCurrentUser ? 'bg-teal-500/5 hover:bg-teal-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Slot */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">
                      #{row.slotNo.toString().padStart(2, '0')}
                    </td>

                    {/* Member */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isCurrentUser 
                            ? 'bg-teal-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {row.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{row.memberName}</span>
                            {isCurrentUser && (
                              <span className="bg-teal-500/20 text-teal-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-teal-500/30">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{row.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Base Due */}
                    <td className="py-4 px-4 font-mono text-slate-400">
                      {formatCurrency(row.baseAmount)}
                    </td>

                    {/* Dividend Credit */}
                    <td className="py-4 px-4 font-mono text-emerald-400 font-medium">
                      - {formatCurrency(row.dividendCredited)}
                    </td>

                    {/* Net Payable */}
                    <td className="py-4 px-4 font-mono font-black text-white text-sm">
                      {formatCurrency(row.netPayable)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PAID</span>
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/15 text-rose-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" />
                          <span>OVERDUE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </span>
                      )}
                    </td>

                    {/* Channel / Receipt */}
                    <td className="py-4 px-4">
                      {isPaid ? (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-200 block">
                            {row.paymentMode === 'CASH_AGENT' ? 'Cash (Agent Verified)' : 'UPI Instant'}
                          </span>
                          <span className="text-[10px] text-teal-400 font-mono block">
                            {row.receiptNo || 'TC-REC-2026'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Awaiting payment</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      {isPaid ? (
                        <button
                          onClick={() => {
                            setActiveReceipt({
                              receiptNo: row.receiptNo || `TC-REC-${row.slotNo}`,
                              chitName: selectedChit.name,
                              memberName: row.memberName,
                              amount: row.netPayable,
                              paidAt: row.paidAt || 'Recorded in Escrow',
                              paymentMode: row.paymentMode?.replace('_', ' ') || 'UPI',
                              collectedBy: row.collectedBy,
                              status: 'CONFIRMED',
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Receipt</span>
                        </button>
                      ) : isCurrentUser ? (
                        <button
                          onClick={() => setIsUpiModalOpen(true)}
                          className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20"
                        >
                          Pay UPI
                        </button>
                      ) : isForemanOrAgent ? (
                        <button
                          onClick={() => {
                            setSelectedLedgerItemForCash(row);
                            setIsCashModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/60 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          title="Record offline cash received"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Mark Cash</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
