const express = require('express');
const router = express.Router();
const locationController = require('../controllers/admin/locationController');

router.route('/').get(locationController.getLocations); // Get all locations (states, cities, areas)

module.exports = router;
