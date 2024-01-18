import { createContext, useContext, useEffect } from 'react';
import httpClient from '../httpClient';
import { useLocation } from 'react-router-dom';
import React from 'react';

type AuthContextType = {
  updateIsLoggedIn: () => void;
  logout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(isLoggedIn)
  }, [isLoggedIn])

  useEffect(() => {
    updateIsLoggedIn();
  }, [location, setIsLoggedIn, isLoggedIn])

  const updateIsLoggedIn = () => {
    httpClient.get('http://localhost:5002/auth-status')
    .then((response) => {setIsLoggedIn(response.data.isLoggedIn)})
    .catch(error => {
      console.error(error)
      setIsLoggedIn(false)
    });
  }

  const logout = () => {
    httpClient.post('http://localhost:5002/logout')
      .then((response) => {
        if (response.status === 200) setIsLoggedIn(false)
      }).catch((error) => {
        if (error.response.status === 401) {
          console.error('Logout failed')
        } else {
          console.error(error.response.data)
          console.error(error.response.status)
          console.error(error.response.headers)
        }
      })
  }

  const contextValue = {
    updateIsLoggedIn,
    logout,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const currentContext = useContext(AuthContext);

  if (!currentContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return currentContext;
};
