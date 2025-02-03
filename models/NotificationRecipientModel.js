const mongoose = require('mongoose');

const notificationRecipientSchema = new mongoose.Schema({
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('NotificationRecipients', notificationRecipientSchema);
