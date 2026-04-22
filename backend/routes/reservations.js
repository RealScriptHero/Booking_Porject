const express = require('express');
const router = express.Router();
const {
  getReservations,
  createReservation,
  updateReservation
} = require('../controllers/reservationController');

router.get('/', getReservations);
router.post('/', createReservation);
router.put('/:id', updateReservation);

module.exports = router;
