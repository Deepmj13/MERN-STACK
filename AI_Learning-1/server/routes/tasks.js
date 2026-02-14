const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Create Task (Requires Manager)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, project, assignee, dueDate, priority } = req.body;

        // Check if user is manager or admin
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const newTask = new Task({
            title,
            description,
            project,
            assignee,
            dueDate,
            priority
        });

        const savedTask = await newTask.save();
        await Project.findByIdAndUpdate(project, { $push: { tasks: savedTask._id } });

        res.json(savedTask);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Tasks for a Project
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Task Status (Employee)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Check if assignee is current user or manager
        if (task.assignee.toString() !== req.user.id && req.user.role !== 'manager') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
