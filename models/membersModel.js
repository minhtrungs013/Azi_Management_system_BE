const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission', // Tham chiếu đến Permission
            required: true
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
