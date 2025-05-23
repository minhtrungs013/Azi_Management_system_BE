const Notification = require('../models/notificationModel');
const NotificationRecipient = require('../models/NotificationRecipientModel');
const sendResponse = require('../helpers/responseHelper');
const logger = require('../config/logger/logger');

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { title, message, senderId, type, link, notificationRecipients } = req.body;

        // Tạo notification
        const notification = new Notification({ title, message, senderId, type, link });
        await notification.save();

        // Tạo danh sách người nhận
        const recipients = notificationRecipients
        .filter(userId => userId !== senderId) // Lọc bỏ senderId nếu cần
        .map(userId => ({
            notificationId: notification._id,
            userId: userId, // Đúng cú pháp
        }));

        const insertedRecipients = await NotificationRecipient.insertMany(recipients);
        const notificationRecipientIds = insertedRecipients.map(recipient => recipient._id);

        // Cập nhật danh sách người nhận vào notification
        notification.notificationRecipients = notificationRecipientIds;
        await notification.save();
        return sendResponse(res, "create notification successfully", 201, { notification, recipients });
    } catch (error) {
        logger.error(`Error creating notification: ${error.message}`, { error });
        sendError(res, 'Error creating notification', 400, error.message);
    }
};

// Get all notifications with recipients
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('notificationRecipients')
            .exec();
        return sendResponse(res, "get notification successfully", 200, notifications);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error.message}`, { error });
        sendError(res, 'Error fetching notifications', 400, error.message);
    }
};

// Get a single notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
            .populate('notificationRecipients')
            .exec();

        if (!notification) {
            return sendError(res, 'Notification not found', 404);
        }

        return sendResponse(res, "get notification by id successfully", 200, notification);
    } catch (error) {
        logger.error(`Error fetching notification: ${error.message}`, { error });
        sendError(res, 'Error fetching notification', 400, error.message);
    }
};

// Update a notification by ID
exports.updateNotification = async (req, res) => {
    try {
        const { title, message, type, link, receiveIds } = req.body;

        // Cập nhật notification
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { title, message, type, link },
            { new: true }
        );

        if (!notification) {
            return sendError(res, 'Notification not found', 404);
        }

        // Xóa danh sách người nhận cũ và thêm danh sách mới nếu `receiveIds` được cung cấp
        if (receiveIds) {
            await NotificationRecipient.deleteMany({ notificationId: notification._id });
            const recipients = receiveIds.map(userId => ({
                notificationId: notification._id,
                userId
            }));
            await NotificationRecipient.insertMany(recipients);
        }

        return sendResponse(res, "update notification successfully", 200, notification);
    } catch (error) {
        logger.error(`Error updating notification: ${error.message}`, { error });
        sendError(res, 'Error updating notification', 400, error.message);
    }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return sendError(res, 'Notification not found', 404);
        }

        // Xóa tất cả người nhận liên quan đến thông báo
        await NotificationRecipient.deleteMany({ notificationId: notification._id });

        return sendResponse(res, " notification deleted successfully", 201, null);
    } catch (error) {
        logger.error(`Error deleting notification: ${error.message}`, { error });
        sendError(res, 'Error deleting notification', 400, error.message);
    }
};


// Get a single notification by ID
exports.getNotificationByUserId = async (req, res) => {
    const id = req.params.id;
    try {
        // Tìm tất cả notificationId mà userId đã nhận
        const notificationRecipients = await NotificationRecipient.find({ userId: id })
            .select('notificationId');

        if (!notificationRecipients.length) {
            return sendResponse(res, "No notifications found for this user", 200, []);
        }

        const notificationIds = notificationRecipients.map(nr => nr.notificationId);

        // Lấy thông tin chi tiết của thông báo dựa trên danh sách notificationId
        const notifications = await Notification.find({ _id: { $in: notificationIds } })
            .populate('notificationRecipients') // Load thông tin recipients nếu cần
            .sort({ createdAt: -1 })
            .exec();
            
        return sendResponse(res, "Get notifications by userId successfully", 200, notifications);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error.message}`, { error });
    }
};

// Update a notification recipient by ID and userId
exports.updateNotificationByUserId = async (req, res) => {
    try {
        const { notificationRecipientId, userId } = req.params;

        // Cập nhật trạng thái đọc của người nhận (notificationRecipient)
        const notificationRecipient = await NotificationRecipient.findOneAndUpdate(
            { _id: notificationRecipientId, userId: userId }, // Tìm theo id và userId
            { isRead: true }, // Cập nhật isRead = true
            { new: true } // Trả về dữ liệu mới sau cập nhật
        );

        if (!notificationRecipient) {
            return sendError(res, 'Notification recipient not found', 404);
        }

        return sendResponse(res, "Update notification successfully", 200, notificationRecipient);
    } catch (error) {
        logger.error(`Error updating notification: ${error.message}`, { error });
        sendError(res, 'Error updating notification', 400, error.message);
    }
};
