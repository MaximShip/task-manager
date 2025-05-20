const express = require('express');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByDate
} = require('../controllers/taskController');

const router = express.Router();

// Маршруты для работы с задачами
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/status/:status', getTasksByStatus);
router.get('/date/:date', getTasksByDate);

module.exports = router;