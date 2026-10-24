import React, { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';

export const OAuth2RedirectHandler: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const username = params.get('username') || params.get('email') || 'Valued Patron';

    if (token) {
      dispatch(
        setCredentials({
          accessToken: token,
          refreshToken: refreshToken || '',
          username,
          role: 'ROLE_USER',
        })
      );
      window.location.href = '/';
    } else {
      window.location.href = '/?error=oauth2_failed';
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0F0617] flex flex-col items-center justify-center text-brand-gold">
      <div className="w-12 h-12 border-3 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="font-serif text-xl tracking-wider">Authenticating with Royal Salon...</h2>
    </div>
  );
};
