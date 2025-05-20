import React from 'react';
import { Link } from 'react-router-dom';
import { formatDisplayDate, isTaskOverdue, getDaysRemaining } from '../../utils/dateHelpers';

function TaskItem({ task, onDelete, showNotification }) {
  // Определяем класс для статуса задачи
  const getStatusClass = (status) => {
    switch (status) {
      case 'новая':
        return 'badge bg-primary';
      case 'в процессе':
        return 'badge bg-warning text-dark';
      case 'завершена':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  // Определяем класс для срока задачи
  const getDueDateClass = () => {
    if (!task.dueDate) return '';
    
    if (task.status === 'завершена') {
      return 'text-muted';
    }
    
    if (isTaskOverdue(task.dueDate)) {
      return 'text-danger fw-bold';
    }
    
    const daysRemaining = getDaysRemaining(task.dueDate);
    if (daysRemaining <= 2) {
      return 'text-warning fw-bold';
    }
    
    return 'text-success';
  };

  // Форматируем информацию о сроке
  const getDueDateInfo = () => {
    if (!task.dueDate) return 'Без срока';
    
    const formattedDate = formatDisplayDate(task.dueDate);
    
    if (task.status === 'завершена') {
      return `Срок: ${formattedDate}`;
    }
    
    if (isTaskOverdue(task.dueDate)) {
      return `Просрочено! (${formattedDate})`;
    }
    
    const daysRemaining = getDaysRemaining(task.dueDate);
    if (daysRemaining === 0) {
      return `Сегодня! (${formattedDate})`;
    } else if (daysRemaining === 1) {
      return `Завтра! (${formattedDate})`;
    } else {
      return `Срок: ${formattedDate} (осталось ${daysRemaining} дн.)`;
    }
  };

  // Обработчик удаления задачи
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        const result = await onDelete(task.id);
        if (result.success) {
          showNotification('Задача успешно удалена!');
        } else {
          showNotification(
            result.message || 'Ошибка при удалении задачи',
            'error'
          );
        }
      } catch (error) {
        showNotification(
          'Не удалось удалить задачу. Пожалуйста, попробуйте позже.',
          'error'
        );
      }
    }
  };

  return (
    <div className="task-item card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{task.title}</h5>
          
          <span className={getStatusClass(task.status)}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
        
        {task.description && (
          <p className="card-text mb-3">{task.description}</p>
        )}
        
        <div className="task-meta d-flex justify-content-between align-items-center">
          <div className="task-date">
            <small className={getDueDateClass()}>
              <i className="fas fa-calendar-alt me-1"></i> {getDueDateInfo()}
            </small>
            
            {task.reminder && (
              <small className="ms-3 text-info">
                <i className="fas fa-bell me-1"></i> Напоминание установлено
              </small>
            )}
          </div>
          
          <div className="task-actions">
            <Link 
              to={`/tasks/edit/${task.id}`} 
              className="btn btn-sm btn-outline-primary me-2"
            >
              <i className="fas fa-edit"></i> Изменить
            </Link>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i> Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;