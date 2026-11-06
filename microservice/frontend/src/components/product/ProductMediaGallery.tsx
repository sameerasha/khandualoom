import React, { useState } from 'react';
import { Product } from '@/types';
import { SilkSheenCanvas } from './SilkSheenCanvas';
import { Eye, Layers } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';

interface ProductMediaGalleryProps {
  product: Product;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ product }) => {
  const [show3d, setShow3d] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);
  const features = useAppSelector((state) => state.features.features);

  // Collect all available image URLs
  const imageList = [
    product.image,
    ...(product.images || []).map((img) => (typeof img === 'string' ? img : img.imageUrl)),
  ].filter((url, idx, self) => url && self.indexOf(url) === idx);

  const canShow3d = features.threeDSheenCanvas && show3d;

  return (
    <div className="space-y-4">
      {/* 3D vs 2D Photo Toggle */}
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs text-brand-ivory/60 font-medium">
          {imageList.length} Masterwork Photographs
        </span>
        {features.threeDSheenCanvas && (
          <button
            type="button"
            onClick={() => setShow3d(!show3d)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              show3d
                ? 'bg-brand-gold text-brand-purple-dark shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                : 'bg-[#1D0B33] text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/15'
            }`}
          >
            {show3d ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Gallery</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive 3D Sheen</span>
              </>
            )}
          </button>
        )}
      </div>

      {canShow3d ? (
        <SilkSheenCanvas color="#9B111E" />
      ) : (
        <div className="space-y-4">
          {/* Main Large Display with subtle zoom */}
          <div className="relative aspect-[3/4] max-h-[580px] w-full rounded-2xl overflow-hidden bg-[#12051E] border border-brand-gold/20 shadow-xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            />
          </div>

          {/* Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {imageList.map((imgUrl, i) => (
                <button
                  key={`thumb-${i}`}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === imgUrl
                      ? 'border-brand-gold shadow-[0_0_10px_rgba(197,160,89,0.4)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
