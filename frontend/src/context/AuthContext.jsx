import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();
const TOKEN_KEY = 'vastra_token';
const ROLE_KEY = 'vastra_role';
const USERNAME_KEY = 'vastra_username';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loginError, setLoginError] = useState('');

  const logout = useCallback(() => {
    setIsAdmin(false);
    setIsCustomerLoggedIn(false);
    setCustomerInfo(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }, []);

  const handleSessionExpired = useCallback(() => {
    logout();
    setLoginError('Your session has expired. Please log in again.');
  }, [logout]);

  // Fetch the currently authenticated user's profile (for customer)
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    if (token.startsWith('mock-sso-token')) {
      const parts = token.split('-');
      const timestamp = parseInt(parts[parts.length - 1], 10);
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        handleSessionExpired();
        return null;
      }
      return null; // Mock profile handled in initAuth
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!data.email || data.email.trim() === '' || data.email === 'undefined') {
          handleSessionExpired();
          window.dispatchEvent(new Event('force-signup'));
          return null;
        }

        setCustomerInfo(data);
        return data;
      } else if (response.status === 401) {
        handleSessionExpired();
      }
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
    return null;
  }, [handleSessionExpired]);
  // Global fetch interceptor for 401 handling
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function () {
      const response = await originalFetch.apply(this, arguments);
      if (response.status === 401) {
        handleSessionExpired();
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [handleSessionExpired]);

  // Initialize auth state on mount/reload
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const role = localStorage.getItem(ROLE_KEY);
      let username = localStorage.getItem(USERNAME_KEY);
      
      // Fix broken state from previous bug
      if (username === 'undefined') {
        username = '';
        localStorage.removeItem(USERNAME_KEY);
      }

      if (token) {
        if (token.startsWith('mock-sso-token')) {
          const parts = token.split('-');
          const timestamp = parseInt(parts[parts.length - 1], 10);
          if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
            handleSessionExpired();
            return;
          }
        } else {
          // Check standard JWT expiration
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            if (payload.exp && (payload.exp * 1000) < Date.now()) {
              handleSessionExpired();
              return;
            }
          } catch (e) {
            // Invalid token format
            handleSessionExpired();
            return;
          }
        }

        if (role === 'ROLE_ADMIN') {
          setIsAdmin(true);
        } else if (role === 'ROLE_USER') {
          setIsCustomerLoggedIn(true);
          
          if (username && username.trim() !== '') {
            setCustomerInfo({ firstName: username, email: username }); // username var holds email or original mock id
          }
          if (!token.startsWith('mock-sso-token')) {
            await fetchProfile();
          } else {
            // Re-inflate mock info for social SSO user session
            setCustomerInfo({
              firstName: username,
              lastName: '',
              email: `${username.toLowerCase()}@social.com`,
              phone: '+91 99999 88888',
              addresses: [
                {
                  id: 999,
                  addressType: 'HOME',
                  fullName: username,
                  streetAddress: '123 Heritage Lane, Handloom Enclave',
                  city: 'Varanasi',
                  state: 'Uttar Pradesh',
                  pincode: '221001',
                  landmark: 'Near Kashi Vishwanath Temple',
                  country: 'India'
                }
              ]
            });
          }
        }
      }
    };
    initAuth();
  }, [fetchProfile, handleSessionExpired]);

  // Unified login handling both admins and customers based on role
  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.username || data.username.trim() === '' || data.username === 'undefined') {
          handleSessionExpired();
          window.dispatchEvent(new Event('force-signup'));
          return { success: false, error: 'Email missing. Please sign up.' };
        }

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(ROLE_KEY, data.role);
        localStorage.setItem(USERNAME_KEY, data.username);

        if (data.role === 'ROLE_ADMIN') {
          setIsAdmin(true);
          setIsCustomerLoggedIn(false);
          setCustomerInfo(null);
        } else {
          setIsCustomerLoggedIn(true);
          setIsAdmin(false);
          setCustomerInfo({ email: data.username, firstName: 'User' }); // username field from jwt holds email
          // Fetch full profile (including addresses)
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${data.accessToken}`,
              },
            });
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setCustomerInfo(profileData);
            }
          } catch (e) {
            console.error('Failed to load profile details immediately:', e);
          }
        }
        setLoginError('');
        return { success: true, role: data.role };
      } else {
        const errorMsg = await response.text();
        setLoginError(errorMsg || 'Invalid username or password');
        return { success: false };
      }
    } catch {
      setLoginError('Server connection error. Please make sure the backend is running.');
      return { success: false };
    }
  }, [handleSessionExpired]);

  // Mock SSO Login for Social Networks (Gmail, Facebook, Instagram)
  const socialLogin = useCallback((provider, username) => {
    const mockToken = `mock-sso-token-${provider}-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(ROLE_KEY, 'ROLE_USER');
    localStorage.setItem(USERNAME_KEY, username);

    setIsCustomerLoggedIn(true);
    setIsAdmin(false);
    setCustomerInfo({
      firstName: username,
      lastName: '',
      email: `${username.toLowerCase()}@${provider.toLowerCase()}.com`,
      phone: '+91 99999 88888',
      addresses: [
        {
          id: 999,
          addressType: 'HOME',
          fullName: username,
          streetAddress: '123 Heritage Lane, Handloom Enclave',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          pincode: '221001',
          landmark: 'Near Kashi Vishwanath Temple',
          country: 'India'
        }
      ]
    });
    setLoginError('');
    return { success: true, role: 'ROLE_USER' };
  }, []);

  // Customer Sign Up
  const signup = useCallback(async (firstName, lastName, email, password, phone, otp) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, phone, otp }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText || 'Registration failed' };
      }
    } catch {
      return { success: false, error: 'Server connection error. Please try again.' };
    }
  }, []);

  // Send OTP
  const sendOtp = async (identifier, intent = 'login') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, intent })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.mockOtp) {
          console.log(`[DEBUG] Development OTP for ${identifier}: ${data.mockOtp}`);
        }
        return { success: true, ...data };
      } else {
        const err = await response.text();
        return { success: false, error: err };
      }
    } catch {
      return { success: false, error: 'Connection error while sending OTP.' };
    }
  };

  const verifyOtpStep = async (identifier, otp) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      if (response.ok) {
        return { success: true };
      } else {
        const err = await response.text();
        return { success: false, error: err };
      }
    } catch {
      return { success: false, error: 'Connection error while verifying OTP.' };
    }
  };

  const loginWithOtp = async (identifier, otp) => {
    try {
      setLoginError('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.username || data.username.trim() === '' || data.username === 'undefined') {
          handleSessionExpired();
          window.dispatchEvent(new Event('force-signup'));
          return { success: false, error: 'Email missing. Please sign up.' };
        }

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(ROLE_KEY, data.role);
        localStorage.setItem(USERNAME_KEY, data.username);
        
        const role = data.role;
        if (role === 'ROLE_ADMIN') {
          setIsAdmin(true);
        } else {
          setIsCustomerLoggedIn(true);
          setIsAdmin(false);
          setCustomerInfo({ email: data.username, firstName: 'User' });
          try {
            const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
              headers: { 'Authorization': `Bearer ${data.accessToken}` }
            });
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setCustomerInfo(profileData);
            }
          } catch (e) {
            console.error("Failed to fetch full profile after OTP login", e);
          }
        }
        return { success: true, role };
      } else {
        const err = await response.text();
        setLoginError(err || 'OTP Login failed.');
        return { success: false, error: err };
      }
    } catch {
      setLoginError('Connection error during OTP login.');
      return { success: false, error: 'Connection error during OTP login.' };
    }
  };

  const resetPassword = async (identifier, otp, newPassword) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword })
      });
      if (response.ok) {
        return { success: true };
      } else {
        const err = await response.text();
        return { success: false, error: err };
      }
    } catch {
      return { success: false, error: 'Connection error while resetting password.' };
    }
  };

  // Update profile settings & shipping addresses
  const updateProfile = useCallback(async (profileData) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { success: false, error: 'Not authenticated' };

    if (token.startsWith('mock-sso-token')) {
      // Simulate profile updates locally for mock SSO user
      setCustomerInfo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          username: profileData.username || prev.username,
          phone: profileData.phone || prev.phone,
          addresses: profileData.addresses || prev.addresses,
        };
      });
      if (profileData.username) {
        localStorage.setItem(USERNAME_KEY, profileData.username);
      }
      return { success: true };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data);
        localStorage.setItem(USERNAME_KEY, data.email);
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText || 'Failed to update profile' };
      }
    } catch {
      return { success: false, error: 'Server connection error. Please try again.' };
    }
  }, []);

  // Logout defined at the top

  const clearError = useCallback(() => setLoginError(''), []);

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAdmin,
      isCustomerLoggedIn,
      customerInfo,
      login,
      socialLogin,
      signup,
      logout,
      loginError,
      clearError,
      getToken,
      fetchProfile,
      updateProfile,
      sendOtp,
      verifyOtpStep,
      loginWithOtp,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
