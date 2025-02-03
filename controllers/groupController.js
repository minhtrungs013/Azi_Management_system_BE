const Group = require('../models/Group');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

// Tạo nhóm mới
exports.createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;

        if (!name || members.length < 1) {
            return sendResponse(res, 'Group name and at least 2 members are required', 400);
        }

        const group = new Group({ name, members });
        const savedGroup = await group.save();

        logger.info(`Group created successfully: ${savedGroup._id}`);
        return sendResponse(res, 'Group created successfully', 201, savedGroup);
    } catch (error) {
        logger.error(`Error creating group: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};

// Lấy danh sách các nhóm
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'username email');
        return sendResponse(res, 'Groups retrieved successfully', 200, groups);
    } catch (error) {
        logger.error(`Error retrieving groups: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};
