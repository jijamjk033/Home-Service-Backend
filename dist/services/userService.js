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
const http_status_codes_1 = require("http-status-codes");
const OTP_EXPIRY_TIME = 60;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESHSECRET || 'myjwtRefreshsecret';
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
            yield this.userRepository.createWallet(userData._id);
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
    getUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield this.userRepository.findUserById(userId);
                return userDetails;
            }
            catch (err) {
                console.error('Address not fetched');
                throw new Error('Address not found');
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
            const refreshToken = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
            yield this.userRepository.updateUser(user._id, { refreshToken: refreshToken });
            return {
                token, refreshToken, user: { email: user.email, id: user._id, username: user.name, is_done: user.is_verified },
                message: 'Login successful'
            };
        });
    }
    getUserTransactions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getUserTransactions(userId);
            }
            catch (error) {
                console.error('Transactions fetching failed');
                throw new Error('Error fetching transactions');
            }
        });
    }
}
exports.UserService = UserService;
