const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.get('/project/:projectId', taskController.getTasksByProjectId);
router.put('/:id', taskController.updateTask);
router.put('/:taskId/lists/:targetListId', taskController.moveTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
