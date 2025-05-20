import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  // Флаг для отслеживания, была ли уже выполнена загрузка задач
  const [hasLoaded, setHasLoaded] = useState(false);

  // Мемоизированная функция fetchTasks для предотвращения бесконечного цикла
  const fetchTasks = useCallback(async () => {
    // Если уже идет загрузка, не делаем повторный запрос
    if (isLoading) return;
    
    try {
      console.log('Начало загрузки задач...');
      setIsLoading(true);
      setError(null);
      
      const response = await taskService.getAllTasks();
      
      console.log('Задачи успешно загружены:', response);
      
      if (response.success) {
        setTasks(response.tasks || []);
      } else {
        console.error('Ошибка в ответе API:', response);
        setError(response.message || 'Не удалось загрузить задачи');
        // Установим пустой массив задач, чтобы не отображать старые задачи
        setTasks([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
      setError(error.message || 'Не удалось загрузить задачи. Пожалуйста, попробуйте позже.');
      // Установим пустой массив задач, чтобы не отображать старые задачи
      setTasks([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
      console.log('Загрузка задач завершена');
    }
  }, [isLoading]); // Зависимость только от isLoading

  // Загружаем задачи при авторизации пользователя
  useEffect(() => {
    if (user && !hasLoaded) {
      fetchTasks();
    } else if (!user) {
      setTasks([]);
      setIsLoading(false);
      setError(null);
      setHasLoaded(false);
    }
  }, [user, fetchTasks, hasLoaded]);

  // Получение задачи по ID
  const getTaskById = async (id) => {
    try {
      console.log(`Получение задачи по ID: ${id}`);
      const response = await taskService.getTaskById(id);
      
      if (response.success) {
        return response.task;
      }
      
      throw new Error(response.message || 'Задача не найдена');
    } catch (error) {
      console.error('Ошибка при получении задачи:', error);
      throw error;
    }
  };

  // Создание новой задачи
  const createTask = async (taskData) => {
    try {
      console.log('Создание новой задачи:', taskData);
      const response = await taskService.createTask(taskData);
      
      if (response.success) {
        // Обновляем состояние задач
        setTasks(prevTasks => [...prevTasks, response.task]);
        return { success: true, task: response.task };
      }
      
      return { 
        success: false, 
        message: response.message || 'Не удалось создать задачу' 
      };
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось создать задачу. Попробуйте позже.' 
      };
    }
  };

  // Обновление задачи
  const updateTask = async (id, taskData) => {
    try {
      console.log(`Обновление задачи ID: ${id}`, taskData);
      const response = await taskService.updateTask(id, taskData);
      
      if (response.success) {
        // Обновляем состояние задач
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === id ? response.task : task)
        );
        return { success: true, task: response.task };
      }
      
      return { 
        success: false, 
        message: response.message || 'Не удалось обновить задачу' 
      };
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось обновить задачу. Попробуйте позже.' 
      };
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      console.log(`Удаление задачи ID: ${id}`);
      const response = await taskService.deleteTask(id);
      
      if (response.success) {
        // Обновляем состояние задач
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.message || 'Не удалось удалить задачу' 
      };
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось удалить задачу. Попробуйте позже.' 
      };
    }
  };

  // Получение задач по статусу
  const getTasksByStatus = async (status) => {
    try {
      console.log(`Получение задач по статусу: ${status}`);
      const response = await taskService.getTasksByStatus(status);
      
      if (response.success) {
        return { success: true, tasks: response.tasks || [] };
      }
      
      return { 
        success: false, 
        message: response.message || 'Не удалось получить задачи' 
      };
    } catch (error) {
      console.error('Ошибка при получении задач по статусу:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось получить задачи. Попробуйте позже.' 
      };
    }
  };

  // Получение задач по дате
  const getTasksByDate = async (date) => {
    try {
      console.log(`Получение задач по дате: ${date}`);
      const response = await taskService.getTasksByDate(date);
      
      if (response.success) {
        return { success: true, tasks: response.tasks || [] };
      }
      
      return { 
        success: false, 
        message: response.message || 'Не удалось получить задачи' 
      };
    } catch (error) {
      console.error('Ошибка при получении задач по дате:', error);
      return { 
        success: false, 
        message: error.message || 'Не удалось получить задачи. Попробуйте позже.' 
      };
    }
  };

  // Принудительное обновление списка задач
  const refreshTasks = () => {
    console.log('Принудительное обновление списка задач');
    setHasLoaded(false); // Сбрасываем флаг загрузки, чтобы useEffect сработал снова
  };

  const value = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByDate,
    refreshTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}