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
const userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
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
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userid = req.params.id;
                const userDetails = yield userService.getUserDetails(userid);
                console.log(userDetails);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(userDetails));
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(error.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    getUserTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const transactions = yield userService.getUserTransactions(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(transactions));
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching transactions', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseHelper_1.createErrorResponse)(error.message));
                }
            }
        });
    }
}
exports.userController = new UserController();
