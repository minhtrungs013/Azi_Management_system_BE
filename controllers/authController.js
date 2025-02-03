const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger/logger')
const sendResponse = require('../helpers/responseHelper');

// Đăng ký User
exports.registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, location, avatar_url, phone, username, password } = req.body;

        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            logger.info(`Registration failed: Username '${username}' is already taken.`);
            return sendResponse(res, 'Username is already taken', 400);
        }

        // Tạo mới User
        const user = new User({ firstname, lastname, email, location, avatar_url, phone, username, password });

        const savedUser = await user.save();

        logger.info(`User registered successfully: ${username}`);
        return sendResponse(res, 'User registered successfully', 201, savedUser);
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};

// Đăng nhập User
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra xem username có tồn tại không
        const user = await User.findOne({ username });
        if (!user) {
            logger.warn(`Login failed: Username '${username}' not found.`);
            return sendResponse(res, 'User not found', 404);
        }

        // Kiểm tra password
        if (user.password !== password) {
            logger.warn(`Login failed: Invalid password for username '${username}'.`);
            return sendResponse(res, 'Invalid username or password', 401);
        }

        // Tạo token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info(`User logged in successfully: ${user}`);
        return sendResponse(res, 'Login successful', 200, { accessToken: token, user: user });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};