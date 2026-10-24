import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  UserPlus,
  Sparkles,
  Key,
  Mail,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Crown,
} from 'lucide-react';

export interface AdminUserItem {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  createdDate?: string;
}

interface AdminManagerViewProps {
  admins: AdminUserItem[];
  onCreateAdmin: (data: { email: string; password?: string; firstName?: string; lastName?: string; role?: string }) => Promise<void>;
}

export const AdminManagerView: React.FC<AdminManagerViewProps> = ({ admins, onCreateAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'>('ROLE_ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Admin@123456');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSecureKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let res = 'Vastra@';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onCreateAdmin({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('Admin@123456');
      setShowModal(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create administrator account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-manager">
      <div className="user-manager__header">
        <div>
          <h1 className="user-manager__title flex items-center gap-3">
            Super Admin Command
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold font-normal">
              {admins.length} ACTIVE GOVERNORS
            </span>
          </h1>
          <p className="user-manager__subtitle">
            Manage high-privilege atelier administrators, vault access controls, and role delegations.
          </p>
        </div>
        <button
          onClick={() => {
            setError('');
            setShowModal(true);
          }}
          className="admin-dashboard__add-btn group"
        >
          <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Add Administrator</span>
        </button>
      </div>

      <div className="user-manager__table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Email</th>
              <th>Security Tier</th>
              <th>Authorization Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((a) => {
                const isSuper = a.role === 'ROLE_SUPER_ADMIN';
                return (
                  <tr key={a.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isSuper
                            ? 'bg-gradient-to-tr from-brand-gold to-amber-200 text-brand-purple-dark shadow-sm'
                            : 'bg-brand-gold/15 border border-brand-gold/30 text-brand-gold'
                        }`}>
                          {isSuper ? <Crown className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white font-serif">
                            {a.firstName || a.lastName ? `${a.firstName || ''} ${a.lastName || ''}`.trim() : 'Atelier Admin'}
                          </div>
                          <span className="text-[10px] text-brand-ivory/50 font-mono">ID: #{a.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-brand-ivory/90 font-mono text-xs">{a.email}</span>
                    </td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border inline-flex items-center gap-1.5 ${
                        isSuper
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                      }`}>
                        {isSuper && <Crown className="w-3 h-3 text-amber-300" />}
                        {a.role}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        JWKS Active
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-brand-ivory/60 font-mono">
                        {a.createdDate
                          ? new Date(a.createdDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Permanent'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No extra administrators registered in this atelier cluster.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Add Admin Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setShowModal(false)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-full max-w-lg bg-gradient-to-b from-[#1C0C30] via-[#120622] to-[#0A0214] border border-brand-gold/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_45px_rgba(223,191,122,0.18)] z-10 text-brand-ivory my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-brand-gold/25">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-gold/30 to-brand-gold/10 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-inner">
                  <UserPlus className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                      IMPERIAL VAULT PROTOCOL
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Commission Administrator
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-5">
              {error && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <span className="text-red-400 font-bold">Error:</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Administrative Security Role Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/80 mb-2">
                  Assign Administrative Tier *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('ROLE_ADMIN')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'ROLE_ADMIN'
                        ? 'bg-gradient-to-br from-brand-gold/25 to-brand-gold/5 border-brand-gold shadow-[0_0_20px_rgba(223,191,122,0.15)] ring-1 ring-brand-gold/50'
                        : 'bg-black/30 border-white/10 hover:border-brand-gold/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-brand-gold" />
                        Atelier Admin
                      </span>
                      {role === 'ROLE_ADMIN' && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                    </div>
                    <p className="text-[10px] text-brand-ivory/60 leading-relaxed font-sans">
                      Catalog weaves, inventory updates, order dispatch & customer concierge.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ROLE_SUPER_ADMIN')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'ROLE_SUPER_ADMIN'
                        ? 'bg-gradient-to-br from-amber-400/25 to-amber-400/5 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.18)] ring-1 ring-amber-400/50'
                        : 'bg-black/30 border-white/10 hover:border-amber-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-sm text-amber-200 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-300" />
                        Super Admin
                      </span>
                      {role === 'ROLE_SUPER_ADMIN' && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <p className="text-[10px] text-brand-ivory/60 leading-relaxed font-sans">
                      Unrestricted master vault, financial telemetry, settings & governor controls.
                    </p>
                  </button>
                </div>
              </div>

              {/* Name Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-brand-gold/40 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Vikram"
                      className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Singhania"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-1.5">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-gold/40 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="governor@vastraloom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Temporary Access Key with Generator and Copy button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-brand-ivory/70 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Temporary Access Key *</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={generateSecureKey}
                      className="text-[10px] font-mono uppercase text-brand-gold-light hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-brand-gold/20 transition-colors"
                      title="Generate High Entropy Key"
                    >
                      <RefreshCw className="w-3 h-3 text-brand-gold" />
                      <span>Randomize</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="text-[10px] font-mono uppercase text-brand-gold-light hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-brand-gold/20 transition-colors"
                      title="Copy Key to Clipboard"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-brand-gold" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-brand-ivory/50 hover:text-brand-gold transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-brand-ivory/50 font-mono mt-1">
                  The administrator will use their email and this password to authenticate at the Atelier Vault.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-mono uppercase tracking-wider text-brand-ivory hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-serif font-bold text-sm shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-brand-purple-dark" />
                  <span>{isSubmitting ? 'Commissioning...' : 'Commission Governor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
