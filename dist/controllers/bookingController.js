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
exports.bookingController = void 0;
const http_status_codes_1 = require("http-status-codes");
const bookingService_1 = require("../services/bookingService");
class BookingController {
    getBookingList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const bookingData = yield bookingService_1.bookingService.getBookingList(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: bookingData,
                    message: ' Booking Data fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Booking data', err,
                });
            }
        });
    }
    getEmployeeBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeId = req.params.id;
                const bookingData = yield bookingService_1.bookingService.getEmployeeBookings(employeeId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: bookingData,
                    message: ' Booking Data fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Booking data', err,
                });
            }
        });
    }
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.id;
                const bookingData = yield bookingService_1.bookingService.getBookingDetails(bookingId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: bookingData,
                    message: ' Booking Data fetched successfully'
                });
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error fetching Booking data', err,
                });
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.id;
                const { bookingStatus, completed } = req.body;
                const updatedBooking = yield bookingService_1.bookingService.updateBookingStatus(bookingId, bookingStatus, completed);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: updatedBooking,
                    message: 'Booking status updated successfully',
                });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error updating booking status',
                    error,
                });
            }
        });
    }
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.id;
                const result = yield bookingService_1.bookingService.cancelBooking(bookingId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: 'Success',
                    data: result,
                    message: 'Booking cancellation successful',
                });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Error cancelling booking',
                    error,
                });
            }
        });
    }
    createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse } = req.body;
            console.log(paymentMethod, 'payment initiated');
            try {
                const response = yield bookingService_1.bookingService.createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response.message || 'Booking successfull',
                    success: response.success,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message,
                    success: false,
                });
            }
        });
    }
}
exports.bookingController = new BookingController();
