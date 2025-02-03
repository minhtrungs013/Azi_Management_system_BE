const Message = require('../models/Message');
const Group = require('../models/Group');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

// Gửi tin nhắn vào nhóm
exports.sendMessage = async (req, res) => {
    try {
        const { groupId, message } = req.body;
        const senderId = req.params.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return sendResponse(res, 'Group not found', 404);
        }

        if (!group.members.includes(senderId)) {
            return sendResponse(res, 'You are not a member of this group', 403);
        }

        const newMessage = new Message({ sender: senderId, group: groupId, message });
        
        const savedMessage = await newMessage.save();

        const io = req.app.get('io'); 
        io.to(groupId).emit('sendMessage', savedMessage);
        logger.info(`Message sent to group ${groupId}`);
        return sendResponse(res, 'Message sent successfully', 200, savedMessage);
    } catch (error) {
        logger.error(`Error sending message: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};

// Lấy tất cả tin nhắn của nhóm
exports.getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return sendResponse(res, 'Group not found', 404);
        }

        const messages = await Message.find({ group: groupId })
            .populate('sender', 'username email')
            .sort({ timestamp: 1 });

        return sendResponse(res, 'Messages retrieved successfully', 200, messages);
    } catch (error) {
        logger.error(`Error retrieving messages: ${error.message}`);
        return sendResponse(res, error.message, 400);
    }
};
