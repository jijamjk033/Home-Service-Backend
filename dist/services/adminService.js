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
exports.adminService = void 0;
const adminRepository_1 = require("../repositories/adminRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepository.findAdminByEmail(email);
            if (!admin) {
                throw new Error('Admin not exists');
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            if (!admin.isAdmin) {
                throw new Error('Not an Admin');
            }
            const token = jsonwebtoken_1.default.sign({ email: admin.email, id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '10h' });
            return { token, admin: { email: admin.email, id: admin._id, username: admin.name }, message: 'Admin login successfull' };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminRepository.getUsersData();
            return data;
        });
    }
    getEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminRepository.getEmployeesData();
            return data;
        });
    }
}
exports.adminService = new AdminService(adminRepository_1.adminRepository);
