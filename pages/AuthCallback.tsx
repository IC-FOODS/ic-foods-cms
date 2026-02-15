import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

/**
 * Handles the OAuth callback redirect from Django.
 * Django redirects to: /#/auth/callback?access=<jwt>&state=<nonce>
 * The refresh token is delivered via an httpOnly cookie (not in the URL).
 * This component extracts the access token, stores it, and redirects to home.
 */
const AuthCallback: React.FC = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access = params.get('access');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/', { replace: true });
      return;
    }

    if (access) {
      setAccessToken(access);
      navigate('/', { replace: true });
    } else {
      console.error('OAuth callback missing access token');
      navigate('/', { replace: true });
    }
  }, [location.search, setAccessToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aggie-blue mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
