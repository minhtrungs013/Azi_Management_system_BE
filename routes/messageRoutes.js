const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware xác thực người dùng

const router = express.Router();

// Gửi tin nhắn
router.post('/:id', authMiddleware, messageController.sendMessage);

// Lấy tin nhắn của nhóm
router.get('/:groupId', authMiddleware, messageController.getMessages);

module.exports = router;
