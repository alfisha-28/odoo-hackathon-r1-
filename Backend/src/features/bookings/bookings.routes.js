const { Router } = require('express');
const { validate } = require('../../middleware/validation.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { createBookingSchema, updateBookingSchema, listBookingsSchema } = require('./bookings.dto');
const { list, create, update } = require('./bookings.controller');

const router = Router();

router.use(authenticate);

// GET /api/bookings
router.get('/', validate(listBookingsSchema), list);

// POST /api/bookings
router.post('/', validate(createBookingSchema), create);

// PATCH /api/bookings/:id
router.patch('/:id', validate(updateBookingSchema), update);

module.exports = router;
