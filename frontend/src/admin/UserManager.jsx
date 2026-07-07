import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserManager.css';

export default function UserManager() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state (roleFilter removed as we only show Customers)
  const [searchQuery, setSearchQuery] = useState('');

  // Detail inline state
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const token = getToken();
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchUsers();
  }, [getToken]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Initial Setup';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter: Show only users having Customer role (ROLE_USER)
  const filteredUsers = users.filter((user) => {
    if (user.role !== 'ROLE_USER') return false;
    
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));

    return matchesSearch;
  });

  // 1. INLINE DETAIL VIEW
  if (selectedUser) {
    return (
      <div className="user-manager">
        <div className="user-manager__header">
          <div>
            <button 
              className="user-manager__back-inline-btn" 
              onClick={() => setSelectedUser(null)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Registry List
            </button>
            <h1 className="user-manager__title" style={{ marginTop: '8px' }}>User Account Profile</h1>
          </div>
        </div>

        <div className="user-details-inline card-glow animate-scale-in">
          <div className="user-details-inline__grid">
            
            {/* Left side: Avatar & Static Role Display */}
            <div className="user-details-inline__left-col">
              <div className="user-details-inline__avatar-large">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="user-details-inline__username">{selectedUser.username}</h2>
              <span className="user-details-inline__id">User ID: #{selectedUser.id}</span>

              {/* Static Role Information (Role cannot be changed) */}
              <div className="user-details-inline__role-box">
                <span className="user-details-inline__role-label">Account Privilege</span>
                <div className="user-details-inline__role-static-badge">
                  Customer Account (Shopper Access)
                </div>
              </div>
            </div>

            {/* Right side: Personal Info & Address Lists */}
            <div className="user-details-inline__right-col">
              
              <div className="user-details-inline__section">
                <h3>Contact & Session Metrics</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-val">{selectedUser.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-val">{selectedUser.phone || '—'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Joined Date</span>
                    <span className="info-val">{formatDate(selectedUser.createdDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Modified Date</span>
                    <span className="info-val">{formatDate(selectedUser.modifiedDate)}</span>
                  </div>
                </div>
              </div>

              <div className="user-details-inline__section">
                <h3>Saved Shipment & Billing Addresses ({selectedUser.addresses?.length || 0})</h3>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="user-details-inline__address-list">
                    {selectedUser.addresses.map((addr, idx) => (
                      <div 
                        className={`user-details-inline__address-card ${addr.isPrimary ? 'primary' : ''}`} 
                        key={addr.id}
                      >
                        <div className="user-details-inline__address-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="user-details-inline__address-type">{addr.addressType}</span>
                            {addr.isPrimary && (
                              <span className="user-details-inline__primary-badge">★ Primary</span>
                            )}
                          </div>
                          <span className="user-details-inline__address-name">{addr.fullName}</span>
                        </div>
                        <p className="user-details-inline__address-body">
                          {addr.streetAddress}<br />
                          {addr.landmark ? `Landmark: ${addr.landmark}, ` : ''}
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong><br />
                          {addr.country}
                        </p>
                        {addr.phone && (
                          <div className="user-details-inline__address-contact">
                            📞 <span>Delivery Phone: {addr.phone}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="user-details-inline__address-empty">
                    <span>No shipping addresses registered for this account.</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. STANDARD USER LIST TABLE VIEW
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

      {/* Filters bar */}
      <div className="user-manager__filters">
        <div className="user-manager__search-wrap">
          <svg className="user-manager__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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

      {/* Users table */}
      {loading ? (
        <div className="user-manager__loading">
          <div className="user-manager__spinner"></div>
          <p>Retrieving shopper records...</p>
        </div>
      ) : error ? (
        <div className="user-manager__error-box">
          <p>{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="user-manager__empty">
          <p>No shopper records matched your criteria.</p>
        </div>
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
                <th>Joined Date</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="user-manager__row-clickable" 
                  onClick={() => setSelectedUser(user)}
                  title="Click to inspect profile & shipping address book"
                >
                  <td>
                    <span className="user-manager__id-badge">#{user.id}</span>
                  </td>
                  <td>
                    <div className="user-manager__username-cell">
                      <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.phone ? (
                      <span className="user-manager__phone">{user.phone}</span>
                    ) : (
                      <span className="user-manager__none-tag">—</span>
                    )}
                  </td>
                  <td>
                    <span className="user-manager__role-badge user-manager__role-badge--user">
                      Active Customer
                    </span>
                  </td>
                  <td>
                    <span className="user-manager__date">{formatDate(user.createdDate)}</span>
                  </td>
                  <td>
                    <span className="user-manager__date">{formatDate(user.modifiedDate)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
