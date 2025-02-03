const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware xác thực người dùng

const router = express.Router();

// Tạo nhóm mới
router.post('/', authMiddleware, groupController.createGroup);

// Lấy danh sách các nhóm
router.get('/', authMiddleware, groupController.getGroups);

module.exports = router;
