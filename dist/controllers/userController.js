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
exports.userController = void 0;
const userService_1 = require("../services/userService");
const responseHelper_1 = require("../helpers/responseHelper");
const http_status_codes_1 = require("http-status-codes");
const userRepository_1 = require("../repositories/userRepository");
const serviceRepository_1 = require("../repositories/serviceRepository");
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository, serviceRepository_1.serviceRepository);
class UserController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.signup(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                console.error("Signup error:", err);
                if (err instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, token } = req.body;
            try {
                if (!token) {
                    throw new Error('JWT token must be provided');
                }
                const result = yield userService.verifyOtp(token, otp);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('Email must be provided'));
            }
            try {
                const result = yield userService.resendOtp(email);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield userService.userLogin(email, password);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, locality, city, state, pincode, user, typeOfAddress } = req.body;
            try {
                const result = yield userService.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Address saved successfully',
                    data: result,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error saving address:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to save address. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
    getAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const addresses = yield userService.getAddressByUser(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Addresses fetched successfully',
                    data: addresses,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching addresses:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to fetch addresses. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
    getTimeslots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeslot = req.params.id;
                const timeslotDetails = yield userService.getTimeslots(timeslot);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: 'Timeslot fetched successfully',
                    success: true,
                    data: timeslotDetails
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: error.message,
                        success: false
                    });
                }
            }
        });
    }
    fetchTimeSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeId = req.params.id;
                const date = req.query.date;
                if (typeof date === 'string') {
                    const timeslots = yield userService.fetchTimeSlots(employeeId, date);
                    res.status(http_status_codes_1.StatusCodes.OK).json({
                        message: 'Timeslot fetched successfully',
                        success: true,
                        data: timeslots,
                    });
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: 'Invalid date format',
                        success: false
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: error.message,
                        success: false
                    });
                }
            }
        });
    }
    fetchAddressSelected(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressId = req.params.id;
            try {
                const addresses = yield userService.fetchAddressSelected(addressId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Address fetched successfully',
                    data: addresses,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching address:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to fetch address. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
    createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, serviceId, addressId, timeslotId, paymentMethod, paymentResponse } = req.body;
            console.log(paymentMethod, 'payment initiated');
            try {
                const response = yield userService.createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, paymentResponse);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response.message || 'Booking successfull',
                    success: response.success,
                });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'An unknown error occurred';
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message,
                    success: false,
                });
            }
        });
    }
}
exports.userController = new UserController();
