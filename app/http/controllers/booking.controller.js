import appError from './../../errors/appError';
import Booking from './../../models/booking.model';
import bookingFreight from './../../models/payment.model';
import catchAsync from './../../utils/catchAsync';
import uniqueCN from './../../utils/CN-Number-generater';
import apiFeature from './../../utils/api-feature';


/**
 * @description All bookings
 * @Method GET 
 * @URL /api-v1/bookings
 * @ACCESS private
 */
const allBookings = catchAsync(async (req, res, next) => {
    console.log(req.query);
    const allBooking = new apiFeature(Booking.find(), req.query)
        .Filter()
        .Sorting()
        .Limiting()
        .Pagination();

    // excuting Query
    const AllData = await allBooking.query;

    res.status(200)
        .json({
            status: 'Success',
            result: AllData.length,
            data: AllData
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

    const bookingData = { ...req.body };
    console.log(bookingData);
    let freightData = {};

    const exludeData = ['totalFreight', 'payedFreight', 'paymentType'];
    exludeData.map((val, key) => {
        freightData[val] = bookingData[val];
        delete bookingData[val];
    });

    const freight = await bookingFreight.create({
        ...freightData
    });

    const newBooking = await Booking.create({
        ...bookingData,
        "bookingNumber": uniqueCN(LastCN_number.length + 1),
        freight: freight._id
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
    console.log(updatePayment);
    if (prevPayedFreight) {
        if (updatePayment.freight) {
            updatePayment.freight.payedFreight = (prevPayedFreight.freight.payedFreight)
                + (updatePayment.freight.payedFreight);
            updatePayment['freight.payedFreight'] = updatePayment.freight.payedFreight;
            updatePayment['freight.totalFreight'] = updatePayment.freight.payedFreight;
            // delete updatePayment["freight"];
        }
        console.log(updatePayment);

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