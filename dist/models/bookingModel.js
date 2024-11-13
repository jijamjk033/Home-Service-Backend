"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    addressId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    timeslotId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
