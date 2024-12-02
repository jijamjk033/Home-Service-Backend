import mongoose, { Types } from "mongoose";

export interface IBooking {
    _id: Types.ObjectId; 
    userId: string;
    serviceId: Types.ObjectId | string;
    addressId: Types.ObjectId | string;
    timeslotId:  string; 
    date: string;
    totalAmount: number; 
    paymentMethod: "Cash" | "Online" | "Wallet";
    bookingStatus: "Pending" | "Confirmed" | "Cancelled"| "Completed";
    paymentStatus: "Pending" | "Success" | "Failed";
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    paymentResponse?: {
        paymentId: string;
        status?: string; 
    };
}

export interface IBookingResponse {
    employee: string;
    date: string;
    category: string;
    service: string;
    totalAmount: number;
    paymentMethod: 'cash' | 'online' | 'wallet';
    bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
    completed:boolean;
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
            ref: 'address',
            required: true
        },
        timeslotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Timeslots',
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'online', 'wallet'],
            required: true
        },
        totalAmount: {
            type: Number,
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
        completed: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Booking = mongoose.model('Booking', bookingSchema);