import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { setSelectedCategory, setSearchQuery } from '@/features/products/productsSlice';

interface CollectionItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  tag: string;
}

const collections: CollectionItem[] = [
  {
    id: 'khandua-silk',
    name: 'Khandua Silk Sarees',
    category: 'Khadua Silk',
    description: 'Traditional Nuapatna tie-dye silk sarees woven with sacred Gita Govinda verses and rich zari borders.',
    image: '/images/products/p3/front.jpg',
    tag: 'Temple Weave',
  },
  {
    id: 'sambalpuri-ikat',
    name: 'Sambalpuri Ikat Sarees',
    category: 'Sambalpuri Ikat',
    description: 'Traditional tie-dye Bandha sarees from Western Odisha with shankha, chakra, and floral patterns.',
    image: '/images/products/p2/front.jpg',
    tag: 'Bandha Art',
  },
  {
    id: 'bomkai-sarees',
    name: 'Bomkai Sarees',
    category: 'Bomkai',
    description: 'Celebrated Subarnapur extra-weft sarees with traditional jhabba pallu and nature-inspired motifs.',
    image: '/images/products/p4/front.jpg',
    tag: 'Traditional Weave',
  },
  {
    id: 'wedding-bridal',
    name: 'Wedding & Bridal Sarees',
    category: 'Wedding & Bridal',
    description: 'Heavy silk sarees with needle-interlocked Phoda Kumbha temple borders for weddings and grand celebrations.',
    image: '/images/products/p5/front.jpg',
    tag: 'Bridal Sarees',
  },
  {
    id: 'festive-collection',
    name: 'Festive Collection',
    category: 'Festive Collection',
    description: 'Comfortable mulberry silk and Bapta sarees with vibrant festive colors for special occasions and pujas.',
    image: '/images/products/p11/front.jpg',
    tag: 'Festive Sarees',
  },
  {
    id: 'traditional-handlooms',
    name: 'Traditional Odisha Handlooms',
    category: 'Traditional Odisha Handlooms',
    description: 'Authentic Kotpad organic dyed sarees, Padua cottons, and Berhampuri temple silk sarees.',
    image: '/images/products/p1/front.jpg',
    tag: 'Handloom Cotton',
  },
];

export const ShopByCollection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectCollection = (category: string) => {
    dispatch(setSearchQuery(''));
    dispatch(setSelectedCategory(category));
    navigate(`/collections/${encodeURIComponent(category)}`);
  };

  return (
    <section id="collections-section" className="py-16 sm:py-20 text-brand-ivory relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0F0617]/85 to-[#0F0617]/95 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Made by Skilled Weavers</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ivory leading-tight">
              Our Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-ivory/70 max-w-md font-light leading-relaxed">
            Shop authentic handwoven sarees made by skilled weavers across Odisha's historic weaving towns.
          </p>
        </div>

        {/* 6 Collection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((item, idx) => (
            <motion.div
              key={item.id}
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelectCollection(item.category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectCollection(item.category);
                }
              }}
              className="group relative rounded-3xl overflow-hidden border border-brand-gold/25 bg-gradient-to-b from-[#180828] to-[#0D0216] shadow-xl hover:border-brand-gold/70 hover:shadow-[0_15px_40px_rgba(197,160,89,0.22)] transition-all duration-500 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {/* Card Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0216] via-transparent to-black/30" />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-brand-gold-light px-3 py-1 rounded-full border border-brand-gold/30">
                    {item.tag}
                  </span>
                </div>

                {/* Arrow Action on Hover */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-gold text-brand-purple-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-ivory group-hover:text-brand-gold transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-brand-ivory/70 line-clamp-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs font-semibold text-brand-gold group-hover:text-brand-gold-light">
                  <span className="uppercase tracking-wider font-mono text-[11px]">View Products</span>
                  <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
