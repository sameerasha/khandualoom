import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setStatus('loading');
    // Simulated subscription with friendly notification
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 700);
  };

  return (
    <section className="py-16 sm:py-20 text-brand-ivory relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F0617]/95 via-[#0A0212]/95 to-[#090210] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-b from-[#19082B] via-[#120420] to-[#0D0216] border border-brand-gold/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle background motif */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-purple/20 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Khadua Looms Dispatch</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stay Connected with Our Weaves
          </h2>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-brand-ivory/80 max-w-xl mx-auto font-light leading-relaxed">
            Discover new collections, timeless styles, and updates from Khadua Looms.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-[#1F0A36]/80 p-1.5 rounded-2xl border border-brand-gold/35 focus-within:border-brand-gold shadow-lg">
              <div className="flex items-center gap-2 pl-3 flex-1">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="w-full bg-transparent border-none text-xs text-brand-ivory placeholder-brand-ivory/50 focus:outline-none py-2"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs text-rose-400 flex items-center justify-center gap-1.5 font-sans"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-sans"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! You are now subscribed to Khadua Looms updates.</span>
              </motion.div>
            )}

            <p className="mt-4 text-[10.5px] text-brand-ivory/50 font-mono">
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
