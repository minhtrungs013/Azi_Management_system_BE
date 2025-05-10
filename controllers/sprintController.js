const Sprint = require('../models/SprintModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

exports.createSprint = async (req, res) => {
    try {
        const { projectId, name, description, startDate, endDate } = req.body;

        if (!projectId || !name || !startDate || !endDate) {
            return sendResponse(res, 'Missing required fields', 400);
        }

        const sprint = new Sprint({ projectId, name, description, startDate, endDate, status: 'Pending' });
        await sprint.save();

        logger.info(`Sprint created: ${sprint._id}`);
        return sendResponse(res, 'Sprint created successfully', 201, null);
    } catch (error) {
        logger.error(`Error creating sprint: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

exports.getAllSprints = async (req, res) => {
    try {
        const { projectId } = req.params;
        const sprints = await Sprint.find({ projectId })
        .select("_id name")
        .sort({ createdAt: -1 });

        return sendResponse(res, 'Sprints retrieved successfully', 200, sprints);
    } catch (error) {
        logger.error(`Error fetching sprints: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

exports.getSprintById = async (req, res) => {
    try {
        const { sprintId } = req.params;
        const sprint = await Sprint.findById(sprintId);

        if (!sprint) {
            return sendResponse(res, 'Sprint not found', 404);
        }

        return sendResponse(res, 'Sprint retrieved successfully', 200, sprint);
    } catch (error) {
        logger.error(`Error fetching sprint: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

exports.updateSprint = async (req, res) => {
    try {
        const { sprintId } = req.params;
        const updatedSprint = await Sprint.findByIdAndUpdate(sprintId, req.body, { new: true });

        if (!updatedSprint) {
            return sendResponse(res, 'Sprint not found', 404);
        }

        logger.info(`Sprint updated: ${updatedSprint._id}`);
        return sendResponse(res, 'Sprint updated successfully', 200, updatedSprint);
    } catch (error) {
        logger.error(`Error updating sprint: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};

exports.deleteSprint = async (req, res) => {
    try {
        const { sprintId } = req.params;
        const deletedSprint = await Sprint.findByIdAndDelete(sprintId);

        if (!deletedSprint) {
            return sendResponse(res, 'Sprint not found', 404);
        }

        logger.info(`Sprint deleted: ${deletedSprint._id}`);
        return sendResponse(res, 'Sprint deleted successfully', 200, deletedSprint);
    } catch (error) {
        logger.error(`Error deleting sprint: ${error.message}`);
        return sendResponse(res, error.message, 500);
    }
};
