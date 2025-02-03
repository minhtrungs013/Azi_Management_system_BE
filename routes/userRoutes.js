const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Định nghĩa các route cho User
router.post('/', authenticateToken, createUser);         // Tạo mới User
router.get('/', authenticateToken, getUsers);           // Lấy danh sách User
router.get('/:id', authenticateToken, getUserById);     // Lấy User theo ID
router.put('/:id', authenticateToken, updateUser);      // Cập nhật User
router.delete('/:id', authenticateToken, deleteUser);   // Xóa User

module.exports = router;
