const Project = require('../models/projectModel');
const Member = require('../models/membersModel');
const List = require('../models/ListModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

// Tạo mới Project
exports.createProject = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;

        const newProject = new Project({ name, description, created_by });
        const savedProject = await newProject.save();


        const newMember = new Member({ user: req.user.id, projectId: savedProject._id, permissions: ['6789397d033595caed04c79f'] });
        await newMember.save();

        // Tạo 5 list mặc định cho project
        const listNames = ['TO DO', 'IN PROGRESS', 'BUG', 'REVIEW', 'DONE'];
        const listPositions = [1, 2, 3, 4, 5];  // Sắp xếp vị trí như yêu cầu

        // Tạo mảng chứa các list
        const lists = listNames.map((listName, index) => {
            return new List({
                projectId: savedProject._id,
                name: listName,
                position: listPositions[index],
                tasks: []  // Ban đầu không có card trong list
            });
        });

        // Lưu tất cả các list vào database
        await List.insertMany(lists);


        logger.info(`Project created: ${savedProject._id} with default lists`);

        logger.info(`Project created: ${savedProject._id}`);
        return sendResponse(res, 'Project created successfully', 201, savedProject);
    } catch (error) {
        logger.error(`Create project error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Lấy danh sách tất cả các Project
exports.getProjects = async (req, res) => {
    try {
        const getMemberbyuserId = await Member.find({ user: { $in: req.user.id } });
        const projectIds = getMemberbyuserId.map(member => member.projectId);
        const projects = await Project.find({
            $or: [
                { _id: { $in: projectIds } }, // Điều kiện 1: projectId nằm trong danh sách
                { created_by: req.user.id }   // Điều kiện 2: created_by bằng userId
            ]
        });


        logger.info('Get all projects successfully');
        return sendResponse(res, 'Get All Project successfully', 201, projects || []);
    } catch (error) {
        logger.error(`Get projects error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin chi tiết một Project theo ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        const list = await List.find({ projectId: id }).populate({
            path: 'tasks',
            populate: [
                { path: 'assignee', select: 'username avatar_url firstname lastname name email location' },
                { path: 'reporter', select: 'username avatar_url firstname lastname name email location' }
            ]
        });
        const response = {
            _id: project._id,
            name: project.name,
            description: project.description,
            created_at: project.createdAt,
            updated_at: project.updatedAt,
            created_by: project.created_by,
            __v: project.__v,
            lists: list
        };

        if (!project) {
            logger.info(`Project not found: ${id}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        return sendResponse(res, 'Get Project By Id successfully', 201, response);
    } catch (error) {
        logger.error(`Get project by ID error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật Project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, created_by } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, description, created_by },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            logger.info(`Project not found for update: ${id}`);
            return res.status(404).json({ error: 'Project not found' });
        }

        logger.info(`Project updated: ${id}`);
        return sendResponse(res, 'Project updated successfully', 200, updatedProject);
    } catch (error) {
        logger.error(`Update project error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Xóa Project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            logger.info(`Project not found for deletion: ${id}`);
            return res.status(404).json({ error: 'Project not found' });
        }
        logger.info(`Project deleted: ${id}`);
        return sendResponse(res, 'Project deleted successfully', 200, null);
    } catch (error) {
        logger.error(`Delete project error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


exports.getProjectIds = async (userId) => {
    try {
        const getMemberbyuserId = await Member.find({ user: { $in: userId } });
        const projectIds = getMemberbyuserId.map(member => member.projectId);
        const projects = await Project.find({
            $or: [
                { _id: { $in: projectIds } }, // Điều kiện 1: projectId nằm trong danh sách
                { created_by: userId }   // Điều kiện 2: created_by bằng userId
            ]
        }).select('_id'); // Chỉ lấy trường _id

        // Trích xuất danh sách các _id từ kết quả
        const projectIdsList = projects.map(project => project._id).map(id => id.toString());

        logger.info('Get all projects successfully');
        return projectIdsList;
    } catch (error) {
        logger.error(`Get projects error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};