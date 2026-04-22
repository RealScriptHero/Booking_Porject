const express = require('express');
const router = express.Router();
const {
  getAdminReservations,
  getAdminStats
} = require('../controllers/adminController');

router.get('/reservations', getAdminReservations);
router.get('/stats', getAdminStats);

module.exports = router;
