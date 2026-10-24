import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Clock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ContactPageProps {
  onBackToStore?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToStore }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bridal Trousseau Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fulfill all mandatory inquiry fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Bridal Trousseau Inquiry',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Unable to submit your message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0617] via-[#150B22] to-[#0A0410] text-brand-ivory py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        {onBackToStore && (
          <button
            onClick={onBackToStore}
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold-light hover:text-white transition-colors"
          >
            ← Return to Collection
          </button>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-gold/30 bg-brand-purple-dark/80 text-brand-gold-light text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Private Atelier Concierge</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-brand-ivory">
            Get in <span className="bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent italic">Touch</span>
          </h1>
          <div className="w-20 h-0.5 bg-brand-gold mx-auto mt-6 mb-4" />
          <p className="text-base text-brand-ivory/70 font-light">
            Whether bespoke bridal trousseau consultations, custom weaves, or heirloom inquiries — our textile curators are honored to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Cards & Atelier Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/20 backdrop-blur-md">
              <h3 className="font-serif font-bold text-lg text-brand-gold mb-4 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-brand-gold" />
                Varanasi Master Atelier
              </h3>
              <p className="text-sm text-brand-ivory/80 leading-relaxed font-light">
                Ghat Weaving Quarter, B-12 Heritage Looms, Chowk, Varanasi, Uttar Pradesh 221001, India
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/20 backdrop-blur-md">
              <h3 className="font-serif font-bold text-lg text-brand-gold mb-4 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-brand-gold" />
                New Delhi Experience Lounge
              </h3>
              <p className="text-sm text-brand-ivory/80 leading-relaxed font-light">
                24 Mehrauli Heritage Complex, Qutub Road, New Delhi 110030, India
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-purple-dark/40 border border-brand-gold/20 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold" />
                <div>
                  <span className="text-[11px] text-brand-ivory/60 uppercase font-mono block">Concierge Hotline</span>
                  <a href="tel:+918005559876" className="text-sm font-medium hover:text-brand-gold transition-colors">
                    +91 (800) 555-9876 / +91 (11) 4567-8901
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold" />
                <div>
                  <span className="text-[11px] text-brand-ivory/60 uppercase font-mono block">Direct Inquiries</span>
                  <a href="mailto:concierge@vastraloom.com" className="text-sm font-medium hover:text-brand-gold transition-colors">
                    concierge@vastraloom.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-gold" />
                <div>
                  <span className="text-[11px] text-brand-ivory/60 uppercase font-mono block">Atelier Hours</span>
                  <p className="text-sm font-light text-brand-ivory/80">
                    Monday – Saturday: 10:00 AM – 7:30 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-brand-purple-dark/60 border border-brand-gold/30 backdrop-blur-xl shadow-2xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Message Dispatched</h3>
                  <p className="text-sm text-brand-ivory/80 max-w-md mx-auto leading-relaxed font-light">
                    Thank you. Your message has been safely received by our senior textile curators. We will contact you within 24 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-6 py-2.5 rounded-full border border-brand-gold/40 text-brand-gold-light hover:bg-brand-gold/10 text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Radhika Sen"
                        className="w-full bg-[#1A0C28]/80 border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="radhika@example.com"
                        className="w-full bg-[#1A0C28]/80 border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#1A0C28]/80 border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                        Inquiry Topic
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-[#1A0C28] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      >
                        <option value="Bridal Trousseau Inquiry">Bridal Trousseau Consultation</option>
                        <option value="Custom Loom Weave">Bespoke Custom Weave</option>
                        <option value="Silk Mark Verification">Silk Mark / Certificate Check</option>
                        <option value="Order & Logistics Inquiry">Order & Shipment Assistance</option>
                        <option value="Other">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Please convey your requirements or questions in detail..."
                      className="w-full bg-[#1A0C28]/80 border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-purple-dark font-serif font-bold text-base hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-brand-purple-dark border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch Message to Atelier</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
