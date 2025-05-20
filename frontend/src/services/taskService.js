import api from '../utils/api';

// Получение всех задач
const getAllTasks = async () => {
  try {
    console.log('Запрос на получение всех задач');
    const response = await api.get('/tasks');
    console.log('Получен ответ с задачами:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при получении задач:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при получении задач';
    
    throw new Error(errorMessage);
  }
};

// Получение задачи по ID
const getTaskById = async (id) => {
  try {
    console.log(`Запрос на получение задачи по ID: ${id}`);
    const response = await api.get(`/tasks/${id}`);
    console.log('Получен ответ с задачей:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при получении задачи:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при получении задачи';
    
    throw new Error(errorMessage);
  }
};

// Создание новой задачи
const createTask = async (taskData) => {
  try {
    console.log('Запрос на создание задачи:', taskData);
    const response = await api.post('/tasks', taskData);
    console.log('Получен ответ после создания задачи:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при создании задачи:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при создании задачи';
    
    throw new Error(errorMessage);
  }
};

// Обновление задачи
const updateTask = async (id, taskData) => {
  try {
    console.log(`Запрос на обновление задачи ID: ${id}`, taskData);
    const response = await api.put(`/tasks/${id}`, taskData);
    console.log('Получен ответ после обновления задачи:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при обновлении задачи:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при обновлении задачи';
    
    throw new Error(errorMessage);
  }
};

// Удаление задачи
const deleteTask = async (id) => {
  try {
    console.log(`Запрос на удаление задачи ID: ${id}`);
    const response = await api.delete(`/tasks/${id}`);
    console.log('Получен ответ после удаления задачи:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при удалении задачи:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при удалении задачи';
    
    throw new Error(errorMessage);
  }
};

// Получение задач по статусу
const getTasksByStatus = async (status) => {
  try {
    console.log(`Запрос на получение задач по статусу: ${status}`);
    const response = await api.get(`/tasks/status/${status}`);
    console.log('Получен ответ с задачами по статусу:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при получении задач по статусу:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при получении задач по статусу';
    
    throw new Error(errorMessage);
  }
};

// Получение задач по дате
const getTasksByDate = async (date) => {
  try {
    console.log(`Запрос на получение задач по дате: ${date}`);
    const response = await api.get(`/tasks/date/${date}`);
    console.log('Получен ответ с задачами по дате:', response.data);
    return response.data;
  } catch (error) {
    console.error('Детальная ошибка при получении задач по дате:', error);
    
    // Извлекаем сообщение ошибки из ответа сервера, если оно есть
    const errorMessage = 
      error.response?.data?.message || 
      'Произошла ошибка при получении задач по дате';
    
    throw new Error(errorMessage);
  }
};

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByDate
}

export default taskService