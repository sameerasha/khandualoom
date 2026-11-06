import React, { useState, useRef } from 'react';
import { Product } from '@/types';
import { SilkSheenCanvas } from './SilkSheenCanvas';
import { Eye, Layers, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';

interface ProductMediaGalleryProps {
  product: Product;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({ product }) => {
  const [show3d, setShow3d] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const features = useAppSelector((state) => state.features.features);

  // Collect all available unique image URLs
  const imageList = [
    product.image,
    ...(product.images || []).map((img) => (typeof img === 'string' ? img : img.imageUrl)),
  ].filter((url, idx, self) => url && self.indexOf(url) === idx);

  const activeIdx = imageList.indexOf(activeImage);
  const canShow3d = features.threeDSheenCanvas && show3d;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIdx = (activeIdx - 1 + imageList.length) % imageList.length;
    setActiveImage(imageList[newIdx]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIdx = (activeIdx + 1) % imageList.length;
    setActiveImage(imageList[newIdx]);
  };

  return (
    <div className="space-y-4">
      {/* Photo count & 3D Toggle */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-gray-500 font-medium">
          {imageList.length} Photos Available
        </span>
        {features.threeDSheenCanvas && (
          <button
            type="button"
            onClick={() => setShow3d(!show3d)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              show3d
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white text-rose-900 border border-rose-300 hover:bg-rose-50'
            }`}
          >
            {show3d ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Photos</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>3D Fabric View</span>
              </>
            )}
          </button>
        )}
      </div>

      {canShow3d ? (
        <SilkSheenCanvas color="#9B111E" />
      ) : (
        <div className="space-y-3">
          {/* Main Large Display with interactive hover zoom */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsFullScreen(true)}
            className="relative aspect-[3/4] max-h-[560px] w-full rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xs cursor-zoom-in group select-none"
          >
            <img
              src={activeImage}
              alt={product.name}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZooming ? 'scale(2)' : 'scale(1)',
              }}
              className="w-full h-full object-cover object-top transition-transform duration-150 ease-out"
            />

            {/* Fullscreen Button Overlay */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullScreen(true);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:text-black shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Full-Screen Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Next / Prev Chevrons on Hover */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-black shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-black shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Zoom hint badge */}
            <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-[10px] tracking-wider uppercase font-medium pointer-events-none group-hover:hidden">
              Hover to Zoom
            </span>
          </div>

          {/* Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {imageList.map((imgUrl, i) => (
                <button
                  key={`thumb-${i}`}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                    activeImage === imgUrl
                      ? 'border-rose-900 ring-2 ring-rose-900/30 opacity-100'
                      : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                  }`}
                >
                  <img src={imgUrl} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Image Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsFullScreen(false)}
        >
          {/* Top Bar with Close */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
            <span className="text-xs text-white/70 font-mono">
              {activeIdx + 1} / {imageList.length}
            </span>
            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
            />

            {/* Prev & Next in Full Screen */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-[-50px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer hidden sm:block"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-[-50px] top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer hidden sm:block"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail list in Full Screen */}
          {imageList.length > 1 && (
            <div
              className="flex items-center gap-2 mt-4 overflow-x-auto max-w-md p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {imageList.map((url, idx) => (
                <button
                  key={`fs-thumb-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`w-12 h-16 rounded overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImage === url ? 'border-rose-400 scale-105' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
