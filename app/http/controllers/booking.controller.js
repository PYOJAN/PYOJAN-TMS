import appError from './../../errors/appError';
import Booking from './../../models/booking.model';
import catchAsync from './../../utils/catchAsync';
import uniqueCN from './../../utils/CN-Number-generater';


/**
 * @description All bookings
 * @Method GET 
 * @URL /api-v1/bookings
 * @ACCESS private
 */
const allBookings = catchAsync(async (req, res, next) => {
    const Bookings = await Booking.find();

    res.status(200)
        .json({
            status: 'Success',
            result: Bookings.length,
            data: Bookings
        });
});

/**
 * @description New Booking
 * @Method POST 
 * @URL /api-v1/bookings
 * @ACCESS private
 */
const newBooking = catchAsync(async (req, res, next) => {

    let LastCN_number = await Booking.find();

    const newBooking = await Booking.create({
        ...req.body,
        "bookingNumber": uniqueCN(LastCN_number.length + 1)
    });
    res.status(200)
        .json({
            status: 'success',
            message: newBooking
        });
});

/**
 * @description find One booking 
 * @Method GET 
 * @URL /api-v1/bookings/:id
 * @ACCESS private
 */
const findOne = catchAsync(async (req, res, next) => {

    const ID = req.params.id;
    const data = await Booking.findOne({
        bookingNumber: ID
    });

    res.status(200)
        .json({
            status: 'Success',
            data
        });
});

/**
 * @description update one Booking
 * @Method PATCH 
 * @URL /api-v1/bookings/:id
 * @ACCESS private
 */
const updateOne = catchAsync(async (req, res, next) => {

    const ID = req.params.id;
    let updatePayment = { ...req.body };
    const prevPayedFreight = await Booking.findOne({
        bookingNumber: ID
    });

    if (prevPayedFreight) {
        updatePayment.freight.payedFreight = (prevPayedFreight.freight.payedFreight)
            + (updatePayment.freight.payedFreight);
        updatePayment['freight.payedFreight'] = updatePayment.freight.payedFreight;
        delete updatePayment["freight"];

        const data = await Booking.findOneAndUpdate(ID, updatePayment, {
            new: true,
            runValidators: true
        });

        res.status(201)
            .json({
                status: 'Success',
                message: 'update successfull',
                data
            });
    }
    else {
        next(new appError(`This ID ${ID} Not found`, 404));
    }
});

/**
 * @description Delete one Booking
 * @Method DELETE
 * @URL /api-v1/bookings/:id
 * @ACCESS private
 */
const deleteOne = catchAsync(async (req, res, next) => {
    const ID = req.params.id;

    const updateData = {
        bookingStatus: 'Rejected',
        rejectedAt: Date.now()
    };

    let isRejected = await Booking.findOne({ bookingNumber: ID });
    if (!isRejected) return next(new appError(`Invalid booking ID: ${ID}`));
    isRejected = isRejected.bookingStatus === 'Rejected' ? true : false;

    if (isRejected) {
        return next(new appError(`This Booking ${ID} is already Deleted`));
    }
    const data = await Booking.findOneAndUpdate({ bookingNumber: ID }, updateData, {
        runValidators: true,
        new: true
    });


    res.status(201)
        .json({
            status: 'Success',
            message: ` This ${ID} Booking deleted successfully`,
            data
        });
});

export default {
    newBooking,
    allBookings,
    updateOne,
    findOne,
    deleteOne
};