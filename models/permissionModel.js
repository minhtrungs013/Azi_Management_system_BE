const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    label: { type: String },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Permission', PermissionSchema);
