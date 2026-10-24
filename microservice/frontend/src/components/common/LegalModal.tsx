import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, RefreshCw, Trash2 } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'returns' | 'deletion';

interface LegalModalProps {
  isOpen: boolean;
  initialDoc?: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialDoc = 'privacy',
  onClose,
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);

  useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc]);

  if (!isOpen) return null;

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
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#140A1F] border border-brand-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 text-brand-ivory"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-gold/20 bg-brand-purple-dark/80">
            <h3 className="font-serif text-xl font-bold text-brand-gold">
              Legal & Atelier Policies
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-brand-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Pills */}
          <div className="flex border-b border-brand-gold/15 px-6 pt-3 gap-2 overflow-x-auto bg-[#11071B]">
            <button
              onClick={() => setActiveDoc('privacy')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeDoc === 'privacy'
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-transparent text-brand-ivory/60 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => setActiveDoc('terms')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeDoc === 'terms'
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-transparent text-brand-ivory/60 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => setActiveDoc('returns')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeDoc === 'returns'
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-transparent text-brand-ivory/60 hover:text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Shipping & Returns</span>
            </button>
            <button
              onClick={() => setActiveDoc('deletion')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                activeDoc === 'deletion'
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-transparent text-brand-ivory/60 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Data Rights</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-brand-ivory/80 leading-relaxed font-light">
            {activeDoc === 'privacy' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Privacy & Confidentiality Standard</h4>
                <p>
                  Vastra Loom respects your privacy and is devoted to safeguarding all personal information. When you create an account, purchase heirloom sarees, or consult our bespoke bridal trousseau atelier, your data is processed with enterprise-grade encryption.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">1. Personal Information Collected</h5>
                <p>
                  We collect your full name, authenticated email address, shipping addresses, telephone contact, and transaction references for payment verification. We do not store raw card numbers; payments are secured via Razorpay PCI-DSS certified gateways.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">2. Usage of Your Information</h5>
                <p>
                  Information is utilized strictly to fulfill custom handloom orders, coordinate insured high-value transit, and deliver notifications regarding your order lifecycle.
                </p>
              </div>
            )}

            {activeDoc === 'terms' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Terms of Curated Service</h4>
                <p>
                  By accessing the Vastra Loom digital atelier or completing purchases, you enter an agreement governed by the craft traditions of authentic Indian handlooms.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">1. Handloom Characteristics & Authenticity</h5>
                <p>
                  Every saree is handwoven by master artisans across Varanasi, Kanchipuram, Chanderi, or Patan. Slight irregularities in weaving tension, zari slubs, or hand-dyed color saturation are natural hall-marks of artisanal authenticity and are not defects.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">2. Silk Mark Certification</h5>
                <p>
                  All our silk sarees bear genuine Silk Mark authentication, verifying 100% natural mulberry or wild tussar silk threads.
                </p>
              </div>
            )}

            {activeDoc === 'returns' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Heirloom Shipping & Return Assurance</h4>
                <p>
                  Every piece is inspected through our zero-defect quality protocol before being secured inside a padded satin-lined luxury storage chest.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">1. Transit & Insurance</h5>
                <p>
                  We provide complimentary fully-insured express transit on all orders within India. International deliveries are tracked via DHL/FedEx priority corridors.
                </p>
                <h5 className="font-serif font-bold text-brand-gold pt-2">2. 7-Day Inspection Window</h5>
                <p>
                  If your saree does not meet your expectations, we honor a 7-day hassle-free return or exchange for items with the original Silk Mark security tag intact and unworn.
                </p>
              </div>
            )}

            {activeDoc === 'deletion' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Data Privacy & Account Removal</h4>
                <p>
                  You hold the absolute right to be forgotten. In accordance with Indian digital data protection standards and international privacy norms, you may request permanent deletion of your profile, active sessions, and saved addresses.
                </p>
                <p>
                  To request complete account purge, contact <a href="mailto:privacy@vastraloom.com" className="text-brand-gold underline">privacy@vastraloom.com</a> or use the profile management dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-brand-gold/15 bg-brand-purple-dark/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-brand-gold text-brand-purple-dark font-serif font-bold text-sm hover:brightness-110 transition-all"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
