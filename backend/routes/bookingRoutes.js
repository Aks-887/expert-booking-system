const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/', (req, res, next) => {
  // If expertId is provided, return bookings for that expert (pending)
  if (req.query && req.query.expertId) {
    return bookingController.getBookingsByExpertId(req, res, next);
  }
  return bookingController.getBookingsByEmail(req, res, next);
});
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
