const express = require('express');
const { checkout, verify } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/authenticate');

const router = express.Router();

router.route('/checkout').post(isAuthenticatedUser, checkout);
router.route('/verify-payment').post(isAuthenticatedUser, verify);

module.exports = router;
