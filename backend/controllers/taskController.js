const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, '../db/tasks.json');

// Чтение файла задач
const getTasks = () => {
  try {
    // Убедимся, что директория существует
    const dbDir = path.dirname(tasksFilePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Проверим, существует ли файл
    if (!fs.existsSync(tasksFilePath)) {
      // Создаем пустой массив задач
      fs.writeFileSync(tasksFilePath, '[]', 'utf8');
      return [];
    }
    
    // Читаем файл
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    
    // Проверяем, что файл не пустой
    if (!data || data.trim() === '') {
      // Если файл пуст, инициализируем пустым массивом
      fs.writeFileSync(tasksFilePath, '[]', 'utf8');
      return [];
    }
    
    // Парсим JSON
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла задач:', error);
    
    // Если ошибка связана с парсингом JSON, пересоздаем файл
    if (error instanceof SyntaxError) {
      console.log('Файл задач поврежден. Создаем новый файл...');
      fs.writeFileSync(tasksFilePath, '[]', 'utf8');
    }
    
    return [];
  }
};

// Запись в файл задач
const saveTasks = (tasks) => {
  try {
    // Убедимся, что директория существует
    const dbDir = path.dirname(tasksFilePath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Записываем данные в файл
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Ошибка записи в файл задач:', error);
    return false;
  }
};

// Получение всех задач пользователя
const getAllTasks = (req, res) => {
  try {
    console.log('Запрос на получение всех задач пользователя:', req.user.id);
    
    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    console.log(`Найдено ${userTasks.length} задач пользователя`);

    res.json({
      success: true,
      count: userTasks.length,
      tasks: userTasks
    });
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении задач' 
    });
  }
};

// Получение одной задачи
const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Запрос на получение задачи по ID: ${id}`);
    
    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    const task = tasks.find(task => task.id === id && task.userId === req.user.id);

    if (!task) {
      console.log(`Задача с ID ${id} не найдена для пользователя ${req.user.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Задача не найдена' 
      });
    }

    console.log(`Задача с ID ${id} найдена`);
    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Ошибка получения задачи:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении задачи' 
    });
  }
};

// Создание новой задачи
const createTask = (req, res) => {
  try {
    const { title, description, status, dueDate, reminder } = req.body;
    console.log('Запрос на создание задачи:', req.body);

    // Проверка обязательных полей
    if (!title) {
      console.log('Ошибка: отсутствует название задачи');
      return res.status(400).json({ 
        success: false, 
        message: 'Название задачи обязательно' 
      });
    }

    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }

    // Создание новой задачи
    const newTask = {
      id: Date.now().toString(),
      userId: req.user.id,
      title,
      description: description || '',
      status: status || 'новая',
      dueDate: dueDate || null,
      reminder: reminder || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Добавляем задачу и сохраняем
    tasks.push(newTask);
    const saved = saveTasks(tasks);
    
    if (!saved) {
      console.error('Ошибка сохранения задачи в файл');
      return res.status(500).json({
        success: false,
        message: 'Ошибка сохранения задачи'
      });
    }

    console.log(`Задача успешно создана с ID: ${newTask.id}`);
    res.status(201).json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при создании задачи' 
    });
  }
};

// Обновление задачи
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, reminder } = req.body;
    console.log(`Запрос на обновление задачи с ID: ${id}`, req.body);

    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === req.user.id);

    if (taskIndex === -1) {
      console.log(`Задача с ID ${id} не найдена для пользователя ${req.user.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Задача не найдена' 
      });
    }

    // Обновление задачи
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description !== undefined ? description : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
      reminder: reminder !== undefined ? reminder : tasks[taskIndex].reminder,
      updatedAt: new Date().toISOString()
    };

    // Сохраняем обновленные задачи
    const saved = saveTasks(tasks);
    
    if (!saved) {
      console.error('Ошибка сохранения обновленной задачи в файл');
      return res.status(500).json({
        success: false,
        message: 'Ошибка сохранения задачи'
      });
    }

    console.log(`Задача с ID ${id} успешно обновлена`);
    res.json({
      success: true,
      task: tasks[taskIndex]
    });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при обновлении задачи' 
    });
  }
};

// Удаление задачи
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Запрос на удаление задачи с ID: ${id}`);
    
    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === req.user.id);

    if (taskIndex === -1) {
      console.log(`Задача с ID ${id} не найдена для пользователя ${req.user.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Задача не найдена' 
      });
    }

    // Удаление задачи
    tasks.splice(taskIndex, 1);
    
    // Сохраняем обновленные задачи
    const saved = saveTasks(tasks);
    
    if (!saved) {
      console.error('Ошибка сохранения после удаления задачи');
      return res.status(500).json({
        success: false,
        message: 'Ошибка удаления задачи'
      });
    }

    console.log(`Задача с ID ${id} успешно удалена`);
    res.json({
      success: true,
      message: 'Задача успешно удалена'
    });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при удалении задачи' 
    });
  }
};

// Получение задач по статусу
const getTasksByStatus = (req, res) => {
  try {
    const { status } = req.params;
    console.log(`Запрос на получение задач по статусу: ${status}`);
    
    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    const filteredTasks = tasks.filter(
      task => task.userId === req.user.id && task.status === status
    );

    console.log(`Найдено ${filteredTasks.length} задач со статусом "${status}"`);
    res.json({
      success: true,
      count: filteredTasks.length,
      tasks: filteredTasks
    });
  } catch (error) {
    console.error('Ошибка получения задач по статусу:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении задач по статусу' 
    });
  }
};

// Получение задач на определенную дату
const getTasksByDate = (req, res) => {
  try {
    const { date } = req.params;
    console.log(`Запрос на получение задач по дате: ${date}`);
    
    const tasks = getTasks();
    
    // Проверка на валидность данных задач
    if (!Array.isArray(tasks)) {
      console.error('Ошибка: данные задач не являются массивом');
      return res.status(500).json({ 
        success: false, 
        message: 'Ошибка чтения данных задач' 
      });
    }
    
    // Получаем задачи, у которых dueDate совпадает с указанной датой
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate || task.userId !== req.user.id) return false;
      
      // Сравниваем только дату без времени
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === date;
    });

    console.log(`Найдено ${filteredTasks.length} задач на дату "${date}"`);
    res.json({
      success: true,
      count: filteredTasks.length,
      tasks: filteredTasks
    });
  } catch (error) {
    console.error('Ошибка получения задач по дате:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера при получении задач по дате' 
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByDate
};