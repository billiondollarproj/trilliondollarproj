import React from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen, 
  Gavel, 
  Award, 
  ShieldAlert, 
  User, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Navbar = () => {
  const {
    currentUser,
    switchUser,
    demoUsers,
    chits,
    selectedChitId,
    setSelectedChitId,
    selectedChit,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsCreateChitModalOpen,
    resetAllData
  } = useChit();

  const isAuctionLive = selectedChit?.activeAuction?.status === 'LIVE';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Top Banner for Demo State */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs text-slate-300 border-b border-teal-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-emerald-300">Sandbox Mode</span>
          <span className="hidden sm:inline text-slate-400">| Safe simulated UPI payments, escrow reconciliation & live reverse bidding</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetAllData}
            title="Reset to default demo data"
            className="flex items-center gap-1 text-slate-400 hover:text-teal-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
          <span className="text-slate-600">•</span>
          <span className="text-teal-400 font-mono text-[11px]">RBI / Chit Funds Act 1982 Compliant Model</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl font-bold tracking-tight text-white">Trust<span className="text-teal-400">Chit</span></span>
                  <span className="bg-teal-500/10 text-teal-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-teal-500/20">MVP</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Digital ROSCA & Chit Fund</p>
              </div>
            </div>

            {/* Chit Selector Dropdown */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-800">
              <div className="relative">
                <select
                  value={selectedChitId}
                  onChange={(e) => setSelectedChitId(e.target.value)}
                  className="appearance-none bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-teal-300 hover:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  {chits.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                      {c.name} ({formatCurrency(c.value, true)}) • M{c.currentCycle}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ledger'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Digital Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('auction')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'auction'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>Live Auction</span>
              {isAuctionLive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payout')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'payout'
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Payouts & Wins</span>
            </button>

            <button
              onClick={() => setActiveTab('foreman')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'foreman'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Foreman Admin</span>
            </button>
          </nav>

          {/* Right Action: Role Switcher & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <div className="flex items-center bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-1 gap-2 shadow-inner">
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="hidden xl:block text-left pr-1">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-400 font-medium">{currentUser.roleLabel.split(' ')[0]}</p>
                </div>
                
                <select
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-300 hover:text-white focus:outline-none cursor-pointer py-1 pr-1"
                  title="Switch Demo Role"
                >
                  {demoUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                      Switch to: {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              title="Phone OTP Login"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'ledger' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('auction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'auction' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Auction {isAuctionLive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'payout' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Payouts
          </button>
          <button
            onClick={() => setActiveTab('foreman')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'foreman' ? 'bg-indigo-500/20 text-indigo-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Foreman Admin
          </button>
        </div>

      </div>
    </header>
  );
};
