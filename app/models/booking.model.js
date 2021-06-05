import { Schema, model } from 'mongoose';
import bookingFreight from './payment.model';


const bookingSchema = new Schema({
    bookingNumber: {
        type: String,
        required: true,
        unique: true
    },
    partyName: {
        type: String,
        required: true,
        minLength: [4, 'Party Name must be longer then 4+ character'],
        maxLength: [64, 'Party Name is not greater then 64 charecter']
    },
    truck: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    freight: {
        type: Schema.Types.ObjectId,
        ref: bookingFreight
    },
    bookingStatus: {
        type: String,
        required: true,
        enum: {
            values: ['Rejected', 'Delevered', 'Pending'],
            message: "{VALUE} not supported, please use ['Rejected', 'Delevered', 'Pending'] for booking status"
        },
        default: 'Pending'
    },
    rejectionReasons: {
        type: String,
        required: false
    },
    rejectedAt: {
        type: Date,
        required: false
    }

}, {
    timestamps: true
});


const newBooking = model('booking', bookingSchema);

export default newBooking;