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
exports.adminRepository = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const userModel_1 = require("../models/userModel");
class AdminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email: email }).lean();
            return user;
        });
    }
    getUsersData() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.find({});
            return user;
        });
    }
    getEmployeesData() {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield employeeModel_1.default.find({});
            return employee;
        });
    }
}
exports.adminRepository = new AdminRepository();
