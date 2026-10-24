import React, { useState } from 'react';
import { createPortal } from 'react-dom';

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
  onCreateAdmin: (data: { email: string; password?: string; firstName?: string; lastName?: string }) => Promise<void>;
}

export const AdminManagerView: React.FC<AdminManagerViewProps> = ({ admins, onCreateAdmin }) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Admin@123456');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onCreateAdmin({ email: email.trim(), password, firstName: firstName.trim(), lastName: lastName.trim() });
      setEmail('');
      setFirstName('');
      setLastName('');
      setShowModal(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create administrator account.');
    }
  };

  return (
    <div className="user-manager">
      <div className="user-manager__header">
        <div>
          <h1 className="user-manager__title">Super Admin Command</h1>
          <p className="user-manager__subtitle">
            Manage high-privilege atelier administrators and access controls.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="admin-dashboard__add-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Administrator
        </button>
      </div>

      <div className="user-manager__table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Email</th>
              <th>Security Role</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="font-semibold text-white">
                      {a.firstName || a.lastName ? `${a.firstName || ''} ${a.lastName || ''}`.trim() : 'Atelier Admin'}
                    </div>
                  </td>
                  <td>
                    <span className="text-brand-ivory/90 font-mono text-xs">{a.email}</span>
                  </td>
                  <td>
                    <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                      {a.role}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-brand-ivory/60">
                      {a.createdDate
                        ? new Date(a.createdDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No extra administrators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setShowModal(false)}
          data-lenis-prevent="true"
        >
          <div
            className="relative w-full max-w-md bg-gradient-to-b from-[#1A0B2C] via-[#120622] to-[#0A0314] border border-brand-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_40px_rgba(223,191,122,0.12)] z-10 text-brand-ivory my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-5 border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                  🛡
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">
                    SUPER ADMIN PROTOCOL
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Add Administrator
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-brand-ivory/60 hover:text-white flex items-center justify-center transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-5">
              {error && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Yash"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Verma"
                    className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@vastraloom.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-ivory/70 mb-2">
                  Temporary Access Key *
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0E0518] border border-brand-gold/25 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                />
              </div>

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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold text-brand-purple-dark font-serif font-bold text-sm shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Admin
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
