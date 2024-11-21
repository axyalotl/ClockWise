const mongoose = require('mongoose');
const Team = require('../models/Team');

// Generate a random 6-digit alphanumeric team code
const generateTeamCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Create a Team
const createTeam = async (req, res) => {
    const { name, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Team name and user ID are required' });
    }

    try {
        const teamCode = generateTeamCode(); // Generate random team code

        const newTeam = new Team({ name, code: teamCode, members: [userId] });
        await newTeam.save();

        console.log(`Team created: ${newTeam.name} (Code: ${teamCode})`); // Log the team code

        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Failed to create team' });
    }
};


// Join a Team
const joinTeam = async (req, res) => {
    const { code, userId } = req.body;

    if (!code || !userId) {
        return res.status(400).json({ message: 'Team code and user ID are required' });
    }

    try {
        const team = await Team.findOne({ code });
        if (!team) {
            return res.status(404).json({ message: 'Invalid team code' });
        }

        // Add the user to the team if not already a member
        if (!team.members.includes(userId)) {
            team.members.push(userId);
            await team.save();
        }

        res.status(200).json({ message: 'Successfully joined the team', team });
    } catch (error) {
        console.error('Error joining team:', error);
        res.status(500).json({ message: 'Failed to join the team' });
    }
};

module.exports = { createTeam, joinTeam }; // Export both functions
