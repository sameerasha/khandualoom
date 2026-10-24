import React, { useState } from 'react';

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
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#140a20] border border-brand-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-brand-ivory"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <h3 className="font-serif text-xl font-bold text-white">Add Administrator</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-brand-ivory/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              {error && <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-brand-ivory/60 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-brand-ivory/60 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-ivory/60 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@vastraloom.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-ivory/60 mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131628] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-gold/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/5 text-xs text-brand-ivory rounded-lg hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-gold text-brand-purple-dark font-bold text-xs rounded-lg hover:bg-brand-gold-light"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
