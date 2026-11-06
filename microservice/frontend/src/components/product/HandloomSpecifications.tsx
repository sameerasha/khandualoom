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
    <div className="py-6 border-t border-gray-200 space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-600" />
        <span>Product Specifications</span>
      </h3>

      {/* Clean 2-Column Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white text-xs divide-y divide-gray-200 shadow-xs">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 sm:grid-cols-12 py-2.5 px-4 transition-colors ${
              idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'
            }`}
          >
            <span className="sm:col-span-4 font-semibold text-gray-600">{item.label}</span>
            <span className="sm:col-span-8 text-gray-900 font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Handcrafted Note */}
      <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 flex gap-2.5 text-xs text-amber-900 mt-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950">Handloom Note</p>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            Every saree is handwoven by traditional artisan families on wooden pit looms. Minor variations in texture and yarn are natural characteristics of authentic handwoven textiles.
          </p>
        </div>
      </div>
    </div>
  );
};
