import { Schema, model } from 'mongoose';


const freight = new Schema({
    booking: {
        type: Schema.Types.ObjectId, ref: 'booking'
    },
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
            if (this.payedFreight) {
                const balence = (
                    Number(this.totalFreight) - Number(this.payedFreight)
                );
                return balence;
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
            return (this.payedFreight >= this.totalFreight)
                ? 'Complete' : 'Pending';
        }
    },
});


const bookingFreight = model('booking_Freight', freight);

export default bookingFreight;