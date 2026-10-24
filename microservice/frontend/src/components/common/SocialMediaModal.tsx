import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Facebook, Youtube, Share2, MessageCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface SocialMediaItem {
  id: number;
  platform: string;
  url: string;
}

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultSocials: SocialMediaItem[] = [
  { id: 1, platform: 'instagram', url: 'https://instagram.com/khadualooms' },
  { id: 2, platform: 'whatsapp', url: 'https://wa.me/916742918844' },
  { id: 3, platform: 'facebook', url: 'https://facebook.com/khadualooms' },
  { id: 4, platform: 'youtube', url: 'https://youtube.com/@khadualooms' },
];

export const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ isOpen, onClose }) => {
  const [socials, setSocials] = useState<SocialMediaItem[]>(defaultSocials);

  useEffect(() => {
    if (isOpen) {
      axios.get<SocialMediaItem[]>('/api/social-media')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setSocials(res.data);
          }
        })
        .catch(() => {
          // Keep defaults
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-400" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Share2 className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#160B24] border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-brand-ivory"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
            <div>
              <h3 className="font-serif text-xl font-bold text-brand-ivory">
                The Khadua Looms Community
              </h3>
              <p className="text-xs text-brand-ivory/60 mt-0.5">
                Immerse in Odisha weaver stories, lookbooks & heritage drapes
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-brand-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Social Links List */}
          <div className="mt-6 space-y-3">
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-brand-purple-dark/60 border border-brand-gold/15 hover:border-brand-gold/40 hover:bg-brand-purple-dark transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white capitalize">
                      {item.platform}
                    </h4>
                    <span className="text-[11px] text-brand-ivory/50 font-mono">
                      @khadualooms official
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-brand-ivory/40 group-hover:text-brand-gold transition-colors" />
              </a>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-brand-gold/15 text-center">
            <p className="text-[11px] text-brand-ivory/60 font-light italic">
              Tag #KhaduaLooms on social channels to share your handloom story.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
