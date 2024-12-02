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
exports.timeslotController = void 0;
const http_status_codes_1 = require("http-status-codes");
const timeslotService_1 = require("../services/timeslotService");
const userRepository_1 = require("../repositories/userRepository");
const responseHelper_1 = require("../helpers/responseHelper");
const employeeRepository_1 = require("../repositories/employeeRepository");
const userRepository = new userRepository_1.UserRepository();
const timeslotService = new timeslotService_1.TimeslotService(userRepository, employeeRepository_1.employeeRepository);
class TimeslotController {
    getTimeslotByid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeslot = req.params.id;
                const timeslotDetails = yield timeslotService.getTimeslotByid(timeslot);
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
                    const timeslots = yield timeslotService.fetchTimeSlots(employeeId, date);
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
    timeslotCreation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employeeId, startDate, endDate, startTime, endTime } = req.body;
            try {
                const result = yield timeslotService.timeslot(employeeId, startDate, endDate, startTime, endTime);
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
                const timeSlots = yield timeslotService.getTimeSlots(employeeId);
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
                const result = yield timeslotService.deleteSlotsByEmployeeId(employeeId);
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
                const result = yield timeslotService.deleteSlotsBySlotId(slotId);
                return res.status(http_status_codes_1.StatusCodes.OK).json({ data: result, message: 'Time slot deleted successfully.' });
            }
            catch (error) {
                console.error('Error deleting time slots:', error);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
            }
        });
    }
}
exports.timeslotController = new TimeslotController();
