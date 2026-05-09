const express = require('express');
const expertController = require('../controllers/expertController');

const router = express.Router();

router.get('/', expertController.getExperts);
router.post('/', expertController.createExpert);
router.post('/login', expertController.loginExpert);
router.get('/:id', expertController.getExpertById);

module.exports = router;
