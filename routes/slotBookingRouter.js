const express = require('express');
const router = express.Router();
const slotBooking = require('../controllers/admin/slotBookingController');
router
  .route('/')
  .get(slotBooking.getAllSlotBookings)
  .post(slotBooking.createSlotBooking);

module.exports = router;
