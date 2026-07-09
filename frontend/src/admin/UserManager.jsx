import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserManager.css';

export default function UserManager() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch customer directory.');
      }
    } catch (e) {
      setError('Connection failure. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [getToken]);

  const filteredUsers = users.filter((user) => {
    if (user.role !== 'ROLE_USER') return false;
    const q = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.phone && user.phone.includes(q))
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* ─── SVG helpers ─────────────────────────────────────── */
  const PhoneIcon = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.48 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const CopyIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );

  const CheckIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const BadgeCheckIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const BadgeAlertIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  /* ─── DETAIL VIEW ──────────────────────────────────────────── */
  if (selectedUser) {
    const displayName = `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'User';
    const initials    = displayName.slice(0, 2).toUpperCase();
    const primaryAddr = selectedUser.addresses?.find(a => a.isPrimary)
                     || (selectedUser.addresses?.length ? selectedUser.addresses[0] : null);
    const otherAddrs  = selectedUser.addresses?.filter(a => a.id !== primaryAddr?.id) || [];
    const totalAddrs  = selectedUser.addresses?.length || 0;

    return (
      <div className="user-manager">

        {/* ── TOP BAR ─────────────────────────────────────── */}
        <div className="ud-topbar">
          <button
            className="ud-back-btn"
            onClick={() => { setSelectedUser(null); setShowAllAddresses(false); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Registry
          </button>
          <span className="ud-breadcrumb">Customer Directory &rsaquo; Profile</span>
        </div>

        <div className="ud-card animate-scale-in">

          {/* ── HERO BANNER ──────────────────────────────── */}
          <div className="ud-hero">
            <div className="ud-hero__bg" />
            <div className="ud-hero__content">
              <div className="ud-hero__avatar">{initials}</div>
              <div className="ud-hero__info">
                <h2 className="ud-hero__name">{displayName}</h2>
                <div className="ud-hero__meta">
                  <span className="ud-hero__id">ID #{selectedUser.id}</span>
                  <span className="ud-hero__dot" />
                  <span className="ud-hero__badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Verified Customer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTACT STRIP (email · phone · addresses) ── */}
          <div className="ud-contact-strip">
            {/* Email */}
            <div className="ud-contact-item">
              <div className="ud-contact-item__icon email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="ud-contact-item__text">
                <div className="ud-contact-item__label">
                  Email Address
                  {selectedUser.emailVerified ? (
                    <span className="verified-badge"><BadgeCheckIcon /> Verified</span>
                  ) : (
                    <span className="unverified-badge"><BadgeAlertIcon /> Unverified</span>
                  )}
                </div>
                <div className="ud-contact-item__value ud-contact-item__value--email" style={{ display: 'flex', alignItems: 'center' }}>
                  {selectedUser.email}
                  <button className="copy-btn" onClick={() => handleCopy(selectedUser.email, 'email')} title="Copy Email">
                    {copiedField === 'email' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            </div>

            <div className="ud-contact-divider" />

            {/* Phone */}
            <div className="ud-contact-item">
              <div className="ud-contact-item__icon phone">
                <PhoneIcon size={16} />
              </div>
              <div className="ud-contact-item__text">
                <div className="ud-contact-item__label">
                  Phone Number
                  {selectedUser.phone ? (
                    selectedUser.phoneVerified ? (
                      <span className="verified-badge"><BadgeCheckIcon /> Verified</span>
                    ) : (
                      <span className="unverified-badge"><BadgeAlertIcon /> Unverified</span>
                    )
                  ) : null}
                </div>
                <div className="ud-contact-item__value" style={{ display: 'flex', alignItems: 'center' }}>
                  {selectedUser.phone
                    ? <>
                        <span className="ud-contact-item__value--phone">{selectedUser.phone}</span>
                        <button className="copy-btn" onClick={() => handleCopy(selectedUser.phone, 'phone')} title="Copy Phone">
                          {copiedField === 'phone' ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </>
                    : <span className="ud-contact-item__empty">Not provided</span>}
                </div>
              </div>
            </div>

            <div className="ud-contact-divider" />

            {/* Addresses count */}
            <div className="ud-contact-item">
              <div className="ud-contact-item__icon addresses">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="ud-contact-item__text">
                <div className="ud-contact-item__label">Saved Addresses</div>
                <div className="ud-contact-item__value">
                  {totalAddrs} address{totalAddrs !== 1 ? 'es' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* ── ADDRESS SECTION ───────────────────────────── */}
          <div className="ud-body">
            {totalAddrs === 0 ? (
              <div className="ud-no-addresses">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p>No delivery addresses saved for this account.</p>
              </div>
            ) : (
              <>
                {/* Primary address — always visible */}
                <div className="ud-primary-section">
                  <div className="ud-section-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Primary Shipping Address
                  </div>

                  {primaryAddr && (
                    <div className="ud-address-card ud-address-card--primary">
                      <div className="ud-address-card__top">
                        <div className="ud-address-card__badges">
                          <span className="ud-addr-type">{primaryAddr.addressType}</span>
                          <span className="ud-addr-primary">★ Primary</span>
                        </div>
                        <span className="ud-address-card__name">{primaryAddr.fullName}</span>
                      </div>

                      {/* Structured detail grid */}
                      <div className="ud-primary-detail-row">
                        <div className="ud-primary-detail-block">
                          <span className="ud-detail-key">Street</span>
                          <span className="ud-detail-val">
                            {primaryAddr.streetAddress}
                            {primaryAddr.landmark && (
                              <span className="ud-detail-landmark"> · {primaryAddr.landmark}</span>
                            )}
                          </span>
                        </div>
                        <div className="ud-primary-detail-block">
                          <span className="ud-detail-key">City / State</span>
                          <span className="ud-detail-val">{primaryAddr.city}, {primaryAddr.state}</span>
                        </div>
                        <div className="ud-primary-detail-block">
                          <span className="ud-detail-key">PIN Code</span>
                          <span className="ud-detail-val ud-detail-val--pin">{primaryAddr.pincode}</span>
                        </div>
                        <div className="ud-primary-detail-block">
                          <span className="ud-detail-key">Country</span>
                          <span className="ud-detail-val">{primaryAddr.country}</span>
                        </div>
                        {primaryAddr.phone && (
                          <div className="ud-primary-detail-block">
                            <span className="ud-detail-key">Delivery Phone</span>
                            <span className="ud-detail-val ud-detail-val--phone">
                              <PhoneIcon size={12} />
                              {primaryAddr.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* View all addresses toggle */}
                {otherAddrs.length > 0 && (
                  <div className="ud-all-addresses-section">
                    <button
                      className="ud-toggle-all-btn"
                      onClick={() => setShowAllAddresses(v => !v)}
                    >
                      {showAllAddresses ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                          Hide Other Addresses
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                          View All Addresses
                          <span className="ud-toggle-count">+{otherAddrs.length} more</span>
                        </>
                      )}
                    </button>

                    {showAllAddresses && (
                      <div className="ud-address-others">
                        {otherAddrs.map((addr) => (
                          <div className="ud-address-card" key={addr.id}>
                            <div className="ud-address-card__top">
                              <div className="ud-address-card__badges">
                                <span className="ud-addr-type">{addr.addressType}</span>
                              </div>
                              <span className="ud-address-card__name">{addr.fullName}</span>
                            </div>
                            <p className="ud-address-card__body">
                              {addr.streetAddress}
                              {addr.landmark && <>, <em>{addr.landmark}</em></>}
                              <br />
                              {addr.city}, {addr.state} – <strong>{addr.pincode}</strong>
                              <br />
                              {addr.country}
                            </p>
                            {addr.phone && (
                              <div className="ud-address-card__phone">
                                <PhoneIcon size={12} />
                                {addr.phone}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─── LIST VIEW ────────────────────────────────────────────── */
  return (
    <div className="user-manager">
      <div className="user-manager__header">
        <div>
          <h1 className="user-manager__title">Customer Directory</h1>
          <p className="user-manager__subtitle">Manage registered shopper accounts and delivery profiles</p>
        </div>
        <div className="user-manager__count">
          Total Shoppers: <strong style={{ color: 'var(--color-accent)' }}>{filteredUsers.length}</strong>
        </div>
      </div>

      <div className="user-manager__filters">
        <div className="user-manager__search-wrap">
          <svg className="user-manager__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="user-manager__search-input"
            placeholder="Search by shopper name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="user-manager__loading">
          <div className="user-manager__spinner" />
          <p>Retrieving shopper records...</p>
        </div>
      ) : error ? (
        <div className="user-manager__error-box"><p>{error}</p></div>
      ) : filteredUsers.length === 0 ? (
        <div className="user-manager__empty"><p>No shopper records matched your criteria.</p></div>
      ) : (
        <div className="user-manager__table-wrap animate-fade-in">
          <table className="user-manager__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Shopper</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="user-manager__row-clickable"
                  onClick={() => { setSelectedUser(user); setShowAllAddresses(false); }}
                  title="Click to inspect profile & shipping address book"
                >
                  <td><span className="user-manager__id-badge">#{user.id}</span></td>
                  <td>
                    <div className="user-manager__username-cell">
                      <div className="user-avatar">{(`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'U').charAt(0).toUpperCase()}</div>
                      <span>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.phone
                      ? <span className="user-manager__phone">{user.phone}</span>
                      : <span className="user-manager__none-tag">—</span>}
                  </td>
                  <td>
                    <span className="user-manager__role-badge user-manager__role-badge--user">Active Customer</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="user-manager__pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="user-manager__page-btn"
              >
                &larr; Prev
              </button>
              <span className="user-manager__page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="user-manager__page-btn"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
