import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserManager.css'; // Reuse existing styles

export default function AdminManager() {
  const { getToken } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchAdmins = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/super-admin/admins`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        setError('Failed to fetch admins directory.');
      }
    } catch (e) {
      setError('Connection failure. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, [getToken]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/super-admin/admins`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormSuccess('Admin created successfully!');
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
        fetchAdmins();
        setTimeout(() => setShowAddModal(false), 1500);
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to create admin.');
      }
    } catch {
      setFormError('Server error.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/super-admin/admins/${selectedAdminId}/password`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordForm)
      });
      if (response.ok) {
        setFormSuccess('Password changed successfully!');
        setPasswordForm({ newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to change password.');
      }
    } catch {
      setFormError('Server error.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/super-admin/admins/${selectedAdminId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (response.ok) {
        setFormSuccess('Admin details updated successfully!');
        fetchAdmins();
        setTimeout(() => setShowEditModal(false), 1500);
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to update admin details.');
      }
    } catch {
      setFormError('Server error.');
    }
  };

  const openPasswordModal = (id) => {
    setSelectedAdminId(id);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setFormError('');
    setFormSuccess('');
    setShowPasswordModal(true);
  };

  const openAddModal = () => {
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  const openEditModal = (admin) => {
    setSelectedAdminId(admin.id);
    setEditForm({ firstName: admin.firstName || '', lastName: admin.lastName || '', email: admin.email });
    setFormError('');
    setFormSuccess('');
    setShowEditModal(true);
  };

  return (
    <div className="user-manager">
      <div className="user-manager__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="user-manager__title">Manage Admins</h1>
          <p className="user-manager__subtitle">Super Admin Access: Manage store administrators</p>
        </div>
        <button 
          onClick={openAddModal}
          className="admin-add-btn animate-fade-in"
          style={{ 
            background: 'var(--gradient-gold)', 
            color: 'var(--color-bg-primary)', 
            padding: '0.6rem 1.25rem', 
            border: 'none', 
            borderRadius: 'var(--radius-md)', 
            cursor: 'pointer', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-gold)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-gold-lg)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow-gold)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Admin
        </button>
      </div>

      {loading ? (
        <div className="user-manager__loading">
          <div className="user-manager__spinner" />
          <p>Retrieving admin records...</p>
        </div>
      ) : error ? (
        <div className="user-manager__error-box"><p>{error}</p></div>
      ) : admins.length === 0 ? (
        <div className="user-manager__empty"><p>No administrators found.</p></div>
      ) : (
        <div className="user-manager__table-wrap animate-fade-in">
          <table className="user-manager__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Administrator</th>
                <th>Email Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td><span className="user-manager__id-badge">#{admin.id}</span></td>
                  <td>
                    <div className="user-manager__username-cell">
                      <div className="user-avatar">{(`${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'A').charAt(0).toUpperCase()}</div>
                      <span>{`${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Admin User'}</span>
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <div className="admin-actions-container" style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => openEditModal(admin)}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)', 
                          color: 'var(--color-text-primary)',
                          padding: '0.5rem 1rem', 
                          borderRadius: 'var(--radius-sm)', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                      >
                        Edit Details
                      </button>
                      <button 
                        onClick={() => openPasswordModal(admin.id)}
                        style={{ 
                          background: 'rgba(232, 168, 124, 0.1)', 
                          border: '1px solid rgba(232, 168, 124, 0.2)', 
                          color: 'var(--color-accent)',
                          padding: '0.5rem 1rem', 
                          borderRadius: 'var(--radius-sm)', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(232, 168, 124, 0.4)'; e.currentTarget.style.background = 'rgba(232, 168, 124, 0.15)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(232, 168, 124, 0.2)'; e.currentTarget.style.background = 'rgba(232, 168, 124, 0.1)'; }}
                      >
                        Change Password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 13, 23, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-scale-in" style={{ background: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', width: '420px', maxWidth: '90%', border: '1px solid var(--color-bg-tertiary)', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(232, 168, 124, 0.1)', color: 'var(--color-accent)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Create New Admin</h2>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Add a new store administrator</p>
              </div>
            </div>

            {formError && <div style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{formSuccess}</div>}
            
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <input type="text" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ flex: 1, minWidth: 0, padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
                <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ flex: 1, minWidth: 0, padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              </div>
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              <input type="password" placeholder="Temporary Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.color = 'var(--color-text-primary)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';}} onMouseOut={e => {e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-text-secondary)'; e.target.style.borderColor = 'var(--color-bg-tertiary)';}}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: 'var(--gradient-gold)', color: 'var(--color-bg-primary)', border: 'none', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'filter 0.3s', boxShadow: 'var(--shadow-gold)' }} onMouseOver={e => e.target.style.filter = 'brightness(1.15)'} onMouseOut={e => e.target.style.filter = 'brightness(1)'}>Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 13, 23, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-scale-in" style={{ background: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', width: '420px', maxWidth: '90%', border: '1px solid var(--color-bg-tertiary)', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Change Password</h2>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>For Admin #{selectedAdminId}</p>
              </div>
            </div>

            {formError && <div style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{formSuccess}</div>}
            
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="password" placeholder="New Password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-error)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              <div style={{ position: 'relative' }}>
                <input type="password" placeholder="Confirm Password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} style={{ width: '100%', padding: '0.85rem 2.5rem 0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = 'var(--color-error)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
                {passwordForm.confirmPassword.length > 0 && passwordForm.newPassword === passwordForm.confirmPassword && (
                  <svg style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-success)', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.color = 'var(--color-text-primary)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';}} onMouseOut={e => {e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-text-secondary)'; e.target.style.borderColor = 'var(--color-bg-tertiary)';}}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: 'var(--color-error)', color: 'var(--color-bg-primary)', border: 'none', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'filter 0.3s', boxShadow: '0 4px 16px rgba(248, 113, 113, 0.3)' }} onMouseOver={e => e.target.style.filter = 'brightness(1.15)'} onMouseOut={e => e.target.style.filter = 'brightness(1)'}>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 13, 23, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-scale-in" style={{ background: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', width: '420px', maxWidth: '90%', border: '1px solid var(--color-bg-tertiary)', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(232, 168, 124, 0.1)', color: 'var(--color-accent)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--color-text-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Edit Admin Details</h2>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Update information for Admin #{selectedAdminId}</p>
              </div>
            </div>

            {formError && <div style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{formError}</div>}
            {formSuccess && <div style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid rgba(52, 211, 153, 0.2)' }}>{formSuccess}</div>}
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <input type="text" placeholder="First Name" required value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} style={{ flex: 1, minWidth: 0, padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
                <input type="text" placeholder="Last Name" required value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} style={{ flex: 1, minWidth: 0, padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              </div>
              <input type="email" placeholder="Email Address" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border-color 0.3s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = 'var(--color-accent)'} onBlur={e => e.target.style.borderColor = 'var(--color-bg-tertiary)'} />
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }} onMouseOver={e => {e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.color = 'var(--color-text-primary)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';}} onMouseOut={e => {e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-text-secondary)'; e.target.style.borderColor = 'var(--color-bg-tertiary)';}}>Cancel</button>
                <button type="submit" style={{ flex: 1, background: 'var(--gradient-gold)', color: 'var(--color-bg-primary)', border: 'none', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: '600', transition: 'filter 0.3s', boxShadow: 'var(--shadow-gold)' }} onMouseOver={e => e.target.style.filter = 'brightness(1.15)'} onMouseOut={e => e.target.style.filter = 'brightness(1)'}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
