const User = require('../models/User');
const logger = require('../config/logger/logger');
const sendResponse = require('../helpers/responseHelper');

// Tạo mới User
exports.createUser = async (req, res) => {
   
    try {
        const { firstname, lastname, address, phone, username, password } = req.body;

        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            logger.info(`created failed: Username '${username}' is already taken.`);
            return sendResponse(res, 'Username is already taken', 400);
        }

        // Tạo mới User
        const user = new User({ firstname, lastname, address, phone, username, password });
        const savedUser = await user.save();

        logger.info(`User created successfully: ${username}`);
        return sendResponse(res, 'User created successfully', 201, savedUser);
    } catch (error) {
        logger.error(`Error creating user error: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};

// Lấy danh sách tất cả User
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        logger.info('Get all users successfully');
        return sendResponse(res, 'Get all users successfully', 201, users);
    } catch (error) {
        logger.error(`Get all users failed: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

// Lấy thông tin một User theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        logger.info('Get user by ID successfully');
        return sendResponse(res, 'Get user by ID successfully', 200, user);
    } catch (error) {
        logger.error(`Get User by ID failed: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

// Cập nhật thông tin User
exports.updateUser = async (req, res) => {
    try {
        // Kiểm tra xem có trường 'username' trong req.body không
        if (req.body.username) {
            logger.error('Username cannot be updated');
            return sendResponse(res, 'Username cannot be updated', 400);
        }

        // Cập nhật người dùng với các trường còn lại
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!updatedUser) {
            logger.error(`User with ID ${req.params.id} not found`);
            return sendResponse(res, 'User not found', 404);
        }

        // Log thông báo thành công
        logger.info(`User with ID ${req.params.id} updated successfully`);
        
        // Trả về dữ liệu người dùng đã cập nhật
        return sendResponse(res, 'User updated successfully', 200, updatedUser);
    } catch (error) {
        // Log lỗi và trả về thông báo lỗi
        logger.error(`Update user failed: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};

// Xóa một User
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
        return sendResponse(res, 'User deleted successfully', 200, null);
    } catch (error) {
        logger.error(`Delete user failed: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};
