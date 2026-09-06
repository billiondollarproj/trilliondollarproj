import React, { useState, useEffect } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  Gavel, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Percent, 
  ArrowRight, 
  Award, 
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Volume2,
  VolumeX,
  User,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { calculateAuctionMetrics, getMinMaxBids } from '../../utils/calculations';
import { playTickSound, playWinSound } from '../../utils/sounds';

export const AuctionRoom = () => {
  const { 
    selectedChit, 
    currentUser, 
    placeBid, 
    forceStartAuction, 
    endAndSettleAuction, 
    triggerAutomatedMemberBid, 
    setActiveTab 
  } = useChit();

  const [bidDiscount, setBidDiscount] = useState(130000);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isSealedMode, setIsSealedMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!selectedChit) return null;

  const activeAuction = selectedChit.activeAuction;
  const isAuctionLive = activeAuction?.status === 'LIVE';
  const isAuctionSettled = activeAuction?.status === 'SETTLED';

  const { minBid, maxBid, minDiscountPercent, maxDiscountPercent } = getMinMaxBids(
    selectedChit.value,
    selectedChit.maxDiscountPercent || 30,
    selectedChit.minDiscountPercent || 5
  );

  // Default bid slider initialization
  useEffect(() => {
    if (activeAuction?.highestBidDiscount) {
      setBidDiscount(Math.min(maxBid, activeAuction.highestBidDiscount + 5000));
    } else {
      setBidDiscount(Math.round(selectedChit.value * 0.2));
    }
  }, [selectedChit.id, activeAuction?.highestBidDiscount]);

  // Real-time Countdown Timer effect
  useEffect(() => {
    let interval = null;
    if (isAuctionLive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Trigger auto settlement
            endAndSettleAuction(selectedChit.id);
            return 0;
          }
          if (soundEnabled && prev <= 5) {
            playTickSound();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuctionLive, timerSeconds, soundEnabled]);

  // Calculate live metrics based on user's current slider value
  const userMetrics = calculateAuctionMetrics({
    chitValue: selectedChit.value,
    membersCount: selectedChit.membersCount,
    bidDiscount: bidDiscount,
    foremanCommissionRate: (selectedChit.foremanCommissionPercent || 5) / 100,
  });

  // Calculate current top bid metrics
  const currentLeaderMetrics = calculateAuctionMetrics({
    chitValue: selectedChit.value,
    membersCount: selectedChit.membersCount,
    bidDiscount: activeAuction?.highestBidDiscount || 0,
    foremanCommissionRate: (selectedChit.foremanCommissionPercent || 5) / 100,
  });

  const handlePlaceMyBid = (e) => {
    e.preventDefault();
    placeBid({
      chitId: selectedChit.id,
      discountAmount: bidDiscount,
    });
  };

  const isCurrentUserLeading = activeAuction?.highestBidderId === currentUser.id;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Auction Room Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Reverse Auction Bidding Room</h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isAuctionLive 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : isAuctionSettled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isAuctionLive ? '● BIDDING LIVE' : isAuctionSettled ? '✓ CYCLE SETTLED' : 'UPCOMING'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedChit.name} • Month {selectedChit.currentCycle} Payout Pot: <strong className="text-teal-400 font-mono">{formatCurrency(selectedChit.value)}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Live Countdown & Simulation Controls */}
        <div className="flex items-center gap-3">
          {isAuctionLive ? (
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-amber-500/40 shadow-inner">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">Closing In</span>
                <span className="font-display text-2xl font-black text-white font-mono tracking-wider">
                  {formatDuration(timerSeconds)}
                </span>
              </div>
              <Clock className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          ) : (
            <button
              onClick={() => forceStartAuction(selectedChit.id)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20"
            >
              <Play className="w-4 h-4" />
              <span>Start Demo Live Auction</span>
            </button>
          )}

          {isAuctionLive && (
            <button
              onClick={() => endAndSettleAuction(selectedChit.id)}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Foreman immediate settlement trigger"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Conclude & Settle</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid: Leader Card & Interactive Bid Placer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Current Top Leader Card & Live Feed */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Current Top Discount Banner */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Current Top Bid (Cycle {selectedChit.currentCycle})</span>
              <span className="text-amber-400 font-bold">{currentLeaderMetrics.discountPercentage.toFixed(0)}% Discount</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Top Foregone Discount:</span>
                <span className="font-display text-2xl font-black text-amber-400 font-mono">
                  {formatCurrency(activeAuction?.highestBidDiscount || 0)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Winning Bidder:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">
                    {activeAuction?.highestBidderName || 'No bids yet'}
                  </span>
                  {isCurrentUserLeading && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                      YOU LEAD
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Take-Home Payout to Winner:</span>
                <span className="font-bold text-teal-400 font-mono">
                  {formatCurrency(currentLeaderMetrics.netPayout)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-emerald-400 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10 font-medium">
                <span>Dividend Credit to All {selectedChit.membersCount} Members:</span>
                <span className="font-mono font-bold">
                  {formatCurrency(currentLeaderMetrics.dividendPerMember)} / member
                </span>
              </div>
            </div>

            {/* Competitor Bot Simulator Button */}
            {isAuctionLive && (
              <button
                onClick={() => triggerAutomatedMemberBid(selectedChit.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all hover:border-amber-500/50"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Simulate Opposing Member Bid (+₹5,000)</span>
              </button>
            )}
          </div>

          {/* Live Bid Activity Feed */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                Live Bidding Activity Stream
              </h4>
              <span className="text-[11px] text-slate-500">{activeAuction?.bids?.length || 0} bids placed</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeAuction?.bids?.map((b, idx) => (
                <div
                  key={b.id || idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    idx === 0 
                      ? 'bg-amber-500/10 border-amber-500/30' 
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      {b.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{b.userName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400">{formatCurrency(b.discount)}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">({b.discountPercent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): Interactive Bid Placer & Financial Calculator */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Place Your Reverse Bid</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bid the discount you are willing to forego to receive this month's pot immediately
                </p>
              </div>
              <span className="bg-teal-500/15 text-teal-300 text-xs font-bold px-2.5 py-1 rounded-xl border border-teal-500/30">
                Sealed / Open Bidding
              </span>
            </div>

            {/* Discount Slider & Amount Input */}
            <form onSubmit={handlePlaceMyBid} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Your Foregone Discount Bid Amount
                  </label>
                  <span className="font-mono font-bold text-lg text-teal-400">
                    {formatCurrency(bidDiscount)} ({userMetrics.discountPercentage.toFixed(0)}%)
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={minBid}
                  max={maxBid}
                  step={1000}
                  value={bidDiscount}
                  onChange={(e) => setBidDiscount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1.5">
                  <span>Min: {formatCurrency(minBid)} ({minDiscountPercent}%)</span>
                  <span className="text-amber-400/80">Max Cap: {formatCurrency(maxBid)} ({maxDiscountPercent}%)</span>
                </div>
              </div>

              {/* Financial Breakdown Live Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                
                {/* 1. Take-Home Payout */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Your Net Take-Home Payout:</span>
                  <div className="font-display text-xl font-black text-teal-400 font-mono">
                    {formatCurrency(userMetrics.netPayout)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    ₹{selectedChit.value.toLocaleString('en-IN')} - ₹{bidDiscount.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* 2. Foreman Commission */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Foreman 5% Fee (Statutory):</span>
                  <div className="font-display text-xl font-bold text-indigo-300 font-mono">
                    {formatCurrency(userMetrics.foremanCommission)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Chit company administration fee
                  </p>
                </div>

                {/* 3. Dividend Distributed */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Total Dividend Pool:</span>
                  <div className="font-display text-xl font-bold text-emerald-400 font-mono">
                    {formatCurrency(userMetrics.distributableDividend)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Distributed across 20 members
                  </p>
                </div>

                {/* 4. Dividend per member */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Savings per Member Next Month:</span>
                  <div className="font-display text-xl font-bold text-emerald-300 font-mono">
                    {formatCurrency(userMetrics.dividendPerMember)}
                  </div>
                  <p className="text-[10px] text-emerald-400/80 mt-1 font-medium">
                    Next due: {formatCurrency(userMetrics.nextMonthInstallment)}
                  </p>
                </div>

              </div>

              {/* Submit Bid Button */}
              <button
                type="submit"
                disabled={!isAuctionLive}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-300 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 active:scale-95 disabled:opacity-40"
              >
                <Gavel className="w-4 h-4" />
                <span>
                  Submit Discount Bid of {formatCurrency(bidDiscount)} (Receive {formatCurrency(userMetrics.netPayout)})
                </span>
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  All bids are cryptographically stamped and settled via Escrow Account
                </p>
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
