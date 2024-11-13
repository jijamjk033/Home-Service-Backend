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
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpService_1 = require("../helpers/otpService");
const OTP_EXPIRY_TIME = 60;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
const http_status_codes_1 = require("http-status-codes");
class UserService {
    constructor(userRepository, serviceRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findUserByEmail(userData.email);
            if (existingUser) {
                return { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'This user already exists' };
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            userData.password = yield bcryptjs_1.default.hash(userData.password, salt);
            const user = yield this.userRepository.createUser(Object.assign(Object.assign({}, userData), { is_verified: false }));
            const otp = this.generateOtp();
            yield otpService_1.otpService.sendOtp(user.email, otp);
            console.log(otp, ': is your OTP');
            const otpToken = jsonwebtoken_1.default.sign({ email: user.email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
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
                    throw new Error('Otp invalid');
                }
                yield this.userRepository.updateUserVerificationStatus(email, true);
                return { message: 'User verified successfully' };
            }
            catch (err) {
                if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    throw new Error('Otp expired');
                }
                else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    console.error('Invalid JWT:', err.message);
                    throw new Error('Invalid token');
                }
                else {
                    console.error('Unknown error during JWT verification:', err);
                    throw err;
                }
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error('User not found');
                }
                if (user.is_verified) {
                    throw new Error('User already verified');
                }
                const otp = this.generateOtp();
                yield otpService_1.otpService.sendOtp(email, otp);
                console.log('your otp is:', otp);
                const newOtpToken = jsonwebtoken_1.default.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
                return { message: 'Otp sent to your email', newOtpToken };
            }
            catch (err) {
                throw new Error('Unknown error occured');
            }
        });
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('User does not exists');
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            if (!user.is_verified) {
                throw new Error('User is not verified');
            }
            if (user.isAdmin) {
                throw new Error('Not a user');
            }
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '10h' });
            return {
                token, user: { email: user.email, id: user._id, username: user.name, is_done: user.is_verified },
                message: 'User login successful'
            };
        });
    }
    addAddress(address, locality, city, state, pincode, user, typeOfAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
                return result;
            }
            catch (error) {
                console.error('Error in service layer:', error);
                throw new Error('Could not save address.');
            }
        });
    }
    getAddressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAddressByUser(userId);
            }
            catch (error) {
                console.error('Address not fetched');
                throw new Error('Address not found');
            }
        });
    }
    fetchAddressSelected(addresId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.fetchAddressSelected(addresId);
            }
            catch (error) {
                console.error('Address not fetched');
                throw new Error('Address not found');
            }
        });
    }
    fetchTimeSlots(employeeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.fetchTimeSlots(employeeId, date);
            }
            catch (error) {
                console.error('Timeslot not fetched');
                throw new Error('Timeslot not found');
            }
        });
    }
    getTimeslots(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getTimeslot(slotId);
            }
            catch (error) {
                console.error('Timeslot not fetched');
                throw new Error('Timeslot not found');
            }
        });
    }
    createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, paymentResponse) {
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
                    bookingStatus = 'Confirmed';
                    paymentStatus = 'Pending';
                }
                else if (paymentMethod === 'online' || paymentMethod === 'wallet') {
                    paymentStatus = paymentResponse.status === 'Success' ? 'Success' : 'Failed';
                    bookingStatus = paymentStatus === 'Success' ? 'Confirmed' : 'Pending';
                }
                const bookingResult = yield this.userRepository.createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, paymentResponse || {}, bookingStatus, paymentStatus);
                if (!bookingResult.success) {
                    throw new Error(bookingResult.message);
                }
                if (bookingStatus === 'Confirmed') {
                    yield this.userRepository.bookTimeslot(timeslotId, true);
                }
                return bookingResult;
            }
            catch (error) {
                console.error("Booking creation error:", error);
                throw new Error(error instanceof Error ? error.message : "Booking creation failed");
            }
        });
    }
}
exports.UserService = UserService;
