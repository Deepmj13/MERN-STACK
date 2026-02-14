const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'completed'],
        default: 'active'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
