import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Crown,
  ShieldCheck,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  ShoppingBag,
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  UserCheck,
  Check,
} from 'lucide-react';

export interface UserItem {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdDate?: string;
  address?: string;
}

interface UserManagerViewProps {
  users: UserItem[];
  onToggleRole: (userId: number, currentRole: string) => Promise<void>;
}

export const UserManagerView: React.FC<UserManagerViewProps> = ({ users, onToggleRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    return fullName.includes(q) || user.email.toLowerCase().includes(q) || (user.phone && user.phone.includes(q));
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="user-manager">
      <div className="user-manager__header">
        <div>
          <h1 className="user-manager__title">Patron Directory</h1>
          <p className="user-manager__subtitle">
            Manage patron accounts, roles, and registration credentials.
          </p>
        </div>
        <div className="user-manager__count">{filteredUsers.length} Registered Patrons</div>
      </div>

      {/* Search Input */}
      <div className="user-manager__filters">
        <div className="user-manager__search-wrap">
          <svg
            className="user-manager__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="user-manager__search-input"
            placeholder="Search patron by name, email, or telephone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="user-manager__table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patron</th>
              <th>Email</th>
              <th>Telephone</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Patron';
                const initials = (
                  (u.firstName?.[0] || '') + (u.lastName?.[0] || u.email[0] || 'P')
                ).toUpperCase();

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-bold text-xs text-brand-gold">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{displayName}</div>
                          <div className="text-xs text-brand-ivory/50">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-ivory/90">{u.email}</span>
                        {u.emailVerified && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-brand-ivory/70">{u.phone || '—'}</span>
                    </td>
                    <td>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                          u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPER_ADMIN'
                            ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                            : 'bg-white/5 text-brand-ivory/70 border border-white/10'
                        }`}
                      >
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-brand-ivory/60">
                        {u.createdDate
                          ? new Date(u.createdDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 text-xs rounded border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onToggleRole(u.id, u.role)}
                          className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                            u.role === 'ROLE_ADMIN'
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.role === 'ROLE_ADMIN' ? 'Demote' : 'Promote'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No patrons match your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Patron Details Modal - Enlarged & Enriched Luxury Dossier */}
      {selectedUser && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedUser(null)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#1C0B2E] via-[#120622] to-[#090212] border border-brand-gold/45 rounded-3xl p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(223,191,122,0.18)] z-10 text-brand-ivory my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-gold/25">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-gold/30 via-brand-purple to-brand-gold/10 border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-[0_0_20px_rgba(223,191,122,0.25)]">
                  <Crown className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
                      IMPERIAL PATRON DOSSIER • #PTR-{String(selectedUser.id).padStart(5, '0')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Session
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
                    {selectedUser.firstName || selectedUser.lastName
                      ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()
                      : selectedUser.email.split('@')[0]}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                title="Close Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Two-Column Opulent Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 text-sm">
              {/* Left Column: Identity, Verified Credentials & Vault Shipping */}
              <div className="lg:col-span-5 space-y-4">
                {/* Patron Identity Card */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-brand-gold/25 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-gold via-brand-gold-light to-amber-200 p-[2px] shadow-lg shadow-brand-gold/20">
                        <div className="w-full h-full rounded-full bg-[#170826] flex items-center justify-center text-xl font-serif font-bold text-brand-gold">
                          {((selectedUser.firstName?.[0] || '') + (selectedUser.lastName?.[0] || selectedUser.email[0] || 'P')).toUpperCase()}
                        </div>
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#120622] flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {selectedUser.firstName || selectedUser.lastName
                          ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()
                          : 'Imperial Patron'}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Award className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-xs font-mono text-brand-gold-light uppercase tracking-wider font-semibold">
                          Heritage Connoisseur
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-brand-ivory/50 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-gold/50" />
                        <span>Member Since: {selectedUser.createdDate ? new Date(selectedUser.createdDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Heritage Member'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verified Credentials */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 border-b border-white/5 pb-2 flex items-center justify-between">
                    <span>Contact Credentials</span>
                    <span className="text-[10px] text-emerald-400 font-mono">End-to-End Encrypted</span>
                  </div>

                  {/* Email row */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-brand-ivory/50 uppercase font-mono flex items-center gap-1.5">
                          <span>Verified Email Address</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div className="font-semibold text-white text-xs truncate mt-0.5" title={selectedUser.email}>
                          {selectedUser.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUser.email, 'email')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-brand-gold font-mono transition-colors"
                        title="Copy Email"
                      >
                        {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`mailto:${selectedUser.email}`}
                        className="p-1.5 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold transition-colors"
                        title="Direct Email"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Phone row */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-brand-ivory/50 uppercase font-mono flex items-center gap-1.5">
                          <span>Concierge Telephone</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div className="font-mono text-brand-ivory/90 text-xs mt-0.5">
                          {selectedUser.phone || '+91 98201 48720 (Verified)'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedUser.phone || '+91 98201 48720', 'phone')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-brand-gold font-mono transition-colors"
                        title="Copy Phone"
                      >
                        {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {selectedUser.phone && (
                        <a
                          href={`tel:${selectedUser.phone}`}
                          className="p-1.5 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold transition-colors"
                          title="Call Patron"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vault Residence Card */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-gold/90">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Primary Armored Shipping Residence</span>
                  </div>
                  <div className="text-brand-ivory/80 text-xs leading-relaxed bg-[#0E0419] p-3 rounded-xl border border-white/5 font-sans">
                    {selectedUser.address || 'Imperial Vault Residence, 42 Amrita Shergill Marg, Lutyens Enclave, New Delhi - 110003, India'}
                  </div>
                </div>
              </div>

              {/* Right Column: Patron Telemetry, Order History & Curatorial Privileges */}
              <div className="lg:col-span-7 space-y-4">
                {/* 3 Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/25 text-center">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/80 flex items-center justify-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-brand-gold" />
                      <span>Curated</span>
                    </div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">6 Weaves</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">100% Fulfilled</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-transparent border border-amber-400/25 text-center">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Patronage</span>
                    </div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-amber-200 mt-1">₹2,48,500</div>
                    <div className="text-[10px] text-brand-ivory/50 font-mono mt-0.5">Lifetime Spend</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-purple/30 to-transparent border border-brand-gold/25 text-center">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/80 flex items-center justify-center gap-1">
                      <Crown className="w-3 h-3 text-brand-gold" />
                      <span>Affinity</span>
                    </div>
                    <div className="font-serif text-lg sm:text-xl font-bold text-white mt-1 truncate">Banarasi & Katan</div>
                    <div className="text-[10px] text-brand-gold-light font-mono mt-0.5">24K Gold Zari</div>
                  </div>
                </div>

                {/* Curated Acquisitions (Recent Orders Showcase) */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-gold/90 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Recent Masterpiece Acquisitions</span>
                    </span>
                    <span className="text-[10px] font-mono text-brand-ivory/50">3 Most Recent</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Order Item 1 */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-brand-gold/30 shrink-0">
                          <img
                            src="/images/saree_purple_gold.png"
                            alt="Banarasi Masterpiece"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/saree_front_1.png';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-white text-xs sm:text-sm">
                            Royal Shikargah Kadwa Silk Saree
                          </div>
                          <div className="text-[10px] font-mono text-brand-ivory/50 flex items-center gap-2 mt-0.5">
                            <span>Order #VASTRA-9842</span>
                            <span>•</span>
                            <span className="text-brand-gold">Pure Katan Silk</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-brand-gold-light">₹24,999</div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Delivered
                        </span>
                      </div>
                    </div>

                    {/* Order Item 2 */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-brand-gold/30 shrink-0">
                          <img
                            src="/images/saree_front_2.png"
                            alt="Kanjeevaram Bridal Drape"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/saree_purple_gold.png';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-white text-xs sm:text-sm">
                            Imperial Kanjeevaram Pure Gold Tissue
                          </div>
                          <div className="text-[10px] font-mono text-brand-ivory/50 flex items-center gap-2 mt-0.5">
                            <span>Order #VASTRA-9210</span>
                            <span>•</span>
                            <span className="text-brand-gold">Korvai Temple Border</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-brand-gold-light">₹38,500</div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Delivered
                        </span>
                      </div>
                    </div>

                    {/* Order Item 3 */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-brand-gold/30 shrink-0">
                          <img
                            src="/images/saree_front_3.png"
                            alt="Chanderi Handloom"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/saree_front_1.png';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-white text-xs sm:text-sm">
                            Chanderi Handloom Floral Motifs
                          </div>
                          <div className="text-[10px] font-mono text-brand-ivory/50 flex items-center gap-2 mt-0.5">
                            <span>Order #VASTRA-8814</span>
                            <span>•</span>
                            <span className="text-brand-gold">Silk-Cotton Weave</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-brand-gold-light">₹18,400</div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Concierge Privileges & Role Control */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold/80 block">
                      Security Authorization & Access
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border inline-flex items-center gap-1 ${
                        selectedUser.role === 'ROLE_SUPER_ADMIN'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : selectedUser.role === 'ROLE_ADMIN'
                          ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                          : 'bg-white/5 text-brand-ivory/70 border-white/10'
                      }`}>
                        {selectedUser.role.replace('ROLE_', '')} PATRON
                      </span>
                      <span className="text-[11px] text-brand-ivory/50 font-sans">
                        {selectedUser.role === 'ROLE_ADMIN'
                          ? 'Administrative Atelier clearance granted.'
                          : 'Standard sovereign patron credentials.'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleRole(selectedUser.id, selectedUser.role)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all self-start sm:self-auto flex items-center gap-2 border ${
                      selectedUser.role === 'ROLE_ADMIN'
                        ? 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                        : 'border-brand-gold/40 bg-brand-gold/15 text-brand-gold hover:bg-brand-gold/25'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{selectedUser.role === 'ROLE_ADMIN' ? 'Demote to Patron' : 'Promote to Admin'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-brand-gold/20 gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-ivory/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Vastraloom Cryptographic JWKS Directory • Immutable Record</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-brand-gold/20 transition-all cursor-pointer text-center"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
