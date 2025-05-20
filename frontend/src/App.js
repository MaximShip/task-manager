import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskForm from './components/Tasks/TaskForm';
import Calendar from './components/Calendar/Calendar';
import Notification from './components/UI/Notification';

function App() {
  const { user, isLoading } = useAuth();
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Обработчик уведомлений
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Переключение боковой панели
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}

      {user ? (
        <div className="app-container">
          <Header toggleSidebar={toggleSidebar} />
          <div className="content-wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
              <Routes>
                <Route 
                  path="/" 
                  element={<TaskList showNotification={showNotification} />} 
                />
                <Route 
                  path="/tasks/add" 
                  element={<TaskForm showNotification={showNotification} />} 
                />
                <Route 
                  path="/tasks/edit/:id" 
                  element={<TaskForm showNotification={showNotification} />} 
                />
                <Route 
                  path="/calendar" 
                  element={<Calendar showNotification={showNotification} />} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <div className="auth-container">
          <Routes>
            <Route 
              path="/login" 
              element={<Login showNotification={showNotification} />} 
            />
            <Route 
              path="/register" 
              element={<Register showNotification={showNotification} />} 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;