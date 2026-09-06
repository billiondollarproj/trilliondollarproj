import React, { useState } from 'react';
import { useChit } from '../../context/ChitContext';
import { 
  PlusCircle, 
  X, 
  ShieldCheck, 
  Coins, 
  Calendar, 
  Users, 
  Percent, 
  Building2,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CreateChitModal = () => {
  const { isCreateChitModalOpen, setIsCreateChitModalOpen, createNewChitGroup } = useChit();

  const [formData, setFormData] = useState({
    name: 'Bangalore Elite Entrepreneurs Chit',
    value: 500000,
    durationMonths: 20,
    membersCount: 20,
    auctionDayOfMonth: 15,
    maxDiscountPercent: 30,
    foremanCommissionPercent: 5,
    description: 'High-trust business rotating credit fund with bank-verified escrow protection.',
  });

  if (!isCreateChitModalOpen) return null;

  const baseMonthly = Math.round(formData.value / (formData.durationMonths || 1));
  const foremanCommissionAmount = (formData.value * formData.foremanCommissionPercent) / 100;
  const maxDiscountAmount = (formData.value * formData.maxDiscountPercent) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewChitGroup(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsCreateChitModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-bold text-white">Create New Chit Fund</h3>
              <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                Foreman Tool
              </span>
            </div>
            <p className="text-xs text-slate-400">Initialize a compliant ROSCA scheme with custom rules and escrow backing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Group Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Chit Scheme Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Value & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Total Pot Value (₹)
              </label>
              <select
                value={formData.value}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({ ...formData, value: val });
                }}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-teal-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value={50000}>₹50,000 (Micro)</option>
                <option value={100000}>₹1,00,000 (1 Lakh)</option>
                <option value={250000}>₹2,50,000 (2.5 Lakhs)</option>
                <option value={500000}>₹5,00,000 (5 Lakhs)</option>
                <option value={1000000}>₹10,00,000 (10 Lakhs)</option>
                <option value={2500000}>₹25,00,000 (25 Lakhs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Duration (Months)
              </label>
              <select
                value={formData.durationMonths}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setFormData({ ...formData, durationMonths: d, membersCount: d });
                }}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value={10}>10 Months</option>
                <option value={20}>20 Months</option>
                <option value={25}>25 Months</option>
                <option value={30}>30 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Members Count
              </label>
              <input
                type="number"
                value={formData.membersCount}
                onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                min={2}
                max={50}
                required
              />
            </div>
          </div>

          {/* Rules & Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Auction Day of Month
              </label>
              <input
                type="number"
                value={formData.auctionDayOfMonth}
                onChange={(e) => setFormData({ ...formData, auctionDayOfMonth: Number(e.target.value) })}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                min={1}
                max={28}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Max Discount Cap (%)
              </label>
              <input
                type="number"
                value={formData.maxDiscountPercent}
                onChange={(e) => setFormData({ ...formData, maxDiscountPercent: Number(e.target.value) })}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                min={5}
                max={40}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Foreman Fee (%)
              </label>
              <input
                type="number"
                value={formData.foremanCommissionPercent}
                onChange={(e) => setFormData({ ...formData, foremanCommissionPercent: Number(e.target.value) })}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
                min={1}
                max={10}
                required
              />
            </div>
          </div>

          {/* Calculated Summary Matrix */}
          <div className="bg-slate-950/90 border border-indigo-900/30 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Monthly Contribution:</span>
              <p className="text-base font-bold text-teal-400 font-mono mt-0.5">{formatCurrency(baseMonthly)}/mo</p>
            </div>
            <div>
              <span className="text-slate-400">Foreman 5% Fee:</span>
              <p className="text-base font-bold text-indigo-300 font-mono mt-0.5">{formatCurrency(foremanCommissionAmount)}</p>
            </div>
            <div>
              <span className="text-slate-400">Max Discount Limit:</span>
              <p className="text-base font-bold text-amber-300 font-mono mt-0.5">{formatCurrency(maxDiscountAmount)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Terms
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-bold text-sm hover:from-indigo-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 mt-4"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Chit Group & Seed 20 Members</span>
          </button>

        </form>

      </div>
    </div>
  );
};
