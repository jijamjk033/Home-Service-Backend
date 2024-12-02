"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const bookingrepository_1 = require("../repositories/bookingrepository");
const serviceRepository_1 = require("../repositories/serviceRepository");
const userRepository_1 = require("../repositories/userRepository");
class BookingService {
    constructor(bookingRepository, UserRepository, serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = UserRepository;
        this.serviceRepository = serviceRepository;
    }
    getBookingList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserById(userId);
                if (!user)
                    throw new Error('User does not exists');
                const bookingdata = yield this.bookingRepository.getBookingList(userId);
                console.log(bookingdata);
                return bookingdata;
            }
            catch (error) {
                console.error('Booking data not found');
                throw new Error('Error fetching Booking Data');
            }
        });
    }
    getEmployeeBookings(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingdata = yield this.bookingRepository.getEmployeeBookings(employeeId);
                return bookingdata;
            }
            catch (error) {
                console.error('Booking data not found');
                throw new Error('Error fetching Booking Data');
            }
        });
    }
    getBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingdata = yield this.bookingRepository.getBookingDetails(bookingId);
                return bookingdata;
            }
            catch (error) {
                console.error('Booking data not found');
                throw new Error('Error fetching Booking Data');
            }
        });
    }
    updateBookingStatus(bookingId, bookingStatus, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!bookingId)
                    throw new Error('Booking ID is required');
                const updateData = {};
                if (bookingStatus && ['Pending', 'Confirmed', 'Cancelled'].includes(bookingStatus)) {
                    updateData.bookingStatus = bookingStatus;
                }
                else if (bookingStatus) {
                    throw new Error('Invalid booking status');
                }
                if (typeof completed !== 'undefined') {
                    updateData.completed = completed;
                }
                if (bookingStatus === 'Cancelled') {
                    const booking = yield this.bookingRepository.getBookingDetails(bookingId);
                    if (!booking)
                        throw new Error('Booking not found');
                    yield userRepository.changeTimeslotStatus(booking.timeslotId, false);
                    if (booking.paymentMethod === 'Online' && ((_a = booking.paymentResponse) === null || _a === void 0 ? void 0 : _a.paymentId)) {
                        yield this.refund(booking.paymentResponse.paymentId, (_b = booking.totalAmount) !== null && _b !== void 0 ? _b : 0);
                    }
                }
                const updatedBooking = yield bookingrepository_1.bookingRepository.updateBookingStatus(bookingId, updateData);
                if (!updatedBooking) {
                    throw new Error('Failed to update booking status');
                }
                return updatedBooking;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error updating booking status: ${error.message}`);
                }
                throw error;
            }
        });
    }
    refund(paymentId, totalAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!paymentId || !totalAmount) {
                    throw new Error('Payment ID and amount are required for refund');
                }
                console.log(`Processing refund for Payment ID: ${paymentId}, Amount: ${totalAmount}`);
                return Promise.resolve();
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Error processing refund: ${error.message}`);
            }
        });
    }
    cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.bookingRepository.getBookingDetails(bookingId);
                console.log(booking);
                if (!booking)
                    throw new Error('Booking not found');
                if (booking.bookingStatus === 'Completed' || booking.bookingStatus === 'Cancelled') {
                    throw new Error('Booking cannot be cancelled');
                }
                const currentTime = new Date();
                const slotDate = yield this.parseBookingDate(booking.date);
                const timeDifferenceInHours = (slotDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
                let refundAmount = 0;
                console.log('details-->', currentTime, booking.date, slotDate, timeDifferenceInHours);
                if (timeDifferenceInHours > 24) {
                    refundAmount = booking.totalAmount - 50;
                }
                else if (timeDifferenceInHours >= 12 && timeDifferenceInHours <= 24) {
                    refundAmount = 0;
                }
                else {
                    throw new Error('Booking cannot be cancelled within 12 hours of the slot');
                }
                yield bookingrepository_1.bookingRepository.updateBookingStatus(bookingId, { bookingStatus: 'Cancelled' });
                if (refundAmount > 0) {
                    const walletCreated = yield userRepository.addTransactionToWallet(booking.userId, refundAmount, 'credit');
                    console.log('wallet', walletCreated);
                }
                yield userRepository.changeTimeslotStatus(booking.timeslotId, false);
                return `Booking cancelled successfully. Refund of ₹${refundAmount} has been processed.`;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error cancelling booking: ${error.message}`);
                    throw new Error(`Error cancelling booking: ${error.message}`);
                }
                throw new Error('An unexpected error occurred during cancellation.');
            }
        });
    }
    parseBookingDate(bookingDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const [monthDay, timeRange] = bookingDate.split(' - ');
            const [startTime] = timeRange.split(' to ');
            const year = new Date().getFullYear();
            const dateString = `${monthDay} ${year} ${startTime}`;
            const parsedDate = new Date(dateString);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date format');
            }
            return parsedDate;
        });
    }
    ;
    createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserById(userId);
                if (!user)
                    throw new Error("User not found");
                const service = yield this.serviceRepository.findByServiceId(serviceId);
                if (!service)
                    throw new Error("Service not found");
                const addresses = yield this.userRepository.getAddressByUser(userId);
                const validAddress = addresses.find(address => address._id.toString() === addressId);
                if (!validAddress)
                    throw new Error("Address not found or does not belong to the user");
                const timeslot = yield this.userRepository.getTimeslot(timeslotId);
                if (!timeslot)
                    throw new Error("Timeslot not found");
                if (timeslot.isBooked)
                    throw new Error("Timeslot is already booked");
                let bookingStatus = 'Pending';
                let paymentStatus = 'Pending';
                if (paymentMethod === 'cash') {
                    paymentStatus = 'Pending';
                }
                else if (paymentMethod === 'online' || paymentMethod === 'wallet') {
                    paymentStatus = paymentResponse.status;
                }
                const bookingResult = yield this.userRepository.createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse, bookingStatus, paymentStatus);
                if (!bookingResult.success) {
                    throw new Error(bookingResult.message);
                }
                yield this.userRepository.updateTimeslot(timeslotId, true);
                return bookingResult;
            }
            catch (error) {
                console.error("Booking creation error:", error);
                throw new Error(error instanceof Error ? error.message : "Booking creation failed");
            }
        });
    }
}
const userRepository = new userRepository_1.UserRepository();
exports.bookingService = new BookingService(bookingrepository_1.bookingRepository, userRepository, serviceRepository_1.serviceRepository);
