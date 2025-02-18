const List = require('../models/ListModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

// Create List
exports.createList = async (req, res) => {
    try {
        const { projectId, name, position, tasks } = req.body;

        const newList = new List({
            projectId,
            name,
            position,
            tasks
        });

        const savedList = await newList.save();
        logger.info(`List created successfully with ID: ${savedList._id}`);
        return sendResponse(res, 'List created successfully', 201, savedList);
    } catch (error) {
        logger.error(`Error creating list: ${error.message}`);
        return sendResponse(res, 'Failed to create list', 500, { error: error.message });
    }
};

// Get all Lists
exports.getLists = async (req, res) => {
    try {
        const lists = await List.find().populate('tasks');  // Populate tasks nếu cần
        logger.info('Lists fetched successfully');
        return sendResponse(res, 'Lists fetched successfully', 200, lists);
    } catch (error) {
        logger.error(`Error fetching lists: ${error.message}`);
        return sendResponse(res, 'Failed to fetch lists', 500, { error: error.message });
    }
};

// Get List by ID
exports.getListById = async (req, res) => {
    try {
        const list = await List.findById(req.params.id).populate('tasks');
        if (!list) {
            logger.info('List not found');
            return sendResponse(res, 'List not found', 404);
        }
        logger.info(`List fetched successfully with ID: ${list._id}`);
        return sendResponse(res, 'List fetched successfully', 200, list);
    } catch (error) {
        logger.error(`Error fetching list by ID: ${error.message}`);
        return sendResponse(res, 'Failed to fetch list', 500, { error: error.message });
    }
};

// Update List
exports.updateList = async (req, res) => {
    try {
        const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedList) {
            logger.info('List not found for update');
            return sendResponse(res, 'List not found', 404);
        }
        logger.info(`List updated successfully with ID: ${updatedList._id}`);
        return sendResponse(res, 'List updated successfully', 200, updatedList);
    } catch (error) {
        logger.error(`Error updating list: ${error.message}`);
        return sendResponse(res, 'Failed to update list', 500, { error: error.message });
    }
};

// Delete List
exports.deleteList = async (req, res) => {
    try {
        const deletedList = await List.findByIdAndDelete(req.params.id);
        if (!deletedList) {
            logger.info('List not found for deletion');
            return sendResponse(res, 'List not found', 404);
        }
        logger.info(`List deleted successfully with ID: ${deletedList._id}`);
        return sendResponse(res, 'List deleted successfully', 200, deletedList);
    } catch (error) {
        logger.error(`Error deleting list: ${error.message}`);
        return sendResponse(res, 'Failed to delete list', 500, { error: error.message });
    }
};

// Get all Lists by project id
exports.getListByProjectId = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    try {
        const lists = await List.find({ projectId: id }).select("_id name");
        
        logger.info('Lists fetched successfully');
        return sendResponse(res, 'Lists fetched successfully', 200, lists);
    } catch (error) {
        logger.error(`Error fetching lists: ${error.message}`);
        return sendResponse(res, 'Failed to fetch lists', 500, { error: error.message });
    }
};