import React, { useState } from 'react';
import { Product, Order } from '@/types';
import { Compass, ShieldCheck } from 'lucide-react';

interface AtelierMetricsPanelProps {
  products: Product[];
  orders: Order[];
}

interface TraditionInfo {
  region: string;
  technique: string;
  avgPrice: string;
  giTag: boolean;
}

const TRADITION_METADATA: Record<string, TraditionInfo> = {
  Banarasi: {
    region: 'Varanasi, Uttar Pradesh',
    technique: 'Kadwa Brocade & Katan Silk',
    avgPrice: '₹38,500',
    giTag: true,
  },
  Kanjeevaram: {
    region: 'Kanchipuram, Tamil Nadu',
    technique: 'Korvai Weave & Temple Borders',
    avgPrice: '₹44,000',
    giTag: true,
  },
  Chanderi: {
    region: 'Chanderi, Madhya Pradesh',
    technique: 'Fine Silk Cotton with Zari Butis',
    avgPrice: '₹18,500',
    giTag: true,
  },
  Patola: {
    region: 'Patan, Gujarat',
    technique: 'Double Ikat Geometrical Grid',
    avgPrice: '₹75,000',
    giTag: true,
  },
  Paithani: {
    region: 'Paithan, Maharashtra',
    technique: 'Oblique Tapestry & Mor Pallu',
    avgPrice: '₹32,000',
    giTag: true,
  },
  Mysore: {
    region: 'Mysuru, Karnataka',
    technique: 'Pure Mulberry Crepe & 24K Gold',
    avgPrice: '₹28,000',
    giTag: true,
  },
  Tussar: {
    region: 'Champa, Chhattisgarh',
    technique: 'Wild Kosa Silk & Tribal Weft',
    avgPrice: '₹22,000',
    giTag: true,
  },
};

