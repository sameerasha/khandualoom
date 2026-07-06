import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileDashboard.css';

export default function ProfileDashboard({ onNavigate }) {
  const { customerInfo, updateProfile, fetchProfile, logout } = useAuth();

  // Profile fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address book state
  const [addresses, setAddresses] = useState([]);
  
  // UI states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // null if adding a new one
  
  // Address form fields
  const [addressType, setAddressType] = useState('HOME'); // HOME, OFFICE, OTHER
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [shippingPhone, setShippingPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch / Sync profile details on mount
  useEffect(() => {
    if (customerInfo) {
      setUsername(customerInfo.username || '');
      setEmail(customerInfo.email || '');
      setPhone(customerInfo.phone || '');
      setAddresses(customerInfo.addresses || []);
    } else {
      // Redirect home if not logged in
      onNavigate('home');
    }
  }, [customerInfo, onNavigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    const payload = {
      username,
      phone,
      addresses
    };

    if (password) {
      payload.password = password;
    }

    const result = await updateProfile(payload);
    setIsLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      // Refresh context
      await fetchProfile();
    } else {
      setError(result.error || 'Failed to update profile settings.');
    }
  };

  const handleAddAddressClick = () => {
    setIsEditingAddress(true);
    setEditingAddressId(null);
    // Reset form
    setAddressType('HOME');
    setFullName('');
    setStreetAddress('');
    setLandmark('');
    setCity('');
    setState('');
    setPincode('');
    setCountry('India');
    setShippingPhone('');
  };

  const handleEditAddressClick = (addr) => {
    setIsEditingAddress(true);
    setEditingAddressId(addr.id);
    // Populate form
    setAddressType(addr.addressType || 'HOME');
    setFullName(addr.fullName || '');
    setStreetAddress(addr.streetAddress || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPincode(addr.pincode || '');
    setCountry(addr.country || 'India');
    setShippingPhone(addr.phone || '');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    const newAddress = {
      addressType,
      fullName,
      streetAddress,
      landmark,
      city,
      state,
      pincode,
      country,
      phone: shippingPhone
    };

    let updatedList;
    if (editingAddressId === null) {
      // Add mode - use a temporary negative ID so we can identify it in the list before DB persistence
      newAddress.id = -Date.now();
      updatedList = [...addresses, newAddress];
    } else {
      // Edit mode
      newAddress.id = editingAddressId;
      updatedList = addresses.map(addr => addr.id === editingAddressId ? newAddress : addr);
    }

    setAddresses(updatedList);
    setIsEditingAddress(false);
    setSuccess('Address list updated! Save profile to persist changes.');
  };

  const handleDeleteAddress = (id) => {
    const updatedList = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedList);
    setSuccess('Address deleted! Save profile to persist changes.');
  };

  return (
    <div className="profile-dashboard container">
      {/* Back Button */}
      <div className="profile-dashboard__header">
        <button className="profile-dashboard__back-btn" onClick={() => onNavigate('home')}>
          ← Back to Gallery
        </button>
        <h1>My Account</h1>
        <p className="profile-dashboard__subtitle">Manage your profile details and shipment addresses</p>
      </div>

      {success && <div className="profile-feedback success">{success}</div>}
      {error && <div className="profile-feedback error">{error}</div>}

      <div className="profile-dashboard__grid">
        {/* Profile Settings Section */}
        <div className="profile-dashboard__card">
          <h2>Profile Settings</h2>
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="profile-form__group">
              <label>Email Address (Cannot be changed)</label>
              <input type="email" value={email} disabled className="readonly-input" />
            </div>

            <div className="profile-form__group">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="profile-form__group">
              <label htmlFor="profile-phone">Mobile Phone</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
              />
            </div>

            <hr className="profile-divider" />
            <h3 className="profile-form__section-title">Change Password (Leave blank to keep current)</h3>

            <div className="profile-form__group">
              <label htmlFor="profile-new-password">New Password</label>
              <input
                id="profile-new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div className="profile-form__group">
              <label htmlFor="profile-confirm-password">Confirm New Password</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="profile-save-btn" disabled={isLoading}>
              {isLoading ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>

        {/* Shipping Address Book Section */}
        <div className="profile-dashboard__card">
          <div className="address-book-header">
            <h2>Shipping Address Book</h2>
            {!isEditingAddress && (
              <button className="add-address-btn" onClick={handleAddAddressClick}>
                + Add Address
              </button>
            )}
          </div>

          {isEditingAddress ? (
            /* Address Editor Form */
            <form onSubmit={handleAddressSubmit} className="address-form">
              <h3>{editingAddressId === null ? 'Add Shipping Address' : 'Edit Shipping Address'}</h3>
              
              <div className="address-form__row">
                <div className="profile-form__group flex-1">
                  <label htmlFor="address-type">Address Tag / Type</label>
                  <select
                    id="address-type"
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                  >
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="profile-form__group flex-2">
                  <label htmlFor="address-fullname">Recipient's Full Name</label>
                  <input
                    id="address-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="profile-form__group">
                <label htmlFor="address-street">Street Address / Block / Apartment</label>
                <input
                  id="address-street"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                  placeholder="Apartment #, Building, Street Name"
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="address-landmark">Landmark (Optional)</label>
                <input
                  id="address-landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near temple, metro station, etc."
                />
              </div>

              <div className="address-form__row">
                <div className="profile-form__group flex-1">
                  <label htmlFor="address-city">City</label>
                  <input
                    id="address-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="profile-form__group flex-1">
                  <label htmlFor="address-state">State</label>
                  <input
                    id="address-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="address-form__row">
                <div className="profile-form__group flex-1">
                  <label htmlFor="address-pincode">Pincode / ZIP Code</label>
                  <input
                    id="address-pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>

                <div className="profile-form__group flex-1">
                  <label htmlFor="address-country">Country</label>
                  <input
                    id="address-country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="profile-form__group">
                <label htmlFor="address-phone">Delivery Contact Phone (Optional)</label>
                <input
                  id="address-phone"
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="Alternate phone for delivery rider"
                />
              </div>

              <div className="address-form__actions">
                <button type="submit" className="save-addr-btn">
                  Apply Address
                </button>
                <button type="button" className="cancel-addr-btn" onClick={() => setIsEditingAddress(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Address List View */
            <div className="address-list">
              {addresses.length === 0 ? (
                <div className="address-list-empty">
                  No shipping addresses saved yet. Click "+ Add Address" to populate your address book.
                </div>
              ) : (
                addresses.map((addr) => (
                  <div className="address-card" key={addr.id}>
                    <div className="address-card__header">
                      <span className={`address-badge ${addr.addressType.toLowerCase()}`}>
                        {addr.addressType}
                      </span>
                      <div className="address-card__actions">
                        <button className="edit-addr-btn" onClick={() => handleEditAddressClick(addr)}>Edit</button>
                        <button className="delete-addr-btn" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="address-card__body">
                      <p className="address-recipient">{addr.fullName}</p>
                      <p>{addr.streetAddress}</p>
                      {addr.landmark && <p className="address-landmark">Landmark: {addr.landmark}</p>}
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p>{addr.country}</p>
                      {addr.phone && <p className="address-phone">📞 {addr.phone}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
