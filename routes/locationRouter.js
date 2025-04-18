const express = require('express');
const router = express.Router();
const locationController = require('../controllers/admin/locationController');
const { protect, restrictTo } = require('../middlewares/authmiddlewares');

router.use(protect); // ensures that user is logged in
router.use(restrictTo(2)); // ensures that only user_type = 2 can access resources
router.route('/').get(locationController.getLocations); // Get all locations (states, cities, areas)

module.exports = router;
