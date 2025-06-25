const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.get('/project/:projectId', taskController.getTasksByProjectId);
router.get('/current-sprint/:projectId', taskController.getTasksByCurrentSprint);
router.get('/sprint/:sprintId', taskController.getTasksBySprintId);
router.get('/backlog/:projectId', taskController.getTasksOnBacklog);
router.put('/:id', taskController.updateTask);
router.put('/:taskId/lists/:targetListId', taskController.moveTask);
router.put('/moveToBacklog/:taskId', taskController.moveTaskToBacklog);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
