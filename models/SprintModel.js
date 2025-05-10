const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
        name: { type: String, required: true },
        description: { type: String },
        status: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    { timestamps: true } 
)

// Export Schema cho Sprint
module.exports = mongoose.model('Sprint', projectSchema);