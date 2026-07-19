import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function OAuth2RedirectHandler() {
  // Use custom auth login logic if available, or just set token manually
  // const { loginWithToken } = useAuth(); // If available

  useEffect(() => {
    // Extract token from URL query params manually
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Save token to localStorage using AuthContext keys
      localStorage.setItem('vastra_token', token);
      localStorage.setItem('vastra_role', 'ROLE_USER');
      
      // Redirect to root safely without react-router-dom
      window.location.href = '/'; 
    } else {
      // Handle error by sending them back with an error hash or URL param
      window.location.href = '/?error=oauth2_failed';
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#121212', color: '#d4a853' }}>
      <h2>Authenticating...</h2>
    </div>
  );
}
