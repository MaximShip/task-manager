import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Таймаут запроса
  timeout: 10000
});

// Добавляем интерцептор для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Ошибка запроса:', error);
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Детальное логирование ошибок для отладки
    console.error('API Error:', error);
    
    // Вывод подробной информации об ошибке
    if (error.response) {
      console.error('Статус ошибки:', error.response.status);
      console.error('Данные ошибки:', error.response.data);
      console.error('Заголовки ответа:', error.response.headers);
    } else if (error.request) {
      console.error('Запрос был сделан, но ответ не получен');
      console.error('Запрос:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }
    
    // Обработка случая, когда токен истек
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Функция для проверки работоспособности API
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API не доступен:', error);
    throw new Error('API не отвечает');
  }
};

export default api;