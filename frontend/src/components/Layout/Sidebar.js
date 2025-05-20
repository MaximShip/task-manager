import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';

function Sidebar({ isOpen }) {
  const { tasks } = useTask();

  // Подсчет количества задач по статусам
  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  // Подсчет задач с установленными напоминаниями
  const getTasksWithReminders = () => {
    return tasks.filter(task => task.reminder).length;
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h4>Навигация</h4>
        </div>
        
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              end
            >
              <i className="fas fa-list me-2"></i>
              Все задачи
              <span className="badge bg-secondary ms-2">
                {tasks.length}
              </span>
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink 
              to="/tasks/add" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-plus me-2"></i>
              Добавить задачу
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink 
              to="/calendar" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-calendar-alt me-2"></i>
              Календарь
            </NavLink>
          </li>
        </ul>
        
        <div className="sidebar-header mt-4">
          <h4>Фильтры</h4>
        </div>
        
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink 
              to="/tasks/status/новая" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-hourglass-start me-2"></i>
              Новые
              <span className="badge bg-primary ms-2">
                {getTaskCountByStatus('новая')}
              </span>
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink 
              to="/tasks/status/в процессе" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-spinner me-2"></i>
              В процессе
              <span className="badge bg-warning text-dark ms-2">
                {getTaskCountByStatus('в процессе')}
              </span>
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink 
              to="/tasks/status/завершена" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-check me-2"></i>
              Завершенные
              <span className="badge bg-success ms-2">
                {getTaskCountByStatus('завершена')}
              </span>
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink 
              to="/tasks/reminders" 
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="fas fa-bell me-2"></i>
              С напоминаниями
              <span className="badge bg-info ms-2">
                {getTasksWithReminders()}
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;