import { Schema, model } from 'mongoose';


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
        totalFreight: {
            type: Number,
            required: true
        },
        payedFreight: {
            type: Number,
            required: false
        },
        balenceFreight: {
            type: Number,
            required: false,
            default: function () {
                if (this.freight.payedFreight) {
                    const balence = (
                        Number(this.freight.totalFreight) - Number(this.freight.payedFreight)
                    );
                    return balence;
                }
            }
        }
    },
    paymentType: {
        type: String,
        required: false,
        enum: {
            values: ['CASH', 'ONLINE'],
            message: 'Payment type is either CASH, or ONLINE'
        }
    },
    paymentStatus: {
        type: String,
        required: false,
        default: function () {
            return (this.freight.payedFreight >= this.freight.totalFreight)
                ? 'Complete' : 'Pending';
        }
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
    rejectedAt: {
        type: Date,
        required: false
    }

}, {
    timestamps: true
});


const newBooking = model('booking', bookingSchema);

export default newBooking;