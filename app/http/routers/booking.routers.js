import { Router } from 'express';
// import newBooking from '../../models/booking.model';
// import catchAsync from '../../utils/catchAsync';
import bookingController from './../controllers/booking.controller';

const router = Router();

router.route('/')
    .get(bookingController.allBookings)
    .post(bookingController.newBooking);

router.route('/:id')
    .get(bookingController.findOne)
    .patch(bookingController.updateOne)
    .delete(bookingController.deleteOne);


export default router;