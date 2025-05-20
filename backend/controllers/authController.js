const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const usersFilePath = path.join(__dirname, '../db/users.json');

// Чтение файла пользователей
const getUsers = () => {
  try {
    // Убедимся, что директория существует
    const dbDir = path.dirname(usersFilePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Проверим, существует ли файл
    if (!fs.existsSync(usersFilePath)) {
      // Создаем пустой массив пользователей
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
      return [];
    }
    
    // Читаем файл
    const data = fs.readFileSync(usersFilePath, 'utf8');
    
    // Проверяем, что файл не пустой
    if (!data || data.trim() === '') {
      // Если файл пуст, инициализируем пустым массивом
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
      return [];
    }
    
    // Парсим JSON
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла пользователей:', error);
    
    // Если ошибка связана с парсингом JSON, пересоздаем файл
    if (error instanceof SyntaxError) {
      console.log('Файл пользователей поврежден. Создаем новый файл...');
      fs.writeFileSync(usersFilePath, '[]', 'utf8');
    }
    
    return [];
  }
};

// Запись в файл пользователей
const saveUsers = (users) => {
  try {
    // Убедимся, что директория существует
    const dbDir = path.dirname(usersFilePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Записываем данные в файл
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Ошибка записи в файл пользователей:', error);
    return false;
  }
};

// Регистрация нового пользователя
const register = async (req, res) => {
  try {
    console.log('Запрос на регистрацию:', req.body);
    const { username, email, password } = req.body;

    // Проверка обязательных полей
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Все поля обязательны для заполнения' 
      });
    }

    // Получаем пользователей
    let users = getUsers();
    
    // Проверка на валидность данных пользователей
    if (!Array.isArray(users)) {
      console.error('Ошибка: данные пользователей не являются массивом');
      users = [];
    }

    // Проверка на существующего пользователя
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пользователь с таким email уже существует' 
      });
    }

    // Хэширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание нового пользователя
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Добавляем пользователя и сохраняем
    users.push(newUser);
    const saved = saveUsers(users);
    
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Ошибка сохранения пользователя'
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    console.log('Пользователь успешно зарегистрирован:', { id: newUser.id, email: newUser.email });
    
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при регистрации' 
    });
  }
};

// Авторизация пользователя
const login = async (req, res) => {
  try {
    console.log('Запрос на авторизацию:', req.body);
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Все поля обязательны для заполнения' 
      });
    }

    // Получаем пользователей
    const users = getUsers();
    
    // Проверка на валидность данных пользователей
    if (!Array.isArray(users)) {
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных пользователей' 
      });
    }

    // Поиск пользователя
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Неверный email или пароль' 
      });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Неверный email или пароль' 
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    console.log('Пользователь успешно авторизован:', { id: user.id, email: user.email });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при авторизации' 
    });
  }
};

// Получение данных текущего пользователя
const getMe = (req, res) => {
  try {
    console.log('Запрос данных пользователя:', req.user);
    
    const users = getUsers();
    
    // Проверка на валидность данных пользователей
    if (!Array.isArray(users)) {
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных пользователей' 
      });
    }
    
    const user = users.find(user => user.id === req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }

    console.log('Данные пользователя успешно получены:', { id: user.id, email: user.email });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении профиля' 
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};