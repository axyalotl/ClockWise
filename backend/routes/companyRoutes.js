// backend/routes/companyRoutes.js
const express = require('express');
const { createCompany } = require('../controllers/companyController');
const router = express.Router();

// Route to create a company
router.post('/', createCompany);

module.exports = router;
