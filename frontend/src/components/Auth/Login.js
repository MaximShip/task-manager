import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Login({ showNotification }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
      setIsSubmitting(true);
      const result = await login(formData);
      
      if (result.success) {
        showNotification('Вход выполнен успешно!');
        navigate('/');
      } else {
        showNotification(result.message || 'Ошибка входа. Попробуйте снова.', 'error');
      }
    } catch (error) {
      showNotification('Не удалось войти. Пожалуйста, попробуйте позже.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="card">
        <div className="card-body">
          <h1 className="text-center mb-4">Вход в систему</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Выполняется вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="mt-3 text-center">
            <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;