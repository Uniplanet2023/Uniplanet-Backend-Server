import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  tokenLogin: () => Promise<any>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://auth.uniplanet.shop/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'charset': 'UTF-8'
        },
        body: JSON.stringify({ email, password }), 
        credentials: 'include'
      });
      if (response.ok) {
        setIsLoggedIn(true);
        router.push('/delete-account'); // Redirect to delete account page after successful login
      } else {
        console.error('Login failed');
      }
    } catch (e) {
      console.error("Error during login", e);
    }
  };
  const tokenLogin = async () => {
    try {
      const response = await fetch('https://auth.uniplanet.shop/api/auth/token-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'charset': 'UTF-8'
        },
        body: JSON.stringify({}),
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(true);
        return response.json();
      } else {
        console.error("Token login failed", response.statusText);
      }
    } catch (e) {
      console.error("Error during token login", e);
    }
  };
  const logout = () => {
    setIsLoggedIn(false);
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, tokenLogin}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};