const express = require('express');
const timeSlotController = require('../controllers/timeSlotController');

const router = express.Router();

router.get('/:expertId/slots', timeSlotController.getTimeSlots);
router.post('/', timeSlotController.createTimeSlots);
router.patch('/:id', timeSlotController.updateTimeSlot);

module.exports = router;
