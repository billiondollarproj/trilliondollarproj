import React from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  Gavel, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Percent,
  Sparkles,
  ChevronRight,
  Receipt,
  Layers,
  Banknote,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MemberDashboard = () => {
  const { 
    currentUser, 
    chits, 
    selectedChit, 
    setSelectedChitId, 
    setActiveTab, 
    setIsUpiModalOpen, 
    setActiveReceipt 
  } = useChit();

  // Find user's joined chits
  const userChits = chits.filter((c) => currentUser.chitIds?.includes(c.id) || currentUser.role === 'FOREMAN' || currentUser.role === 'FIELD_AGENT');

  // Compute portfolio metrics
  const totalPortfolioValue = userChits.reduce((acc, c) => acc + c.value, 0);
  
  // Total dividends earned across all cycles for this user
  let cumulativeDividends = 0;
  chits.forEach((chit) => {
    chit.cycles?.forEach((cy) => {
      if (cy.dividendPerMember) {
        cumulativeDividends += cy.dividendPerMember;
      }
    });
  });

  // Current pending payment on selected chit
  const myCurrentLedgerEntry = selectedChit?.ledger?.find((l) => l.memberId === currentUser.id);
  const isPaymentPending = myCurrentLedgerEntry?.status !== 'PAID';

  const isAuctionLive = selectedChit?.activeAuction?.status === 'LIVE';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome & Role Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Namaste, {currentUser.name}</h1>
              <span className="bg-teal-500/15 text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC {currentUser.kycStatus}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Active Member Profile • Primary: {currentUser.phone} • Bank: {currentUser.bankAccount?.bankName || 'Verified Escrow'}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          {isPaymentPending ? (
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Pay Month {selectedChit?.currentCycle} Due ({formatCurrency(myCurrentLedgerEntry?.netPayable || selectedChit?.baseMonthlyContribution)})</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2.5 rounded-2xl border border-emerald-500/20 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Month {selectedChit?.currentCycle} Installment Paid</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Auction Alert Banner (If Live) */}
      {isAuctionLive && (
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-950/20 border-2 border-amber-500/40 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Gavel className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <h4 className="text-base font-bold text-amber-300">Live Reverse Auction in Progress!</h4>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedChit.name} • Cycle {selectedChit.currentCycle} bidding is open. Current top discount bid: <strong className="text-white font-mono">{formatCurrency(selectedChit.activeAuction.highestBidDiscount)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('auction')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <span>Enter Auction Room</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Portfolio Value */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Chit Value</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-white font-mono">
            {formatCurrency(totalPortfolioValue)}
          </div>
          <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1 font-medium">
            <span>Across {userChits.length} active groups</span>
          </p>
        </div>

        {/* Total Dividends Earned */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dividends Earned</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(cumulativeDividends)}
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1 font-medium">
            Direct monthly installment savings
          </p>
        </div>

        {/* Current Due Date */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Payment Due</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl font-bold text-white">
            {formatDate(selectedChit?.nextDueDate || '2026-09-10')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Month {selectedChit?.currentCycle} of {selectedChit?.durationMonths}
          </p>
        </div>

        {/* Next Auction Schedule */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Auction Schedule</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl font-bold text-amber-300">
            {isAuctionLive ? 'LIVE NOW' : 'Cycle 4 Active'}
          </div>
          <p className="text-[11px] text-amber-400/80 mt-1 font-medium">
            Reverse discount bidding
          </p>
        </div>

      </div>

      {/* Main Section: User's Chit Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Your Chit Groups</h3>
            <p className="text-xs text-slate-400">Select any group to view its transparent digital ledger & auction room</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {userChits.map((chit) => {
            const isSelected = chit.id === selectedChit.id;
            const progressPercent = Math.round((chit.currentCycle / chit.durationMonths) * 100);
            const myEntry = chit.ledger.find((l) => l.memberId === currentUser.id);
            const isPaid = myEntry?.status === 'PAID';

            return (
              <div
                key={chit.id}
                onClick={() => setSelectedChitId(chit.id)}
                className={`glass-card p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'border-teal-500 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/50' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Active Tag */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-white">{chit.name}</h4>
                      {isSelected && (
                        <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{chit.code} • {chit.bankEscrow}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Pot</span>
                    <p className="font-display text-xl font-black text-teal-400 font-mono">
                      {formatCurrency(chit.value)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar (Cycle X of Y) */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Cycle Progress</span>
                    <span className="text-teal-400">Month {chit.currentCycle} of {chit.durationMonths} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Chit Details Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs mb-4">
                  <div>
                    <span className="text-slate-400">Base Monthly</span>
                    <p className="font-bold text-white font-mono mt-0.5">{formatCurrency(chit.baseMonthlyContribution)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Members</span>
                    <p className="font-bold text-white font-mono mt-0.5">{chit.membersCount} Participants</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Your Status</span>
                    <p className={`font-bold mt-0.5 ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isPaid ? '✓ Paid' : '⏳ Due'}
                    </p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChitId(chit.id);
                      setActiveTab('ledger');
                    }}
                    className="text-xs font-semibold text-slate-300 hover:text-teal-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Group Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChitId(chit.id);
                      if (!isPaid) {
                        setIsUpiModalOpen(true);
                      } else {
                        setActiveTab('auction');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      !isPaid
                        ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {!isPaid ? 'Pay Installment' : 'Enter Auction'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History & Dividends Breakdown */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Payment & Dividend History</h3>
            <p className="text-xs text-slate-400">Verified transaction ledger for {selectedChit.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Cycle #</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Winning Bidder</th>
                <th className="pb-3 font-semibold">Foregone Discount</th>
                <th className="pb-3 font-semibold">Your Dividend Credit</th>
                <th className="pb-3 font-semibold">Net Paid</th>
                <th className="pb-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {selectedChit.cycles.map((cy) => (
                <tr key={cy.cycleNo} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 font-bold text-white">Cycle {cy.cycleNo}</td>
                  <td className="py-3.5 text-slate-400 font-mono">{formatDate(cy.date)}</td>
                  <td className="py-3.5 text-slate-200 font-medium">{cy.winnerName}</td>
                  <td className="py-3.5 font-mono text-amber-400">
                    {cy.winningBidDiscount > 0 ? formatCurrency(cy.winningBidDiscount) : 'Foreman Draw'}
                  </td>
                  <td className="py-3.5 font-mono text-emerald-400 font-bold">
                    {cy.dividendPerMember > 0 ? `+ ${formatCurrency(cy.dividendPerMember)}` : '₹0'}
                  </td>
                  <td className="py-3.5 font-mono text-white font-bold">
                    {formatCurrency(cy.memberInstallmentDue)}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveReceipt({
                          receiptNo: `TC-CY${cy.cycleNo}-${Math.floor(1000 + Math.random() * 9000)}`,
                          chitName: selectedChit.name,
                          memberName: currentUser.name,
                          amount: cy.memberInstallmentDue,
                          paidAt: `${formatDate(cy.date)} 10:30 AM`,
                          paymentMode: 'UPI (Auto-Reconciled)',
                          status: 'CONFIRMED',
                        });
                      }}
                      className="text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1 hover:underline"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
