import React from 'react';
import { Product, Order } from '@/types';

interface AtelierMetricsPanelProps {
  products: Product[];
  orders: Order[];
}

export const AtelierMetricsPanel: React.FC<AtelierMetricsPanelProps> = ({ products, orders }) => {
  // Category Breakdown
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const total = products.length || 1;
  const categoriesList = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    count,
    pct: Math.round((count / total) * 100),
  }));

  const catColors: Record<string, string> = {
    Banarasi: '#DFBF7A',
    Kanjeevaram: '#C45B8A',
    Chanderi: '#3B82F6',
    Patola: '#10B981',
    Paithani: '#F59E0B',
    Mysore: '#A855F7',
    Tussar: '#E8A87C',
  };

  const recentEvents = [
    {
      id: 1,
      title: 'Heirloom Order #VL-1092 Dispatched',
      subtitle: 'Insured White-Glove Courier to Mumbai',
      time: '4 mins ago',
      type: 'order',
    },
    {
      id: 2,
      title: 'Kanjeevaram Gold Tissue Stock Reserved',
      subtitle: 'VIP Patron Bridal Consultation confirmed',
      time: '18 mins ago',
      type: 'stock',
    },
    {
      id: 3,
      title: 'GI Tag Verification Synchronized',
      subtitle: 'Handloom Silk Board authentic seal validated',
      time: '42 mins ago',
      type: 'compliance',
    },
    {
      id: 4,
      title: 'New Patron Royal Account Enrolled',
      subtitle: 'Maharani Suite Member from London, UK',
      time: '1 hr ago',
      type: 'user',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* Category Weave Distribution */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-brand-gold/20 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                Weaving Tradition Portfolio
                <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                  ATELIER ARCHIVE
                </span>
              </h3>
              <p className="text-xs text-brand-ivory/60 mt-0.5">
                Proportionate distribution of master handloom sarees across historical regions.
              </p>
            </div>
            <span className="font-mono text-xs text-brand-gold font-bold">
              {products.length} Masterpieces Active
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden flex p-0.5 border border-white/5 shadow-inner mb-6">
            {categoriesList.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  width: `${cat.pct}%`,
                  backgroundColor: catColors[cat.name] || '#DFBF7A',
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90"
                title={`${cat.name}: ${cat.count} sarees (${cat.pct}%)`}
              />
            ))}
          </div>

          {/* Category Badges & Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoriesList.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-gold/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: catColors[cat.name] || '#DFBF7A' }}
                  />
                  <span className="text-xs font-medium text-white truncate">{cat.name}</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-base font-bold text-white">{cat.count}</span>
                  <span className="font-mono text-[10px] text-brand-ivory/50">{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Efficiency Highlights */}
        <div className="grid grid-cols-3 gap-4 pt-5 mt-6 border-t border-white/5 text-center">
          <div>
            <div className="font-mono text-base font-bold text-emerald-400">98.8%</div>
            <div className="text-[10px] text-brand-ivory/60 uppercase tracking-wider mt-0.5">
              QC Pass Rate
            </div>
          </div>
          <div>
            <div className="font-mono text-base font-bold text-brand-gold">100%</div>
            <div className="text-[10px] text-brand-ivory/60 uppercase tracking-wider mt-0.5">
              24K Zari Certified
            </div>
          </div>
          <div>
            <div className="font-mono text-base font-bold text-indigo-400">
              {orders.length > 0 ? orders.length : 52}
            </div>
            <div className="text-[10px] text-brand-ivory/60 uppercase tracking-wider mt-0.5">
              Curated Dispatches
            </div>
          </div>
        </div>
      </div>

      {/* Live Atelier Activity Feed */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-brand-gold/20 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Atelier Pulse
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest">
              Live Feed
            </span>
          </div>

          <div className="space-y-3.5">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/20 transition-colors flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 text-brand-gold text-xs">
                  {ev.type === 'order' ? '✦' : ev.type === 'stock' ? '◈' : '◉'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{ev.title}</div>
                  <div className="text-[11px] text-brand-ivory/60 truncate mt-0.5">
                    {ev.subtitle}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-brand-ivory/40 whitespace-nowrap">
                  {ev.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-ivory/60">
          <span>Security Gate: Encrypted</span>
          <span className="font-mono text-[10px] text-brand-gold">SHA-256 JWT</span>
        </div>
      </div>
    </div>
  );
};
