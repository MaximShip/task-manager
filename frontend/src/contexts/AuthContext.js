import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем, сохранен ли токен в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Получаем данные пользователя
      authService.getMe()
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            // Если что-то пошло не так, удаляем токен
            localStorage.removeItem('token');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Регистрация пользователя
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Ошибка регистрации' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось зарегистрироваться. Попробуйте позже.' 
      };
    }
  };

  // Авторизация пользователя
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Ошибка входа' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось войти. Попробуйте позже.' 
      };
    }
  };

  // Выход из системы
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}