import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, INITIAL_CHIT_GROUPS, CHIT_MEMBERS_ROSTER } from '../data/seedData';
import { calculateAuctionMetrics } from '../utils/calculations';
import { playPaymentSuccessSound, playBidSound, playWinSound } from '../utils/sounds';

const ChitContext = createContext();

const STORAGE_KEY_CHITS = 'trustchit_groups_v1';
const STORAGE_KEY_USER = 'trustchit_active_user_v1';

export const ChitProvider = ({ children }) => {
  // 1. Current Logged In User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEMO_USERS[0]; // Rahul Sharma (Member)
  });

  // 2. Chit Groups State
  const [chits, setChits] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHITS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CHIT_GROUPS;
  });

  const [selectedChitId, setSelectedChitId] = useState('chit_golden_5L');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'ledger', 'auction', 'payout', 'foreman'
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isCreateChitModalOpen, setIsCreateChitModalOpen] = useState(false);
  const [selectedLedgerItemForCash, setSelectedLedgerItemForCash] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [notification, setNotification] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHITS, JSON.stringify(chits));
    } catch {
      // Ignore
    }
  }, [chits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch {
      // Ignore
    }
  }, [currentUser]);

  // Selected Chit Helper
  const selectedChit = chits.find((c) => c.id === selectedChitId) || chits[0];

  // Helper notification toast
  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Auth Functions
  const switchUser = (userId) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched profile to ${user.name} (${user.roleLabel})`, 'info');
      // If switched to foreman, auto navigate or maintain view
      if (user.role === 'FOREMAN' && activeTab !== 'auction' && activeTab !== 'ledger') {
        // Can remain or change
      }
    }
  };

  const loginWithPhoneAndOtp = (phone, otp) => {
    const matchedUser = DEMO_USERS.find((u) => u.phone === phone || u.phone.includes(phone)) || DEMO_USERS[0];
    setCurrentUser(matchedUser);
    setIsAuthModalOpen(false);
    showToast(`Logged in successfully as ${matchedUser.name}`, 'success');
  };

  const logout = () => {
    setIsAuthModalOpen(true);
  };

  // ==========================================
  // PAYMENT ACTIONS
  // ==========================================
  const makeMemberPayment = ({ chitId, memberId, paymentMode = 'UPI_GPAY', amount }) => {
    setChits((prevChits) => {
      return prevChits.map((chit) => {
        if (chit.id !== chitId) return chit;

        const updatedLedger = chit.ledger.map((entry) => {
          if (entry.memberId === memberId) {
            const receiptNumber = `TC-REC-${Date.now().toString().slice(-6)}`;
            const receipt = {
              receiptNo: receiptNumber,
              chitName: chit.name,
              memberName: entry.memberName,
              amount: amount || entry.netPayable,
              paidAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              paymentMode: paymentMode.replace('_', ' '),
              status: 'CONFIRMED',
              transactionRef: `UPI/${Date.now().toString().slice(-10)}`,
            };
            setActiveReceipt(receipt);
            return {
              ...entry,
              status: 'PAID',
              paidAt: receipt.paidAt,
              paymentMode,
              receiptNo: receiptNumber,
            };
          }
          return entry;
        });

        return { ...chit, ledger: updatedLedger };
      });
    });

    playPaymentSuccessSound();
    showToast('Payment successful! Receipt generated and ledger updated.', 'success');
  };

  const markCashPaymentByAgent = ({ chitId, memberId, receiptSlipNo, notes }) => {
    setChits((prevChits) => {
      return prevChits.map((chit) => {
        if (chit.id !== chitId) return chit;

        const updatedLedger = chit.ledger.map((entry) => {
          if (entry.memberId === memberId) {
            const receiptNumber = receiptSlipNo || `TC-CSH-${Date.now().toString().slice(-5)}`;
            const receipt = {
              receiptNo: receiptNumber,
              chitName: chit.name,
              memberName: entry.memberName,
              amount: entry.netPayable,
              paidAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              paymentMode: 'CASH (Doorstep Collection)',
              collectedBy: `${currentUser.name} (${currentUser.role === 'FIELD_AGENT' ? currentUser.agentId : 'Foreman'})`,
              status: 'VERIFIED & RECONCILED',
              notes: notes || 'Cash received against physical counterfoil.',
            };
            setActiveReceipt(receipt);
            return {
              ...entry,
              status: 'PAID',
              paidAt: receipt.paidAt,
              paymentMode: 'CASH_AGENT',
              collectedBy: receipt.collectedBy,
              receiptNo: receiptNumber,
            };
          }
          return entry;
        });

        return { ...chit, ledger: updatedLedger };
      });
    });

    playPaymentSuccessSound();
    showToast(`Cash payment verified & recorded for receipt #${receiptSlipNo || 'TC-CASH'}`, 'success');
    setIsCashModalOpen(false);
  };

  // ==========================================
  // AUCTION & BIDDING ACTIONS
  // ==========================================
  const placeBid = ({ chitId, discountAmount, customUserId, customUserName }) => {
    const bidderId = customUserId || currentUser.id;
    const bidderName = customUserName || currentUser.name;

    setChits((prevChits) => {
      return prevChits.map((chit) => {
        if (chit.id !== chitId) return chit;
        if (!chit.activeAuction) return chit;

        const currentHighest = chit.activeAuction.highestBidDiscount || 0;
        if (discountAmount <= currentHighest) {
          showToast(`Bid must be higher than current top discount ₹${currentHighest.toLocaleString('en-IN')}`, 'warning');
          return chit;
        }

        const discountPercent = Math.round((discountAmount / chit.value) * 100);
        const newBid = {
          id: `bid_${Date.now()}`,
          userId: bidderId,
          userName: bidderName,
          discount: discountAmount,
          discountPercent,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        const updatedBids = [newBid, ...(chit.activeAuction.bids || [])];

        return {
          ...chit,
          activeAuction: {
            ...chit.activeAuction,
            highestBidDiscount: discountAmount,
            highestBidderName: bidderName,
            highestBidderId: bidderId,
            bids: updatedBids,
            // Add a little time buffer if bid placed in last seconds
            secondsRemaining: Math.max(chit.activeAuction.secondsRemaining || 0, 20),
          },
        };
      });
    });

    playBidSound();
    showToast(`New top discount bid placed: ₹${discountAmount.toLocaleString('en-IN')}`, 'info');
  };

  const forceStartAuction = (chitId) => {
    setChits((prevChits) => {
      return prevChits.map((chit) => {
        if (chit.id !== chitId) return chit;
        return {
          ...chit,
          status: 'AUCTION_LIVE',
          activeAuction: {
            cycleNo: chit.currentCycle,
            status: 'LIVE',
            startTime: new Date().toISOString(),
            durationSeconds: 90,
            secondsRemaining: 90,
            highestBidDiscount: chit.value * 0.15, // Starts at 15% discount
            highestBidderName: 'Vikramaditya Rao',
            highestBidderId: 'm_5',
            bids: [
              {
                id: `bid_init`,
                userId: 'm_5',
                userName: 'Vikramaditya Rao',
                discount: chit.value * 0.15,
                discountPercent: 15,
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
            winner: null,
          },
        };
      });
    });
    setActiveTab('auction');
    showToast('Auction room opened! Bidding is now LIVE.', 'info');
  };

  const endAndSettleAuction = (chitId) => {
    setChits((prevChits) => {
      return prevChits.map((chit) => {
        if (chit.id !== chitId) return chit;
        if (!chit.activeAuction) return chit;

        const winningDiscount = chit.activeAuction.highestBidDiscount || chit.value * 0.2;
        const winnerId = chit.activeAuction.highestBidderId || 'user_rahul';
        const winnerName = chit.activeAuction.highestBidderName || 'Rahul Sharma';

        const metrics = calculateAuctionMetrics({
          chitValue: chit.value,
          membersCount: chit.membersCount,
          bidDiscount: winningDiscount,
          foremanCommissionRate: chit.foremanCommissionPercent / 100,
        });

        const newSettledCycle = {
          cycleNo: chit.currentCycle,
          date: new Date().toISOString().split('T')[0],
          type: 'AUCTION',
          winnerId,
          winnerName,
          winningBidDiscount: winningDiscount,
          discountPercent: Math.round(metrics.discountPercentage),
          netPayout: metrics.netPayout,
          foremanFee: metrics.foremanCommission,
          totalDividend: metrics.distributableDividend,
          dividendPerMember: Math.round(metrics.dividendPerMember),
          memberInstallmentDue: Math.round(metrics.nextMonthInstallment),
          payoutStatus: 'PROCESSING',
          payoutDate: new Date().toISOString().split('T')[0],
          transactionRef: `UPI/SETTLE-${Date.now().toString().slice(-8)}`,
        };

        const nextCycleNo = chit.currentCycle + 1;
        const nextInstallment = Math.round(metrics.nextMonthInstallment);

        // Regenerate ledger for next cycle with dividend applied!
        const nextLedger = CHIT_MEMBERS_ROSTER.slice(0, chit.membersCount).map((m, idx) => ({
          id: `led_c${nextCycleNo}_${idx + 1}`,
          memberId: m.id,
          memberName: m.name,
          phone: m.phone,
          slotNo: idx + 1,
          baseAmount: chit.baseMonthlyContribution,
          dividendCredited: Math.round(metrics.dividendPerMember),
          netPayable: nextInstallment,
          status: 'PENDING',
          paidAt: null,
          paymentMode: null,
          receiptNo: null,
        }));

        return {
          ...chit,
          currentCycle: nextCycleNo,
          status: 'SETTLING',
          cycles: [...(chit.cycles || []), newSettledCycle],
          activeAuction: {
            ...chit.activeAuction,
            status: 'SETTLED',
            secondsRemaining: 0,
            winner: {
              id: winnerId,
              name: winnerName,
              metrics,
              cycleNo: chit.currentCycle,
            },
          },
          ledger: nextLedger,
        };
      });
    });

    playWinSound();
    setActiveTab('payout');
    showToast('Auction concluded! Dividend calculated and ledger updated.', 'success');
  };

  // Simulate an automated competitive bid from another chit member
  const triggerAutomatedMemberBid = (chitId) => {
    const chit = chits.find((c) => c.id === chitId);
    if (!chit || !chit.activeAuction) return;

    const currentHighest = chit.activeAuction.highestBidDiscount || chit.value * 0.15;
    const maxCap = (chit.value * (chit.maxDiscountPercent || 30)) / 100;
    
    if (currentHighest >= maxCap - 5000) {
      showToast('Auction has reached near maximum allowable legal discount cap.', 'warning');
      return;
    }

    const increment = Math.round((chit.value * 0.02) / 1000) * 1000 || 5000; // +2% jump
    const nextBidAmount = Math.min(maxCap, currentHighest + increment);

    // Pick a member who isn't current user
    const botCandidates = CHIT_MEMBERS_ROSTER.filter((m) => m.id !== currentUser.id && !m.wonCycle);
    const randomMember = botCandidates[Math.floor(Math.random() * botCandidates.length)] || botCandidates[0];

    placeBid({
      chitId,
      discountAmount: nextBidAmount,
      customUserId: randomMember.id,
      customUserName: randomMember.name,
    });
  };

  // Create New Chit Group (Foreman Admin)
  const createNewChitGroup = (chitData) => {
    const baseMonthly = Math.round(chitData.value / chitData.durationMonths);
    const newChitId = `chit_custom_${Date.now()}`;
    
    // Seed initial ledger for the new chit
    const initialLedger = CHIT_MEMBERS_ROSTER.slice(0, chitData.membersCount).map((m, idx) => ({
      id: `led_${newChitId}_${idx + 1}`,
      memberId: m.id,
      memberName: m.name,
      phone: m.phone,
      slotNo: idx + 1,
      baseAmount: baseMonthly,
      dividendCredited: 0,
      netPayable: baseMonthly,
      status: idx < 3 ? 'PAID' : 'PENDING',
      paidAt: idx < 3 ? 'Today' : null,
      paymentMode: idx < 3 ? 'UPI_GPAY' : null,
      receiptNo: idx < 3 ? `TC-REC-${1000 + idx}` : null,
    }));

    const newChit = {
      id: newChitId,
      name: chitData.name,
      code: `TC-${chitData.name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}-${Math.round(chitData.value / 1000)}K`,
      value: Number(chitData.value),
      durationMonths: Number(chitData.durationMonths),
      membersCount: Number(chitData.membersCount),
      baseMonthlyContribution: baseMonthly,
      currentCycle: 1,
      auctionDayOfMonth: Number(chitData.auctionDayOfMonth) || 10,
      maxDiscountPercent: Number(chitData.maxDiscountPercent) || 30,
      minDiscountPercent: 5,
      foremanCommissionPercent: Number(chitData.foremanCommissionPercent) || 5,
      status: 'ACTIVE',
      nextDueDate: '2026-10-10',
      nextAuctionDate: '2026-10-10T19:00:00',
      description: chitData.description || 'Verified chit fund managed on TrustChit platform.',
      bankEscrow: 'HDFC Escrow Account #HDFC-TC-9021',
      cycles: [],
      activeAuction: {
        cycleNo: 1,
        status: 'UPCOMING',
        durationSeconds: 180,
        secondsRemaining: 180,
        highestBidDiscount: 0,
        highestBidderName: null,
        highestBidderId: null,
        bids: [],
        winner: null,
      },
      ledger: initialLedger,
    };

    setChits((prev) => [newChit, ...prev]);
    setSelectedChitId(newChitId);
    setIsCreateChitModalOpen(false);
    showToast(`Created new chit fund "${chitData.name}" successfully!`, 'success');
  };

  // Reset to initial seed state
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_CHITS);
    localStorage.removeItem(STORAGE_KEY_USER);
    setChits(INITIAL_CHIT_GROUPS);
    setCurrentUser(DEMO_USERS[0]);
    setSelectedChitId('chit_golden_5L');
    showToast('Platform reset to default demo state.', 'info');
  };

  return (
    <ChitContext.Provider
      value={{
        currentUser,
        switchUser,
        loginWithPhoneAndOtp,
        logout,
        demoUsers: DEMO_USERS,
        chits,
        selectedChitId,
        setSelectedChitId,
        selectedChit,
        activeTab,
        setActiveTab,
        // Modals & Receipts
        isAuthModalOpen,
        setIsAuthModalOpen,
        isUpiModalOpen,
        setIsUpiModalOpen,
        isCashModalOpen,
        setIsCashModalOpen,
        isCreateChitModalOpen,
        setIsCreateChitModalOpen,
        selectedLedgerItemForCash,
        setSelectedLedgerItemForCash,
        activeReceipt,
        setActiveReceipt,
        notification,
        showToast,
        // Actions
        makeMemberPayment,
        markCashPaymentByAgent,
        placeBid,
        forceStartAuction,
        endAndSettleAuction,
        triggerAutomatedMemberBid,
        createNewChitGroup,
        resetAllData,
      }}
    >
      {children}
    </ChitContext.Provider>
  );
};

export const useChit = () => {
  const context = useContext(ChitContext);
  if (!context) {
    throw new Error('useChit must be used within a ChitProvider');
  }
  return context;
};
