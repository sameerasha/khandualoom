import React from 'react';
import { Product } from '@/types';
import { ShieldCheck, Info } from 'lucide-react';

interface HandloomSpecificationsProps {
  product: Product;
}

export const HandloomSpecifications: React.FC<HandloomSpecificationsProps> = ({ product }) => {
  const specs = [
    { label: 'Fabric', value: product.fabric || 'Pure Mulberry Silk' },
    { label: 'Color', value: product.color || 'Traditional Multi-Hue' },
    { label: 'Weaving Style', value: product.weaveType || product.weave || 'Traditional Handloom Ikat' },
    { label: 'Pattern', value: (product as any).pattern || 'Traditional Temple & Floral Motifs' },
    { label: 'Occasion', value: product.occasion || 'Festive, Wedding, Ceremony' },
    { label: 'Saree Length', value: product.sareeLength || '5.5 Meters' },
    { label: 'Blouse Piece', value: product.blouseIncluded !== false ? '0.8 Meters Included (Unstitched)' : 'Not Included' },
    { label: 'Weaver Society', value: product.artisanSociety || 'Nuapatna Handloom Weavers Cooperative' },
    { label: 'Origin', value: 'Odisha, India (GI Tagged Region)' },
    { label: 'Wash Care', value: 'Dry Clean Only' },
  ];

  return (
    <div className="py-6 border-t border-border space-y-4">
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Product Specifications</span>
      </h3>

      {/* Clean 2-Column Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-surface text-xs divide-y divide-border shadow-xs">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 sm:grid-cols-12 py-2.5 px-4 transition-colors ${
              idx % 2 === 0 ? 'bg-background-secondary' : 'bg-surface'
            }`}
          >
            <span className="sm:col-span-4 font-semibold text-text-secondary">{item.label}</span>
            <span className="sm:col-span-8 text-text-primary font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Handcrafted Note */}
      <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex gap-2.5 text-xs text-amber-900 dark:text-amber-200 mt-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950 dark:text-amber-100">Handloom Note</p>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
            Every saree is handwoven by traditional artisan families on wooden pit looms. Minor variations in texture and yarn are natural characteristics of authentic handwoven textiles.
          </p>
        </div>
      </div>
    </div>
  );
};
