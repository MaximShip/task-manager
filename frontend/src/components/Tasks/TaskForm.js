import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';

function TaskForm({ showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, createTask, updateTask } = useTask();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'новая',
    dueDate: '',
    reminder: ''
  });

  // Загрузка данных задачи для редактирования
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          setIsLoading(true);
          const task = await getTaskById(id);
          
          // Форматируем дату для поля ввода
          const dueDateFormatted = task.dueDate 
            ? new Date(task.dueDate).toISOString().split('T')[0] 
            : '';
            
          const reminderFormatted = task.reminder 
            ? new Date(task.reminder).toISOString().split('.')[0] 
            : '';

          setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            dueDate: dueDateFormatted,
            reminder: reminderFormatted
          });
        } catch (error) {
          showNotification('Не удалось загрузить данные задачи', 'error');
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTask();
    }
  }, [id, getTaskById, navigate, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Подготавливаем данные
      const taskData = {
        ...formData,
        dueDate: formData.dueDate || null,
        reminder: formData.reminder || null
      };

      // Создаем новую задачу или обновляем существующую
      const result = id
        ? await updateTask(id, taskData)
        : await createTask(taskData);

      if (result.success) {
        showNotification(
          id ? 'Задача успешно обновлена!' : 'Задача успешно создана!'
        );
        navigate('/');
      } else {
        showNotification(
          result.message || 'Произошла ошибка. Попробуйте снова.',
          'error'
        );
      }
    } catch (error) {
      showNotification(
        'Не удалось сохранить задачу. Пожалуйста, попробуйте позже.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="card">
        <div className="card-body">
          <h2 className="mb-4">{id ? 'Редактирование задачи' : 'Создание задачи'}</h2>
          
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Название задачи *</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Описание</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Статус</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="новая">Новая</option>
                  <option value="в процессе">В процессе</option>
                  <option value="завершена">Завершена</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Срок выполнения</label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="reminder" className="form-label">Напоминание</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="reminder"
                  name="reminder"
                  value={formData.reminder}
                  onChange={handleChange}
                />
              </div>
              
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskForm;