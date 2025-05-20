import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';
import TaskItem from './TaskItem';

function TaskList({ showNotification }) {
  const { tasks, isLoading, error, deleteTask, getTasksByStatus, refreshTasks } = useTask();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('все');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Применение фильтров к задачам
  useEffect(() => {
    console.log('Применение фильтров, текущие задачи:', tasks);
    
    const applyFilters = async () => {
      try {
        setIsFiltering(true);
        let filtered = [...tasks];
        
        // Фильтр по статусу
        if (filter !== 'все') {
          try {
            console.log(`Применение фильтра по статусу: ${filter}`);
            const result = await getTasksByStatus(filter);
            if (result.success) {
              console.log('Получены задачи по статусу:', result.tasks);
              filtered = result.tasks;
            } else {
              console.warn('Ошибка фильтрации по статусу:', result.message);
              showNotification(
                'Не удалось применить фильтр. Используются все задачи.',
                'warning'
              );
            }
          } catch (error) {
            console.error('Ошибка при фильтрации задач:', error);
          }
        }
        
        // Поиск по названию и описанию
        if (searchTerm.trim() !== '') {
          console.log(`Применение поиска по термину: "${searchTerm}"`);
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(term) || 
            (task.description && task.description.toLowerCase().includes(term))
          );
          console.log('Результаты поиска:', filtered);
        }
        
        // Сортировка: сначала новые, затем в процессе, затем завершенные
        filtered.sort((a, b) => {
          const statusOrder = { 'новая': 0, 'в процессе': 1, 'завершена': 2 };
          
          // Сначала сортируем по статусу
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          
          // При одинаковом статусе сортируем по дате создания (новые сверху)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        console.log('Отфильтрованные и отсортированные задачи:', filtered);
        setFilteredTasks(filtered);
      } catch (filterError) {
        console.error('Ошибка при применении фильтров:', filterError);
        setFilteredTasks([]);
      } finally {
        setIsFiltering(false);
      }
    };
    
    applyFilters();
  }, [tasks, filter, searchTerm, getTasksByStatus, showNotification]);

  // Обработчик изменения статуса
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    console.log(`Изменение фильтра с "${filter}" на "${newFilter}"`);
    setFilter(newFilter);
  };

  // Обработчик изменения поиска
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    console.log(`Изменение поискового запроса с "${searchTerm}" на "${newSearch}"`);
    setSearchTerm(newSearch);
  };

  // Обработчик удаления задачи
  const handleDeleteTask = async (id) => {
    console.log(`Запрос на удаление задачи с ID: ${id}`);
    return await deleteTask(id);
  };
  
  // Обработчик обновления списка задач
  const handleRefresh = () => {
    console.log('Запрос на обновление списка задач');
    refreshTasks();
    showNotification('Список задач обновляется...', 'info');
  };

  return (
    <div className="task-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Мои задачи</h1>
        <div>
          <button 
            onClick={handleRefresh} 
            className="btn btn-outline-secondary me-2"
            disabled={isLoading}
          >
            <i className="fas fa-sync-alt me-1"></i>
            Обновить
          </button>
          <Link to="/tasks/add" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Добавить задачу
          </Link>
        </div>
      </div>
      
      <div className="task-filters card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="status-filter" className="form-label">Фильтр по статусу</label>
              <select
                id="status-filter"
                className="form-select"
                value={filter}
                onChange={handleFilterChange}
                disabled={isLoading || isFiltering}
              >
                <option value="все">Все задачи</option>
                <option value="новая">Новые</option>
                <option value="в процессе">В процессе</option>
                <option value="завершена">Завершенные</option>
              </select>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Поиск задач</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Введите текст для поиска..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isLoading || isFiltering}
              />
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-2">Загрузка задач...</p>
        </div>
      ) : isFiltering ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Фильтрация...</span>
          </div>
          <p className="mt-2">Применение фильтров...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <p><strong>Ошибка при загрузке задач:</strong> {error}</p>
          <button 
            className="btn btn-outline-danger mt-2"
            onClick={handleRefresh}
          >
            <i className="fas fa-sync-alt me-1"></i> Попробовать снова
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center my-5">
          <p className="lead">
            {searchTerm || filter !== 'все' 
              ? 'Нет задач, соответствующих указанным критериям' 
              : 'У вас пока нет задач'}
          </p>
          {searchTerm || filter !== 'все' ? (
            <button 
              className="btn btn-outline-secondary mb-3"
              onClick={() => {
                setSearchTerm('');
                setFilter('все');
              }}
            >
              <i className="fas fa-times me-1"></i> Сбросить фильтры
            </button>
          ) : null}
          <div>
            <Link to="/tasks/add" className="btn btn-primary">
              <i className="fas fa-plus me-1"></i> Создать задачу
            </Link>
          </div>
        </div>
      ) : (
        <div className="task-items">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              showNotification={showNotification}
            />
          ))}
          
          <div className="task-count mt-3 text-muted">
            <small>
              Показано {filteredTasks.length} из {tasks.length} задач
              {filter !== 'все' && ` (фильтр: ${filter})`}
              {searchTerm && ` (поиск: "${searchTerm}")`}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;