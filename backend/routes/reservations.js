const express = require('express');
const router = express.Router();
const {
  getReservations,
  getMyReservations,
  createReservation,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

router.get('/', getReservations);
router.get('/my', getMyReservations);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
