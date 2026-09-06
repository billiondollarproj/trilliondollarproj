import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  ShieldAlert, 
  PlusCircle, 
  Users, 
  Banknote, 
  Coins, 
  Gavel, 
  CheckCircle2, 
  Clock, 
  Percent, 
  FileText, 
  UserPlus, 
  Sparkles,
  Building2,
  Calendar,
  Share2,
  Receipt,
  Download,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ForemanDashboard = () => {
  const { 
    currentUser, 
    chits, 
    selectedChit, 
    setSelectedChitId, 
    setIsCreateChitModalOpen, 
    setIsCashModalOpen, 
    setSelectedLedgerItemForCash, 
    forceStartAuction, 
    endAndSettleAuction,
    showToast 
  } = useChit();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  if (!selectedChit) return null;

  // Foreman platform-wide aggregated metrics
  const totalChitsManaged = chits.length;
  const totalAssetsUnderManagement = chits.reduce((acc, c) => acc + c.value, 0);
  
  // Total foreman commission earned
  let totalForemanCommissions = 0;
  chits.forEach((chit) => {
    chit.cycles?.forEach((cy) => {
      if (cy.foremanFee) {
        totalForemanCommissions += cy.foremanFee;
      }
    });
  });

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    showToast(`Invite sent to ${newMemberName} (${newMemberPhone}) with KYC registration link!`, 'success');
    setNewMemberName('');
    setNewMemberPhone('');
    setInviteModalOpen(false);
  };

  const copyInviteLink = () => {
    navigator.clipboard?.writeText(`https://trustchit.app/join/${selectedChit.code}`);
    showToast('Chit invitation link copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Foreman Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Foreman & Admin Command Hub</h1>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Authorized Organizer
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Admin: <strong>{currentUser.name}</strong> • Regulatory Reg: TN-CHIT-2024-889 • Chit Funds Act 1982 Approved
            </p>
          </div>
        </div>

        {/* Master Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateChitModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Chit Scheme</span>
          </button>
        </div>
      </div>

      {/* 4 Foreman KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total AUM */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fund Pool (AUM)</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-white font-mono">
            {formatCurrency(totalAssetsUnderManagement)}
          </div>
          <p className="text-[11px] text-teal-400 mt-1">
            Across {totalChitsManaged} active chit schemes
          </p>
        </div>

        {/* Foreman Revenue / 5% Commission Earned */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Foreman Commission</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-indigo-300 font-mono">
            {formatCurrency(totalForemanCommissions)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            5% statutory organizer earnings
          </p>
        </div>

        {/* Doorstep Cash Collection Operations */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Field Cash Agents</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-emerald-400 font-mono">
            Active: 1 Agent
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1">
            Ramesh Kumar (AGT-BLR-402)
          </p>
        </div>

        {/* Default / Risk Status */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Risk Rating</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-2xl font-black text-emerald-400">
            AAA (0.0% Default)
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            100% bank escrow guaranteed
          </p>
        </div>

      </div>

      {/* Action Hub & Member Invitation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 Cols): Chit Group Management Roster */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Active Chit Groups Under Administration</h3>
                <p className="text-xs text-slate-400">Manage rules, cycles, and emergency controls</p>
              </div>
              <button
                onClick={copyInviteLink}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Member Invite Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {chits.map((chit) => {
                const isSelected = chit.id === selectedChit.id;
                const paidCount = chit.ledger?.filter(l => l.status === 'PAID').length || 0;
                const totalMembers = chit.membersCount || 20;

                return (
                  <div
                    key={chit.id}
                    onClick={() => setSelectedChitId(chit.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900/90 border-teal-500 ring-1 ring-teal-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{chit.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {chit.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{chit.bankEscrow}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400">Pot Value:</span>
                        <p className="font-bold text-teal-400 font-mono text-base">{formatCurrency(chit.value)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                      <div>
                        <span className="text-slate-500 block">Duration:</span>
                        <span className="font-semibold text-slate-200">{chit.durationMonths} Months</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Current Cycle:</span>
                        <span className="font-semibold text-teal-300">Month {chit.currentCycle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Collections:</span>
                        <span className="font-semibold text-emerald-400 font-mono">{paidCount}/{totalMembers} Paid</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Auction Status:</span>
                        <span className="font-semibold text-amber-300">{chit.activeAuction?.status || 'Scheduled'}</span>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChitId(chit.id);
                          setIsCashModalOpen(true);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Record Cash Collection</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {chit.activeAuction?.status !== 'LIVE' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChitId(chit.id);
                              forceStartAuction(chit.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 font-semibold"
                          >
                            Open Auction Room
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChitId(chit.id);
                              endAndSettleAuction(chit.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold"
                          >
                            Settle Auction
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Member Management & Doorstep Agent Console */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Doorstep Cash Agent Marker */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Banknote className="w-5 h-5" />
              <h4 className="font-display text-base font-bold text-white">Doorstep Cash Desk</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Field agents collect offline payments directly from members at their shops/homes and record verified physical receipts.
            </p>

            <button
              onClick={() => {
                setSelectedLedgerItemForCash(null);
                setIsCashModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Banknote className="w-4 h-4" />
              <span>Open Cash Collection Form</span>
            </button>
          </div>

          {/* Member Enrollment & Invite */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <UserPlus className="w-5 h-5" />
              <h4 className="font-display text-base font-bold text-white">Enroll New Member</h4>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Member Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kavita Krishnan"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mobile Number (for SMS & OTP)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98401 23456"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Send WhatsApp / SMS Invite</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
