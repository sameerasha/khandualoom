import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './StoreSettings.css';

const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'youtube', label: 'YouTube' }
];

const getIcon = (platform) => {
  switch (platform) {
    case 'facebook': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>;
    case 'instagram': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
    case 'twitter': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>;
    case 'whatsapp': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
    case 'telegram': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
    case 'youtube': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
    default: return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
  }
};

export default function StoreSettings() {
  const { getToken } = useAuth();
  const { addToast } = useCart();
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchSocialLinks();
  }, [getToken]);

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/social-media');
      if (res.ok) {
        setSocialLinks(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch social links", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getToken();
    const url = currentLink.id 
      ? `http://localhost:8080/api/admin/social-media/${currentLink.id}`
      : `http://localhost:8080/api/admin/social-media`;
    const method = currentLink.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentLink)
      });
      if (res.ok) {
        addToast(currentLink.id ? "Setting updated successfully!" : "Setting saved successfully!");
        setIsEditing(false);
        setCurrentLink(null);
        fetchSocialLinks();
      } else {
        addToast("Failed to save. Platform might already exist.", "error");
      }
    } catch (e) {
      console.error("Save error", e);
      addToast("An error occurred while saving.", "error");
    }
  };

  const confirmDelete = (link) => {
    setItemToDelete(link);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:8080/api/admin/social-media/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast("Setting deleted successfully!");
        fetchSocialLinks();
      }
    } catch (e) {
      console.error("Delete error", e);
    } finally {
      setItemToDelete(null);
    }
  };

  const openEditor = (link = null) => {
    if (link) {
      setCurrentLink({ 
        ...link, 
        url: link.url || '',
        announcement: link.announcement || '' 
      });
    } else {
      setCurrentLink({ platform: 'whatsapp', url: '', announcement: '' });
    }
    setIsEditing(true);
  };

  return (
    <div className="store-settings">
      <div className="store-settings__header">
        <div>
          <h1 className="store-settings__title">Store Settings</h1>
          <p className="store-settings__subtitle">Manage your public storefront social media links and announcements.</p>
        </div>
        {!isEditing && (
          <button className="store-settings__add-btn" onClick={() => openEditor()}>
            + Add Social Link
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="store-settings__card animate-fade-in">
          <h2 className="store-settings__card-title">{currentLink.id ? 'Edit' : 'Add'} Social Link</h2>
          <form className="store-settings__form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Platform</label>
              <select 
                value={currentLink.platform}
                onChange={e => setCurrentLink({...currentLink, platform: e.target.value})}
                required
              >
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Account Link</label>
              <input 
                type="text" 
                placeholder="e.g. +91 9876543210 or https://t.me/joinchat/..."
                value={currentLink.url}
                onChange={e => setCurrentLink({...currentLink, url: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Message or Announcement</label>
              <textarea 
                rows="3"
                placeholder="Message to display when user clicks the icon... e.g. 'Join our VIP WhatsApp group for daily drops!'"
                value={currentLink.announcement}
                onChange={e => setCurrentLink({...currentLink, announcement: e.target.value})}
              />
            </div>
            <div className="store-settings__form-actions">
              <button type="button" className="store-settings__cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="store-settings__save-btn">Save Configuration</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="store-settings__list">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : socialLinks.length === 0 ? (
            <div className="store-settings__empty">
              <p>No social media configured. Add one to show in the storefront footer.</p>
            </div>
          ) : (
            socialLinks.map(link => (
              <div key={link.id} className="store-settings__item">
                <div className={`store-settings__item-icon store-settings__item-icon--${link.platform}`}>
                  {getIcon(link.platform)}
                </div>
                <div className="store-settings__item-info">
                  <div className="store-settings__platform-name">{link.platform}</div>
                  <div className="store-settings__item-url">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    {link.url}
                  </div>
                  {link.announcement && (
                    <div className="store-settings__item-announcement">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      {link.announcement}
                    </div>
                  )}
                </div>
                <div className="store-settings__item-actions">
                  <button onClick={() => openEditor(link)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => confirmDelete(link)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="store-settings__confirm-overlay">
          <div className="store-settings__confirm-dialog animate-scale-in">
            <h3>Delete {itemToDelete.platform}?</h3>
            <p>Are you sure you want to remove this social link from your storefront? This action cannot be undone.</p>
            <div className="store-settings__confirm-actions">
              <button className="store-settings__cancel-btn" onClick={() => setItemToDelete(null)}>Cancel</button>
              <button className="store-settings__delete-btn" onClick={executeDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
