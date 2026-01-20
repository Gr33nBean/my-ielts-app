import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { callApi } = useApi();

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('ielts_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const data = await callApi('checkLogin', { 
          params: { email: parsedUser.email },
          silent: true 
        });

        if (data?.success) {
          setUser(data);
          localStorage.setItem('ielts_user', JSON.stringify(data));
        } else if (data) {
          logout();
        } else {
          // Lỗi mạng, dùng data cũ
          setUser(parsedUser);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [callApi]);

  const login = async (email) => {
    const data = await callApi('checkLogin', { 
      params: { email },
      silent: false 
    });

    if (data?.success) {
      setUser(data);
      localStorage.setItem('ielts_user', JSON.stringify(data));
      return { success: true };
    }
    return { success: false, message: data?.message || "Lỗi kết nối server!" };
  };

  const logout = () => {
    localStorage.removeItem('ielts_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);