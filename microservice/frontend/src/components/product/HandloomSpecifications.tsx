import React from 'react';
import { Product } from '@/types';
import { Check, Shield, Info } from 'lucide-react';

interface HandloomSpecificationsProps {
  product: Product;
}

export const HandloomSpecifications: React.FC<HandloomSpecificationsProps> = ({ product }) => {
  return (
    <div className="py-6 space-y-4">
      <h3 className="font-serif text-lg text-brand-gold font-semibold flex items-center gap-2">
        <Shield className="w-5 h-5 text-brand-gold" />
        <span>Authentic Craft Specifications</span>
      </h3>

      <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-brand-ivory/80">
        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Saree Length</span>
          <span className="font-semibold text-brand-ivory">
            {product.sareeLength || '5.5 Meters (Full Drape)'}
          </span>
        </div>

        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Blouse Piece</span>
          <span className="font-semibold text-brand-ivory">
            {product.blouseIncluded !== false ? '0.8m Included (Unstitched)' : 'Not Included'}
          </span>
        </div>

        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Fabric Purity</span>
          <span className="font-semibold text-brand-ivory">
            {product.fabric || 'Pure Mulberry Silk (4-Ply)'}
          </span>
        </div>

        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Weave Technique</span>
          <span className="font-semibold text-brand-ivory">
            {product.weaveType || product.weave || 'Traditional Handloom Ikat'}
          </span>
        </div>

        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Artisan Weaving Cluster</span>
          <span className="font-semibold text-brand-ivory">
            {product.artisanSociety || 'Nuapatna Master Weavers Cooperative'}
          </span>
        </div>

        <div>
          <span className="text-brand-ivory/50 block text-[11px]">Certifications</span>
          <span className="font-semibold text-brand-gold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Silk Mark & GI Authenticated</span>
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-lg bg-[#1D0C30] border border-brand-gold/20 flex gap-3 text-xs text-brand-ivory/80 mt-4">
        <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-brand-gold-light">Handcrafted Heritage Note</p>
          <p className="text-[11px] text-brand-ivory/60 mt-0.5">
            Each saree is handwoven by artisanal families on wooden pit looms. Subtle variations in yarn texture and motifs represent the hallmark of authentic handloom. Dry clean only.
          </p>
        </div>
      </div>
    </div>
  );
};
