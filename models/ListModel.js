const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],  // Dẫn đến mảng các card
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
