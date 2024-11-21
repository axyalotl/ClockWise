const mongoose = require('mongoose');
const Company = require('../models/Company');
const Team = require('../models/Team');

const createCompany = async (req, res) => {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
        return res.status(400).json({ message: 'Company name and owner ID are required' });
    }

    try {
        // Check if the ownerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: 'Invalid owner ID' });
        }

        // Check if a company with the same name exists
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company name already exists' });
        }

        // Create a new company
        const newCompany = new Company({
            name,
            owner: mongoose.Types.ObjectId(ownerId), // Convert to ObjectId
            members: [mongoose.Types.ObjectId(ownerId)], // Convert to ObjectId
        });
        await newCompany.save();

        // Generate a random team code
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const defaultTeam = new Team({
            name: `${name} Default Team`,
            code: teamCode,
            members: [mongoose.Types.ObjectId(ownerId)], // Convert to ObjectId
            company: newCompany._id, // Link the team to the company
        });
        await defaultTeam.save();

        // Add the default team to the company's teams list
        newCompany.teams.push(defaultTeam._id);
        await newCompany.save();

        res.status(201).json({
            message: 'Company and default team created successfully',
            company: newCompany,
            team: defaultTeam,
        });
    } catch (error) {
        console.error('Error creating company and default team:', error);
        res.status(500).json({ message: 'Failed to create company and default team', error: error.message });
    }

    console.log('Owner ID received:', ownerId);

};

module.exports = { createCompany };

