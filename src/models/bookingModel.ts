import mongoose from "mongoose";

export interface IBooking {
    userId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    addressId: mongoose.Types.ObjectId;
    timeslotId: mongoose.Types.ObjectId;
    paymentMethod: 'Cash' | 'Online' | 'Wallet';
    paymentResponse?: object;
    paymentStatus: 'Pending' | 'Success' | 'Failed';
    bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
            required: true
        },
        timeslotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeSlot',
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'online', 'wallet'],
            required: true
        },
        paymentResponse: {
            type: Object
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Success', 'Failed'],
            default: 'Pending'
        },
        bookingStatus: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending'
        },
    },
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model('Booking', bookingSchema);