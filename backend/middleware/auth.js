const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    console.log('Проверка аутентификации');
    
    // Получение токена из заголовка
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Отсутствует токен авторизации');
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован. Отсутствует токен авторизации' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Токен авторизации некорректен');
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован. Некорректный токен авторизации' 
      });
    }

    try {
      // Верификация токена
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Проверка данных в токене
      if (!decoded || !decoded.id || !decoded.email) {
        console.log('Токен не содержит необходимых данных');
        return res.status(401).json({ 
          success: false, 
          message: 'Не авторизован. Некорректный токен' 
        });
      }
      
      // Добавление данных пользователя в запрос
      req.user = decoded;
      
      console.log('Аутентификация успешна:', { id: decoded.id, email: decoded.email });
      next();
    } catch (jwtError) {
      console.error('Ошибка аутентификации JWT:', jwtError);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Не авторизован. Токен истек' 
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Не авторизован. Недействительный токен' 
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован. Ошибка проверки токена' 
      });
    }
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Не авторизован. Произошла ошибка при проверке аутентификации' 
    });
  }
};