const express = require('express');
const {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
} = require('../controllers/permissionController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Các route CRUD Permission
router.post('/', authenticateToken, createPermission);
router.get('/', authenticateToken, getPermissions);
router.get('/:id', authenticateToken, getPermissionById);
router.put('/:id', authenticateToken, updatePermission);
router.delete('/:id', authenticateToken, deletePermission);

module.exports = router;
