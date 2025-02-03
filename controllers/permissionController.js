const Permission = require('../models/permissionModel');
const logger = require('../config/logger/logger');
const sendResponse = require('../helpers/responseHelper');

// Tạo mới Permission
exports.createPermission = async (req, res) => {
    try {
        const { name, label, description } = req.body;

        const existingPermission = await Permission.findOne({ name });
        if (existingPermission) {
            logger.info(`Permission creation failed: Name '${name}' already exists.`);
            return sendResponse(res, 'Permission name already exists', 400);
        }

        const newPermission = new Permission({ name, label, description });
        const savedPermission = await newPermission.save();

        logger.info(`Permission created: ${savedPermission.name}`);
        return sendResponse(res, 'Permission created successfully', 201, savedPermission);
    } catch (error) {
        logger.error(`Create permission error: ${error.message}`);
        return sendResponse(res, 'Failed to create permission', 400, { error: error.message });
    }
};

// Lấy danh sách tất cả các Permission
exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        return sendResponse(res, 'Permissions retrieved successfully', 200, permissions);
    } catch (error) {
        logger.error(`Get permissions error: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve permissions', 500, { error: error.message });
    }
};

// Lấy thông tin chi tiết một Permission theo ID
exports.getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);

        if (!permission) {
            logger.info(`Permission not found: ${id}`);
            return sendResponse(res, 'Permission not found', 404);
        }

        return sendResponse(res, 'Permission retrieved successfully', 200, permission);
    } catch (error) {
        logger.error(`Get permission by ID error: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve permission', 500, { error: error.message });
    }
};

// Cập nhật Permission
exports.updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, label, description } = req.body;

        const updatedPermission = await Permission.findByIdAndUpdate(
            id,
            { name, label, description },
            { new: true, runValidators: true }
        );

        if (!updatedPermission) {
            logger.info(`Permission not found for update: ${id}`);
            return sendResponse(res, 'Permission not found', 404);
        }

        logger.info(`Permission updated: ${id}`);
        return sendResponse(res, 'Permission updated successfully', 200, updatedPermission);
    } catch (error) {
        logger.error(`Update permission error: ${error.message}`);
        return sendResponse(res, 'Failed to update permission', 400, { error: error.message });
    }
};

// Xóa Permission
exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPermission = await Permission.findByIdAndDelete(id);

        if (!deletedPermission) {
            logger.info(`Permission not found for deletion: ${id}`);
            return sendResponse(res, 'Permission not found', 404);
        }

        logger.info(`Permission deleted: ${id}`);
        return sendResponse(res, 'Permission deleted successfully', 200);
    } catch (error) {
        logger.error(`Delete permission error: ${error.message}`);
        return sendResponse(res, 'Failed to delete permission', 500, { error: error.message });
    }
};
