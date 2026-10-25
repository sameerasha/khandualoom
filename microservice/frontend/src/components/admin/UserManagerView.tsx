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
  Search,
  Eye,
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
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const matchesSearch =
      q === '' ||
      fullName.includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.phone && user.phone.includes(q)) ||
      String(user.id).includes(q);

    const matchesRole =
      roleFilter === 'ALL'
        ? true
        : roleFilter === 'ADMINS'
        ? user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN'
        : user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const patronsCount = users.filter((u) => u.role === 'ROLE_USER').length;
  const adminsCount = users.filter((u) => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPER_ADMIN').length;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="user-manager space-y-6 pb-12 animate-fadeIn">
      {/* Header with Title and Live Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C0C30] via-[#120622] to-[#0A0214] border border-brand-gold/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold px-2.5 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/40">
                PATRON DIRECTORY & CONCIERGE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Patron & Collector Registry
            </h1>
            <p className="text-xs sm:text-sm text-brand-ivory/60 mt-1 font-sans">
              Manage client credentials, concierge access, verified communications, and administrative roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-brand-gold/30 backdrop-blur-md">
              <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">Total Patrons</span>
              <span className="font-mono text-lg font-bold text-brand-gold-light">{users.length} Registered</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-emerald-500/30 backdrop-blur-md">
              <span className="text-[10px] text-brand-ivory/50 font-mono uppercase block">Sovereign Tier</span>
              <span className="font-mono text-lg font-bold text-emerald-400">{patronsCount} Collectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search & Filter Command Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#120622]/90 border border-brand-gold/25 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patron by name, email, telephone, or Patron ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0214] border border-brand-gold/30 focus:border-brand-gold rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-brand-ivory/40 focus:outline-none transition-colors shadow-inner font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-brand-ivory/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Accounts', count: users.length },
              { id: 'ROLE_USER', label: 'Patrons Only', count: patronsCount },
              { id: 'ADMINS', label: 'Administrators', count: adminsCount },
            ].map((tab) => {
              const active = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                    active
                      ? 'bg-brand-gold text-brand-purple-dark font-bold border-brand-gold shadow-md shadow-brand-gold/20'
                      : 'bg-black/30 border-white/10 text-brand-ivory/70 hover:border-brand-gold/30 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-brand-purple-dark/20 text-brand-purple-dark' : 'bg-white/10 text-brand-gold'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Filter Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-brand-ivory/50 pt-2 border-t border-white/5">
          <div>
            Showing <span className="text-brand-gold font-bold">{filteredUsers.length}</span> of {users.length} accounts
          </div>
          {searchQuery && (
            <span className="text-emerald-400">Filtered by query: "{searchQuery}"</span>
          )}
        </div>
      </div>

      {/* Desktop View: Full-Featured Administrative Table */}
      <div className="hidden md:block rounded-2xl border border-brand-gold/25 bg-[#0D0317]/95 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-gold/20 bg-white/[0.02] text-xs font-mono uppercase tracking-wider text-brand-gold/90">
              <th className="py-4 px-5">Patron / Collector</th>
              <th className="py-4 px-5">Email Address</th>
              <th className="py-4 px-5">Telephone</th>
              <th className="py-4 px-5">Authorization Role</th>
              <th className="py-4 px-5">Registered Date</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Patron';
                const initials = (
                  (u.firstName?.[0] || '') + (u.lastName?.[0] || u.email[0] || 'P')
                ).toUpperCase();
                const isAdmin = u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPER_ADMIN';

                return (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md border ${
                          isAdmin
                            ? 'bg-gradient-to-tr from-brand-gold to-amber-200 text-brand-purple-dark border-brand-gold'
                            : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                        }`}>
                          {isAdmin ? <Crown className="w-4 h-4" /> : initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white font-serif">{displayName}</div>
                          <div className="text-[11px] text-brand-ivory/50 font-mono">ID: #PTR-{String(u.id).padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-ivory/90 font-sans text-xs">{u.email}</span>
                        {u.emailVerified && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="text-brand-ivory/70 font-mono text-xs">{u.phone || '—'}</span>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold inline-flex items-center gap-1 border ${
                          u.role === 'ROLE_SUPER_ADMIN'
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : u.role === 'ROLE_ADMIN'
                            ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                            : 'bg-white/5 text-brand-ivory/70 border-white/10'
                        }`}
                      >
                        {isAdmin && <ShieldCheck className="w-3 h-3 text-brand-gold" />}
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="text-xs text-brand-ivory/60 font-mono">
                        {u.createdDate
                          ? new Date(u.createdDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Permanent'}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1.5 text-xs font-mono rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="View Patron Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleRole(u.id, u.role)}
                          className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                            u.role === 'ROLE_ADMIN'
                              ? 'border-red-500/30 text-red-300 hover:bg-red-500/15'
                              : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15'
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
                <td colSpan={6} className="text-center py-12 text-brand-ivory/50 font-sans">
                  No patrons match your search filter "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet View: Device-Friendly Patron Cards */}
      <div className="md:hidden space-y-3.5">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => {
            const displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Patron';
            const initials = (
              (u.firstName?.[0] || '') + (u.lastName?.[0] || u.email[0] || 'P')
            ).toUpperCase();
            const isAdmin = u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPER_ADMIN';

            return (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-[#120622]/95 border border-brand-gold/25 shadow-lg space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md border ${
                      isAdmin
                        ? 'bg-gradient-to-tr from-brand-gold to-amber-200 text-brand-purple-dark border-brand-gold'
                        : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                    }`}>
                      {isAdmin ? <Crown className="w-5 h-5" /> : initials}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-base leading-tight">{displayName}</h3>
                      <span className="text-[11px] font-mono text-brand-ivory/50">ID: #PTR-{String(u.id).padStart(4, '0')}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border inline-flex items-center gap-1 ${
                      u.role === 'ROLE_SUPER_ADMIN'
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : u.role === 'ROLE_ADMIN'
                        ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                        : 'bg-white/5 text-brand-ivory/70 border-white/10'
                    }`}
                  >
                    {u.role.replace('ROLE_', '')}
                  </span>
                </div>

                {/* Contact info list */}
                <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-brand-ivory/80">
                    <span className="text-brand-ivory/50 font-mono text-[10px] uppercase">Email</span>
                    <span className="truncate max-w-[200px] text-white font-medium">{u.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-ivory/80">
                    <span className="text-brand-ivory/50 font-mono text-[10px] uppercase">Phone</span>
                    <span className="font-mono text-brand-gold-light">{u.phone || 'Unlisted'}</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-ivory/80">
                    <span className="text-brand-ivory/50 font-mono text-[10px] uppercase">Enrolled</span>
                    <span className="font-mono text-brand-ivory/60">
                      {u.createdDate ? new Date(u.createdDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(u)}
                    className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-purple-dark font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-brand-gold/20 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleRole(u.id, u.role)}
                    className={`w-full py-2.5 rounded-xl border font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      u.role === 'ROLE_ADMIN'
                        ? 'border-red-500/40 bg-red-500/10 text-red-300'
                        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{u.role === 'ROLE_ADMIN' ? 'Demote' : 'Promote'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-brand-ivory/50 bg-[#120622] rounded-2xl border border-white/5">
            No patrons found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Patron Details Modal - Enlarged & Enriched Luxury Dossier */}
      {selectedUser && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedUser(null)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-[96vw] max-w-6xl xl:max-w-7xl bg-gradient-to-b from-[#1C0B2E] via-[#120622] to-[#090212] border border-brand-gold/45 rounded-3xl p-6 sm:p-9 shadow-[0_25px_95px_rgba(0,0,0,0.92),0_0_60px_rgba(223,191,122,0.22)] z-10 text-brand-ivory my-auto max-h-[92vh] overflow-y-auto"
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
                            <span>Order #KHANDUA-9842</span>
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
                            <span>Order #KHANDUA-9210</span>
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
                            <span>Order #KHANDUA-8814</span>
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
                <span>Khandua Looms Cryptographic JWKS Directory • Immutable Record</span>
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
