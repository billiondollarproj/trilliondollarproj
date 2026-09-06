import React from 'react';
import { ChitProvider, useChit } from './context/ChitContext';
import { Navbar } from './components/common/Navbar';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { DigitalLedger } from './components/ledger/DigitalLedger';
import { AuctionRoom } from './components/auction/AuctionRoom';
import { PayoutConfirmation } from './components/payout/PayoutConfirmation';
import { ForemanDashboard } from './components/admin/ForemanDashboard';

// Modals
import { LoginModal } from './components/auth/LoginModal';
import { UpiPaymentModal } from './components/common/UpiPaymentModal';
import { MarkCashPaymentModal } from './components/admin/MarkCashPaymentModal';
import { CreateChitModal } from './components/admin/CreateChitModal';
import { ReceiptModal } from './components/common/ReceiptModal';

// Icons & Notifications
import { ShieldCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent = () => {
  const { activeTab, notification } = useChit();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative">
      
      {/* Dynamic Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md max-w-md ${
            notification.type === 'success' 
              ? 'bg-slate-900/95 border-emerald-500/40 text-white' 
              : notification.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-white'
                : 'bg-slate-900/95 border-teal-500/40 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : notification.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-teal-400 shrink-0" />
            )}
            <p className="text-xs font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <MemberDashboard />}
        {activeTab === 'ledger' && <DigitalLedger />}
        {activeTab === 'auction' && <AuctionRoom />}
        {activeTab === 'payout' && <PayoutConfirmation />}
        {activeTab === 'foreman' && <ForemanDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-300">TrustChit Technologies Pvt. Ltd.</span>
            <span>• Verified Digital Chit Fund Management System</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by RBI Chit Funds Act 1982 guidelines & Automated Escrow Ledgers
          </p>
        </div>
      </footer>

      {/* Global Modals */}
      <LoginModal />
      <UpiPaymentModal />
      <MarkCashPaymentModal />
      <CreateChitModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <ChitProvider>
      <MainContent />
    </ChitProvider>
  );
}
