const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create Note
router.post('/', auth, async (req, res) => {
    try {
        const { content, projectId } = req.body;
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ msg: 'Project not found' });

        // Authorization: User must be part of the project team or client
        if (req.user.role === 'employee' && !project.team.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        if (req.user.role === 'client' && project.clientId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const note = new Note({
            content,
            project: projectId,
            author: req.user.id
        });

        await note.save();

        // Add note reference to Project
        project.notes.push(note._id);
        await project.save();

        res.json(note);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Notes (Project Specific)
router.get('/:projectId', auth, async (req, res) => {
    try {
        const notes = await Note.find({ project: req.params.projectId }).populate('author', 'name avatar role');
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
