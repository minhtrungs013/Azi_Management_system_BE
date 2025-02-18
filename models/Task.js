const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueType: { type: String, required: true },
    image_urls: [{ type: String }],
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
    position: { type: String, required: true },
    priority: { type: String, required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, default: new Date() },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);