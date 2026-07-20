import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout({ onNavigate }) {
  const { customerInfo, fetchProfile, getToken, updateProfile } = useAuth();
  const { cartItems, totalPrice, clearCart, addToast } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Payment processing overlay state
  const [paymentOverlay, setPaymentOverlay] = useState({
    visible: false,
    status: 'idle', // idle | processing | verifying | success | failed
    message: ''
  });

  // Address form states (synced with ProfileDashboard)
  const [addressType, setAddressType] = useState('HOME');
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country] = useState('India');
  const [shippingPhone, setShippingPhone] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  
  const [formErrors, setFormErrors] = useState({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Address API states
  const [indianStates, setIndianStates] = useState([]);
  const [indianCities, setIndianCities] = useState([]);
  const [isStatesLoading, setIsStatesLoading] = useState(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  // Auto-select primary address on load or pre-fill form for new users
  useEffect(() => {
    if (customerInfo?.addresses?.length > 0) {
      const defaultAddr = customerInfo.addresses.find(a => a.isPrimary) || customerInfo.addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else if (customerInfo) {
      // Auto-populate name and phone if no addresses exist (form shows by default)
      setFullName(customerInfo.firstName ? `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim() : '');
      setShippingPhone(customerInfo.phone || '');
    }
  }, [customerInfo]);

  // Fetch Indian states on mount
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
    fetchStates();
  }, []);

  // Fetch cities when state changes
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

  // Auto-populate state/city from pincode
  useEffect(() => {
    if (pincode && pincode.toString().length === 6) {
      const fetchPincodeDetails = async () => {
        setIsPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            const fetchedState = details.State;
            const fetchedCity = details.District;
            const matchedState = indianStates.find(s => s.toLowerCase() === fetchedState.toLowerCase()) || fetchedState;
            setState(matchedState);
            setCity(fetchedCity);
            addToast('Location auto-filled from PIN Code', 'success');
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

  const validateAddress = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Recipient name is required';
    if (!streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!pincode.trim()) errors.pincode = 'Pincode is required';
    else if (pincode.trim().length !== 6) errors.pincode = 'Pincode must be exactly 6 digits';
    if (!shippingPhone.trim()) errors.shippingPhone = 'Phone number is required';
    else if (shippingPhone.trim().length !== 10) errors.shippingPhone = 'Phone number must be exactly 10 digits';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddressClick = () => {
    setAddressType('HOME');
    setFullName(customerInfo?.firstName ? `${customerInfo.firstName} ${customerInfo.lastName || ''}`.trim() : '');
    setStreetAddress('');
    setLandmark('');
    setCity('');
    setState('');
    setPincode('');
    setShippingPhone(customerInfo?.phone || '');
    setIsPrimary(false);
    setFormErrors({});
    setIsAddingAddress(true);
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    const newAddress = {
      id: -Date.now(),
      addressType, fullName, streetAddress, landmark, city, state, pincode, country, phone: shippingPhone, isPrimary
    };

    let updatedList = [...(customerInfo?.addresses || []), newAddress];

    if (newAddress.isPrimary) {
      updatedList = updatedList.map(addr => addr.id === newAddress.id ? addr : { ...addr, isPrimary: false });
    } else {
      const hasPrimary = updatedList.some(addr => addr.isPrimary);
      if (!hasPrimary && updatedList.length > 0) {
        updatedList = updatedList.map((addr, idx) => idx === 0 ? { ...addr, isPrimary: true } : addr);
      }
    }

    setIsSavingAddress(true);
    const payload = { 
      firstName: customerInfo.firstName, 
      lastName: customerInfo.lastName || '', 
      phone: customerInfo.phone || '', 
      addresses: updatedList 
    };

    const result = await updateProfile(payload);
    setIsSavingAddress(false);

    if (result.success) {
      await fetchProfile();
      setIsAddingAddress(false);
      setSelectedAddressId(newAddress.id);
      addToast('Address added successfully', 'success');
    } else {
      addToast(result.error || 'Failed to add address', 'error');
    }
  };

  // ---------- Payment ----------
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'COD') {
      await placeFinalOrder(null);
    } else {
      await processRazorpayPayment();
    }
  };

  const processRazorpayPayment = async () => {
    setIsPlacingOrder(true);
    setPaymentOverlay({ visible: true, status: 'processing', message: 'Initializing payment gateway...' });

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      addToast('Razorpay SDK failed to load. Are you online?', 'error');
      setPaymentOverlay({ visible: false, status: 'idle', message: '' });
      setIsPlacingOrder(false);
      return;
    }

    try {
      const token = getToken();

      // Step 1: Create Razorpay order on our server
      setPaymentOverlay({ visible: true, status: 'processing', message: 'Creating secure payment order...' });
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: totalPrice, currency: 'INR' })
      });

      if (!orderRes.ok) {
        addToast('Failed to initialize payment', 'error');
        setPaymentOverlay({ visible: false, status: 'idle', message: '' });
        setIsPlacingOrder(false);
        return;
      }

      const orderData = await orderRes.json();

      // --- Dummy mode: simulate the full flow with delays ---
      if (orderData.key === 'rzp_test_dummy') {
        setPaymentOverlay({ visible: true, status: 'processing', message: 'Processing payment...' });
        
        await new Promise(r => setTimeout(r, 1200));
        
        setPaymentOverlay({ visible: true, status: 'verifying', message: 'Verifying payment with server...' });
        
        // Call verification endpoint even in dummy mode for consistency
        const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: 'pay_dummy_' + Date.now(),
            razorpaySignature: 'dummy_sig_' + Date.now()
          })
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.status === 'verified') {
          setPaymentOverlay({ visible: true, status: 'success', message: 'Payment verified successfully!' });
          await new Promise(r => setTimeout(r, 800));
          
          await placeFinalOrder({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: 'pay_dummy_' + Date.now(),
            razorpaySignature: 'dummy_sig_' + Date.now()
          });
        } else {
          setPaymentOverlay({ visible: true, status: 'failed', message: 'Payment verification failed' });
          await new Promise(r => setTimeout(r, 2000));
          setPaymentOverlay({ visible: false, status: 'idle', message: '' });
          addToast('Payment verification failed. Please try again.', 'error');
          setIsPlacingOrder(false);
        }
        return;
      }

      // --- Real Razorpay mode ---
      setPaymentOverlay({ visible: false, status: 'idle', message: '' }); // Hide overlay while Razorpay modal is open

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vastra Loom",
        description: "Handloom Saree Purchase",
        order_id: orderData.orderId,
        handler: async function (response) {
          // Step 2: Verify payment signature server-side
          setPaymentOverlay({ visible: true, status: 'verifying', message: 'Verifying payment with server...' });

          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.status === 'verified') {
              setPaymentOverlay({ visible: true, status: 'success', message: 'Payment verified successfully!' });
              await new Promise(r => setTimeout(r, 800));

              // Step 3: Create the order
              await placeFinalOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });
            } else {
              setPaymentOverlay({ visible: true, status: 'failed', message: 'Payment verification failed. Your money will be refunded.' });
              await new Promise(r => setTimeout(r, 3000));
              setPaymentOverlay({ visible: false, status: 'idle', message: '' });
              addToast('Payment verification failed. Please contact support if you were charged.', 'error');
              setIsPlacingOrder(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            setPaymentOverlay({ visible: true, status: 'failed', message: 'Could not verify payment. Please contact support.' });
            await new Promise(r => setTimeout(r, 3000));
            setPaymentOverlay({ visible: false, status: 'idle', message: '' });
            addToast('Error verifying payment', 'error');
            setIsPlacingOrder(false);
          }
        },
        prefill: {
          name: (customerInfo?.firstName || '') + ' ' + (customerInfo?.lastName || ''),
          email: customerInfo?.email,
          contact: customerInfo?.phone,
          method: paymentMethod === 'UPI' ? 'upi' : 'card'
        },
        theme: { color: "#c3a27e" },
        modal: {
          ondismiss: () => {
            setPaymentOverlay({ visible: false, status: 'idle', message: '' });
            setIsPlacingOrder(false);
            addToast('Payment cancelled', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setPaymentOverlay({ visible: true, status: 'failed', message: response.error.description || 'Payment failed' });
        setTimeout(() => {
          setPaymentOverlay({ visible: false, status: 'idle', message: '' });
          setIsPlacingOrder(false);
        }, 3000);
        addToast('Payment failed: ' + response.error.description, 'error');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      setPaymentOverlay({ visible: false, status: 'idle', message: '' });
      addToast('Error initializing payment gateway', 'error');
      setIsPlacingOrder(false);
    }
  };

  const placeFinalOrder = async (razorpayData) => {
    setIsPlacingOrder(true);
    setPaymentOverlay(prev => prev.visible ? { ...prev, status: 'processing', message: 'Placing your order...' } : prev);
    
    const orderRequest = {
      addressId: selectedAddressId,
      paymentMethod,
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
      ...(razorpayData || {})
    };

    try {
      const token = getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderRequest)
      });
      if (res.ok) {
        setPaymentOverlay({ visible: true, status: 'success', message: 'Order placed successfully!' });
        await new Promise(r => setTimeout(r, 1200));
        clearCart();
        setPaymentOverlay({ visible: false, status: 'idle', message: '' });
        addToast('Order placed successfully!', 'success');
        onNavigate('profile');
      } else {
        setPaymentOverlay({ visible: false, status: 'idle', message: '' });
        addToast('Failed to place order', 'error');
        setIsPlacingOrder(false);
      }
    } catch (err) {
      setPaymentOverlay({ visible: false, status: 'idle', message: '' });
      addToast('Failed to place order', 'error');
      setIsPlacingOrder(false);
    }
  };

  // ---------- Empty State ----------
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your Cart is Empty</h2>
          <button onClick={() => onNavigate('')} className="checkout-btn primary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  const selectedAddress = customerInfo?.addresses?.find(a => a.id === selectedAddressId);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ---------- Render ----------
  return (
    <div className="checkout-page">
      {/* Payment Processing Overlay */}
      {paymentOverlay.visible && (
        <div className="payment-overlay">
          <div className="payment-overlay__card">
            <div className={`payment-overlay__icon ${paymentOverlay.status}`}>
              {paymentOverlay.status === 'processing' && (
                <div className="payment-spinner">
                  <svg viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="90 150" strokeDashoffset="0" />
                  </svg>
                </div>
              )}
              {paymentOverlay.status === 'verifying' && (
                <div className="payment-shield">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path className="shield-check" d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              )}
              {paymentOverlay.status === 'success' && (
                <div className="payment-success-icon">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path className="check-draw" d="M8 12l3 3 5-5" />
                  </svg>
                </div>
              )}
              {paymentOverlay.status === 'failed' && (
                <div className="payment-failed-icon">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </div>
              )}
            </div>
            <p className={`payment-overlay__message ${paymentOverlay.status}`}>{paymentOverlay.message}</p>
            {paymentOverlay.status === 'processing' && (
              <div className="payment-overlay__dots">
                <span></span><span></span><span></span>
              </div>
            )}
            {paymentOverlay.status === 'failed' && (
              <button 
                className="checkout-btn secondary payment-retry-btn"
                onClick={() => {
                  setPaymentOverlay({ visible: false, status: 'idle', message: '' });
                  setIsPlacingOrder(false);
                }}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      <div className="checkout-header-area">
        <h1 className="checkout-title">Secure Checkout</h1>
        <button onClick={() => onNavigate('')} className="checkout-back-link">← Back to Shopping</button>
      </div>

      <div className="checkout-wizard">
        {/* ── Progress Bar ── */}
        <div className="wizard-progress">
          <div className={`wizard-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed clickable' : ''}`} onClick={() => currentStep > 1 && setCurrentStep(1)}>
            <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
            <span>Address</span>
          </div>
          <div className={`wizard-line ${currentStep > 1 ? 'filled' : ''}`} />
          <div className={`wizard-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed clickable' : ''}`} onClick={() => currentStep > 2 && setCurrentStep(2)}>
            <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
            <span>Summary</span>
          </div>
          <div className={`wizard-line ${currentStep > 2 ? 'filled' : ''}`} />
          <div className={`wizard-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Payment</span>
          </div>
        </div>

        {/* ── Step 1: Address ── */}
        {currentStep === 1 && (
          <section className="checkout-section fade-in active-step">
            <div className="section-header">
              <h2>Select Delivery Address</h2>
            </div>

            <div className="section-content">
              {customerInfo?.addresses?.length > 0 && !isAddingAddress ? (
                <>
                  <div className="address-list">
                    {customerInfo.addresses.map(addr => (
                      <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}>
                        <input 
                          type="radio" name="address" value={addr.id} 
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="address-details">
                          <div className="address-card-header">
                            <strong>{addr.fullName}</strong>
                            <span className={`address-badge ${(addr.addressType || 'home').toLowerCase()}`}>
                              {addr.addressType || 'HOME'}
                            </span>
                          </div>
                          <p>{addr.streetAddress}</p>
                          {addr.landmark && <p>Near: {addr.landmark}</p>}
                          <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                          <p className="phone">📞 {addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button className="add-address-link" onClick={handleAddAddressClick}>+ Add New Address</button>

                  <div className="step-actions mt-4">
                    <button className="checkout-btn primary full-width" onClick={() => setCurrentStep(2)} disabled={!selectedAddressId}>
                      Continue to Summary
                    </button>
                  </div>
                </>
              ) : (
                <form className="address-form-full" onSubmit={handleAddAddressSubmit}>
                  {/* Address Type */}
                  <div className="form-group">
                    <label>Address Type</label>
                    <div className="radio-group row-style">
                      {['HOME', 'WORK', 'OTHER'].map(type => (
                        <label key={type} className={`radio-pill ${addressType === type ? 'selected' : ''}`}>
                          <input type="radio" name="addressType" value={type} checked={addressType === type} onChange={e => setAddressType(e.target.value)} />
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Recipient Name <span className="req">*</span></label>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={formErrors.fullName ? 'error' : ''} placeholder="Full name" />
                      {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Delivery Phone <span className="req">*</span></label>
                      <input type="tel" maxLength="10" value={shippingPhone} onChange={e => setShippingPhone(e.target.value.replace(/\D/g, ''))} className={formErrors.shippingPhone ? 'error' : ''} placeholder="10-digit number" />
                      {formErrors.shippingPhone && <span className="error-text">{formErrors.shippingPhone}</span>}
                    </div>
                  </div>

                  {/* Street */}
                  <div className="form-group">
                    <label>Street Address <span className="req">*</span></label>
                    <textarea value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className={formErrors.streetAddress ? 'error' : ''} placeholder="House no, building, street, area" />
                    {formErrors.streetAddress && <span className="error-text">{formErrors.streetAddress}</span>}
                  </div>

                  {/* Landmark */}
                  <div className="form-group">
                    <label>Landmark <span style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'none', letterSpacing: 0 }}>(Optional)</span></label>
                    <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Near temple, school, etc." />
                  </div>

                  {/* Pincode + Country */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pincode <span className="req">*</span> {isPincodeLoading && <span className="loading-tag">Auto-filling...</span>}</label>
                      <input type="text" maxLength="6" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))} className={formErrors.pincode ? 'error' : ''} placeholder="6-digit PIN" />
                      {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" value={country} readOnly disabled className="disabled-input" />
                    </div>
                  </div>

                  {/* State + City */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>State <span className="req">*</span> {isStatesLoading && <span className="loading-tag">Loading...</span>}</label>
                      <select value={state} onChange={e => setState(e.target.value)} className={formErrors.state ? 'error' : ''}>
                        <option value="">Select State</option>
                        {state && !indianStates.includes(state) && <option value={state}>{state}</option>}
                        {indianStates.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                      </select>
                      {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label>City <span className="req">*</span> {isCitiesLoading && <span className="loading-tag">Loading...</span>}</label>
                      <select value={city} onChange={e => setCity(e.target.value)} className={formErrors.city ? 'error' : ''} disabled={!state}>
                        <option value="">Select City</option>
                        {city && !indianCities.includes(city) && <option value={city}>{city}</option>}
                        {indianCities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                      </select>
                      {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                    </div>
                  </div>

                  {/* Primary checkbox */}
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="isPrimaryAddr" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)} />
                    <label htmlFor="isPrimaryAddr">Set as primary shipping address</label>
                  </div>

                  {/* Actions */}
                  <div className="form-actions mt-4">
                    {customerInfo?.addresses?.length > 0 && (
                      <button type="button" className="checkout-btn secondary" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                    )}
                    <button type="submit" className="checkout-btn primary" disabled={isSavingAddress}>
                      {isSavingAddress ? 'Saving...' : 'Save & Use This Address'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* ── Step 2: Summary ── */}
        {currentStep === 2 && (
          <section className="checkout-section fade-in active-step">
            <div className="section-header">
              <h2>Review Your Order</h2>
            </div>

            <div className="section-content">
              {/* Cart Items */}
              <div className="summary-items-full">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item-full">
                    <img src={item.image} alt={item.name} className="summary-item-full-img" />
                    <div className="summary-item-full-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="summary-totals-full">
                <div className="summary-row-full">
                  <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row-full">
                  <span>Shipping</span>
                  <span style={{ color: 'var(--color-success)' }}>Free</span>
                </div>
                <div className="summary-row-full total-row">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery Address Preview */}
              <div className="delivery-info">
                <h3>Delivering to</h3>
                {selectedAddress && (
                  <div className="address-card selected no-pointer">
                    <div className="address-details">
                      <div className="address-card-header">
                        <strong>{selectedAddress.fullName}</strong>
                        <span className={`address-badge ${(selectedAddress.addressType || 'home').toLowerCase()}`}>
                          {selectedAddress.addressType || 'HOME'}
                        </span>
                      </div>
                      <p>{selectedAddress.streetAddress}</p>
                      <p>{selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}</p>
                      <p className="phone">📞 {selectedAddress.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="secure-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                100% Secure Checkout · Free Shipping
              </div>

              <div className="step-actions mt-4">
                <button className="checkout-btn secondary" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="checkout-btn primary" onClick={() => setCurrentStep(3)}>Continue to Payment</button>
              </div>
            </div>
          </section>
        )}

        {/* ── Step 3: Payment ── */}
        {currentStep === 3 && (
          <section className="checkout-section fade-in active-step">
            <div className="section-header">
              <h2>Choose Payment Method</h2>
            </div>

            <div className="section-content">
              <div className="payment-options">
                <label className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                  <div className="payment-icon-wrapper">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div className="payment-details">
                    <strong>UPI (GPay, PhonePe, Paytm)</strong>
                    <p>Instant secure payment via Razorpay</p>
                  </div>
                  <div className="payment-badge">Recommended</div>
                </label>

                <label className={`payment-card ${paymentMethod === 'CREDIT_CARD' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="CREDIT_CARD" checked={paymentMethod === 'CREDIT_CARD'} onChange={() => setPaymentMethod('CREDIT_CARD')} />
                  <div className="payment-icon-wrapper">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                      <line x1="7" y1="15" x2="7.01" y2="15" />
                      <line x1="11" y1="15" x2="13" y2="15" />
                    </svg>
                  </div>
                  <div className="payment-details">
                    <strong>Credit / Debit Card</strong>
                    <p>Visa, MasterCard, RuPay & more</p>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div className="payment-icon-wrapper">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="payment-details">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive the order</p>
                  </div>
                </label>
              </div>

              {/* Payment Security Info */}
              <div className="payment-security-info">
                <div className="security-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="security-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Secure Payment Gateway</span>
                </div>
                <div className="security-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Verified by Razorpay</span>
                </div>
              </div>

              <div className="step-actions mt-4">
                <button className="checkout-btn secondary" onClick={() => setCurrentStep(2)}>Back</button>
                <button className="checkout-btn primary large-btn" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                  {isPlacingOrder ? 'Processing...' : paymentMethod === 'COD' ? `Place Order — ₹${totalPrice.toLocaleString('en-IN')}` : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
