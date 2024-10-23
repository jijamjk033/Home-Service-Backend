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
exports.employeeController = void 0;
const responseHelper_1 = require("../helpers/responseHelper");
const employeeService_1 = require("../services/employeeService");
const http_status_codes_1 = require("http-status-codes");
class EmployeeController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield employeeService_1.employeeService.signup(req.body);
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
                const result = yield employeeService_1.employeeService.verifyOtp(token, otp);
                return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                console.error('Error verifying OTP:', err.message);
                if (err.message === 'Otp invalid') {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('Invalid OTP. Please try again.'));
                }
                else if (err.message === 'Otp expired') {
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('OTP has expired. Request a new one.'));
                }
                else if (err.message === 'Invalid token') {
                    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json((0, responseHelper_1.createErrorResponse)('Invalid or malformed token.'));
                }
                else {
                    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred.'));
                }
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('Email must be provided'));
            }
            try {
                const result = yield employeeService_1.employeeService.resendOtp(email);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
            }
        });
    }
    employeeLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield employeeService_1.employeeService.employeeLogin(email, password);
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
    getEmployeeDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            try {
                const employeeDetails = yield employeeService_1.employeeService.getEmployeeDetails(employeeId);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(employeeDetails));
            }
            catch (error) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error fetching Employee Data", error });
            }
        });
    }
    timeslotCreation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId, startDate, endDate, startTime, endTime } = req.body;
            try {
                const result = yield employeeService_1.employeeService.timeslot(employeeId, startDate, endDate, startTime, endTime);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error in timeslot creation:', error.message);
                    if (error.message === 'Time slot already exists for this date and time.') {
                        res.status(http_status_codes_1.StatusCodes.CONFLICT).json((0, responseHelper_1.createErrorResponse)(error.message));
                    }
                    else {
                        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseHelper_1.createErrorResponse)(error.message));
                    }
                }
                else {
                    console.error('Unknown error in timeslot creation');
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    getTimeslots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            try {
                const timeSlots = yield employeeService_1.employeeService.getTimeSlots(employeeId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: timeSlots,
                    message: "Timeslot fetched successfully"
                });
            }
            catch (error) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error fetching Timeslots", error });
            }
        });
    }
    deleteTimeslots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            try {
                const result = yield employeeService_1.employeeService.deleteSlotsByEmployeeId(employeeId);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ data: result, message: 'Time slots deleted successfully for employee.' });
            }
            catch (error) {
                console.error('Error deleting time slots:', error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
            }
        });
    }
    deleteTimeslotsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const slotId = req.params.id;
            try {
                const result = yield employeeService_1.employeeService.deleteSlotsBySlotId(slotId);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ data: result, message: 'Time slot deleted successfully.' });
            }
            catch (error) {
                console.error('Error deleting time slots:', error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
            }
        });
    }
}
exports.employeeController = new EmployeeController();
