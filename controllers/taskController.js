const Task = require('../models/Task');
const Project = require('../models/projectModel');
const List = require('../models/ListModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');


const generateTaskIdentifier = async (projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

    
    const projectName = project.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    
    const lastTask = await Task.findOne({ identifier: { $regex: `^${projectName}` } })
                               .sort({ createdAt: -1 });  // Lấy task mới nhất

    let newCount = 1;
    if (lastTask) {
        const lastIdentifier = lastTask.identifier;
        const lastNumber = parseInt(lastIdentifier.slice(projectName.length));
        newCount = lastNumber + 1;
    }

    const identifier = `${projectName}${String(newCount).padStart(4, '0')}`;
   
    return identifier;
};

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignee, issueType, image_urls, listId, position, priority, reporter } = req.body;
        // Kiểm tra xem listId có hợp lệ không
        const list = await List.findById(listId);
        const identifier = await generateTaskIdentifier(list.projectId);
       
        if (!list) {
            logger.info('List not found');
            return sendResponse(res, 'List not found', 404);
        }
      
        const newTask = new Task({
            identifier: identifier,
            title,
            description,
            assignee,
            issueType,
            image_urls,
            listId,
            position,
            priority,
            reporter
        });

        const savedTask = await newTask.save();
        // Cập nhật task vào list
        list.tasks.push(savedTask._id);  // Thêm task vào mảng cards của list
        await list.save();  // Lưu lại list với task mới đã được thêm vào

        logger.info(`Task created successfully with ID: ${savedTask._id}`);
        return sendResponse(res, 'Task created successfully', 201, savedTask);
    } catch (error) {
        logger.error(`Error creating task: ${error.message}`);
        return sendResponse(res, 'Failed to create task', 500, { error: error.message });
    }
};

// Get all Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        logger.info('Tasks fetched successfully');
        return sendResponse(res, 'Tasks fetched successfully', 200, tasks);
    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        return sendResponse(res, 'Failed to fetch tasks', 500, { error: error.message });
    }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ identifier: req.params.id })
        .populate('assignee', 'name email avatar_url firstname lastname')
        .populate('reporter', 'name email avatar_url firstname lastname')
        if (!task) {
            logger.info('Task not found');
            return sendResponse(res, 'Task not found', 404);
        }
        logger.info(`Task fetched successfully with ID: ${task._id}`);
        return sendResponse(res, 'Task fetched successfully', 200, task);
    } catch (error) {
        logger.error(`Error fetching task by ID: ${error.message}`);
        return sendResponse(res, 'Failed to fetch task', 500, { error: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            logger.info('Task not found for update');
            return sendResponse(res, 'Task not found', 404);
        }
        logger.info(`Task updated successfully with ID: ${updatedTask._id}`);
        return sendResponse(res, 'Task updated successfully', 200, updatedTask);
    } catch (error) {
        logger.error(`Error updating task: ${error.message}`);
        return sendResponse(res, 'Failed to update task', 500, { error: error.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            logger.info('Task not found for deletion');
            return sendResponse(res, 'Task not found', 404);
        }
        logger.info(`Task deleted successfully with ID: ${deletedTask._id}`);
        return sendResponse(res, 'Task deleted successfully', 200, deletedTask);
    } catch (error) {
        logger.error(`Error deleting task: ${error.message}`);
        return sendResponse(res, 'Failed to delete task', 500, { error: error.message });
    }
};

// move  Task
exports.moveTask = async (req, res) => {
    try {
        const { taskId, targetListId } = req.params;

        // Kiểm tra dữ liệu đầu vào
        if (!taskId || !targetListId) {
            return res.status(400).json({ error: 'Task ID and target List ID are required' });
        }

        // Tìm task cần di chuyển
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const currentListId = task.listId; // ID danh sách hiện tại
        task.listId = targetListId; // Cập nhật ID danh sách

        // Lưu task đã được cập nhật
        await task.save();

        // Gỡ task khỏi danh sách hiện tại
        await List.findByIdAndUpdate(currentListId, { $pull: { tasks: taskId } });

        // Thêm task vào danh sách đích
        await List.findByIdAndUpdate(targetListId, { $push: { tasks: task } });

        // Gửi phản hồi
        return sendResponse(res, 'Move Task successfully', 200, null);

    } catch (error) {
        logger.error(`Error moving task: ${error.message}`);
        return res.status(500).json({ error: 'Failed to move task' });
    }
};

// Get All Tasks by ProjectId
exports.getTasksByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { page = 1, searchParams, status, reporter, assignee } = req.query;
        const limit = 10;
        const skip = (parseInt(page) - 1) * limit;

        // Lấy danh sách list thuộc project
        const lists = await List.find({ projectId }).select('_id name');
        if (!lists.length) {
            logger.info('No lists found for the given project ID');
            return sendResponse(res, 'No lists found for the given project ID', 404);
        }

        // Lọc listId theo status nếu có
        let listIds = lists.map(list => list._id);
        if (status && status !== "All") {
            const statusList = lists.find(list => list.name.toUpperCase() === status.toUpperCase());
            listIds = statusList ? [statusList._id] : [];
        }

        // Tạo bộ lọc
        const filter = { listId: { $in: listIds } };
        Object.assign(filter, assignee && { assignee }, reporter && { reporter });
        if (searchParams) {
            filter.$or = [
                { title: new RegExp(searchParams, "i") },
                { description: new RegExp(searchParams, "i") }
            ];
        }

        // Lấy task và đếm tổng số lượng trong một lần truy vấn
        const [tasks, totalTasks] = await Promise.all([
            Task.find(filter)
                .populate('assignee', 'name email avatar_url firstname lastname')
                .populate('reporter', 'name email avatar_url firstname lastname')
                .populate('listId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Task.countDocuments(filter)
        ]);

        if (!tasks.length) {
            logger.info('No tasks found for the given project ID');
            return sendResponse(res, 'No tasks found for the given project ID', 404);
        }

        logger.info(`Found ${tasks.length} tasks for project ID: ${projectId}`);
        return sendResponse(res, 'Tasks retrieved successfully', 200, { tasks, totalPages: Math.ceil(totalTasks / limit) });

    } catch (error) {
        logger.error(`Error retrieving tasks by project ID: ${error.message}`);
        return sendResponse(res, 'Failed to retrieve tasks', 500, { error: error.message });
    }
};
