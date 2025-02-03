const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();
// Đăng ký
router.post('/register', registerUser);
// Đăng nhập
router.post('/login', loginUser);


module.exports = router;