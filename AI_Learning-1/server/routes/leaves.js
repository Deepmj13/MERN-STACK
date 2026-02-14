const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create Leave Request
router.post('/', auth, async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const leave = new Leave({
            user: req.user.id,
            startDate,
            endDate,
            reason,
            status: 'pending' // Default to pending
        });

        await leave.save();
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Leave Status (Manager only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const { status } = req.body; // 'approved' or 'rejected'
        let leave = await Leave.findById(req.params.id);

        if (!leave) return res.status(404).json({ msg: 'Leave not found' });

        leave.status = status;
        await leave.save(); // Save status
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Leaves (For Calendar View - Accessible by All Authenticated Users)
router.get('/', auth, async (req, res) => {
    try {
        // Only return approved leaves for the calendar view so everyone knows who is off.
        // Managers might want to see pending ones too, so we can filter based on query param or role.
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        else query.status = 'approved'; // Default to show approved leaves for calendar

        // If manager, maybe show all? Or let frontend handle it.
        // For now, let's stick to the requirement: "see who is absent".
        // So 'approved' is the key.

        const leaves = await Leave.find(query).populate('user', 'name email role');
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
