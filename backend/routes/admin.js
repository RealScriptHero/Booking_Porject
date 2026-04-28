const express = require('express');
const router = express.Router();
const {
  getAdminCustomers,
  getAdminCustomerReservations,
  deleteAdminCustomer,
  getAdminReservations,
  getAdminAnalytics
} = require('../controllers/adminController');

router.get('/customers', getAdminCustomers);
router.get('/customers/:id/reservations', getAdminCustomerReservations);
router.delete('/customers/:id', deleteAdminCustomer);
router.get('/reservations', getAdminReservations);
router.get('/analytics', getAdminAnalytics);
router.get('/stats', getAdminAnalytics);

module.exports = router;
