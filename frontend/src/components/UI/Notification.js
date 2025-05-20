import React, { useEffect } from 'react';

function Notification({ message, type = 'success' }) {
  useEffect(() => {
    // Автоматическое скрытие уведомления через 3 секунды
    const timer = setTimeout(() => {
      const notification = document.querySelector('.notification');
      if (notification) {
        notification.classList.add('hide');
      }
    }, 2700); // Скрывать чуть раньше, чем полностью исчезнет

    return () => clearTimeout(timer);
  }, [message, type]);

  // Определение класса в зависимости от типа уведомления
  const getNotificationClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning text-dark';
      case 'info':
        return 'bg-info text-dark';
      default:
        return 'bg-success';
    }
  };

  // Определение иконки в зависимости от типа уведомления
  const getNotificationIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-check-circle';
    }
  };

  return (
    <div className={`notification ${getNotificationClass()}`}>
      <div className="notification-content">
        <i className={`${getNotificationIcon()} me-2`}></i>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Notification;