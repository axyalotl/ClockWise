const express = require('express');
const { joinTeam, createTeam } = require('../controllers/teamController');
const router = express.Router();

// Route to join a team
router.post('/join', joinTeam);

// Route to create a new team
router.post('/create', createTeam);

module.exports = router;
