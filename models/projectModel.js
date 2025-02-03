const mongoose = require('mongoose');

// Định nghĩa schema cho Project
const projectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

module.exports = mongoose.model('Project', projectSchema);
