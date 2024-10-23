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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
const employeeRepository_1 = require("../repositories/employeeRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpService_1 = require("../helpers/otpService");
const OTP_EXPIRY_TIME = 30;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
class EmployeeService {
    signup(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmployee = yield employeeRepository_1.employeeRepository.findEmployeeByEmail(employeeData.email);
            if (existingEmployee) {
                return { status: 400, message: 'This user already exists' };
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            employeeData.password = yield bcryptjs_1.default.hash(employeeData.password, salt);
            const employee = yield employeeRepository_1.employeeRepository.createEmployee(Object.assign(Object.assign({}, employeeData), { is_verified: false }));
            const otp = this.generateOtp();
            yield otpService_1.otpService.sendOtp(employee.email, otp);
            console.log(otp, ': is your OTP');
            const otpToken = jsonwebtoken_1.default.sign({ email: employee.email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
            return { message: 'Otp sent to your email', otpToken };
        });
    }
    generateOtp() {
        const randomNumber = crypto_1.default.randomInt(0, 10000);
        return String(randomNumber).padStart(4, '0');
    }
    verifyOtp(otpToken, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(otpToken, JWT_SECRET);
                const email = decoded.email;
                const storedOtp = decoded.otp;
                // Check if the stored OTP matches the provided OTP
                if (storedOtp !== otp) {
                    console.error('OTP mismatch:', { storedOtp, receivedOtp: otp });
                    throw new Error('Otp invalid');
                }
                // Update the employee's verification status
                yield employeeRepository_1.employeeRepository.updateEmployeeVerificationStatus(email, true);
                return { message: 'Employee verified successfully' };
            }
            catch (err) {
                // Handle specific JWT errors
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    console.error('Token expired:', err.message);
                    throw new Error('Otp expired');
                }
                else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    console.error('JWT Error:', err.message);
                    throw new Error('Invalid token');
                }
                else {
                    // Log any other error
                    console.error('Unknown error during OTP verification:', err);
                    throw new Error('Otp invalid'); // Make sure this is caught by the controller
                }
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield employeeRepository_1.employeeRepository.findEmployeeByEmail(email);
                if (!employee) {
                    throw new Error('Employee not found');
                }
                if (employee.is_verified) {
                    throw new Error('Employee already verified');
                }
                const otp = this.generateOtp();
                yield otpService_1.otpService.sendOtp(email, otp);
                const newOtpToken = jsonwebtoken_1.default.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
                return { message: 'Otp sent to your email', newOtpToken };
            }
            catch (err) {
                throw new Error('Unknown error occured');
            }
        });
    }
    employeeLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield employeeRepository_1.employeeRepository.findEmployeeByEmail(email);
            if (!employee) {
                throw new Error('Employee does not exists');
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, employee.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            if (!employee.is_verified) {
                throw new Error('Employee is not verified');
            }
            const token = jsonwebtoken_1.default.sign({ email: employee.email, id: employee._id }, JWT_SECRET, { expiresIn: '10h' });
            return {
                token, employee: { email: employee.email, id: employee._id, employeeName: employee.name, is_done: employee.is_verified },
                message: 'Employee login successful'
            };
        });
    }
    getEmployeeDetails(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield employeeRepository_1.employeeRepository.findEmployeeById(employeeId);
            if (!result) {
                throw new Error('Timeslot not found');
            }
            return result;
        });
    }
    timeslot(employeeId, startDate, endDate, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const generatedSlots = yield this.generateTimeSlots(employeeId, startDate, endDate, startTime, endTime);
                if (generatedSlots.length > 0) {
                    return { message: 'Timeslots created successfully', slots: generatedSlots };
                }
                else {
                    throw new Error('No new timeslots were created (possible overlap with existing slots).');
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error creating time slots:', error.message);
                    throw new Error(error.message);
                }
                else {
                    throw new Error('An unknown error occurred while creating the timeslots');
                }
            }
        });
    }
    generateTimeSlots(employeeId, startDate, endDate, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const date = d.toISOString().slice(0, 10);
                let currentHour = parseInt(startTime.split(':')[0], 10);
                const endHour = parseInt(endTime.split(':')[0], 10);
                while (currentHour < endHour) {
                    const timeSlot = `${date} ${this.formatTime(currentHour)} - ${this.formatTime(currentHour + 1)}`;
                    const exists = yield employeeRepository_1.employeeRepository.findSlot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                    if (!exists) {
                        yield employeeRepository_1.employeeRepository.newTimeslot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                        slots.push(timeSlot);
                    }
                    currentHour++;
                }
            }
            return slots;
        });
    }
    formatTime(hour) {
        return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    }
    getTimeSlots(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeSlots = yield employeeRepository_1.employeeRepository.findTimeslotById(employeeId);
            if (!timeSlots) {
                throw new Error('Timeslot not found');
            }
            return timeSlots;
        });
    }
    deleteSlotsByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield employeeRepository_1.employeeRepository.deleteMany(employeeId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error deleting time slots for the employee: ' + error.message);
                }
            }
        });
    }
    deleteSlotsBySlotId(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield employeeRepository_1.employeeRepository.deleteById(slotId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error deleting time slot ' + error.message);
                }
            }
        });
    }
}
exports.employeeService = new EmployeeService();
