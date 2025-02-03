const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middlewares/authMiddleware');
// Create a new notification
router.post('/', authenticateToken, notificationController.createNotification);

// Get all notifications
router.get('/', authenticateToken, notificationController.getNotifications);

// Get a single notification by ID
router.get('/:id', authenticateToken, notificationController.getNotificationById);

// Update a notification by ID
router.put('/:id', authenticateToken, notificationController.updateNotification);

// Delete a notification by ID
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

module.exports = router;
