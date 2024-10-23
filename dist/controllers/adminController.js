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
exports.adminController = void 0;
const responseHelper_1 = require("../helpers/responseHelper");
const adminService_1 = require("../services/adminService");
const http_status_codes_1 = require("http-status-codes");
class AdminController {
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield adminService_1.adminService.adminLogin(email, password);
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
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield adminService_1.adminService.getUsers();
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(users));
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
    getEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employees = yield adminService_1.adminService.getEmployees();
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(employees));
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
}
exports.adminController = new AdminController();
