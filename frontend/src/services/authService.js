import api from '../utils/api';

// Регистрация пользователя
const register = async (userData) => {
  try {
    console.log('Отправка запроса регистрации:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Получен ответ:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка регистрации:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при регистрации';
    
    throw new Error(errorMessage);
  }
};

// Вход в систему
const login = async (credentials) => {
  try {
    console.log('Отправка запроса авторизации');
    const response = await api.post('/auth/login', credentials);
    console.log('Получен ответ авторизации');
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка авторизации:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при входе';
    
    throw new Error(errorMessage);
  }
};

// Получение информации о текущем пользователе
const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка получения профиля:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Не удалось получить данные пользователя';
    
    throw new Error(errorMessage);
  }
};

// Создаем объект с методами, который будем экспортировать
const authService = {
  register,
  login,
  getMe
};

export default authService;