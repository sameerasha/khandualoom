import React, { useState } from 'react';

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

      {/* Patron Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#140a20] border border-brand-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-brand-ivory"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <h3 className="font-serif text-xl font-bold text-white">Patron Dossier</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full text-brand-ivory/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-bold text-lg text-brand-gold">
                  {((selectedUser.firstName?.[0] || '') + (selectedUser.lastName?.[0] || 'P')).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <span className="text-xs font-mono text-brand-gold uppercase">{selectedUser.role}</span>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-brand-ivory/50 uppercase font-mono">Email Address</div>
                    <div className="font-semibold text-white">{selectedUser.email}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedUser.email, 'email')}
                    className="text-xs text-brand-gold hover:underline font-mono"
                  >
                    {copiedField === 'email' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-brand-ivory/50 uppercase font-mono">Telephone</div>
                    <div className="text-brand-ivory/90">{selectedUser.phone || 'Unlisted'}</div>
                  </div>
                  {selectedUser.phone && (
                    <button
                      onClick={() => handleCopy(selectedUser.phone!, 'phone')}
                      className="text-xs text-brand-gold hover:underline font-mono"
                    >
                      {copiedField === 'phone' ? '✓ Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                <div>
                  <div className="text-xs text-brand-ivory/50 uppercase font-mono">Atelier Shipping Vault</div>
                  <div className="text-brand-ivory/80 text-xs mt-1 leading-relaxed">
                    {selectedUser.address || 'Imperial Vault Residence, India'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
