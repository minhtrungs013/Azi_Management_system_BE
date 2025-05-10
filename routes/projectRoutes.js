const express = require('express');
const {
    createProject,
    getProjects,
    getProjectById,
    getProjectDashboardById,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Các route CRUD Project
router.post('/', authenticateToken, createProject);
router.get('/', authenticateToken, getProjects);
router.get('/:id', authenticateToken, getProjectById);
router.get('/dashboard/:id', authenticateToken, getProjectDashboardById);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;