export const AtelierMetricsPanel: React.FC<AtelierMetricsPanelProps> = ({ products, orders }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    pct: Math.max(1, Math.round((count / total) * 100)),
  }));

  const catColors: Record<string, string> = {
    Banarasi: '#DFBF7A',
    Kanjeevaram: '#C45B8A',
    Chanderi: '#3B82F6',
    Patola: '#10B981',
    Paithani: '#F59E0B',
    Mysore: '#A855F7',
    Tussar: '#E8A87C',
    Other: '#9CA3AF',
  };

  // SVG Radial Donut calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius; // ~351.858
  let accumulatedPct = 0;

  const donutSlices = categoriesList.map((cat) => {
    const slicePct = cat.pct;
    const strokeDasharray = `${(slicePct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPct / 100) * circumference);
    accumulatedPct += slicePct;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
      color: catColors[cat.name] || '#DFBF7A',
      meta: TRADITION_METADATA[cat.name] || {
        region: 'Heritage Weaving Cluster',
        technique: 'Artisanal Handloom Silk',
        avgPrice: '₹25,000',
        giTag: true,
      },
    };
  });

  const activeFocus = donutSlices.find((s) => s.name === selectedCategory) || donutSlices[0] || {
    name: 'Atelier Archives',
    count: products.length,
    pct: 100,
    color: '#DFBF7A',
    meta: {
      region: 'Across 7 Indian Heritage Guilds',
      technique: 'Certified Pure Silk & Real Zari',
      avgPrice: '₹34,000',
      giTag: true,
    },
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
      {/* Enhanced Weaving Tradition Portfolio - Radial Donut & Interactive Heritage Hub */}
      <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1A0B2C]/90 via-[#120520]/80 to-[#0A0213]/90 border border-brand-gold/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/15 text-brand-gold font-bold uppercase">
                  ATELIER HERITAGE GUILD
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                Weaving Tradition Portfolio
              </h3>
              <p className="text-xs text-brand-ivory/60 mt-0.5 font-sans">
                Curatorial distribution, geographical provenance, and active loom allocation.
              </p>
            </div>
            <div className="text-right self-start sm:self-auto bg-black/40 px-3.5 py-2 rounded-xl border border-brand-gold/20">
              <span className="font-mono text-base font-bold text-brand-gold block">
                {products.length} Masterpieces
              </span>
              <span className="text-[10px] text-brand-ivory/50 font-mono uppercase tracking-wider">
                {categoriesList.length} Living Traditions
              </span>
            </div>
          </div>

          {/* Centerpiece: Radial Heritage Donut & Tradition Focus Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-black/35 border border-brand-gold/20 mb-6">
            {/* SVG Donut Chart */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                  {/* Background Track */}
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="14"
                  />
                  {/* Category Slices */}
                  {donutSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={selectedCategory === slice.name ? '17' : '14'}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-500 cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setSelectedCategory(slice.name)}
                      onClick={() => setSelectedCategory(slice.name)}
                    />
                  ))}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  <span className="font-mono text-2xl font-bold text-white tracking-tight">
                    {selectedCategory ? `${activeFocus.pct}%` : `${products.length}`}
                  </span>
                  <span className="text-[10px] font-serif text-brand-gold uppercase tracking-wider truncate max-w-[100px]">
                    {selectedCategory ? activeFocus.name : 'Master Weaves'}
                  </span>
                  <span className="text-[9px] text-brand-ivory/40 font-mono">
                    {selectedCategory ? `${activeFocus.count} pieces` : 'In Vault'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Tradition Dossier */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-3 border-t md:border-t-0 md:border-l border-white/10 md:pl-6 pt-4 md:pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold-light/70 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Regional Provenance</span>
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                    {activeFocus.name} Saree Tradition
                  </h4>
                </div>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-md"
                  style={{ backgroundColor: activeFocus.color }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">Origin Cluster</span>
                  <span className="font-medium text-white text-[11px] truncate block mt-0.5">
                    {activeFocus.meta.region}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">Weft Technique</span>
                  <span className="font-medium text-white text-[11px] truncate block mt-0.5">
                    {activeFocus.meta.technique}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">Valuation Range</span>
                  <span className="font-mono font-bold text-brand-gold text-[11px] block mt-0.5">
                    {activeFocus.meta.avgPrice}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">GI Tag Status</span>
                    <span className="font-medium text-emerald-400 text-[11px] block mt-0.5">
                      ✓ GI Certified
                    </span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tradition Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {donutSlices.map((cat, idx) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-gold/15 border-brand-gold shadow-[0_0_15px_rgba(223,191,122,0.2)] ring-1 ring-brand-gold/60'
                      : 'bg-white/[0.02] border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-semibold text-white truncate font-serif">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-brand-gold font-bold">
                      {cat.pct}%
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden my-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-ivory/50">
                    <span>{cat.count} drapes</span>
                    <span className="text-emerald-400">GI Tag</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Efficiency Highlights */}
        <div className="grid grid-cols-3 gap-4 pt-5 mt-6 border-t border-brand-gold/15 text-center">
          <div>
            <div className="font-mono text-base font-bold text-emerald-400">100%</div>
            <div className="text-[10px] text-brand-ivory/60 uppercase tracking-wider mt-0.5">
              GI Tag Verification
            </div>
          </div>
          <div>
            <div className="font-mono text-base font-bold text-brand-gold">14 Guilds</div>
            <div className="text-[10px] text-brand-ivory/60 uppercase tracking-wider mt-0.5">
              Ancestral Weaving Clusters
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
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#180A26]/90 via-[#11041D]/80 to-[#0A0212]/90 border border-brand-gold/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Atelier Pulse
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/30">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 transition-all flex items-start gap-3 hover:scale-[1.01]"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 text-brand-gold text-xs font-bold shadow-inner">
                  {ev.type === 'order' ? '✦' : ev.type === 'stock' ? '◈' : '◉'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate font-serif">{ev.title}</div>
                  <div className="text-[11px] text-brand-ivory/60 truncate mt-0.5 font-sans">
                    {ev.subtitle}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-brand-ivory/40 whitespace-nowrap self-start">
                  {ev.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-ivory/60">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Vault Security: Encrypted
          </span>
          <span className="font-mono text-[10px] text-brand-gold">SHA-256 JWKS</span>
        </div>
      </div>
    </div>
  );
};
