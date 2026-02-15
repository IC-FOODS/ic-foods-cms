import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setAccessToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(
    () => localStorage.getItem('access_token')
  );
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = useCallback((token: string) => {
    localStorage.setItem('access_token', token);
    setAccessTokenState(token);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('access_token');
    setAccessTokenState(null);
    setUser(null);
  }, []);

  /** Try to get a fresh access token via the httpOnly refresh cookie. */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/oauth/refresh/`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const { access } = await res.json();
        localStorage.setItem('access_token', access);
        setAccessTokenState(access);
        return access;
      }
    } catch {
      // refresh endpoint unreachable
    }
    return null;
  }, []);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (res.ok) {
        setUser(await res.json());
      } else if (res.status === 401) {
        // Access token expired — try cookie-based refresh
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          const retryRes = await fetch(`${API_BASE}/api/auth/me/`, {
            headers: { Authorization: `Bearer ${newAccess}` },
            credentials: 'include',
          });
          if (retryRes.ok) {
            setUser(await retryRes.json());
            return;
          }
        }
        clearAuth();
      }
    } catch {
      // API unreachable — keep token, user will be null
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, refreshAccessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchUser(accessToken);
    } else {
      setIsLoading(false);
    }
  }, [accessToken, fetchUser]);

  const login = useCallback(() => {
    const djangoBase = API_BASE || window.location.origin;
    window.location.href = `${djangoBase}/accounts/google/login/?process=login`;
  }, []);

  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await fetch(`${API_BASE}/api/auth/oauth/logout/`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });
      } catch {
        // Logout API failed — clear local state anyway
      }
    }
    clearAuth();
  }, [accessToken, clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
