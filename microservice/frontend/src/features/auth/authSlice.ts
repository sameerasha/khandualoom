import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = 'vastra_token';
const REFRESH_TOKEN_KEY = 'vastra_refresh_token';
const ROLE_KEY = 'vastra_role';
const USERNAME_KEY = 'vastra_username';

const initialToken = localStorage.getItem(TOKEN_KEY);
const initialRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
const initialRole = localStorage.getItem(ROLE_KEY);
const initialUsername = localStorage.getItem(USERNAME_KEY);

const initialState: AuthState = {
  user: initialUsername
    ? {
        id: 0,
        firstName: initialUsername,
        lastName: '',
        email: initialUsername,
        role: (initialRole as any) || 'ROLE_USER',
        emailVerified: false,
        phoneVerified: false,
      }
    : null,
  token: initialToken,
  refreshToken: initialRefreshToken,
  role: initialRole,
  isAuthenticated: Boolean(initialToken),
  isAdmin: initialRole === 'ROLE_ADMIN' || initialRole === 'ROLE_SUPER_ADMIN',
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        role: string;
        username: string;
      }>
    ) => {
      const { accessToken, refreshToken, role, username } = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
      state.isAuthenticated = true;
      state.isAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN';
      state.user = {
        id: 0,
        firstName: username,
        lastName: '',
        email: username,
        role: role as any,
        emailVerified: true,
        phoneVerified: false,
      };
      state.error = null;

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(ROLE_KEY, role);
      localStorage.setItem(USERNAME_KEY, username);
    },
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAdmin = action.payload.role === 'ROLE_ADMIN' || action.payload.role === 'ROLE_SUPER_ADMIN';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(USERNAME_KEY);
    },
  },
});

export const { setCredentials, setUserProfile, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
