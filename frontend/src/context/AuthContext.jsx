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

  // Fetch the currently authenticated user's profile (for customer)
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data);
        return data;
      }
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
    return null;
  }, []);

  // Initialize auth state on mount/reload
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const role = localStorage.getItem(ROLE_KEY);
      const username = localStorage.getItem(USERNAME_KEY);

      if (token) {
        if (role === 'ROLE_ADMIN') {
          setIsAdmin(true);
        } else if (role === 'ROLE_USER') {
          setIsCustomerLoggedIn(true);
          setCustomerInfo({ username });
          await fetchProfile();
        }
      }
    };
    initAuth();
  }, [fetchProfile]);

  // Unified login handling both admins and customers based on role
  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
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
          setCustomerInfo({ username: data.username });
          // Fetch full profile (including addresses)
          try {
            const profileResponse = await fetch('http://localhost:8080/api/users/profile', {
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
    } catch (error) {
      setLoginError('Server connection error. Please make sure the backend is running.');
      return { success: false };
    }
  }, []);

  // Customer Sign Up
  const signup = useCallback(async (username, email, password, phone) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, phone }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText || 'Registration failed' };
      }
    } catch (e) {
      return { success: false, error: 'Server connection error. Please try again.' };
    }
  }, []);

  // Update profile settings & shipping addresses
  const updateProfile = useCallback(async (profileData) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('http://localhost:8080/api/users/profile', {
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
        localStorage.setItem(USERNAME_KEY, data.username);
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText || 'Failed to update profile' };
      }
    } catch (e) {
      return { success: false, error: 'Server connection error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setIsCustomerLoggedIn(false);
    setCustomerInfo(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }, []);

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
      signup,
      logout,
      loginError,
      clearError,
      getToken,
      fetchProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
