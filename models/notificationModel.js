const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    link: { type: String },
    notificationRecipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NotificationRecipients' }]
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);
