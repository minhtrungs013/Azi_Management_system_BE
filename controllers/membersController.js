const Member = require('../models/membersModel');
const Permission = require('../models/permissionModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');
const User = require('../models/User');

// Create a new member
exports.createMember = async (req, res) => {
    try {
        const { user, projectId, permissions } = req.body;

        // Validate permissions
        const existingPermissions = await Permission.find({ _id: { $in: permissions } });

        if (existingPermissions.length !== permissions.length) {
            logger.info('Invalid permissions provided during member creation');
            return sendResponse(res, 'Invalid permissions provided', 400);
        }

        const newMember = new Member({ user, projectId, permissions });
        const savedMember = await newMember.save();

        logger.info(`Member created successfully for user ${user} in project ${projectId}`);
        return sendResponse(res, 'Member created successfully', 201, savedMember);
    } catch (error) {
        logger.error(`Error creating member: ${error.message}`);
        return sendResponse(res, 'Failed to create member', 500, { error: error.message });
    }
};

// Get all members
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find()
            .populate('user')
            .populate('projectId')
            .populate('permissions');

        logger.info('All members retrieved successfully');
        return sendResponse(res, 'Members retrieved successfully', 200, members);
    } catch (error) {
        logger.error(`Error retrieving members: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve members', 500, { error: error.message });
    }
};

// Get a member by ID
exports.getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id)
            .populate('user')
            .populate('projectId')
            .populate('permissions');

        if (!member) {
            logger.info(`Member not found: ${id}`);
            return sendResponse(res, 'Member not found', 404);
        }

        logger.info(`Member retrieved successfully: ${id}`);
        return sendResponse(res, 'Member retrieved successfully', 200, member);
    } catch (error) {
        logger.error(`Error retrieving member by ID: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve member', 500, { error: error.message });
    }
};

// Update a member
exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, projectId, permissions } = req.body;

        // Validate permissions
        const existingPermissions = await Permission.find({ _id: { $in: permissions } });

        if (existingPermissions.length !== permissions.length) {
            logger.info('Invalid permissions provided during member update');
            return sendResponse(res, 'Invalid permissions provided', 400);
        }

        const updatedMember = await Member.findByIdAndUpdate(
            id,
            { user, projectId, permissions },
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            logger.info(`Member not found for update: ${id}`);
            return sendResponse(res, 'Member not found', 404);
        }

        logger.info(`Member updated successfully: ${id}`);
        return sendResponse(res, 'Member updated successfully', 200, updatedMember);
    } catch (error) {
        logger.error(`Error updating member: ${error.message}`);
        return sendResponse(res, 'Failed to update member', 500, { error: error.message });
    }
};

// Delete a member
exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMember = await Member.findByIdAndDelete(id);

        if (!deletedMember) {
            logger.info(`Member not found for deletion: ${id}`);
            return sendResponse(res, 'Member not found', 404);
        }

        logger.info(`Member deleted successfully: ${id}`);
        return sendResponse(res, 'Member deleted successfully', 200);
    } catch (error) {
        logger.error(`Error deleting member: ${error.message}`);
        return sendResponse(res, 'Failed to delete member', 500, { error: error.message });
    }
};

// Get all members by project ID
exports.getMembersByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const members = await Member.find({ projectId })
            .populate('user')
            .populate('permissions');

        if (!members || members.length === 0) {
            logger.info(`No members found for project ID: ${projectId}`);
            return sendResponse(res, 'No members found for this project', 200, []);
        }

        logger.info(`Members retrieved successfully for project ID: ${projectId}`);
        return sendResponse(res, 'Members retrieved successfully', 200, members);
    } catch (error) {
        logger.error(`Error retrieving members by project ID: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve members', 500, { error: error.message });
    }
};

exports.getUsersNotInProject = async (req, res) => {
    try {
        const { projectId } = req.params; // Lấy projectId từ tham số URL

        // Lấy tất cả user có projectId trong bảng Member
        const members = await Member.find({ projectId: projectId }).select('user');

        // Tạo một mảng các userId từ các thành viên
        const memberUserIds = members.map(member => member.user);

        // Tìm tất cả người dùng (User) mà không có trong memberUserIds
        const users = await User.find({ _id: { $nin: memberUserIds } });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found that are not members of this project.' });
        }

        return res.status(200).json({
            status: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        console.error(`Error retrieving users: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};