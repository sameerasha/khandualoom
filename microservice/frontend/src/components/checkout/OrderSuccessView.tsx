import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, ShieldCheck, MessageCircle, PackageCheck } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      {/* Celebration Checkmark */}
      <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500/60 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <CheckCircle className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
        ORDER CREATED & AUTHORIZED
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold">
        Thank You for Your Order!
      </h1>
      <p className="text-sm text-brand-ivory/70 mt-2">
        Your handloom masterwork has been scheduled for dispatch with the artisan cooperative.
      </p>

      {/* Order ID & Tracking Card */}
      <div className="mt-8 p-6 rounded-2xl bg-[#170928] border border-brand-gold/25 text-left space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-gold/15 pb-4">
          <div>
            <span className="text-[11px] text-brand-ivory/50 uppercase font-semibold">
              Order Reference
            </span>
            <p className="font-mono text-lg font-bold text-brand-gold">
              #KHL-{orderId || '782941'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded bg-[#1D0C30] border border-brand-gold/30 text-brand-gold text-xs font-semibold hover:bg-brand-gold/15 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>

        {/* Tracking Progression */}
        <div>
          <span className="text-[11px] text-brand-ivory/60 font-semibold uppercase tracking-wider block mb-3">
            Dispatch Progression
          </span>

          <div className="grid grid-cols-4 text-center text-xs relative">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1 z-10 shadow">
                ✓
              </div>
              <span className="font-semibold text-emerald-400 text-[11px]">Confirmed</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-purple-dark flex items-center justify-center font-bold text-xs mb-1 z-10 shadow animate-pulse">
                2
              </div>
              <span className="font-semibold text-brand-gold text-[11px]">Quality Check</span>
            </div>

            <div className="flex flex-col items-center opacity-50">
              <div className="w-7 h-7 rounded-full bg-[#1A0A2C] border border-brand-gold/30 text-brand-ivory/60 flex items-center justify-center font-bold text-xs mb-1 z-10">
                3
              </div>
              <span className="text-[11px]">Handed to Courier</span>
            </div>

            <div className="flex flex-col items-center opacity-50">
              <div className="w-7 h-7 rounded-full bg-[#1A0A2C] border border-brand-gold/30 text-brand-ivory/60 flex items-center justify-center font-bold text-xs mb-1 z-10">
                4
              </div>
              <span className="text-[11px]">Delivered</span>
            </div>
          </div>
        </div>

        {/* WhatsApp updates */}
        <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs text-brand-ivory/80">
          <div className="flex items-center gap-2 text-emerald-400">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Receive live delivery updates via WhatsApp</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] uppercase font-bold text-emerald-300">
            Active
          </span>
        </div>
      </div>

      {/* Primary Continue Shopping CTA */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/catalog"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-purple-dark font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/account/orders"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#1A0A2C] border border-brand-gold/30 text-brand-gold font-bold text-xs uppercase tracking-widest hover:bg-brand-gold/10 transition-colors"
        >
          View All Orders
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-brand-ivory/50">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Authenticated Silk Mark and GI Certificate enclosed inside parcel</span>
      </div>
    </div>
  );
};
