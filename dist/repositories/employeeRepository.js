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
exports.employeeRepository = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const timeslotModel_1 = require("../models/timeslotModel");
class EmployeeRepository {
    createEmployee(employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = new employeeModel_1.default(employeeData);
            const saved = yield employee.save();
            return saved.toObject();
        });
    }
    findEmployeeByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield employeeModel_1.default.findOne({ email: email });
            if (!employee) {
                return null;
            }
            return employee;
        });
    }
    findEmployeeById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield employeeModel_1.default.findOne({ _id: employeeId });
            if (!employee) {
                return null;
            }
            return employee;
        });
    }
    updateEmployeeVerificationStatus(email, is_verified) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusUpdate = is_verified ? 'active' : 'blocked';
            yield employeeModel_1.default.updateOne({ email }, { is_verified, status: statusUpdate });
        });
    }
    findSlot(employeeId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSlot = yield timeslotModel_1.timeslots.findOne({
                employeeId,
                date,
                startTime,
                endTime
            }).lean();
            return existingSlot;
        });
    }
    newTimeslot(employeeId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTimeSlot = new timeslotModel_1.timeslots({ employeeId, date, startTime, endTime });
            const result = yield newTimeSlot.save();
            return result.toObject();
        });
    }
    findTimeslotById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeslotList = yield timeslotModel_1.timeslots.find({ employeeId: employeeId }).lean();
            return timeslotList;
        });
    }
    deleteMany(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield timeslotModel_1.timeslots.deleteMany({ employeeId: employeeId });
        });
    }
    deleteById(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield timeslotModel_1.timeslots.findByIdAndDelete(slotId);
        });
    }
}
exports.employeeRepository = new EmployeeRepository();
