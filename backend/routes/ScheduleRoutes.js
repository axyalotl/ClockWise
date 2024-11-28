const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule'); // Replace with your Schedule model
const User = require('../models/User'); // Replace with your User model

// Create a schedule
router.post('/schedule', async (req, res) => {
    const { userId, date, time, description } = req.body;

    try {
        const schedule = new Schedule({ user: userId, date, time, description });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error });
    }
});

// Fetch all schedules
router.get('/schedules', async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('user', 'name email'); // Populate user data for better visibility
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
});

// Join a schedule
router.post('/schedule/join', async (req, res) => {
    const { userId, scheduleId } = req.body;

    try {
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Add user to the schedule (assuming you have a participants field in your schedule schema)
        if (!schedule.participants) {
            schedule.participants = [];
        }

        if (schedule.participants.includes(userId)) {
            return res.status(400).json({ message: 'User already joined this schedule' });
        }

        schedule.participants.push(userId);
        await schedule.save();

        res.status(200).json({ message: 'Successfully joined the schedule', schedule });
    } catch (error) {
        res.status(500).json({ message: 'Error joining schedule', error });
    }
});

module.exports = router;
