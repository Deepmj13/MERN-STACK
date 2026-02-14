const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create Project
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, status, clientId, team } = req.body;
        let project = new Project({
            name,
            description,
            status,
            clientId,
            managerId: req.user.id,
            team,
            tasks: [],
            notes: []
        });

        // Check if user is a manager (optional role check for creation)
        if (req.user.role !== 'manager') return res.status(403).json({ msg: 'Not authorized' });

        await project.save();
        res.json(project);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Projects - Based on Role
router.get('/', auth, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'manager') {
            // Managers see all or their own projects. For simplicity, all.
            projects = await Project.find().populate('team', 'name').populate('clientId', 'name');
        } else if (req.user.role === 'client') {
            // Clients see only their projects
            projects = await Project.find({ clientId: req.user.id }).populate('team', 'name');
        } else {
            // Employees see projects they are assigned to
            projects = await Project.find({ team: req.user.id }).populate('clientId', 'name').populate('managerId', 'name');
        }
        res.json(projects);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get Single Project
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('team', 'name email avatar')
            .populate('tasks')
            .populate('notes');

        if (!project) return res.status(404).json({ msg: 'Project not found' });

        // Authorization check
        // Authorization check
        let hasFullAccess = false;

        // Admins/Managers always have full access
        if (req.user.role === 'manager' || req.user.role === 'admin') hasFullAccess = true;

        // Clients only if they own the project
        if (req.user.role === 'client') {
            if (project.clientId && project.clientId.toString() === req.user.id) {
                hasFullAccess = true;
            } else {
                return res.status(403).json({ msg: 'Not authorized' });
            }
        }

        // Employees
        if (req.user.role === 'employee') {
            if (project.team.some(member => member._id.toString() === req.user.id)) {
                hasFullAccess = true;
            }
            // If not in team, they can still view (continue to response), but maybe we should flag it or partial return?
            // User said: "every other can see who is involved in the project but not task"
            // So if not in team, we return partial data.
        }

        if (!hasFullAccess && req.user.role === 'employee' && !project.team.some(member => member._id.toString() === req.user.id)) {
            // Return limited view (No tasks, No notes)
            const limitedProject = {
                _id: project._id,
                name: project.name,
                description: project.description,
                status: project.status,
                team: project.team, // Showing who is involved
                managerId: project.managerId,
                clientId: project.clientId,
                isLimited: true
            };
            return res.json(limitedProject);
        }

        res.json(project);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
