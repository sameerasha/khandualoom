import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileDashboard.css';

export default function ProfileDashboard({ onNavigate }) {
  const { customerInfo, updateProfile, fetchProfile, sendOtp, getToken, logout } = useAuth();

  // Layout state
  const [activeTab, setActiveTab] = useState('profile');

  // Profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Security fields
  const [previousPassword, setPreviousPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // OTP Verification States
  const [otpSentFor, setOtpSentFor] = useState(null); // 'email' or 'phone'
  const [otp, setOtp] = useState('');

  // Address book state
  const [addresses, setAddresses] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // null if adding a new one
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  
  // Address form fields
  const [addressType, setAddressType] = useState('HOME');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [shippingPhone, setShippingPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // Address API states
  const [indianStates, setIndianStates] = useState([]);
  const [indianCities, setIndianCities] = useState([]);
  const [isStatesLoading, setIsStatesLoading] = useState(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // Edit Phone state
  const [showEditPhonePanel, setShowEditPhonePanel] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [editPhoneStep, setEditPhoneStep] = useState(1); // 1 = enter phone, 2 = verify email OTP

  // Delete Address state
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Delete Account state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // OTP Timer & Attempts state
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const [otpErrorMsg, setOtpErrorMsg] = useState('');

  useEffect(() => {
    let interval = null;
    if (otpTimer > 0 && (showOtpModal || editPhoneStep === 2)) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer, showOtpModal, editPhoneStep]);

  useEffect(() => {
    const fetchStates = async () => {
      setIsStatesLoading(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'India' })
        });
        const data = await res.json();
        if (!data.error && data.data && data.data.states) {
          setIndianStates(data.data.states.map(s => s.name));
        }
      } catch (err) {
        console.error('Failed to fetch states', err);
      } finally {
        setIsStatesLoading(false);
      }
    };
    
    const fetchMyOrders = async () => {
      setIsOrdersLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchStates();
    if (getToken()) {
      fetchMyOrders();
    }
  }, []);

  useEffect(() => {
    if (!state) {
      setIndianCities([]);
      return;
    }
    const fetchCities = async () => {
      setIsCitiesLoading(true);
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'India', state: state })
        });
        const data = await res.json();
        if (!data.error && data.data) {
          setIndianCities(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch cities', err);
      } finally {
        setIsCitiesLoading(false);
      }
    };
    fetchCities();
  }, [state]);

  useEffect(() => {
    if (editingAddressId === null && pincode && pincode.toString().length === 6) {
      const fetchPincodeDetails = async () => {
        setIsPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            const fetchedState = details.State;
            const fetchedCity = details.District;
            
            // Attempt to match state name exactly with the list
            const matchedState = indianStates.find(s => s.toLowerCase() === fetchedState.toLowerCase()) || fetchedState;
            setState(matchedState);
            setCity(fetchedCity);
            showToast('Location auto-filled from PIN Code', 'success');
          } else {
            setFormErrors(prev => ({ ...prev, pincode: 'Invalid PIN Code' }));
          }
        } catch (err) {
          console.error('Failed to fetch pincode details', err);
        } finally {
          setIsPincodeLoading(false);
        }
      };
      
      const debounce = setTimeout(fetchPincodeDetails, 500);
      return () => clearTimeout(debounce);
    }
  }, [pincode, indianStates]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpError = (errorString) => {
    if (errorString.toLowerCase().includes('expired')) {
      setOtpErrorMsg('Security code has expired. Please resend.');
    } else {
      setOtpErrorMsg('Invalid security code. Please try again.');
    }

    const match = errorString.match(/Attempts remaining: (\d+)/);
    if (match) {
      setOtpAttemptsLeft(parseInt(match[1], 10));
    } else {
      setOtpAttemptsLeft(prev => Math.max(0, prev - 1));
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch / Sync profile details on mount
  useEffect(() => {
    if (customerInfo) {
      setFirstName(customerInfo.firstName || '');
      setLastName(customerInfo.lastName || '');
      setEmail(customerInfo.email || '');
      setPhone(customerInfo.phone || '');
      setEmailVerified(customerInfo.emailVerified || false);
      setPhoneVerified(customerInfo.phoneVerified || false);
      setAddresses(customerInfo.addresses || []);
    } else {
      onNavigate('home');
    }
  }, [customerInfo, onNavigate]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormErrors({});
    setError('');
    setOtpSentFor(null);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        logout();
      } else {
        const text = await response.text();
        showToast(text || "Failed to delete account", 'error');
        setShowDeleteConfirmModal(false);
      }
    } catch (err) {
      showToast("Server connection error.", 'error');
      setShowDeleteConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRequest = async (type, forcedIdentifier = null, openModal = true, isResend = false) => {
    setIsLoading(true);
    const identifier = forcedIdentifier || (type === 'email' ? email : phone);
    try {
      const result = await sendOtp(identifier);
      setIsLoading(false);
      
      if (result.success) {
        setOtpSentFor(type);
        setOtpTimer(result.ttlSeconds || 120);
        setOtpAttemptsLeft(result.maxAttempts || 5);
        setOtp('');
        setOtpErrorMsg('');
        if (isResend) {
          setResendMessage(`A new security code has been sent to your ${type}.`);
          setTimeout(() => setResendMessage(''), 4000);
        }
        if (openModal) {
          setShowOtpModal(true);
        }
      } else {
        showToast(result.error || `Failed to send OTP to ${type}.`, 'error');
      }
    } catch (err) {
      setIsLoading(false);
      showToast('Error sending OTP', 'error');
    }
  };

  const handleVerifySubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    const identifier = type === 'email' ? email : phone;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ identifier, otp })
      });
      setIsLoading(false);
      if (response.ok) {
        setOtpSentFor(null);
        setOtp('');
        setShowOtpModal(false);
        await fetchProfile();
      } else {
        const err = await response.text();
        handleOtpError(err || 'Verification failed.');
      }
    } catch (e) {
      setIsLoading(false);
      showToast('Connection error during verification.', 'error');
    }
  };

  const handleEditPhoneContinue = async () => {
    if (!newPhone || !/^(?:\+91|91|0)?[6789]\d{9}$/.test(newPhone)) {
      setFormErrors({ ...formErrors, newPhone: 'Valid 10-digit phone required' });
      return;
    }
    setFormErrors({});
    await handleVerifyRequest('phone', newPhone, false); // Send OTP to the NEW phone number
    setEditPhoneStep(2);
  };

  const handleEditPhoneSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ newPhone, otp })
      });
      setIsLoading(false);
      
      const result = await response.json();
      if (response.ok && result.success) {
        setShowEditPhonePanel(false);
        setEditPhoneStep(1);
        setOtp('');
        setOtpSentFor(null);
        await fetchProfile();
      } else {
        handleOtpError(result.error || 'Invalid OTP.');
      }
    } catch (e) {
      setIsLoading(false);
      showToast('Connection error.', 'error');
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (phone && !/^(?:\+91|91|0)?[6789]\d{9}$/.test(phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateProfile()) return;

    setIsSavingProfile(true);
    const payload = { firstName, lastName, phone, addresses };
    const result = await updateProfile(payload);
    setIsSavingProfile(false);

    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      await fetchProfile();
    } else {
      showToast(result.error || 'Failed to update profile settings.', 'error');
    }
  };

  const validateSecurity = () => {
    const errors = {};
    if (!previousPassword.trim()) errors.previousPassword = 'Previous password is required';
    if (!password || password.length < 6) errors.password = 'New password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateSecurity()) return;

    setIsSavingSecurity(true);
    const payload = { previousPassword, newPassword: password, addresses };
    const result = await updateProfile(payload);
    setIsSavingSecurity(false);

    if (result.success) {
      showToast('Password updated successfully!');
      setPreviousPassword('');
      setPassword('');
      setConfirmPassword('');
    } else {
      showToast(result.error || 'Failed to update password.', 'error');
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Recipient name is required';
    if (!streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!pincode.trim()) errors.pincode = 'Pincode is required';
    if (!country.trim()) errors.country = 'Country is required';
    if (!shippingPhone.trim()) errors.shippingPhone = 'Phone number is required';
    else if (shippingPhone.trim().length !== 10) errors.shippingPhone = 'Phone number must be exactly 10 digits';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddressClick = () => {
    setIsEditingAddress(true);
    setEditingAddressId(null);
    setFormErrors({});
    setAddressType('HOME');
    setFullName(customerInfo?.firstName ? `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim() : '');
    setStreetAddress('');
    setLandmark('');
    setCity('');
    setState('');
    setPincode('');
    setCountry('India');
    setShippingPhone(customerInfo?.phone || '');
    setIsPrimary(false);
  };

  const handleEditAddressClick = (addr) => {
    setIsEditingAddress(true);
    setEditingAddressId(addr.id);
    setFormErrors({});
    setAddressType(addr.addressType || 'HOME');
    setFullName(addr.fullName || '');
    setStreetAddress(addr.streetAddress || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPincode(addr.pincode || '');
    setCountry(addr.country || 'India');
    setShippingPhone(addr.phone || '');
    setIsPrimary(addr.isPrimary || false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    const newAddress = {
      addressType, fullName, streetAddress, landmark, city, state, pincode, country, phone: shippingPhone, isPrimary
    };

    let updatedList;
    if (editingAddressId === null) {
      newAddress.id = -Date.now();
      updatedList = [...addresses, newAddress];
    } else {
      newAddress.id = editingAddressId;
      updatedList = addresses.map(addr => addr.id === editingAddressId ? newAddress : addr);
    }

    if (newAddress.isPrimary) {
      updatedList = updatedList.map(addr => addr.id === newAddress.id ? addr : { ...addr, isPrimary: false });
    } else {
      const hasPrimary = updatedList.some(addr => addr.isPrimary);
      if (!hasPrimary && updatedList.length > 0) {
        updatedList = updatedList.map((addr, idx) => idx === 0 ? { ...addr, isPrimary: true } : addr);
      }
    }

    setIsSavingAddress(true);
    const payload = { firstName, lastName, phone, addresses: updatedList };
    const result = await updateProfile(payload);
    setIsSavingAddress(false);

    if (result.success) {
      setAddresses(updatedList);
      setIsEditingAddress(false);
      showToast(editingAddressId ? 'Address updated successfully!' : 'Address added successfully!', 'success');
      await fetchProfile();
    } else {
      showToast(result.error || 'Failed to save address.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    setIsLoading(true);
    const updatedList = addresses.filter(addr => addr.id !== id);
    const payload = { firstName, lastName, phone, addresses: updatedList };
    const result = await updateProfile(payload);
    setIsLoading(false);

    if (result.success) {
      setAddresses(updatedList);
      showToast('Address deleted successfully!', 'success');
      setAddressToDelete(null);
      await fetchProfile();
    } else {
      showToast(result.error || 'Failed to delete address.', 'error');
    }
  };

  return (
    <div className="profile-dashboard container">
      <div className="profile-dashboard__header">
        <button className="profile-dashboard__back-btn" onClick={() => onNavigate('home')}>
          ← Back to Gallery
        </button>
        <h1>My Account</h1>
        <p className="profile-dashboard__subtitle">Manage your profile details, security, and shipment addresses</p>
      </div>

      {error && <div className="profile-feedback error">{error}</div>}

      <div className="profile-dashboard-layout">
        {/* Sidebar Tabs */}
        <div className="profile-sidebar">
          <button className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => switchTab('profile')}>
            👤 Personal Info
          </button>
          <button className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => switchTab('security')}>
            🔒 Security
          </button>
          <button className={`profile-tab ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => switchTab('addresses')}>
            📍 Address Book
          </button>
          <button className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => switchTab('orders')}>
            📦 Order History
          </button>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="profile-dashboard__card">
              <h2>Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="profile-form__group">
                  <label>
                    Email Address
                    {emailVerified ? (
                      <span className="verified-chip">✓ Verified</span>
                    ) : (
                      <>
                        <span className="unverified-chip">⚠ Unverified</span>
                        <button type="button" onClick={() => handleVerifyRequest('email', email)} className="verify-now-btn">Verify Now</button>
                      </>
                    )}
                  </label>
                  <input type="email" value={email} disabled className="readonly-input" />
                </div>

                <div className="profile-form__group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="profile-firstname">First Name <span className="required-star">*</span></label>
                    <input
                      id="profile-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={formErrors.firstName ? 'input-error' : ''}
                    />
                    {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="profile-lastname">Last Name <span className="required-star">*</span></label>
                    <input
                      id="profile-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={formErrors.lastName ? 'input-error' : ''}
                    />
                    {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="profile-form__group">
                  <label htmlFor="profile-phone">
                    Mobile Phone
                    {phone && phoneVerified ? (
                      <span className="verified-chip">✓ Verified</span>
                    ) : phone ? (
                      <>
                        <span className="unverified-chip">⚠ Unverified</span>
                        <button type="button" onClick={() => handleVerifyRequest('phone', phone)} className="verify-now-btn">Verify Now</button>
                      </>
                    ) : null}
                    
                    {phoneVerified && (
                      <button 
                        type="button" 
                        onClick={() => { setShowEditPhonePanel(true); setNewPhone(''); setEditPhoneStep(1); }} 
                        className="verify-now-btn" 
                        style={{ marginLeft: '10px', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text-primary)' }}
                      >
                        Edit Number
                      </button>
                    )}
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value !== (customerInfo?.phone || '')) {
                        setPhoneVerified(false);
                      } else {
                        setPhoneVerified(customerInfo?.phoneVerified || false);
                      }
                    }}
                    placeholder="+91 99999 99999"
                    className={formErrors.phone ? 'input-error' : ''}
                    disabled={phoneVerified}
                  />
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>

                <button type="submit" className="profile-save-btn" disabled={isSavingProfile}>
                  {isSavingProfile ? 'Saving...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="profile-dashboard__card">
              <h2>Change Password</h2>
              <form onSubmit={handleSecuritySubmit} className="profile-form">
                
                <div className="profile-form__group">
                  <label htmlFor="profile-prev-password">Previous Password <span className="required-star">*</span></label>
                  <input
                    id="profile-prev-password"
                    type="password"
                    value={previousPassword}
                    onChange={(e) => setPreviousPassword(e.target.value)}
                    placeholder="••••••••"
                    className={formErrors.previousPassword ? 'input-error' : ''}
                  />
                  {formErrors.previousPassword && <span className="error-message">{formErrors.previousPassword}</span>}
                </div>

                <div className="profile-form__group">
                  <label htmlFor="profile-new-password">New Password <span className="required-star">*</span></label>
                  <input
                    id="profile-new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={formErrors.password ? 'input-error' : ''}
                  />
                  {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                </div>

                <div className="profile-form__group">
                  <label htmlFor="profile-confirm-password">Confirm New Password <span className="required-star">*</span></label>
                  <input
                    id="profile-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={formErrors.confirmPassword ? 'input-error' : ''}
                  />
                  {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
                </div>

                <button type="submit" className="profile-save-btn" disabled={isSavingSecurity}>
                  {isSavingSecurity ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>

              <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)', opacity: 0.5 }} />
              <div className="danger-zone-section" style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>Danger Zone</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirmModal(true)}
                  disabled={isLoading}
                  style={{ background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Delete Account...
                </button>
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
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
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <h3>{editingAddressId === null ? 'Add Shipping Address' : 'Edit Shipping Address'}</h3>
                  
                  <div className="address-form__row">
                    <div className="profile-form__group flex-1">
                      <label htmlFor="address-type">Address Tag</label>
                      <select id="address-type" value={addressType} onChange={(e) => setAddressType(e.target.value)}>
                        <option value="HOME">Home</option>
                        <option value="OFFICE">Office</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="profile-form__group flex-2">
                      <label htmlFor="address-fullname">Recipient's Full Name <span className="required-star">*</span></label>
                      <input
                        id="address-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={formErrors.fullName ? 'input-error' : ''}
                      />
                      {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
                    </div>
                  </div>

                  <div className="profile-form__group">
                    <label htmlFor="address-street">Street Address / Block <span className="required-star">*</span></label>
                    <input
                      id="address-street"
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Apartment #, Building, Street Name"
                      className={formErrors.streetAddress ? 'input-error' : ''}
                    />
                    {formErrors.streetAddress && <span className="error-message">{formErrors.streetAddress}</span>}
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
                      <label htmlFor="address-state">State <span className="required-star">*</span> {isStatesLoading && <span className="loading-text">(Loading...)</span>}</label>
                      <select
                        id="address-state"
                        value={state}
                        onChange={(e) => { setState(e.target.value); setCity(''); }}
                        className={formErrors.state ? 'input-error' : ''}
                      >
                        <option value="">Select State</option>
                        {indianStates.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                      {formErrors.state && <span className="error-message">{formErrors.state}</span>}
                    </div>

                    <div className="profile-form__group flex-1">
                      <label htmlFor="address-city">City <span className="required-star">*</span> {isCitiesLoading && <span className="loading-text">(Loading...)</span>}</label>
                      <select
                        id="address-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={formErrors.city ? 'input-error' : ''}
                        disabled={!state}
                      >
                        <option value="">Select City</option>
                        {city && !indianCities.includes(city) && (
                          <option value={city}>{city}</option>
                        )}
                        {indianCities.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                      {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                    </div>
                  </div>

                  <div className="address-form__row">
                    <div className="profile-form__group flex-1">
                      <label htmlFor="address-pincode">Pincode / ZIP <span className="required-star">*</span> {isPincodeLoading && <span className="loading-text">(Fetching...)</span>}</label>
                      <input
                        id="address-pincode"
                        type="text"
                        maxLength="6"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className={formErrors.pincode ? 'input-error' : ''}
                        placeholder="6-digit PIN"
                      />
                      {formErrors.pincode && <span className="error-message">{formErrors.pincode}</span>}
                    </div>

                    <div className="profile-form__group flex-1">
                      <label htmlFor="address-country">Country <span className="required-star">*</span></label>
                      <input
                        id="address-country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={formErrors.country ? 'input-error' : ''}
                      />
                      {formErrors.country && <span className="error-message">{formErrors.country}</span>}
                    </div>
                  </div>

                  <div className="profile-form__group">
                    <label htmlFor="address-phone">Delivery Phone <span className="required-star">*</span></label>
                    <input
                      id="address-phone"
                      type="tel"
                      maxLength="10"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value.replace(/\D/g, ''))}
                      className={formErrors.shippingPhone ? 'input-error' : ''}
                      placeholder="10-digit phone number"
                    />
                    {formErrors.shippingPhone && <span className="error-message">{formErrors.shippingPhone}</span>}
                  </div>
                  
                  <div className="profile-form__group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <input
                      type="checkbox"
                      id="address-primary"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                    />
                    <label htmlFor="address-primary" style={{ cursor: 'pointer', marginBottom: 0 }}>Set as Primary Shipping Address</label>
                  </div>

                  <div className="address-form__actions">
                    <button type="submit" className="save-addr-btn">Apply Address</button>
                    <button type="button" className="cancel-addr-btn" onClick={() => setIsEditingAddress(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="address-list">
                  {addresses.length === 0 ? (
                    <div className="address-list-empty">
                      No shipping addresses saved yet. Click "+ Add Address" to populate your address book.
                    </div>
                  ) : (
                    [...addresses].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 0 : 1)).map((addr) => (
                      <div className={`address-card ${addr.isPrimary ? 'primary' : ''}`} key={addr.id}>
                        <div className="address-card__header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`address-badge ${addr.addressType.toLowerCase()}`}>
                              {addr.addressType}
                            </span>
                            {addr.isPrimary && (
                              <span className="address-badge primary-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="address-card__actions">
                            <button className="edit-addr-btn" onClick={() => handleEditAddressClick(addr)}>Edit</button>
                            <button className="delete-addr-btn" onClick={() => setAddressToDelete(addr.id)}>Delete</button>
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
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="profile-dashboard__card">
              <h2>Order History</h2>
              
              {isOrdersLoading ? (
                <div className="loading-spinner-container">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't placed any orders yet.</p>
                  <button className="btn-primary" onClick={() => onNavigate('home')}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-header-info">
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status-badges">
                          <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                          <span className={`status-badge status-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="order-item">
                            <img src={item.productImageUrl || '/assets/products/placeholder.jpg'} alt={item.productName} />
                            <div className="order-item-details">
                              <h4>{item.productName}</h4>
                              <p>Qty: {item.quantity}</p>
                              <p className="order-item-price">₹{item.priceAtTime.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div className="order-address">
                          <strong>Shipped to:</strong> {order.address.fullName}, {order.address.city}
                        </div>
                        <div className="order-total">
                          <strong>Total:</strong> ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {toastMessage && (
        <div className={`profile-toast toast-${toastType}`}>
          {toastMessage}
        </div>
      )}

      {/* Premium OTP Modal */}
      {showOtpModal && otpSentFor && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content premium-modal">
            <div className="premium-modal-icon">
              {otpSentFor === 'email' ? '✉️' : '📱'}
            </div>
            <h3>Verify Your Identity</h3>
            <p>We've sent a 6-digit security code to your {otpSentFor}.</p>
            {resendMessage && <div className="resend-success-msg">{resendMessage}</div>}
            {otpErrorMsg && <div className="profile-feedback error" style={{ padding: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>{otpErrorMsg}</div>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: otpTimer === 0 || otpAttemptsLeft === 0 ? '#ef4444' : '#c3a27e', fontWeight: '500' }}>
              <span>⏱️ {formatTimer(otpTimer)}</span>
              <span>Attempts left: {otpAttemptsLeft}</span>
            </div>

            <input 
              type="text" 
              className="otp-modal-input premium-input"
              value={otp} 
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
              placeholder="••••••" 
              maxLength="6"
              disabled={otpTimer === 0 || otpAttemptsLeft === 0}
            />
            <div className="otp-modal-actions" style={{ flexDirection: 'column', gap: '16px' }}>
              {otpTimer === 0 || otpAttemptsLeft === 0 ? (
                <button 
                  type="button" 
                  className="otp-modal-btn premium-btn-verify" 
                  onClick={() => handleVerifyRequest(otpSentFor, null, true, true)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <button 
                  type="button" 
                  className="otp-modal-btn premium-btn-verify" 
                  onClick={(e) => handleVerifySubmit(e, otpSentFor)}
                  disabled={isLoading || otp.length !== 6 || otpAttemptsLeft === 0}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              )}
              <button 
                type="button" 
                className="otp-modal-btn premium-btn-cancel" 
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Phone Number Panel */}
      {showEditPhonePanel && (
        <div className="side-panel-overlay">
          <div className="side-panel">
            <div className="side-panel-header">
              <h3>Change Mobile Number</h3>
              <button className="close-panel-btn" onClick={() => setShowEditPhonePanel(false)}>×</button>
            </div>
            
            {editPhoneStep === 1 && (
              <div className="profile-form">
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                  Please enter your new mobile number. We will send a security code to this new number to verify it.
                </p>
                <div className="profile-form__group">
                  <label>New Mobile Number</label>
                  <input 
                    type="tel" 
                    value={newPhone} 
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className={formErrors.newPhone ? 'input-error' : ''}
                  />
                  {formErrors.newPhone && <span className="error-message">{formErrors.newPhone}</span>}
                </div>
                <button type="button" className="profile-save-btn" onClick={handleEditPhoneContinue} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Security Code'}
                </button>
              </div>
            )}

            {editPhoneStep === 2 && (
              <div className="profile-form">
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                 We've sent a 6-digit security code to your new mobile number: <strong>{newPhone}</strong>. Enter it below to verify and update your phone number.
                </p>
                {resendMessage && <div className="resend-success-msg">{resendMessage}</div>}
                {otpErrorMsg && <div className="profile-feedback error" style={{ padding: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>{otpErrorMsg}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', color: otpTimer === 0 || otpAttemptsLeft === 0 ? '#ef4444' : '#10b981', fontWeight: '500' }}>
                  <span>⏱️ {formatTimer(otpTimer)}</span>
                  <span>Attempts left: {otpAttemptsLeft}</span>
                </div>
                <div className="profile-form__group">
                  <label>Mobile OTP</label>
                  <input 
                    type="text" 
                    className="otp-modal-input"
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="••••••" 
                    maxLength="6"
                    disabled={otpTimer === 0 || otpAttemptsLeft === 0}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="profile-cancel-btn" onClick={() => setEditPhoneStep(1)} style={{ flex: 1 }}>Back</button>
                  {otpTimer === 0 || otpAttemptsLeft === 0 ? (
                    <button type="button" className="profile-save-btn" onClick={() => handleVerifyRequest('phone', newPhone, false, true)} disabled={isLoading} style={{ flex: 1 }}>
                      {isLoading ? 'Sending...' : 'Resend'}
                    </button>
                  ) : (
                    <button type="button" className="profile-save-btn" onClick={handleEditPhoneSubmit} disabled={isLoading || otp.length !== 6} style={{ flex: 1 }}>
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Address Confirm Modal */}
      {addressToDelete && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            <h3 style={{ color: '#ef4444' }}>Delete Address</h3>
            <p>Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="otp-modal-actions">
              <button 
                type="button" 
                className="otp-modal-btn otp-modal-verify" 
                onClick={() => handleDeleteAddress(addressToDelete)}
                disabled={isLoading}
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                type="button" 
                className="otp-modal-btn otp-modal-cancel" 
                onClick={() => setAddressToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirm Modal */}
      {showDeleteConfirmModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            <h3 style={{ color: '#ef4444' }}>Delete Account</h3>
            <p>Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.</p>
            <div className="otp-modal-actions">
              <button 
                type="button" 
                className="otp-modal-btn otp-modal-verify" 
                onClick={handleDeleteAccount}
                disabled={isLoading}
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button 
                type="button" 
                className="otp-modal-btn otp-modal-cancel" 
                onClick={() => setShowDeleteConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
