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
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    signup(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmployee = yield this.employeeRepository.findEmployeeByEmail(employeeData.email);
            if (existingEmployee) {
                return { status: 400, message: 'This user already exists' };
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            employeeData.password = yield bcryptjs_1.default.hash(employeeData.password, salt);
            const employee = yield this.employeeRepository.createEmployee(Object.assign(Object.assign({}, employeeData), { is_verified: false }));
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
                if (storedOtp !== otp) {
                    console.error('OTP mismatch:', { storedOtp, receivedOtp: otp });
                    throw new Error('Otp invalid');
                }
                yield this.employeeRepository.updateEmployeeVerificationStatus(email, true);
                return { message: 'Employee verified successfully' };
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    console.error('Token expired:', err.message);
                    throw new Error('Otp expired');
                }
                else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    console.error('JWT Error:', err.message);
                    throw new Error('Invalid token');
                }
                else {
                    console.error('Unknown error during OTP verification:', err);
                    throw new Error('Otp invalid');
                }
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield this.employeeRepository.findEmployeeByEmail(email);
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
            const employee = yield this.employeeRepository.findEmployeeByEmail(email);
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
            const token = jsonwebtoken_1.default.sign({ email: employee.email, id: employee._id, role: 'employee' }, JWT_SECRET, { expiresIn: '10h' });
            return {
                token, employee: { email: employee.email, id: employee._id, employeeName: employee.name, is_done: employee.is_verified },
                message: 'Employee login successful'
            };
        });
    }
    getEmployeeDetails(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.employeeRepository.findEmployeeById(employeeId);
            if (!result) {
                throw new Error('Timeslot not found');
            }
            return result;
        });
    }
}
exports.employeeService = new EmployeeService(employeeRepository_1.employeeRepository);
