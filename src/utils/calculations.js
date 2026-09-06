// Chit Fund Reverse Auction Calculations & Financial Math

export const calculateAuctionMetrics = ({
  chitValue = 0,
  membersCount = 20,
  bidDiscount = 0,
  foremanCommissionRate = 0.05, // 5% standard statutory commission
}) => {
  const baseMonthly = membersCount > 0 ? chitValue / membersCount : 0;
  const foremanCommission = chitValue * foremanCommissionRate;
  
  // Net payout that the winning bidder takes home
  const netPayout = Math.max(0, chitValue - bidDiscount);
  
  // Distributable dividend among all members
  const distributableDividend = Math.max(0, bidDiscount - foremanCommission);
  
  // Per member dividend deduction
  const dividendPerMember = membersCount > 0 ? distributableDividend / membersCount : 0;
  
  // Net installment due from each member in the following month
  const nextMonthInstallment = Math.max(0, baseMonthly - dividendPerMember);
  
  // Discount percentage
  const discountPercentage = chitValue > 0 ? (bidDiscount / chitValue) * 100 : 0;

  return {
    chitValue,
    membersCount,
    baseMonthly,
    bidDiscount,
    discountPercentage,
    foremanCommission,
    netPayout,
    distributableDividend,
    dividendPerMember,
    nextMonthInstallment,
  };
};

export const getMinMaxBids = (chitValue, maxDiscountPercent = 30, minDiscountPercent = 5) => {
  const minBid = (chitValue * minDiscountPercent) / 100;
  const maxBid = (chitValue * maxDiscountPercent) / 100;
  return { minBid, maxBid, minDiscountPercent, maxDiscountPercent };
};
